import { instance } from '@/basic/request';

/** 抛货管理相关接口 */
export const lightgoodsApis = {
  /** post /Api/BulkyCargo/Product/List  获取抛货产品列表 */
  getLightgoodsProductList(condition) {
    return instance.post('/Api/BulkyCargo/Product/List', condition);
  },
  /** get /Api/BulkyCargo/Product/Setup 设置抛货产品 */
  getLightgoodsProductSetup(productID: string) {
    return instance.get('/Api/BulkyCargo/Product/Setup', { params: { productID } });
  },
  /** delete /Api/BulkyCargo/Product/Remove 删除抛货产品 */
  getLightgoodsProductRemove(productID: string) {
    return instance.delete('/Api/BulkyCargo/Product/Remove', { params: { productID } });
  },
  /** post /Api/BulkyCargo/Sulotion/Save 设置抛货产品方案保存(新增|编辑) */
  getLightgoodsSulotionSave(data) {
    return instance.post('/Api/BulkyCargo/Sulotion/Save', data);
  },
  /** get /Api/BulkyCargo/Solution/List 获取抛货产品打包方案列表 */
  getLightgoodsSulotionList(productID: string) {
    return instance.get('/Api/BulkyCargo/Solution/List', { params: { productID } });
  },
  /** delete /Api/BulkyCargo/Solution/Remove 删除抛货方案 */
  getLightgoodsSolutionRemove(solutionID: string) {
    return instance.delete('/Api/BulkyCargo/Solution/Remove', { params: { solutionID } });
  },
  /** post /Api/BulkyCargo/Sulotion/TableDataSave 打包方案保存 */
  getLightgoodsSolutionTableDataSave(data) {
    return instance.post('/Api/BulkyCargo/Sulotion/TableDataSave', data);
  },
  /** post /Api/BulkyCargo/Sulotion/FormulaSave 产品体积公式保存 */
  getLightgoodsSolutionFormulaSave(data) {
    return instance.post('/Api/BulkyCargo/Sulotion/FormulaSave', data);
  },
};
