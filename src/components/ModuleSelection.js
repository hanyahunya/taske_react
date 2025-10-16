import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// 개별 모듈 아코디언 컴포넌트
const ModuleAccordion = ({ module, capabilityType }) => {
  // --- ✅ 1. 여기서도 useTranslation 훅을 호출합니다. ---
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const capabilities = module[capabilityType] || [];

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
              <li key={cap.capabilityId} className="capability-list-item">
                {cap.name}
                <span className="capability-description">{cap.description}</span>
              </li>
            ))
          ) : (
            // 이제 't' 함수가 정의되었으므로 정상적으로 작동합니다.
            <li className="capability-list-item empty">{t('task_add_no_capability')}</li>
          )}
        </ul>
      )}
    </div>
  );
};

// 트리거 또는 액션 컬럼 전체를 렌더링하는 컴포넌트
const ModuleSelection = ({ modules, capabilityType, title }) => {
  // --- ✅ 2. 여기서는 t 함수를 사용하지 않으므로 제거해도 됩니다. (선택 사항) ---
  // const { t } = useTranslation(); // -> 이 줄은 이제 없어도 됩니다.

  if (!modules || modules.length === 0) {
    // 't'를 사용하려면 여기서도 훅을 호출해야 합니다. 지금은 하위 컴포넌트로 책임이 넘어갔습니다.
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
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleSelection;