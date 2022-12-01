import restoreInitDataByOrigin from '../../../../../assets/js/utils/reduction';
import messageBox from '../../../../../assets/js/utils/message';
import { PagesNumberTypeEnums } from '../../../../../store/review/reviewEnums';

export default class PageNumberItemClass {
  ID = '' // number

  FileList = []

  Type = PagesNumberTypeEnums.EveryKindPages.ID

  Formula = null

  Value = ''

  key = Math.random().toString(16).slice(-10)

  constructor(data) {
    restoreInitDataByOrigin(this, data);
    if (data) {
      const { Formula } = data;
      if (Formula) this.Formula = { ...Formula };
    }
  }

  checker() {
    if (!this.FileList || this.FileList.length === 0) {
      messageBox.failSingleError('保存失败', '未选择输出文件');
      return false;
    }

    if (!this.Formula && !this.Value && this.Value !== 0) {
      messageBox.failSingleError('保存失败', '请设置页数');
      return false;
    }

    if (!this.Formula && !/^[1-9][0-9]*$/.test(+this.Value)) {
      messageBox.failSingleError('保存失败', '页数必须为正整数');
      return false;
    }

    return true;
  }
}
