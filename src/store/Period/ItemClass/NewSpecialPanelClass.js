import messageBox from '@/assets/js/utils/message';
import { getValueIsOrNotNumber } from '@/assets/js/utils/util';
import restoreInitDataByOrigin from '../../../assets/js/utils/reduction';
import getEnumList from '../../../assets/js/utils/getEnumList';


export const NewSpecialTypeEnumObj = {
  produce: { ID: 1, Name: '延长生产工时' },
  transport: { ID: 2, Name: '延长运输时长' },
  lastPay: { ID: 3, Name: '更改最晚付款时间' },
};

export const SpecialTimeTypeEnumObj = {
  fixedTime: { ID: 1, Name: '固定时长' },
  dateRange: { ID: 2, Name: '时间范围' },
};

export const NewSpecialTypeEnumList = getEnumList(NewSpecialTypeEnumObj);

export const SpecialTimeTypeEnumList = getEnumList(SpecialTimeTypeEnumObj);

export default class NewSpecialPanelClass {
  SpecialType = NewSpecialTypeEnumObj.produce.ID // number

  TimeType = SpecialTimeTypeEnumObj.fixedTime.ID // number

  StartTime = ''

  EndTime = ''

  TimeChange = {
    First: '', // number
    Second: '', // number
  }

  Tips = ''

  LatestPayChange = '' // number

  ProduceStartChange = '' // number

  IsUpdateOrder = false

  constructor(data) {
    restoreInitDataByOrigin(this, data);
    if (this.LatestPayChange === 0 && this.ProduceStartChange === 0) {
      this.LatestPayChange = '';
      this.ProduceStartChange = '';
    }
  }

  checkAndGetSubmitData() {
    const temp = {};
    temp.SpecialType = this.SpecialType;
    // 延长生产工时 或 延长运输时长
    if (this.SpecialType === NewSpecialTypeEnumObj.produce.ID || this.SpecialType === NewSpecialTypeEnumObj.transport.ID) {
      // 必填的值：Tips
      if (this.TimeType === SpecialTimeTypeEnumObj.fixedTime.ID) { // 选择固定时长 - TimeChange中First Second必填
        const { First, Second } = this.TimeChange;
        if ((!First && First !== 0) && (!Second && Second !== 0)) {
          messageBox.failSingleError('保存失败', '延长时间未设置');
          return false;
        }
        if ((First && !getValueIsOrNotNumber(First, true)) || (Second && !getValueIsOrNotNumber(Second, true))) {
          messageBox.failSingleError('保存失败', '延长时间设置不正确');
          return false;
        }
        if (!this.Tips && (First === 0 || First === '') && (Second === 0 || Second === '')) {
          messageBox.failSingleError('保存失败', '提示为空时，延长时间中天和小时不能同时为0');
          return false;
        }
        temp.TimeChange = this.TimeChange;
      } else if (this.TimeType === SpecialTimeTypeEnumObj.dateRange.ID) { // 时间范围
        if (!this.StartTime || !this.EndTime) {
          messageBox.failSingleError('保存失败', '时间范围未设置');
          return false;
        }
        temp.StartTime = this.StartTime;
        temp.EndTime = this.EndTime;
      }
      // if (!this.Tips) {
      //   messageBox.failSingleError('保存失败', '提示未设置');
      //   return false;
      // }
      temp.Tips = this.Tips;
      temp.TimeType = this.TimeType;
      temp.IsUpdateOrder = this.IsUpdateOrder;
    } else if (this.SpecialType === NewSpecialTypeEnumObj.lastPay.ID) {
      if (this.LatestPayChange === 0 && this.ProduceStartChange === 0) {
        messageBox.failSingleError('保存失败', '付款时间和生产开始时间偏移不能同时为0');
        return false;
      }
      if (!getValueIsOrNotNumber(this.LatestPayChange, true)) {
        messageBox.failSingleError('保存失败', '付款时间偏移设置不正确');
        return false;
      }
      if (!getValueIsOrNotNumber(this.ProduceStartChange, true)) {
        messageBox.failSingleError('保存失败', '生产开始时间偏移设置不正确');
        return false;
      }
      temp.LatestPayChange = this.LatestPayChange;
      temp.ProduceStartChange = this.ProduceStartChange;
    }
    return temp;
  }
}
