/* eslint-disable max-len */
// eslint-disable-next-line import/no-cycle
import instance from './instance';

/** 文档管理项目接口 */
export const docApi = {
  /** 获取分类列表 GET /Api/Category/GetAl */
  getClassList() {
    return instance.get('/Api/Category/GetAll');
  },
};
