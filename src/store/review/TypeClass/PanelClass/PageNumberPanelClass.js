import PageNumberItemClass from '../../../../components/ReviewComps/ReviewSetup/Panels/PageNumberPanel/PageNumberItemClass';
import messageBox from '../../../../assets/js/utils/message';

export default class PageNumberPanelClass {
  PagesNumberList = []

  constructor(data) {
    if (data && Array.isArray(data.PagesNumberList)) {
      this.PagesNumberList = data.PagesNumberList.map(it => new PageNumberItemClass(it));
    }
  }

  getInfo() {
    if (this.PagesNumberList.length === 0) {
      messageBox.failSingleError('保存失败', '至少应有一条设置');
      return null;
    }
    return this;
  }

  static getTableItemDisplayContent(item) {
    if (item && Array.isArray(item.PagesNumberList)) {
      const names = [];
      item.PagesNumberList.forEach(it => {
        if (Array.isArray(it.FileList)) {
          names.push(...it.FileList.map(_it => _it.Name).filter(_it => _it));
        }
      });
      return [...new Set(names)].join('、');
    }
    return '';
  }
}
