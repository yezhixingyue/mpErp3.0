import restoreInitDataByOrigin from '../../../../../assets/js/utils/reduction';
import messageBox from '../../../../../assets/js/utils/message';

export default class SizeNumberItemClass {
  ID = '' // number

  /** 是否无文件 - 不需要输出文件 */
  Fileless = false

  FileList = []

  LengthFormula = null

  LengthErrorRange = {
    MinValue: '',
    MaxValue: '',
  }

  WidthFormula = null

  WidthErrorRange = {
    MinValue: '',
    MaxValue: '',
  }

  /** 是否允许宽高互换 */
  AllowSizeExchange = false

  BleedTop = ''

  BleedBottom = ''

  BleedLeft = ''

  BleedRight = ''

  NumberFormula = null

  key = Math.random().toString(16).slice(-10)

  constructor(data) {
    if (data?.Fileless) { // 无文件
      this.ID = data.ID || '';
      this.key = data.key || this.key;
      this.Fileless = data.Fileless;
      if (data.NumberFormula) this.NumberFormula = { ...data.NumberFormula };
      return;
    }

    // 有文件
    restoreInitDataByOrigin(this, data);
    if (data) {
      const { LengthFormula, WidthFormula, NumberFormula } = data;
      if (LengthFormula) this.LengthFormula = { ...LengthFormula };
      if (WidthFormula) this.WidthFormula = { ...WidthFormula };
      if (NumberFormula) this.NumberFormula = { ...NumberFormula };
    }
  }

  checker() {
    if (this.Fileless) {
      if (!this.NumberFormula) {
        messageBox.failSingleError('保存失败', '[ 数量 ] 公式未设置');
        return false;
      }
      return true;
    }
    if (!this.FileList || this.FileList.length === 0) {
      messageBox.failSingleError('保存失败', '未选择输出文件');
      return false;
    }

    if (!this.LengthFormula) {
      messageBox.failSingleError('保存失败', '[ 宽 ] 公式未设置');
      return false;
    }

    const reg = /^[0-9]+(.[0-9]{1})?$/;

    if (!reg.test(+this.LengthErrorRange.MinValue) || !reg.test(+this.LengthErrorRange.MaxValue)) {
      messageBox.failSingleError('保存失败', '[ 宽 ] 误差数值不正确 (数值类型，不能为空，不能小于0且最多一位小数)');
      return false;
    }

    if (!this.WidthFormula) {
      messageBox.failSingleError('保存失败', '[ 高 ] 公式未设置');
      return false;
    }

    if (!reg.test(+this.WidthErrorRange.MinValue) || !reg.test(+this.WidthErrorRange.MaxValue)) {
      messageBox.failSingleError('保存失败', '[ 高 ] 误差数值不正确 (数值类型，不能为空，不能小于0且最多一位小数)');
      return false;
    }

    if (this.BleedTop === ''
      || this.BleedLeft === ''
      || this.BleedBottom === ''
      || this.BleedRight === '') {
      messageBox.failSingleError('保存失败', '出血数值不能为空');
      return false;
    }

    if (!reg.test(+this.BleedTop)
      || !reg.test(+this.BleedLeft)
      || !reg.test(+this.BleedBottom)
      || !reg.test(+this.BleedRight)) {
      messageBox.failSingleError('保存失败', '出血数值不正确，应为数值类型，不能小于0且最多一位小数');
      return false;
    }

    if (+this.BleedTop > 1000
      || +this.BleedLeft > 1000
      || +this.BleedBottom > 1000
      || +this.BleedRight > 1000) {
      messageBox.failSingleError('保存失败', '出血数值不能大于1000');
      return false;
    }

    // if (!this.NumberFormula) {
    //   messageBox.failSingleError('保存失败', '[ 数量 ] 公式未设置');
    //   return false;
    // }

    this.LengthErrorRange.MinValue = +this.LengthErrorRange.MinValue;
    this.LengthErrorRange.MaxValue = +this.LengthErrorRange.MaxValue;
    this.WidthErrorRange.MinValue = +this.WidthErrorRange.MinValue;
    this.WidthErrorRange.MinValue = +this.WidthErrorRange.MinValue;
    this.BleedTop = +this.BleedTop;
    this.BleedBottom = +this.BleedBottom;
    this.BleedLeft = +this.BleedLeft;
    this.BleedRight = +this.BleedRight;

    return true;
  }
}
