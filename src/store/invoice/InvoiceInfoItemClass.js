import messageBox from '../../assets/js/utils/message';

export default class InvoiceInfoItemClass {
  InvoiceCategoryID = ''

  CategoryName = ''

  Unit = ''

  IsDefault = false

  ProductList = []

  constructor(data, allProductClassify) {
    if (data) {
      this.InvoiceCategoryID = data.InvoiceCategoryID;
      this.CategoryName = data.CategoryName;
      this.Unit = data.Unit;
      this.IsDefault = data.IsDefault;

      // 处理ProductList
      this.ProductList = data.ProductList.map(it => {
        const { TypeID } = it;

        const t = allProductClassify.find(lv1 => lv1.children.map(lv2 => lv2.ID).includes(TypeID));

        return t ? { TypeID, ClassID: t.ID } : null;
      }).filter(Boolean);
    } else {
      this.key = Math.random().toString(16).slice(-10);
    }
  }

  checker(InvoiceInfoList, defaultItemInfo) {
    if (!this.CategoryName) {
      messageBox.failSingleError('保存失败', '请填写开票类别名称');
      return false;
    }

    if (InvoiceInfoList.some(it => it.CategoryName === this.CategoryName && it.InvoiceCategoryID !== this.InvoiceCategoryID)
     || (defaultItemInfo && defaultItemInfo.CategoryName === this.CategoryName)) {
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
