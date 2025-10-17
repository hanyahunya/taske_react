import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig';
import Loading from '../components/Loading';
import ModuleSelection from '../components/ModuleSelection';

// --- (parseSchema 헬퍼 함수는 동일) ---
const parseSchema = (schema, prefix) => {
  if (!schema || !schema.properties) return {};
  
  const vars = {};
  for (const [key, value] of Object.entries(schema.properties)) {
    vars[`${prefix}.${key}`] = value.description || 'No description available';
  }
  return vars;
};

// --- ✅ 1. 스텝 인디케이터 컴포넌트 추가 ---
const StepIndicator = ({ currentStep, totalSteps, onStepClick, t }) => {
    const steps = [];
    for (let i = 0; i < totalSteps; i++) {
        const isActive = currentStep === i;
        let label = '';
        if (i === 0) {
            label = t('step_trigger_short', 'Trigger'); // "트리거"
        } else {
            label = t('step_action_short', 'Action {{index}}', { index: i }); // "액션 1"
        }
        
        steps.push(
            <button
                key={i}
                className={`step-indicator-item ${isActive ? 'active' : ''}`}
                onClick={() => onStepClick(i)}
                title={label} // 마우스 호버 시 툴팁
            >
                {/* CSS가 모바일에서 비활성 텍스트를 자동으로 숨깁니다 */}
                <span>{label}</span> 
            </button>
        );
    }

    return (
        <div className="step-indicator-container">
            {steps}
        </div>
    );
};


const AddTaskPage = () => {
    const { t } = useTranslation();
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentStep, setCurrentStep] = useState(0); 
    const [selectedTrigger, setSelectedTrigger] = useState(null);
    const [selectedActions, setSelectedActions] = useState([]); 
    const [availableVariables, setAvailableVariables] = useState({});

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/task/modules');
                setModules(response.data);
                setError(null);
            } catch (err) {
                setError(t('task_add_load_error'));
                console.error("Error fetching modules:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchModules();
    }, [t]);

    useEffect(() => {
        let allVars = {};
        if (currentStep > 0 && selectedTrigger) {
            allVars = {
                ...allVars,
                ...parseSchema(selectedTrigger.outputSchema, 'trigger.output')
            };
        }
        const previousActions = selectedActions.slice(0, currentStep - 1); 
        previousActions.forEach((action, index) => {
            if (action) {
                const prefix = `action${index}.output`; 
                allVars = {
                    ...allVars,
                    ...parseSchema(action.outputSchema, prefix)
                };
            }
        });
        setAvailableVariables(allVars);
    }, [selectedTrigger, selectedActions, currentStep]); 

    const handleSelectCapability = (capability) => {
        if (currentStep === 0) {
            setSelectedTrigger(capability);
            setSelectedActions([]); 
        } else {
            const actionIndex = currentStep - 1;
            const newActions = [...selectedActions];
            newActions[actionIndex] = capability;
            const finalActions = newActions.slice(0, actionIndex + 1);
            setSelectedActions(finalActions);
        }
    };

    // --- ✅ 2. 스텝 클릭 핸들러 추가 ---
    const handleStepClick = (stepIndex) => {
        // 사용자가 이미 생성된 스텝 (트리거 + 선택된 액션들) 또는
        // 현재 편집 중인 새 스텝까지만 클릭할 수 있도록 합니다.
        // totalStepsToShow가 이 로직을 이미 포함하므로, 그냥 이동시킵니다.
        setCurrentStep(stepIndex);
    };

    const { capabilityType, title, selectedCapability } = useMemo(() => {
        if (currentStep === 0) {
            return {
                capabilityType: 'triggers',
                title: t('step_trigger'),
                selectedCapability: selectedTrigger
            };
        }
        const actionIndex = currentStep - 1;
        return {
            capabilityType: 'actions',
            title: t('step_action_index', { index: currentStep }),
            selectedCapability: selectedActions[actionIndex]
        };
    }, [currentStep, selectedTrigger, selectedActions, t]);

    const renderStepContent = () => {
        return (
            <ModuleSelection
                modules={modules}
                capabilityType={capabilityType}
                title={title}
                onSelectCapability={handleSelectCapability}
                selectedCapabilityId={selectedCapability?.capabilityId}
            />
        );
    };

    const renderServiceContainerContent = () => {
        if (selectedCapability) {
            return (
                <div>
                    <h4>{selectedCapability.name} 설정</h4>
                    <p>{selectedCapability.description}</p>
                    {/* 설정 폼 컴포넌트 자리 */}
                </div>
            );
        }
        const promptKey = currentStep === 0 ? 'trigger' : 'action';
        return <p>{t('task_add_select_capability_prompt', { step: promptKey })}</p>;
    };

    const isCurrentStepValid = currentStep === 0 ? !!selectedTrigger : !!selectedActions[currentStep - 1];

    // --- ✅ 3. 표시할 총 스텝 수 계산 ---
    // (현재 스텝 인덱스 + 1)과 (완성된 스텝 수) 중 더 큰 값을 사용
    const totalStepsToShow = Math.max(currentStep + 1, 1 + selectedActions.length);

    return (
        <div className="page-container">
            <h2 className="page-title">{t('task_add_title')}</h2>
            
            <div className="add-task-wrapper">
                
                <div className="add-task-main-content">
                    {isLoading && <Loading />}
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    {!isLoading && !error && (
                        <div className="task-creation-container">
                            {renderStepContent()}
                            <div className="service-container">
                                {renderServiceContainerContent()}
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && (
                        // --- ✅ 4. step-navigation 레이아웃 수정 ---
                        <div className="step-navigation">
                            {/* "이전" 버튼 */}
                            <button
                                className="step-button back"
                                onClick={() => setCurrentStep(currentStep - 1)}
                                style={{ visibility: currentStep > 0 ? 'visible' : 'hidden' }}
                            >
                                {currentStep === 1 ? t('button_back_trigger') : t('button_back_action', { index: currentStep - 1 })}
                            </button>

                            {/* 스텝 인디케이터 */}
                            <StepIndicator 
                                currentStep={currentStep}
                                totalSteps={totalStepsToShow}
                                onStepClick={handleStepClick}
                                t={t}
                            />

                            {/* 오른쪽 버튼 그룹 */}
                            <div style={{ display: 'flex', gap: '15px', flexShrink: 0 }}>
                                {currentStep > 0 && (
                                    <button
                                        className="step-button"
                                        onClick={() => alert('Save functionality to be implemented')}
                                        disabled={!isCurrentStepValid}
                                    >
                                        {t('button_save_task')}
                                    </button>
                                )}
                                <button
                                    className="step-button"
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={!isCurrentStepValid}
                                >
                                    {currentStep === 0 ? t('button_next_action') : t('button_add_action')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 변수 사이드바 */}
                <div className="available-vars-sidebar">
                    <h4>{t('available_variables_title')}</h4>
                    <div className="vars-list">
                        {Object.keys(availableVariables).length === 0 ? (
                            <p>{t('no_available_variables')}</p>
                        ) : (
                            Object.entries(availableVariables).map(([key, desc]) => (
                                <div className="var-item" key={key}>
                                    <code>{`{{${key}}}`}</code>
                                    <p>{desc}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div> {/* End of add-task-wrapper */}
        </div> /* End of page-container */
    );
};

export default AddTaskPage;