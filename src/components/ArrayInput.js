import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * 'type: "array"' 스키마를 위한 동적 배열 입력 컴포넌트
 * @param {object} field - 스키마의 'field' 객체 (예: "to" 필드 전체)
 * @param {array} value - 현재 저장된 값 (배열)
 * @param {function} onChange - 변경 시 호출될 콜백 (새 배열을 인자로 받음)
 */
const ArrayInput = ({ field, value = [], onChange }) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');

    // 'items' 스키마를 기반으로 입력 필드의 타입을 결정 (예: format: "email")
    const inputType = field.items?.format === 'email' ? 'email' : 'text';

    // 항목 추가 핸들러
    const handleAddItem = (e) => {
        e.preventDefault(); // 폼 제출 방지 (필요시)
        if (inputValue.trim()) {
            onChange([...value, inputValue.trim()]);
            setInputValue(''); // 입력 필드 초기화
        }
    };

    // 항목 삭제 핸들러
    const handleDeleteItem = (indexToDelete) => {
        onChange(value.filter((_, index) => index !== indexToDelete));
    };

    // Enter 키로 추가
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddItem(e);
        }
    };

    return (
        <div className="array-input-container">
            {/* 1. 입력 필드 + 추가 버튼 */}
            <div className="array-input-wrapper">
                <input
                    type={inputType}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    // --- ✅ 1. placeholder 수정 ---
                    // 백엔드의 items 스키마에 description이 있으면 그것을 사용
                    placeholder={field.items?.description || ''}
                    className="array-input-field"
                />
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
                        <span>{item}</span>
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