/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from './axios';

const api = {
  getLogin(data: any) {
    return instance.post('/Api/Staff/Login', data, { withoutToken: true });
  },
  getUser<T = any>() {
    return instance.post<T>('/Api/Staff/Detail');
  },
};

export default api;
