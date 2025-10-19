import React, { useEffect, useRef, useMemo } from 'react';

// HTML 문자열에서 태그를 제거하는 간단한 유틸리티
const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

/**
 * 변수(HTML "Pill") 삽입이 가능한 contenteditable 입력 필드
 * ✅ onKeyDown prop 추가
 */
const VariableInput = ({ id, value, onChange, placeholder, isTextArea, onKeyDown }) => {
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

    // --- (handleDrop 로직은 변경 없음) ---
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

            // 1. 드롭 위치 계산
            if (document.caretRangeFromPoint) {
                range = document.caretRangeFromPoint(e.clientX, e.clientY);
            } else {
                // @ts-ignore
                if (document.caretPositionFromPoint) {
                    // @ts-ignore
                    const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
                    if (pos) {
                        range = document.createRange();
                        range.setStart(pos.offsetNode, pos.offset);
                        range.collapse(true);
                    }
                }
            }

            // 2. 유효한 Range가 아니거나 에디터 외부일 경우
            if (!range || !editorRef.current || !editorRef.current.contains(range.startContainer)) {
                if (selection.rangeCount > 0 && editorRef.current?.contains(selection.getRangeAt(0).startContainer)) {
                    range = selection.getRangeAt(0);
                } else {
                    range = document.createRange();
                    range.selectNodeContents(editorRef.current);
                    range.collapse(false);
                }
            }

            // 3. Range를 selection으로 설정
            selection.removeAllRanges();
            selection.addRange(range);

            // 4. 커서 위치에 HTML 삽입
            range.deleteContents();
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
                selection.removeAllRanges();
                selection.addRange(range);
            }

            // 6. 변경된 내용 상위로 전파
            onChange(editorRef.current.innerHTML);

        } catch (err) {
            console.error("Failed to drop variable", err);
        }
    };

    const isEmpty = useMemo(() => !value || stripHtml(value).trim().length === 0, [value]);
    const className = `variable-input ${isTextArea ? 'textarea-like' : ''} ${isEmpty ? 'show-placeholder' : ''}`;

    return (
        <div
            ref={editorRef}
            id={id}
            className={className}
            contentEditable="true"
            onInput={handleInput}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            data-placeholder={placeholder}
            // --- ✅ [핵심 수정] onKeyDown prop 적용 ---
            onKeyDown={onKeyDown || null} 
        />
    );
};

export default VariableInput;