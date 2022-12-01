import { FileHandleModeEnums, FileHandleModeEnumList, ContentReviewModeEnumList, ContentReviewModeEnums } from '../../reviewEnums';
import restoreInitDataByOrigin from '../../../../assets/js/utils/reduction';

const getDisplayContent = item => {
  const { DealType, IsCheckContent } = item;
  const t1 = FileHandleModeEnumList.find(it => it.ID === DealType);
  const t2 = ContentReviewModeEnumList.find(it => it.ID === IsCheckContent);
  const DealTypeText = t1 ? t1.Name : '';
  const IsCheckContentText = t2 ? t2.Name : '';
  return [DealTypeText, IsCheckContentText].filter(it => it).join('、');
};

export default class ReviewFlowPanelClass {
  DealType = FileHandleModeEnums.manual.ID

  IsCheckContent = ContentReviewModeEnums.review.ID

  constructor(data) {
    restoreInitDataByOrigin(this, data);
  }

  getDisplayContent() {
    return getDisplayContent(this);
  }

  getInfo() {
    return { DealFileProcess: this };
  }

  static getTableItemDisplayContent(item) {
    if (item && item.DealFileProcess) {
      return getDisplayContent(item.DealFileProcess);
    }
    return '';
  }
}
