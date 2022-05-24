import { getValueIsOrNotNumber, getNumberValueList } from '../utils/util';

export const checkNumberSectionList = (value, SectionList, valueList) => {
  let isInSection = false;
  const msgArr = [];
  const getMaxTimes = numArr => {
    if (!Array.isArray(numArr) || numArr.length === 0) return 1;
    const getPointDigits = num => {
      const _numText = typeof num === 'number' ? num.toString() : num;
      let T = _numText.indexOf('.');
      T = T === -1 ? 0 : _numText.length - T - 1;
      return T;
    };
    const _nums = numArr.map(getPointDigits);
    let len = Math.max(..._nums);
    const arr = new Array(len);
    arr.fill('0');
    len = `1${arr.join('')}`;
    return +len;
  };
  for (let i = 0; i < SectionList.length; i += 1) {
    const section = SectionList[i];
    const { MinValue, MaxValue, IsGeneralValue, Increment } = section;
    if (+value >= MinValue && (+value <= MaxValue || +MaxValue === -1)) { // 符合范围区间 进入判断
      isInSection = true;
      let msg = '';
      if (!IsGeneralValue) {
        const times = getMaxTimes([value, MinValue, Increment]);
        if (Math.round(+value * times - MinValue * times) % Math.round((Increment * times)) !== 0) {
          msg = `[${MinValue}, ${MaxValue}]区间内应符合增量为${Increment}`;
        }
      }
      if (IsGeneralValue && valueList) {
        msg = `[${MinValue}, ${MaxValue}]区间内应从${valueList}对应区间中取值`;
      }
      msgArr.push(msg);
    }
  }
  if (!isInSection) {
    const msg = '输入值不正确，不在分段控制范围内';
    return msg;
  }
  const t = msgArr.find(it => it === '');
  if (t === undefined) {
    return `输入值不正确，${msgArr.join(' 或')}`;
  }
  return '';
};

/**
 * @description: 检查元素值是否符合规范
 * @param {*} value 值
 * @param {*} element 所赋值的元素
 * @return {*}
 */
export const elementValChecker = (value, element) => {
  if (!value && value !== 0) return { msg: '值未设置', result: false };
  const { Type, NumbericAttribute, OptionAttribute, HiddenToCustomer } = element; // 开关类型暂未判断 或可不需要
  if (Type === 1) { // 数值类型元素
    const { AllowDecimal, SectionList, InputContent, Allow, AllowCustomer } = NumbericAttribute;
    const isConformNumberType = getValueIsOrNotNumber(value, !AllowDecimal);
    if (!isConformNumberType) {
      const msg = `输入值错误，请输入正确的数字类型（${AllowDecimal ? '允许小数' : '不允许小数'}）`;
      return { msg, result: false };
    }
    if (SectionList && Array.isArray(SectionList) && SectionList.length > 0) {
      const valueList = getNumberValueList(InputContent);
      if (valueList.includes(`${value}`)) {
        return { msg: '', result: true };
      }
      if (!Allow && !valueList.includes(`${value}`)) {
        return { msg: `值不正确，不允许自定义，请从${valueList}中取值`, result: false };
      }
      if (!AllowCustomer && !HiddenToCustomer && !valueList.includes(`${value}`)) {
        return { msg: `值不正确，不允许自定义，请从${valueList}中取值`, result: false };
      }
      const msg = checkNumberSectionList(value, SectionList, valueList);
      if (msg) return { msg, result: false };
    }
    return { msg: '', result: true };
  }
  if (Type === 2) { // 选项元素
    const { Allow, OptionList } = OptionAttribute;
    const optionIDs = OptionList.map(it => it.ID);
    if (!Allow && !optionIDs.includes(value)) {
      return { msg: '该选项元素不允许自定义', result: false };
    }
    return { msg: '', result: true };
  }
  return { msg: '', result: true };
};

export default {
  elementValChecker,
};
