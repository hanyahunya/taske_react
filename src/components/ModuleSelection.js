import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// 개별 모듈 아코디언 컴포넌트
const ModuleAccordion = ({ module, capabilityType, onSelectCapability, selectedCapabilityId }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const capabilities = module[capabilityType] || [];

    // --- ✅ 핵심 수정 1: Capability 클릭 핸들러 ---
    const handleClick = (cap) => {
        onSelectCapability(cap);
    };

    return (
        <div className="module-accordion">
            <button className="module-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{module.moduleName}</span>
                <span className={`arrow ${isOpen ? 'open' : ''}`}>›</span>
            </button>
            {isOpen && (
                <ul className="capability-list">
                    {capabilities.length > 0 ? (
                        capabilities.map((cap) => (
                            <li
                                key={cap.capabilityId}
                                // --- ✅ 핵심 수정 2: 선택된 항목 스타일 및 클릭 이벤트 추가 ---
                                className={`capability-list-item ${selectedCapabilityId === cap.capabilityId ? 'selected' : ''}`}
                                onClick={() => handleClick(cap)}
                            >
                                {cap.name}
                                <span className="capability-description">{cap.description}</span>
                            </li>
                        ))
                    ) : (
                        <li className="capability-list-item empty">{t('task_add_no_capability')}</li>
                    )}
                </ul>
            )}
        </div>
    );
};

// 트리거 또는 액션 컬럼 전체를 렌더링하는 컴포넌트
const ModuleSelection = ({ modules, capabilityType, title, onSelectCapability, selectedCapabilityId }) => {

    if (!modules || modules.length === 0) {
        return <p>No available modules.</p>;
    }

    return (
        <div className="capability-selector">
            <h4>{title}</h4>
            <div className="module-list">
                {modules.map((module) => (
                    <ModuleAccordion
                        key={module.moduleId}
                        module={module}
                        capabilityType={capabilityType}
                        // --- ✅ 핵심 수정 3: Props 전달 ---
                        onSelectCapability={onSelectCapability}
                        selectedCapabilityId={selectedCapabilityId}
                    />
                ))}
            </div>
        </div>
    );
};

export default ModuleSelection;