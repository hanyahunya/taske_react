import React from 'react';
import { useTranslation } from 'react-i18next';
import ArrayInput from './ArrayInput';
import VariableInput from './VariableInput'; 
import CronBuilder from './CronBuilder'; 

/**
 * paramSchema의 properties를 기반으로 개별 입력 필드를 렌더링합니다.
 * (이 함수 자체는 변경되지 않았습니다)
 */
const renderField = (key, field, value, onFieldChange, t, capabilityId, validationError) => {

    const isError = validationError === key;

    // --- Cron 빌더 특별 처리 ---
    if (capabilityId === 'schedule_cron' && key === 'cron') {
        return (
            <div className="form-field" key={key}>
                <label htmlFor={key}>{field.description || key}</label>
                <CronBuilder
                    id={key}
                    value={value || '0 0 12 * * *'} 
                    onChange={(newValue) => onFieldChange(key, newValue)}
                    isError={isError} 
                />
            </div>
        );
    }
    // --- 특별 처리 끝 ---


    // 1. 'type: "array"' (변경 없음)
    if (field.type === 'array') {
        return (
            <div className="form-field" key={key}>
                <label htmlFor={key}>{field.description || key}</label>
                <ArrayInput
                    field={field}
                    value={value || []}
                    onChange={(newArray) => onFieldChange(key, newArray)}
                    isError={isError} 
                />
            </div>
        );
    }

    // 2. 'type: "object"' (변경 없음)
    if (field.type === 'object') {
         return (
            <div className="form-field" key={key}>
                <label htmlFor={key}>{field.description || key}</label>
                <textarea
                    id={key}
                    name={key}
                    placeholder={field.description || ''}
                    rows={3}
                    value={value || ''}
                    onChange={(e) => onFieldChange(key, e.target.value)}
                    className={isError ? 'field-error' : ''} 
                />
            </div>
        );
    }

    // 3. 'type: "string" format: "email"' (변경 없음)
    if (field.type === 'string' && field.format === 'email') {
        return (
            <div className="form-field" key={key}>
                <label htmlFor={key}>{field.description || key}</label>
                <input
                    type="email"
                    id={key}
                    name={key}
                    placeholder={field.description || ''}
                    value={value || ''}
                    onChange={(e) => onFieldChange(key, e.target.value)}
                    className={isError ? 'field-error' : ''} 
                />
            </div>
        );
    }


    // --- 4. 그 외 모든 "string" 타입 -> VariableInput 사용 (변경 없음) ---
    const isTextArea = (field.format === 'html' || (field.description && field.description.length > 50));

    return (
        <div className="form-field" key={key}>
            <label htmlFor={key}>{field.description || key}</label>
            <VariableInput
                id={key} 
                isTextArea={isTextArea}
                placeholder={field.description || ''}
                value={value || ''}
                onChange={(newValue) => onFieldChange(key, newValue)}
                isError={isError} 
            />
        </div>
    );
};

/**
 * paramSchema를 받아 동적 폼을 렌더링하는 컴포넌트
 */
const CapabilityForm = ({ schema, capabilityId, config, onChange, validationError }) => {
    const { t } = useTranslation();

    const handleFieldChange = (key, value) => {
        onChange({
            ...config,
            [key]: value
        });
    };

    if (!schema || !schema.properties) {
        return <p>{t('task_add_no_schema', '설정할 수 있는 항목이 없습니다.')}</p>;
    }

    // --- ✅ [핵심 수정] ---
    // 1. schema에서 properties, required, ignored를 구조분해 할당합니다.
    const { properties, required = [], ignored = [] } = schema;
    // --- 수정 끝 ---

    const requiredFields = [];
    const optionalFields = [];

    // 'ignored'에 포함되지 않은 필수 필드만 필터링합니다.
    const simpleRequired = required.filter(key => !key.startsWith('_') && !ignored.includes(key));

    Object.entries(properties).forEach(([key, field]) => {
        
        // --- ✅ [핵심 수정] ---
        // 2. ignored 배열에 포함된 키는 렌더링하지 않고 건너뜁니다.
        if (ignored.includes(key)) {
            return; // continue
        }
        // --- 수정 끝 ---

        const currentValue = config[key];
        
        const fieldComponent = renderField(key, field, currentValue, handleFieldChange, t, capabilityId, validationError);

        if (simpleRequired.includes(key)) {
            requiredFields.push(fieldComponent);
        } else {
            optionalFields.push(fieldComponent);
        }
    });

    return (
        <div className="capability-form-container">
            {requiredFields.length > 0 && (
                <div className="form-section">
                    <h4>{t('form_required_fields', '필수 항목')}</h4>
                    {requiredFields}
                </div>
            )}
            {optionalFields.length > 0 && (
                <div className="form-section">
                    <h4>{t('form_optional_fields', '선택 항목')}</h4>
                    {optionalFields}
                </div>
            )}

            {requiredFields.length === 0 && optionalFields.length === 0 && (
                 <p>{t('task_add_no_schema', '설정할 수 있는 항목이 없습니다.')}</p>
            )}
        </div>
    );
};

export default CapabilityForm;