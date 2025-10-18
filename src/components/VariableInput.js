import React, { useEffect, useRef, useMemo } from 'react';

// HTML 문자열에서 태그를 제거하는 간단한 유틸리티
const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

/**
 * 변수(HTML "Pill") 삽입이 가능한 contenteditable 입력 필드
 */
const VariableInput = ({ id, value, onChange, placeholder, isTextArea }) => {
    const editorRef = useRef(null);

    // props로 받은 value가 실제 DOM의 innerHTML과 다를 때만 업데이트
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = (e) => {
        const newHtml = e.target.innerHTML;
        onChange(newHtml);
    };

    // --- ✅ [핵심 수정] handleDrop 로직 변경 ---
    const handleDrop = (e) => {
        e.preventDefault();
        const dataStr = e.dataTransfer.getData("application/json");
        if (!dataStr) return;

        try {
            const data = JSON.parse(dataStr);
            if (!data.backendKey || !data.name) return;

            const pillHtml = `<span class="variable-pill" data-key="${data.backendKey}" contenteditable="false">${data.name}</span>`;

            const selection = window.getSelection();
            let range;

            // 1. 드롭 위치 계산 (가장 중요!)
            // document.caretRangeFromPoint를 사용하여 드롭된 좌표(e.clientX, e.clientY)의 Range를 찾습니다.
            if (document.caretRangeFromPoint) {
                range = document.caretRangeFromPoint(e.clientX, e.clientY);
            } else {
                // Firefox 구 버전 등 fallback (덜 정확할 수 있음)
                // @ts-ignore - caretPositionFromPoint is non-standard
                if (document.caretPositionFromPoint) {
                    // @ts-ignore
                    const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
                    if (pos) {
                        range = document.createRange();
                        range.setStart(pos.offsetNode, pos.offset);
                        range.collapse(true); // 커서를 한 점으로 만듦
                    }
                }
            }

            // 2. 유효한 Range를 찾지 못했거나, Range가 현재 에디터(.variable-input div) 내부에 있지 않으면
            //    기존 selection (깜빡이는 커서)을 사용하거나, 없으면 맨 뒤에 추가
            if (!range || !editorRef.current || !editorRef.current.contains(range.startContainer)) {
                if (selection.rangeCount > 0 && editorRef.current?.contains(selection.getRangeAt(0).startContainer)) {
                    // 기존 selection이 에디터 내부에 있으면 사용
                    range = selection.getRangeAt(0);
                } else {
                    // 그것도 아니면 에디터 맨 끝에 추가
                    range = document.createRange();
                    range.selectNodeContents(editorRef.current);
                    range.collapse(false); // 끝으로 이동
                }
            }

            // 3. 계산된 (또는 fallback) Range를 현재 selection으로 설정
            selection.removeAllRanges();
            selection.addRange(range);

            // 4. 커서 위치(Range)에 HTML 삽입 (이 부분은 이전과 유사)
            range.deleteContents(); // 선택된 내용(있다면) 삭제

            const el = document.createElement("div");
            el.innerHTML = pillHtml;

            const frag = document.createDocumentFragment();
            let node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // 5. 커서를 삽입된 박스 뒤로 이동
            if (lastNode) {
                range.setStartAfter(lastNode);
                range.collapse(true);
                selection.removeAllRanges(); // 다시 selection 설정
                selection.addRange(range);
            }

            // 6. 변경된 내용 상위로 전파
            onChange(editorRef.current.innerHTML);

        } catch (err) {
            console.error("Failed to drop variable", err);
        }
    };
    // --- ✅ 수정 끝 ---

    const isEmpty = useMemo(() => !value || stripHtml(value).trim().length === 0, [value]);
    const className = `variable-input ${isTextArea ? 'textarea-like' : ''} ${isEmpty ? 'show-placeholder' : ''}`;

    return (
        <div
            ref={editorRef}
            id={id}
            className={className}
            contentEditable="true"
            onInput={handleInput}
            onDragOver={(e) => e.preventDefault()} // 드롭 허용
            onDrop={handleDrop} // 드롭 이벤트 처리
            data-placeholder={placeholder}
        />
    );
};

export default VariableInput;