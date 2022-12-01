import SizeNumberItemClass from '../../../../components/ReviewComps/ReviewSetup/Panels/SizeNumberPanel/SizeNumberItemClass';
import messageBox from '../../../../assets/js/utils/message';

export default class SizeNumberPanelClass {
  SizeNumberList = []

  constructor(data) {
    if (data && Array.isArray(data.SizeNumberList)) {
      this.SizeNumberList = data.SizeNumberList.map(it => new SizeNumberItemClass(it));
    }
  }

  getInfo() {
    if (this.SizeNumberList.length === 0) {
      messageBox.failSingleError('保存失败', '至少应有一条设置');
      return null;
    }
    return this;
  }

  static getTableItemDisplayContent(item) {
    if (item && Array.isArray(item.SizeNumberList)) {
      const names = [];
      item.SizeNumberList.forEach(it => {
        if (Array.isArray(it.FileList)) {
          names.push(...it.FileList.map(_it => _it.Name).filter(_it => _it));
        }
      });
      return [...new Set(names)].join('、');
    }
    return '';
  }
}
