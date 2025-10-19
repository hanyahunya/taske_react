import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Cron 문자열을 UI 상태로 파싱하는 함수
 * "0 분 시 * * 요일" 형식만 지원 (예: "0 15 10 * * 1,3,5")
 * @param {string} cronValue - "0 15 10 * * 1,3,5"
 */
const parseCron = (cronValue) => {
    try {
        const parts = cronValue.split(' ');
        if (parts.length !== 6) {
            // --- ✅ [수정] 기본 요일을 '평일'에서 '선택 안 함'으로 변경 ---
            return { minute: '0', hour: '12', days: [] };
        }
        
        const [sec, min, hr, dayOfMonth, month, dayOfWeek] = parts;
        
        if (sec !== '0' || dayOfMonth !== '*' || month !== '*') {
             // --- ✅ [수정] 기본 요일을 '평일'에서 '선택 안 함'으로 변경 ---
             return { minute: '0', hour: '12', days: [] };
        }

        const parsedDays = dayOfWeek === '*' ? [] : dayOfWeek.split(',').map(Number);
        
        return {
            minute: min === '*' ? '0' : min,
            hour: hr === '*' ? '12' : hr,
            days: parsedDays,
        };

    } catch (e) {
        // --- ✅ [수정] 기본 요일을 '평일'에서 '선택 안 함'으로 변경 ---
        return { minute: '0', hour: '12', days: [] };
    }
};


// --- (이하 코드는 변경 없음) ---
const CronBuilder = ({ id, value, onChange, isError }) => {
    const { t } = useTranslation();

    const DAYS_OF_WEEK = useMemo(() => [
        { label: t('cron_day_sun', '일'), value: 0 },
        { label: t('cron_day_mon', '월'), value: 1 },
        { label: t('cron_day_tue', '화'), value: 2 },
        { label: t('cron_day_wed', '수'), value: 3 },
        { label: t('cron_day_thu', '목'), value: 4 },
        { label: t('cron_day_fri', '금'), value: 5 },
        { label: t('cron_day_sat', '토'), value: 6 },
    ], [t]);
    
    // UI 상태: 파싱된 cron 값으로 초기화
    const [internalState, setInternalState] = useState(() => parseCron(value));

    // --- onChange 콜백을 ref에 저장 ---
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);


    // 부모 컴포넌트(CapabilityForm)에서 cron 값(value)이 변경될 때
    useEffect(() => {
        setInternalState(parseCron(value));
    }, [value]);

    // --- ✅ [핵심 수정] 무한 루프 방지 ---
    // UI 상태(시간, 요일)가 변경될 때마다 cron 문자열을 생성하여 부모로 전달
    useEffect(() => {
        const { minute, hour, days } = internalState;
        
        const dayOfWeekStr = days.length === 0 ? '*' : days.sort((a, b) => a - b).join(',');
        
        const newCronValue = `0 ${minute} ${hour} * * ${dayOfWeekStr}`;
        
        // --- ✅ 1. 조건문 추가 ---
        // 부모로부터 받은 'value'와 내가 새로 만든 'newCronValue'가 다를 때만
        // onChange를 호출하여 무한 루프를 방지합니다.
        if (newCronValue === value) {
            return;
        }
        
        if (onChangeRef.current) {
            onChangeRef.current(newCronValue);
        }
    // --- ✅ 2. 의존성 배열에 'value' 추가 ---
    // 'value'가 변경될 때도 이 훅을 실행하여 비교해야 합니다.
    }, [internalState, value]); 

    // 시간(시, 분) 변경 핸들러
    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        let numValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
        
        if (isNaN(numValue)) numValue = 0;
        
        if (name === 'hour') {
            if (numValue > 23) numValue = 23;
        } else {
            if (numValue > 59) numValue = 59;
        }

        setInternalState(prev => ({
            ...prev,
            [name]: String(numValue),
        }));
    };

    // 요일 토글 핸들러
    const toggleDay = (dayValue) => {
        setInternalState(prev => {
            const newDays = prev.days.includes(dayValue)
                ? prev.days.filter(d => d !== dayValue)
                : [...prev.days, dayValue];
            return { ...prev, days: newDays };
        });
    };

    return (
        // --- ✅ 2. className에 isError 적용 ---
        <div className={`cron-builder-container ${isError ? 'field-error' : ''}`} id={id}>
            {/* 1. 시간 입력 */}
            <div className="cron-time-input-wrapper">
                <input
                    type="text"
                    name="hour"
                    value={internalState.hour}
                    onChange={handleTimeChange}
                    className="cron-time-input"
                    maxLength={2}
                />
                <span className="cron-time-separator">:</span>
                <input
                    type="text"
                    name="minute"
                    value={internalState.minute}
                    onChange={handleTimeChange}
                    className="cron-time-input"
                    maxLength={2}
                />
            </div>
            
            {/* 2. 요일 선택 */}
            <div className="cron-days-toggle">
                {DAYS_OF_WEEK.map(day => (
                    <button
                        key={day.value}
                        type="button"
                        className={`day-btn ${internalState.days.includes(day.value) ? 'active' : ''}`}
                        onClick={() => toggleDay(day.value)}
                    >
                        {day.label}
                    </button>
                ))}
            </div>

            {/* 3. 단축 버튼 */}
            <div className="cron-shortcut-buttons">
                <button
                    type="button"
                    onClick={() => setInternalState(prev => ({ ...prev, days: [1, 2, 3, 4, 5] }))}
                >
                    {t('cron_shortcut_weekdays', '평일')}
                </button>
                 <button
                    type="button"
                    onClick={() => setInternalState(prev => ({ ...prev, days: [0, 6] }))}
                >
                    {t('cron_shortcut_weekends', '주말')}
                </button>
                <button
                    type="button"
                    onClick={() => setInternalState(prev => ({ ...prev, days: [0, 1, 2, 3, 4, 5, 6] }))}
                >
                    {t('cron_shortcut_everyday', '매일')}
                </button>
            </div>
        </div>
    );
};

export default CronBuilder;