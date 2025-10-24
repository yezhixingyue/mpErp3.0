import { instance } from '@/basic/request';

export const baseSetupApis = {
  /** POST /Api/Product/MRList  获取产品生产需求列表 */
  getProductMRList(condition) {
    return instance.post('/Api/Product/MRList', condition);
  },
  /** POST /Api/Product/SetupMROrder 设置订单序列化信息 */
  getProductSetupMROrder(data) {
    return instance.post('/Api/Product/SetupMROrder', data);
  },
  /** GET /Api/Product/MRProduct  获取生产需求产品设置 */
  getProductMRProduct(productID: string) {
    return instance.get('/Api/Product/MRProduct', { params: { productID } });
  },
  /** POST /Api/Product/SetupMRProduct  设置生产需求产品信息 */
  getProductSetupMRProduct(data) {
    return instance.post('/Api/Product/SetupMRProduct', data);
  },
  /** /Api/PrintPackage/UnFinishedOrderLimit 获取当前是否允许未完工订单回货 */
  getPrintPackageUnFinishedOrderLimit() {
    return instance.get('/Api/PrintPackage/UnFinishedOrderLimit');
  },
  /** /Api/PrintPackage/ChangeUnFinishedOrderLimit */
  getPrintPackageChangeUnFinishedOrderLimit(allowPrint: boolean) {
    return instance.put('/Api/PrintPackage/ChangeUnFinishedOrderLimit', undefined, { params: { allowPrint } });
  },
  /** /Api/Product/SetIncludeDescribeFile  PUT  productID产品ID  includeDescribeFile 包含需求描述文件 */
  getProductSetIncludeDescribeFile(productID: string, includeDescribeFile: boolean) {
    return instance.put('/Api/Product/SetIncludeDescribeFile', undefined, { params: { productID, includeDescribeFile } });
  },
};
