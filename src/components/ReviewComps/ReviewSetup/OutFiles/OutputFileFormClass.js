import restoreInitDataByOrigin from '../../../../assets/js/utils/reduction';

export default class OutputFileFormClass {
  ID = ''

  Name = ''

  CreateTime = ''

  IncludeContent = ''

  CheckContent = false

  IsPDF = false // 生成提交数据时，需要进行一次封装，当IsPDF为false时， 修改下面2个的值为false 然后再提交

  IsMakeup = false // 需要拼版

  IsGenerateThumb = false // 生成缩略图

  IsFromPrintFile = false // 印刷文件生成

  UseTimes = 0 // 引用次数

  Index = ''

  displayContent = ''

  constructor(data) {
    restoreInitDataByOrigin(this, data);
    if (data && data.Index && data.Index > 5000) {
      this.Index = '';
    }
  }

  getSubmitData() {
    const temp = { ...this };
    if (!this.IsPDF) {
      temp.IsMakeup = false;
      temp.IsGenerateThumb = false;
      temp.IsFromPrintFile = false;
      temp.Index = 9999;
    }
    return temp;
  }
}
