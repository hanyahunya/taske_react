import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axiosConfig';
import Loading from '../components/Loading';
import ModuleSelection from '../components/ModuleSelection';

const AddTaskPage = () => {
  const { t } = useTranslation();
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="page-container">
      <h2 className="page-title">{t('task_add_title')}</h2>
      
      {isLoading && <Loading />}
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {!isLoading && !error && (
        <div className="task-creation-container">
          <div className="selectors-container">
            <ModuleSelection 
              modules={modules}
              capabilityType="triggers"
              title={t('task_triggers')}
            />
            <ModuleSelection
              modules={modules}
              capabilityType="actions"
              title={t('task_actions')}
            />
          </div>
          <div className="service-container">
            {/* 이 곳이 나중에 작업 설정 UI가 들어갈 우측 영역입니다. */}
            <p>{t('task_add_service_placeholder')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskPage;