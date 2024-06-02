import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3001/',
});

api.interceptors.request.use(
  (config) => {
    const u: any = localStorage.getItem('u') as any;
    const token = u ? JSON.parse(u)?.token : null;

    config.headers.Authorization =  token;

    return config;
  },
  (error) => {
    console.log(error)
    // if (error.response.status === 401) {
    //   location.href = '/signin'
    // }

    return error;
  }
);

export default api;
