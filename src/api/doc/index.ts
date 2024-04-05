import { IArticle, IDocClass } from '@/views/OpenPlatform/DocManage/js/types';
import instance from './instance';

/** 文档管理项目接口 */
export const docApi = {
  /** 获取分类列表 GET /Api/Category/GetAl */
  getClassList() {
    return instance.get<IDocClass[]>('/Api/Category/GetAll');
  },
  /** 获取文章列表 GET /Api/Article/GetArticlesByCategory */
  getArticleList(CategoryID: number, Page: number, Limit: number) {
    return instance.get<IArticle[]>('/Api/Article/GetArticlesByCategory', { params: { CategoryID, Page, Limit } });
  },
  /** 创建编辑文章分类 POST /Api/Category/SaveCategory */
  getCategorySaveCategory(params) {
    return instance.post<IDocClass>('/Api/Category/SaveCategory', null, { params });
  },
  /** 删除文章分类 DELETE /Api/Category/DeleteCategory */
  getCategoryDeleteCategory(id: number) {
    return instance.delete('/Api/Category/DeleteCategory', { params: { id } });
  },
  /** 上移下移 PUT /Api/Category/MoveCategory */
  getCategoryMoveCategory(id: number, direction: 1 | -1) {
    return instance.put('/Api/Category/MoveCategory', null, { params: { id, direction } });
  },
  /** 移动到其他分类 PUT /Api/Category/MoveCategoryToParent */
  getCategoryMoveCategoryToParent(id: number, targetID: number) {
    return instance.put('/Api/Category/MoveCategoryToParent', null, { params: { id, targetID } });
  },
};
