import { MyMessage } from '@/basic/message';
import { FileHandleModeEnums, FileHandleModeEnumList, ContentReviewModeEnumList, ContentReviewModeEnums } from '../../reviewEnums';

const getDisplayContent = item => {
  const { DealType, IsCheckContent, Bleed } = item;
  const t1 = FileHandleModeEnumList.find(it => it.ID === DealType);
  const t2 = ContentReviewModeEnumList.find(it => it.ID === IsCheckContent);

  let DealTypeText = t1 ? t1.Name : '';
  const IsCheckContentText = t2 ? t2.Name : '';

  const BleedText = DealTypeText && DealType === FileHandleModeEnums.auto.ID && typeof Bleed === 'number' ? `（审稿出血：${Bleed}mm）` : '';
  if (BleedText) DealTypeText += BleedText;

  return [DealTypeText, IsCheckContentText].filter(it => it).join('、');
};

export default class ReviewFlowPanelClass {
  DealType = FileHandleModeEnums.manual.ID

  IsCheckContent = ContentReviewModeEnums.review.ID

  Bleed = ''

  constructor(data) {
    if (data) {
      if (data.DealType || data.DealType === 0) {
        this.DealType = data.DealType;
      }
      if (typeof data.IsCheckContent === 'boolean') {
        this.IsCheckContent = data.IsCheckContent;
      }
      if (this.DealType === FileHandleModeEnums.auto.ID && (data.Bleed || data.Bleed === 0)) {
        this.Bleed = data.Bleed;
      }
    }
  }

  getDisplayContent() {
    return getDisplayContent(this);
  }

  getInfo() {
    if (this.DealType === FileHandleModeEnums.auto.ID) {
      // 1. 校验Bleed  [0-10] 允许1位小数  单位：mm  ---- 校验不通过则提示然后抛出错误？
      if (this.Bleed === '') {
        MyMessage.error({ title: '验证失败', msg: '请设置审稿出血' });
        throw new Error('审稿出血验证不通过');
      }

      if (!/^\d+(\.\d{1})?$/.test(String(this.Bleed))) {
        MyMessage.error({ title: '验证失败', msg: '审稿出血应为不小于0的数字类型，最多1位小数' });
        throw new Error('审稿出血验证不通过');
      }

      if (Number(this.Bleed) > 10) {
        MyMessage.error({ title: '验证失败', msg: '审稿出血最大不能超过10mm' });
        throw new Error('审稿出血验证不通过');
      }

      // 2. 转换Bleed为数字格式
      this.Bleed = Number(this.Bleed);
    }

    return { DealFileProcess: this };
  }

  static getTableItemDisplayContent(item) {
    if (item && item.DealFileProcess) {
      return getDisplayContent(item.DealFileProcess);
    }
    return '';
  }
}
