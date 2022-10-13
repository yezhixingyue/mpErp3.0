import type { AxiosRequestConfig } from 'axios';
import { TokenClass } from 'yezhixingyue-js-utils-4-mpzj';
import api from '@/api/index';
import { IUser } from '@/store/modules/user/types';

enum localStorageKeyEnum {
  token = 'converterToken',
  user = 'converterUser'
}

export const tokenHandler = new TokenClass({
  labelName: {
    token: localStorageKeyEnum.token,
    user: localStorageKeyEnum.user,
  },
  getUserInfoFunc: () => api.getUser(),
});

export const handleToken = (config: AxiosRequestConfig) => {
  const token = tokenHandler.getToken();
  if (!token && !config.withoutToken) {
    throw new Error('请重新登录');
  }

  if (config.headers && !config.withoutToken) {
    const _config = config;
    if (_config.headers) _config.headers.Authorization = `Bearer ${token}`;
  }
};

export const getLocalStorageUser = () => {
  const temp = localStorage.getItem(localStorageKeyEnum.user);
  if (temp) {
    return JSON.parse(temp) as IUser;
  }
  return null;
};
