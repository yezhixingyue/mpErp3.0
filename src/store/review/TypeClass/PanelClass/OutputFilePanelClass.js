import messageBox from '../../../../assets/js/utils/message';

export default class OutputFilePanelClass {
  FileList = []

  constructor(data) {
    if (data && Array.isArray(data.FileList)) {
      this.FileList = [...data.FileList];
    }
  }

  getInfo() {
    if (this.FileList.length === 0) {
      messageBox.failSingleError('保存失败', '未选择文件');
      return null;
    }
    return this;
  }

  static getTableItemDisplayContent(item) {
    if (item && Array.isArray(item.FileList)) {
      return item.FileList.map(it => it.Name).filter(it => it).join('、');
    }
    return '';
  }
}
