import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import Loading from '../components/Loading';
import ModuleSelection from '../components/ModuleSelection';
import CapabilityForm from '../components/CapabilityForm';
import { translateData } from '../utils/i18nParser';

// ✅ 1. HTML을 백엔드 키로 변환하는 헬퍼 함수
const convertHtmlToBackendKey = (html) => {
    if (!html) return '';
    // 임시 div를 사용해 HTML 문자열을 DOM 노드로 변환
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // <span class="variable-pill" data-key="...">...</span> 태그를 찾음
    const pills = tempDiv.querySelectorAll('.variable-pill');

    pills.forEach(pill => {
        const key = pill.getAttribute('data-key');
        if (key) {
            // span 태그를 data-key 값(텍스트 노드)으로 교체
            pill.parentNode.replaceChild(document.createTextNode(key), pill);
        }
    });

    // HTML <br>을 \n (줄바꿈)으로 변환
    tempDiv.innerHTML = tempDiv.innerHTML.replace(/<br\s*\/?>/gi, '\n');

    // &nbsp; 같은 HTML 엔티티를 실제 문자로 변환 (textContent가 자동으로 처리)
    return tempDiv.textContent || '';
};


/**
 * 스키마를 파싱하여 변수 맵을 생성합니다.
 * @param {object} schema - outputSchema
 * @param {string} logicalPrefix - 변수 키에 사용될 접두사 (예: "trigger.output")
 * @param {string} displayPrefix - UI에 표시될 접두사 (예: "트리거", "액션 1")
 * @returns {object} - { "trigger.output.key": { name: "...", description: "...", backendKey: "#_%...%_#" } }
 */
const parseSchema = (schema, logicalPrefix, displayPrefix) => {
    if (!schema || !schema.properties) return {};
    const vars = {};
    for (const [key, value] of Object.entries(schema.properties)) {
        const logicalKey = `${logicalPrefix}.${key}`;

        const displayName = value.name || key;
        const description = value.description || 'No description available';

        // ✅ 2. 백엔드 전송용 키 형식 추가
        vars[logicalKey] = {
            name: `${displayPrefix} / ${displayName}`,
            description: description,
            backendKey: `#_%${logicalKey}%_#` // 예: #_%action0.output.success%_#
        };
    }
    return vars;
};

const StepIndicator = ({ currentStep, totalSteps, onStepClick, t }) => {
    // ... (기존 코드와 동일)
    const steps = [];
    for (let i = 0; i < totalSteps; i++) {
        const isActive = currentStep === i;
        let label = '';
        if (i === 0) {
            label = t('step_trigger_short', 'Trigger');
        } else {
            label = t('step_action_short', 'Action {{index}}', { index: i });
        }

        steps.push(
            <button
                key={i}
                className={`step-indicator-item ${isActive ? 'active' : ''}`}
                onClick={() => onStepClick(i)}
                title={label}
            >
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
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const MAX_ACTIONS = 5; // (기존 코드와 동일)

    const [rawModules, setRawModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTrigger, setSelectedTrigger] = useState(null);
    const [selectedActions, setSelectedActions] = useState([]);
    const [availableVariables, setAvailableVariables] = useState({});
    const [taskName, setTaskName] = useState('');
    const [stepConfigs, setStepConfigs] = useState({});


    useEffect(() => {
        const fetchModules = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/task/modules');
                setRawModules(response.data);
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

    const modules = useMemo(() => {
        return translateData(rawModules, i18n.language);
    }, [rawModules, i18n.language]);


    useEffect(() => {
        if (currentStep === 0) {
            setAvailableVariables({});
            return;
        }

        let allVars = {};

        if (selectedTrigger) {
            allVars = {
                ...allVars,
                ...parseSchema(
                    selectedTrigger.outputSchema,
                    'trigger.output',
                    t('step_trigger_short')
                )
            };
        }

        const previousActions = selectedActions.slice(0, currentStep - 1);
        previousActions.forEach((action, index) => {
            if (action) {
                const logicalPrefix = `action${index}.output`;
                const displayPrefix = t('step_action_short', { index: index + 1 });

                allVars = {
                    ...allVars,
                    ...parseSchema(
                        action.outputSchema,
                        logicalPrefix,
                        displayPrefix
                    )
                };
            }
        });

        setAvailableVariables(allVars);
    }, [selectedTrigger, selectedActions, currentStep, t]);


    const handleConfigChange = (stepIndex, newConfig) => {
        setStepConfigs(prevConfigs => ({
            ...prevConfigs,
            [stepIndex]: newConfig
        }));
    };

    const handleSelectCapability = (capability) => {
        if (currentStep === 0) {
            setSelectedTrigger(capability);
            setSelectedActions([]);
            setStepConfigs({ 0: stepConfigs[0] });
        } else {
            const actionIndex = currentStep - 1;
            
            if (actionIndex >= MAX_ACTIONS) return; 

            const newActions = [...selectedActions];
            newActions[actionIndex] = capability;
            const finalActions = newActions.slice(0, actionIndex + 1);
            setSelectedActions(finalActions);

            const newConfigs = { ...stepConfigs };
            for (let i = actionIndex + 2; i <= selectedActions.length; i++) {
                delete newConfigs[i];
            }
            setStepConfigs(newConfigs);
        }
    };

    const handleStepClick = (stepIndex) => {
        setCurrentStep(stepIndex);
    };

    const { capabilityType, title, selectedCapability } = useMemo(() => {
        if (currentStep === 0) {
            return { capabilityType: 'triggers', title: t('step_trigger'), selectedCapability: selectedTrigger };
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
            const currentConfig = stepConfigs[currentStep] || {};

            return (
                <CapabilityForm
                    schema={selectedCapability.paramSchema}
                    config={currentConfig}
                    onChange={(newConfig) => handleConfigChange(currentStep, newConfig)}
                />
            );
        }

        const promptKey = currentStep === 0 ? 'trigger' : 'action';
        return <p>{t('task_add_select_capability_prompt', { step: promptKey })}</p>;
    };

    // --- (handleSaveTask는 변경 없음) ---
    const handleSaveTask = async () => {
        if (!taskName.trim()) {
            alert(t('task_name_required', '작업 이름을 입력해주세요.'));
            return;
        }
        if (!selectedTrigger) return;
        if (selectedActions.length === 0) {
            alert(t('action_required', '하나 이상의 액션이 필요합니다.'));
            return;
        }

        setIsSaving(true);

        const buildConfig = (stepIndex, capability) => {
            const config = {};
            const rawConfig = stepConfigs[stepIndex] || {};

            if (!capability.paramSchema || !capability.paramSchema.properties) {
                return config;
            }
            const properties = capability.paramSchema.properties;

            for (const key in rawConfig) {
                if (Object.prototype.hasOwnProperty.call(rawConfig, key) && properties[key]) {
                    const type = properties[key].type;
                    const rawValue = rawConfig[key]; // rawValue는 이제 HTML일 수 있음

                    if (rawValue === null || rawValue === undefined) continue;

                    if (type === 'array') {
                        // ArrayInput은 HTML이 아니므로 그대로 둠
                        config[key] = rawValue;
                    } else if (type === 'object') {
                        // Object (JSON textarea)도 HTML이 아니므로 그대로 둠
                        if (rawValue === '') continue;
                        try {
                            config[key] = JSON.parse(rawValue);
                        } catch (e) {
                            config[key] = rawValue; // 파싱 실패 시 원본 텍스트
                        }
                    } else if (type === 'string') {
                        // ✅ HTML을 백엔드 키로 변환
                        // (email 필드도 string이지만, convertHtmlToBackendKey는
                        //  HTML이 없는 일반 텍스트는 그대로 반환하므로 안전함)
                        config[key] = convertHtmlToBackendKey(rawValue);
                    } else {
                        // boolean, number 등
                        config[key] = rawValue;
                    }
                }
            }
            return config;
        };

        const triggerRequest = {
            capabilityId: selectedTrigger.capabilityId,
            config: buildConfig(0, selectedTrigger)
        };

        const actionRequests = selectedActions.map((action, index) => ({
            capabilityId: action.capabilityId,
            config: buildConfig(index + 1, action)
        }));

        const payload = {
            taskName: taskName.trim(),
            trigger: triggerRequest,
            actions: actionRequests
        };

        console.log("Saving Task:", JSON.stringify(payload, null, 2));

        try {
            await api.post('/task/task', payload);
            alert(t('task_save_success', '작업이 성공적으로 저장되었습니다!'));
            navigate('/service');
        } catch (err) {
            console.error("Error saving task:", err);
            alert(t('task_save_error', '작업 저장에 실패했습니다. 다시 시도해주세요.'));
        } finally {
            setIsSaving(false);
        }
    };

    const isCurrentStepValid = currentStep === 0 ? !!selectedTrigger : !!selectedActions[currentStep - 1];
    
    const totalStepsToShow = Math.min(
        Math.max(currentStep + 1, 1 + selectedActions.length),
        1 + MAX_ACTIONS 
    );


    // --- (JSX 렌더링 부분) ---
    return (
        <div className="page-container">
            <div className="task-name-container">
                <div className="form-field">
                    <label htmlFor="taskName">{t('task_name', '작업 이름')}</label>
                    <input
                        type="text"
                        id="taskName"
                        name="taskName"
                        placeholder={t('task_name_placeholder', '예: 매일 아침 날씨 이메일 받기')}
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                </div>
            </div>

            {(isLoading || isSaving) && <Loading />}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {!isLoading && !isSaving && !error && (
                <>
                    <div className="add-task-wrapper">

                        <div className="add-task-main-content">
                            <div className="task-creation-container">
                                {renderStepContent()}
                                <div className="service-container">
                                    {renderServiceContainerContent()}
                                </div>
                            </div>
                        </div>

                        <div className="available-vars-sidebar">
                            <h4>{t('available_variables_title')}</h4>
                            <div className="vars-list">
                                {Object.keys(availableVariables).length === 0 ? (
                                    <p>{t('no_available_variables')}</p>
                                ) : (
                                    // --- (드래그 앤 드롭 로직은 변경 없음) ---
                                    Object.entries(availableVariables).map(([key, valueObj]) => (
                                        <div className="var-item" key={key}>
                                            <div
                                                className="var-item-name"
                                                draggable="true"
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData("application/json", JSON.stringify(valueObj));
                                                }}
                                            >
                                                {valueObj.name}
                                            </div>

                                            <p className="var-item-description">
                                                {valueObj.description}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="step-navigation">
                        {currentStep > 0 && (
                            <button
                                className="step-button back"
                                onClick={() => setCurrentStep(currentStep - 1)}
                            >
                                {currentStep === 1 ? t('button_back_trigger') : t('button_back_action', { index: currentStep - 1 })}
                            </button>
                        )}

                        <StepIndicator
                            currentStep={currentStep}
                            totalSteps={totalStepsToShow}
                            onStepClick={handleStepClick}
                            t={t}
                        />

                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            flexShrink: 0,
                            marginLeft: 'auto'
                        }}>
                            {currentStep > 0 && (
                                <button
                                    className="step-button"
                                    onClick={handleSaveTask}
                                    disabled={!isCurrentStepValid || !taskName.trim()}
                                >
                                    {t('button_save_task')}
                                </button>
                            )}

                            {/* --- ✅ [핵심 수정] "다음/액션 추가" 버튼 조건부 렌더링 --- */}
                            {/* currentStep이 5 (액션 5 페이지)보다 작을 때만 버튼을 보여줍니다. */}
                            { currentStep < MAX_ACTIONS && (
                                <button
                                    className="step-button"
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={!isCurrentStepValid}
                                >
                                    {currentStep === 0 ? t('button_next_action') : t('button_add_action')}
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AddTaskPage;