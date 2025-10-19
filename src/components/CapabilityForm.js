import React from 'react';
import { useTranslation } from 'react-i18next';
import ArrayInput from './ArrayInput';
import VariableInput from './VariableInput'; // ✅ VariableInput import 확인
import CronBuilder from './CronBuilder'; // ✅ 1. CronBuilder import

/**
 * paramSchema의 properties를 기반으로 개별 입력 필드를 렌더링합니다.
 */
// ✅ 2. renderField 시그니처에 capabilityId 추가
const renderField = (key, field, value, onFieldChange, t, capabilityId) => {

    // --- ✅ 3. Cron 빌더 특별 처리 ---
    if (capabilityId === 'schedule_cron' && key === 'cron') {
        return (
            <div className="form-field" key={key}>
                <label htmlFor={key}>{field.description || key}</label>
                <CronBuilder
                    id={key}
                    value={value || '0 0 12 * * 1,2,3,4,5'} // 기본값: 평일 12:00
                    onChange={(newValue) => onFieldChange(key, newValue)}
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
                    id={key} // textarea에는 id가 이미 있었음
                    name={key}
                    placeholder={field.description || ''}
                    rows={3}
                    value={value || ''}
                    onChange={(e) => onFieldChange(key, e.target.value)}
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
                    id={key} // input에는 id가 이미 있었음
                    name={key}
                    placeholder={field.description || ''}
                    value={value || ''}
                    onChange={(e) => onFieldChange(key, e.target.value)}
                />
            </div>
        );
    }


    // --- ✅ 4. 그 외 모든 "string" 타입 -> VariableInput 사용 ---
    const isTextArea = (field.format === 'html' || (field.description && field.description.length > 50));

    return (
        <div className="form-field" key={key}>
            <label htmlFor={key}>{field.description || key}</label>
            <VariableInput
                id={key} // ✅ id prop 전달됨
                isTextArea={isTextArea}
                placeholder={field.description || ''}
                value={value || ''}
                onChange={(newValue) => onFieldChange(key, newValue)}
            />
        </div>
    );
};

/**
 * paramSchema를 받아 동적 폼을 렌더링하는 컴포넌트
 */
// ✅ 4. capabilityId를 props로 받도록 수정
const CapabilityForm = ({ schema, capabilityId, config, onChange }) => {
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

    const { properties, required = [] } = schema;

    const requiredFields = [];
    const optionalFields = [];

    const simpleRequired = required.filter(key => !key.startsWith('_'));

    Object.entries(properties).forEach(([key, field]) => {
        const currentValue = config[key];
        
        // ✅ 5. renderField 호출 시 capabilityId 전달
        const fieldComponent = renderField(key, field, currentValue, handleFieldChange, t, capabilityId);

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