import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VariableInput from './VariableInput'; // VariableInput import

// ❌ convertHtmlToBackendKey 헬퍼 함수를 이 파일에서 제거합니다.

/**
 * 'type: "array"' 스키마를 위한 동적 배열 입력 컴포넌트
 */
const ArrayInput = ({ field, value = [], onChange }) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState(''); // HTML 문자열을 저장

    // ✅ 1. 항목 추가 핸들러 수정
    const handleAddItem = (e) => {
        e.preventDefault();
        
        // HTML을 기반으로 실제 텍스트 콘텐츠가 있는지 확인
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = inputValue;
        const plainText = tempDiv.textContent || "";

        // 실제 텍스트가 있을 때만 추가
        if (plainText.trim()) {
            onChange([...value, inputValue]); // HTML 원본을 그대로 추가
            setInputValue(''); // VariableInput 초기화
        }
    };

    // 항목 삭제 핸들러 (변경 없음)
    const handleDeleteItem = (indexToDelete) => {
        onChange(value.filter((_, index) => index !== indexToDelete));
    };

    // Enter 키 핸들러 (변경 없음)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddItem(e);
        }
    };

    return (
        <div className="array-input-container">
            {/* 1. 입력 필드 + 추가 버튼 (VariableInput 사용) */}
            <div className="array-input-wrapper">
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <VariableInput
                        isTextArea={false}
                        value={inputValue}
                        onChange={setInputValue}
                        onKeyDown={handleKeyDown}
                        placeholder={field.items?.description || ''}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAddItem}
                    className="array-add-btn"
                >
                    +
                </button>
            </div>
            
            {/* 2. 추가된 항목 목록 */}
            <div className="array-item-list">
                {value.map((item, index) => (
                    <div key={index} className="array-item">
                        {/* ✅ 2. HTML을 렌더링하도록 수정 */}
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                        <button
                            type="button"
                            onClick={() => handleDeleteItem(index)}
                            className="array-delete-btn"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArrayInput;