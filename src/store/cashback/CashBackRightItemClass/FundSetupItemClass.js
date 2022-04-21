import { ReturnTypeEnums } from './index';
import messageBox from '../../../assets/js/utils/message';

export default class {
  Range = {
    MinValue: '',
    MaxValue: '',
  }

  Type = ReturnTypeEnums.fixed.ID

  Increment = ''

  _ReturnPercent = ''

  ReturnValue = ''

  StartFromZero = false

  key = Math.random().toString(16).slice(-10)

  // 需要转换_ReturnPercent和ReturnValue  提交时需要删除一些内容
  constructor(data) {
    if (data && typeof data === 'object') {
      const { Range, Type, Increment, ReturnValue, StartFromZero } = data;
      const { MinValue, MaxValue } = Range;
      this.Range.MinValue = MinValue;
      this.Range.MaxValue = MaxValue;
      this.Type = Type;
      if (Type === ReturnTypeEnums.fixed.ID) {
        this._ReturnPercent = ReturnValue;
      } else if (Type === ReturnTypeEnums.increase.ID) {
        this.Increment = Increment;
        this.ReturnValue = ReturnValue;
        this.StartFromZero = StartFromZero;
      }
    }
  }

  check() {
    const reg = /(^\d*[1-9]\d*(\.\d{1,2})?$)|0\.(\d?[1-9]|[1-9]\d?)$/;
    const checkNum = (num, title, allowInfinity) => {
      if (!num && num !== 0) {
        messageBox.failSingleError('保存失败', `${title}未设置`);
        return false;
      }
      if (!reg.test(num) && +num !== 0) {
        if (allowInfinity && +num === -1) {
          return true;
        }
        messageBox.failSingleError('保存失败', `${title}设置不正确`);
        return false;
      }
      return true;
    };
    if (!checkNum(this.Range.MinValue, '消费金额最小值')) return false;
    if (!checkNum(this.Range.MaxValue, '消费金额最大值', true)) return false;
    if (this.Range.MinValue > +this.Range.MaxValue && +this.Range.MaxValue !== -1) {
      messageBox.failSingleError('保存失败', '消费金额中最小值不能大于最大值');
      return false;
    }
    if (this.Type === ReturnTypeEnums.fixed.ID) { // 按照固定比例
      if (!checkNum(this._ReturnPercent, '返现比例')) return false;
      if (this._ReturnPercent > 100) {
        messageBox.failSingleError('保存失败', '返现比例不能超过100%');
        return false;
      }
    } else if (this.Type === ReturnTypeEnums.increase.ID) { // 按递增方式
      if (!checkNum(this.Increment, '递增金额')) return false;
      if (!checkNum(this.ReturnValue, '递增返回金额')) return false;
      const min = this.StartFromZero ? 0 : this.Range.MinValue;
      if (+this.Range.MaxValue !== -1 && (this.Range.MaxValue - min) < +this.Increment) {
        messageBox.failSingleError('保存失败', '递增金额超出了最大范围区间');
        return false;
      }
      if (this.ReturnValue > +this.Increment) {
        messageBox.failSingleError('保存失败', '递增金额不能小于递增返回金额');
        return false;
      }
    }

    return true;
  }

  transform() {
    const temp = { ...this };
    if (temp.Type === ReturnTypeEnums.fixed.ID) {
      temp.ReturnValue = temp._ReturnPercent;
      delete temp.Increment;
      delete temp.StartFromZero;
    }
    delete temp._ReturnPercent;
    return temp;
  }
}
