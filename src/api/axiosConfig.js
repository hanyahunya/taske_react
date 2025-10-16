import axios from 'axios';

// 1. 모든 요청에 사용될 기본 인스턴스 (인터셉터 포함)
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 2. 토큰 갱신 전용으로 사용될 별도의 인스턴스 (인터셉터 없음!)
const refreshApi = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// --- 요청 인터셉터 (api 인스턴스에만 적용) ---
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 응답 인터셉터 (api 인스턴스에만 적용) ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleLogout = () => {
  localStorage.removeItem('accessToken');
  alert('세션이 만료되었습니다. 다시 로그인해주세요.');
  window.location.href = '/';
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // --- ↓↓↓ 핵심 수정 부분 ↓↓↓ ---
      try {
        // 1. 현재 localStorage에 저장된 (만료된) 토큰을 가져옵니다.
        const expiredAccessToken = localStorage.getItem('accessToken');

        // 2. 토큰 갱신 요청 시, 가져온 만료 토큰을 직접 헤더에 담아 보냅니다.
        const refreshResponse = await refreshApi.post('/auth/refresh', null, {
            headers: {
                'Authorization': `Bearer ${expiredAccessToken}`
            }
        });
        
        const newAuthHeader = refreshResponse.headers['authorization'];
        if (newAuthHeader && newAuthHeader.startsWith('Bearer ')) {
          const newAccessToken = newAuthHeader.split(' ')[1];
          
          localStorage.setItem('accessToken', newAccessToken);
          
          processQueue(null, newAccessToken);
          
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
            handleLogout();
            return Promise.reject(new Error('Refresh succeeded but no token was provided.'));
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;