import restoreInitDataByOrigin from '../../assets/js/utils/reduction';
import messageBox from '../../assets/js/utils/message';

export default class InvoiceInfoItemClass {
  ID = ''

  Name = ''

  Unit = ''

  ProductClassList = []

  IsIncludeIncreasedProduct = false

  constructor(data) {
    restoreInitDataByOrigin(this, data);
    if (!data) this.key = Math.random().toString(16).slice(-10);
  }

  checker(InvoiceInfoList) {
    if (!this.Name) {
      messageBox.failSingleError('提交失败', '请填写开票类别名称');
      return false;
    }

    if (InvoiceInfoList.some(it => it.Name === this.Name && it.ID !== this.ID)) {
      messageBox.failSingleError('提交失败', '开票类别名称重复');
      return false;
    }

    if (!this.Unit) {
      messageBox.failSingleError('提交失败', '请填写类别单位');
      return false;
    }

    if (this.ProductClassList.length === 0) {
      messageBox.failSingleError('提交失败', '请选择产品分类');
      return false;
    }

    return true;
  }
}
