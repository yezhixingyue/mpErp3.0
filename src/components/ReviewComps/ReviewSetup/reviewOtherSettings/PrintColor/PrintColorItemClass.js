import restoreInitDataByOrigin from '../../../../../assets/js/utils/reduction';
import messageBox from '../../../../../assets/js/utils/message';
import { PrintColorTypeEnumList } from '../../../../../store/review/reviewEnums';

export default class PrintColorItemClass {
  ID = '' // 数字类型

  InstranceID = ''

  Part = { // 可能为空
    ID: '',
    Name: '',
  }

  Group = { // 可能为空
    ID: '',
    Name: '',
  }

  Element = {
    ID: '',
    Name: '',
  }

  Option = {
    ID: '',
    Name: '',
  }

  ColorList = [] // 不可为空

  _IsDefault = false

  constructor(data, Product) {
    restoreInitDataByOrigin(this, data);
    if (!this._IsDefault && data && Product) {
      if (this.Part.ID === '' && this.Element.ID) {
        this.Part.ID = Product.ID;
        this.Part.Name = '产品';
      }
    }
  }

  checker() {
    if (!this.ColorList || this.ColorList.length === 0) {
      const msg = this._IsDefault ? '请选择颜色' : '信息不完整';
      messageBox.failSingleError('保存失败', msg);
      return false;
    }
    return true;
  }

  getInfo(Product) {
    if (!this.checker()) {
      return null;
    }

    if (this._IsDefault) {
      return { DefaultPrintColor: [...this.ColorList] };
    }

    const PrintColor = { ...this };

    delete PrintColor._IsDefault;

    if (this.Part.ID === Product.ID) {
      PrintColor.Part = null;
    }
    if (!this.Group.ID) {
      PrintColor.Group = null;
    }

    return { PrintColor };
  }

  static getColorDisplayContent(ColorList) {
    if (!Array.isArray(ColorList)) return '';
    let list = ColorList;
    if (list.length === 0) {
      return '未设置';
    }
    list = PrintColorTypeEnumList.filter(it => list.includes(it.ID));
    return list.map(it => it.Name).join('、');
  }

  static getPropOptionDisplayContent({ Part, Group, Element, Option } = {}) {
    return [Part, Group, Element, Option].map(it => (it && it.Name ? it.Name : '')).filter(it => it).join(':');
  }
}
