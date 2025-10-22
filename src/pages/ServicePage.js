import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig'; // API 임포트
import Loading from '../components/Loading'; // 로딩 컴포넌트 임포트

// --- ✅ [수정] TaskItem 컴포넌트 ---
const TaskItem = ({ task, onToggle, onNameChange, onDelete }) => {
    const { t, i18n } = useTranslation();
    // ... (useState 및 핸들러 함수들은 변경 없음) ...
    const [isEditing, setIsEditing] = useState(false);
    const [currentName, setCurrentName] = useState(task.taskName);

    // --- 편집 버튼 클릭 ---
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // --- 저장 버튼 클릭 ---
    const handleSave = () => {
        const newName = currentName.trim();
        // 유효하고, 이름이 변경되었을 때만 부모 함수 호출
        if (newName && newName !== task.taskName) {
            onNameChange(task.taskId, newName);
        }
        setIsEditing(false);
    };

    // --- 취소 버튼 클릭 ---
    const handleCancel = () => {
        setIsEditing(false);
        setCurrentName(task.taskName); // 원래 이름으로 복원
    };

    // --- Enter(저장), Escape(취소) 키 처리 ---
    const handleNameInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };


    // --- ✅ [핵심 수정] formattedDate 로직 변경 ---
    const formattedDate = useMemo(() => {
        try {
            // 1. 날짜 부분 옵션
            const dateOptions = { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            };
            
            // 2. 시간 부분 옵션
            const timeOptions = { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            };

            // 3. 날짜 로캘 결정: 한국어(ko)일 경우, YYYY/MM/DD 형식을 위해 'ja' 로캘을 사용
            const dateLocale = i18n.language === 'ko' ? 'ja' : i18n.language;
            
            // 4. 시간 로캘 결정: 항상 현재 언어 사용 (오전/AM/午前)
            const timeLocale = i18n.language;

            // 5. 날짜와 시간 부분을 별도로 포맷팅
            const datePart = new Date(task.updatedAt).toLocaleDateString(dateLocale, dateOptions);
            const timePart = new Date(task.updatedAt).toLocaleTimeString(timeLocale, timeOptions);

            // 6. 'en' 로캘은 콤마(,)가 필요하지만, 'ko'와 'ja'는 공백( )이 필요함
            if (i18n.language === 'en') {
                return `${datePart}, ${timePart}`; // 예: 10/20/2025, 12:48 AM
            }
            return `${datePart} ${timePart}`; // 예: 2025/10/20 오전 12:48
            
        } catch (e) {
            return task.updatedAt; // 파싱 실패 시 원본 표시
        }
    }, [task.updatedAt, i18n.language]); // 의존성은 변경 없음

    return (
        <div className="task-list-item">
            {/* --- 작업 이름 셀 (변경 없음) --- */}
            <div className="task-name-cell">
                {isEditing ? (
                    // --- 1. 편집 중일 때 (Input + 버튼 2개) ---
                    <div className="task-name-edit-wrapper">
                        <input
                            type="text"
                            value={currentName}
                            onChange={(e) => setCurrentName(e.target.value)}
                            onKeyDown={handleNameInputKeyDown}
                            className="task-name-input"
                            autoFocus
                        />
                        <div className="task-name-edit-actions">
                            <button onClick={handleSave} className="task-action-btn save">
                                {t('task_item_save_button', '저장')}
                            </button>
                            <button onClick={handleCancel} className="task-action-btn cancel">
                                {t('task_item_cancel_button', '취소')}
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- 2. 평상시 (Span + 버튼 1개) ---
                    <div className="task-name-view-wrapper">
                        <span className="task-name-view" title={task.taskName}>
                            {task.taskName}
                        </span>
                        <button className="task-action-btn edit" onClick={handleEditClick}>
                            {t('task_item_edit_name_button', '편집')}
                        </button>
                    </div>
                )}
            </div>

            {/* 2. 활성화 토글 스위치 (변경 없음) */}
            <div className="task-status-cell">
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={task.isActive}
                        onChange={(e) => onToggle(task.taskId, e.target.checked)}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* --- ✅ [수정 완료] --- */}
            <div className="task-updated-at-cell">
                {formattedDate}
            </div>

            {/* 4. 관리 버튼 (i18n 적용) (변경 없음) */}
            <div className="task-actions-cell">
                <button className="task-edit-btn" onClick={() => alert('세부 수정 기능 구현 예정')}>
                    {t('task_item_edit_button', '세부 수정')}
                </button>
                <button className="task-delete-btn" onClick={() => onDelete(task.taskId)}>
                    {t('task_item_delete_button', '삭제')}
                </button>
            </div>
        </div>
    );
};


// --- ServicePage 메인 컴포넌트 (변경 없음) ---
// ... (이하 ServicePage 코드는 이전과 동일) ...
const ServicePage = () => {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // API 응답을 정렬하는 헬퍼 함수 (변경 없음)
    const sortTasks = (tasks) => {
        return tasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    };

    // 컴포넌트 마운트 시 작업 목록 불러오기 (i18n 적용)
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/task');
                const sortedTasks = sortTasks(response.data);
                setTasks(sortedTasks);
                setError(null);
            } catch (err) {
                console.error("Error fetching tasks:", err);
                setError(t('task_list_load_error', '작업 목록을 불러오는 데 실패했습니다.'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [t]);

    // 토글 핸들러 (API 호출 및 로컬 상태 갱신) (i18n 적용)
    const handleToggleActive = async (taskId, newIsActive) => {
        const originalTasks = tasks;
        const newUpdatedAt = new Date().toISOString();

        setTasks(prevTasks =>
            sortTasks(
                prevTasks.map(task =>
                    task.taskId === taskId ? { ...task, isActive: newIsActive, updatedAt: newUpdatedAt } : task
                )
            )
        );
        
        try {
            await api.patch(`/task/${taskId}/active`, { isActive: newIsActive });
        } catch (error) {
            console.error("Failed to update active status:", error);
            alert(t('task_update_error', '작업 상태 변경에 실패했습니다.'));
            setTasks(originalTasks); // 실패 시 원상 복구
        }
    };
    
    // 이름 변경 핸들러 (API 호출 및 로컬 상태 갱신) (i18n 적용)
    const handleNameChange = async (taskId, newName) => {
        const originalTasks = tasks;
        const newUpdatedAt = new Date().toISOString();

        // 1. 로컬 상태 즉시 업데이트 (낙관적 UI)
        setTasks(prevTasks =>
            sortTasks( // 정렬 다시 적용
                prevTasks.map(task =>
                    task.taskId === taskId ? { ...task, taskName: newName, updatedAt: newUpdatedAt } : task
                )
            )
        );

        // 2. API 호출
        try {
            await api.patch(`/task/${taskId}/title`, { taskName: newName });
            
        } catch (error) {
            console.error("Failed to update task name:", error);
            alert(t('task_name_update_error', '작업 이름 변경에 실패했습니다.'));
            setTasks(originalTasks); // 실패 시 원상 복구
        }
    };
    
    // 삭제 핸들러 (i18n 적용)
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm(t('task_item_delete_confirm', '이 작업을 정말로 삭제하시겠습니까?'))) {
            return;
        }

        const originalTasks = tasks;
        setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));

        try {
            await api.delete(`/task/${taskId}`);
        } catch (error) {
            console.error("Failed to delete task:", error);
            alert(t('task_delete_error', '작업 삭제에 실패했습니다.'));
            setTasks(originalTasks); // 실패 시 원상 복구
        }
    };


    // 렌더링 로직 (변경 없음)
    const renderContent = () => {
        if (isLoading) {
            return <Loading />;
        }

        if (error) {
            return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
        }

        if (tasks.length === 0) {
            return (
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <p>{t('service_page_no_tasks')}</p>
                </div>
            );
        }

        return (
            <div className="task-list-container">
                {/* --- 헤더 i18n 적용 --- */}
                <div className="task-list-header">
                    <div className="task-name-cell">{t('task_header_name', '작업 이름')}</div>
                    <div className="task-status-cell">{t('task_header_status', '상태')}</div>
                    <div className="task-updated-at-cell">{t('task_header_updated', '최종 수정')}</div>
                    <div className="task-actions-cell">{t('task_header_actions', '관리')}</div>
                </div>
                <div className="task-list-body">
                    {tasks.map(task => (
                        <TaskItem
                            key={task.taskId}
                            task={task}
                            onToggle={handleToggleActive}
                            onNameChange={handleNameChange}
                            onDelete={handleDeleteTask}
                        />
                    ))}
                </div>
            </div>
        );
    };

    // --- className 변경 (변경 없음) ---
    return (
        <div className="page-container">
            <div className="service-page-content">
                <h2>{t('service_page_title')}</h2>
                
                {renderContent()}

                <div className="service-page-actions">
                    <Link to="/task/add" className="submit-btn" style={{ textDecoration: 'none' }}>
                        {t('service_page_add_task_button')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServicePage;