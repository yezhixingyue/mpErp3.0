import restoreInitDataByOrigin from '../../assets/js/utils/reduction';
import messageBox from '../../assets/js/utils/message';

export default class InvoiceInfoItemClass {
  InvoiceCategoryID = ''

  CategoryName = ''

  Unit = ''

  ProductList = []

  constructor(data) {
    restoreInitDataByOrigin(this, data);
    if (!data) this.key = Math.random().toString(16).slice(-10);
  }

  checker(InvoiceInfoList) {
    if (!this.CategoryName) {
      messageBox.failSingleError('保存失败', '请填写开票类别名称');
      return false;
    }

    if (InvoiceInfoList.some(it => it.CategoryName === this.CategoryName && it.InvoiceCategoryID !== this.InvoiceCategoryID)) {
      messageBox.failSingleError('保存失败', '开票类别名称重复');
      return false;
    }

    if (!this.Unit) {
      messageBox.failSingleError('保存失败', '请填写类别单位');
      return false;
    }

    if (this.ProductList.length === 0) {
      messageBox.failSingleError('保存失败', '请选择产品分类');
      return false;
    }

    return true;
  }
}
