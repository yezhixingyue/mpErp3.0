/* eslint-disable @typescript-eslint/no-explicit-any */
import { SaleAndProductionListItemPlainType } from '@/views/serverManage/utils/SaleAndProductionListItemClass';
import { ServerTypeEnum } from '@/views/serverManage/utils/types';
import instance from './axios';

const api = {
  /* 用户相关
  ------------------------------- */
  getLogin(data: any) {
    return instance.post('/Api/Staff/Login', data, { withoutToken: true });
  },
  getUser<T = any>() {
    return instance.post<T>('/Api/Staff/Detail');
  },
  /* 销售端 & 生产端
  ------------------------------- */
  getServerList(type: ServerTypeEnum) { // GET /Api/Server/List  获取服务器列表
    return instance.get('/Api/Server/List', { params: { type } });
  },
  // POST /Api/Server/Save  服务器(销售端/生产端)信息保存
  getServerSave(data: SaleAndProductionListItemPlainType) {
    return instance.post<string>('/Api/Server/Save', data);
  },
};

export default api;
