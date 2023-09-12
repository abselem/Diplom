import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
});

let lastActivity = Date.now();

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Проверяем время последней активности пользователя
  if (Date.now() - lastActivity > 5 * 60 * 1000) {
    // Удаляем токен и перезагружаем страницу
    localStorage.removeItem('access_token');
    window.location.reload();
  }

  return config;
});

instance.interceptors.response.use((response) => {
  // Обновляем время последней активности пользователя при любом ответе от сервера
  lastActivity = Date.now();
  return response;
  }, (error) => {
  const originalRequest = error.config;

  // Проверяем код ответа сервера
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    
    // Обращаемся к серверу для обновления токена
    return axios.post('http://127.0.0.1:8000/api/refresh_token/', {
      refresh: localStorage.getItem('refresh_token'),
    }).then((response) => {
      const access_token = response.data.access;
      localStorage.setItem('access_token', access_token);
    
      // Обновляем заголовок запроса с новым токеном
      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return axios(originalRequest);
    });
  }
  return Promise.reject(error);
});

// Запускаем интервал обновления токена
setInterval(() => {
  axios.post('http://127.0.0.1:8000/api/refresh_token/', {
    refresh: localStorage.getItem('refresh_token'),
  }).then((response) => {
    const access_token = response.data.access;
    localStorage.setItem('access_token', access_token);
  });
}, 30 * 60 * 1000);

export default instance;