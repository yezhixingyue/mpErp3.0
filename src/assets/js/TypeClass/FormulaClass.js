import messageBox from '@/assets/js/utils/message';
import { getValueIsOrNotNumber, getNumberValueList } from '@/assets/js/utils/util';

export const FormulaUseModuleEnum = [
  { type: 'ProductProperty', label: '产品' },
  { type: 'MaterialProperty', label: '物料' },
];

export const ElementSelectTypeEnum = [
  { label: '元素', ID: 0, nickName: '类型元素' },
  { label: '物料尺寸', ID: 1, nickName: '尺寸' },
];

export default class FormulaClass {
  ID = '';

  Name = '';

  Content = '';

  PositionID = '';

  UseModule = '';

  UseTimes = '';

  Unit = '';

  Remark = '';

  PropertyList = [];

  constructor(initData) { // 初始化
    if (!initData || Object.prototype.toString.call(initData) !== '[object Object]') return;
    const { ID, Name, Content, PositionID, UseModule, UseTimes, Unit, PropertyList, Remark } = JSON.parse(JSON.stringify(initData));
    if (ID) this.ID = ID;
    if (Name) this.Name = Name;
    if (Content) this.Content = Content;
    if (PositionID) this.PositionID = PositionID;
    if (UseModule || UseModule === 0) this.UseModule = UseModule;
    if (UseTimes) this.UseTimes = UseTimes;
    if (Unit) this.Unit = Unit;
    if (Remark) this.Remark = Remark;
    if (PropertyList && Array.isArray(PropertyList) && PropertyList.length > 0) this.PropertyList = PropertyList;
  }

  static checkSubmit(obj) { // 校验是否符合提交条件
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
      messageBox.failSingleError('操作失败', '获取提交信息出错');
      return false;
    }
    const { Name, PropertyList, Content, Remark } = obj;
    if (!Name) {
      messageBox.failSingleError('操作失败', '请输入公式名称');
      return false;
    }
    // if (!PropertyList || PropertyList.length === 0) {
    //   messageBox.failSingleError('操作失败', '请添加元素并填写公式内容');
    //   return false;
    // }
    if (PropertyList && PropertyList.length > 0) {
      let t = PropertyList.find(it => !it.DefaultValue && it.DefaultValue !== 0);
      if (t) {
        messageBox.failSingleError('操作失败', `${t.Element.Name}未设置空值`);
        return false;
      }
      t = PropertyList.find(it => {
        const { Type, NumbericAttribute } = it.Element;
        const isInteger = !(Type === 1 && NumbericAttribute && NumbericAttribute.AllowDecimal);
        return !getValueIsOrNotNumber(it.DefaultValue, isInteger);
      });
      if (t) {
        messageBox.failSingleError('操作失败', `${t.Element.Name}空值设置值不合法(检查是否为数字或是否允许小数)`);
        return false;
      }
      t = PropertyList.find(it => {
        const { DefaultValue, AvailableValueList } = it;

        if (AvailableValueList.length === 0) return false;

        for (let i = 0; i < AvailableValueList.length; i += 1) {
          const AvailableValue = AvailableValueList[i]; // 有效数值

          if (typeof AvailableValue === 'number' && DefaultValue === AvailableValue) return false;

          if (typeof AvailableValue === 'object') {
            const { MinValue, MaxValue, IsGeneralValue, Increment, InputContent } = AvailableValue;
            const valueList = getNumberValueList(InputContent);
            if (valueList.includes(`${DefaultValue}`)) return false;
            if (DefaultValue > MinValue && (DefaultValue <= MaxValue || MaxValue === -1)) { // 符合范围区间 进入判断
              if (!IsGeneralValue && (DefaultValue - MinValue) % Increment === 0) return false;
            }
          }
        }
        return true;
      });
      if (t) {
        messageBox.failSingleError('操作失败', `${t.Element.Name}空值设置值不合法，请检查其取值范围`);
        return false;
      }
    }

    if (!Content) {
      messageBox.failSingleError('操作失败', '请填写公式内容');
      return false;
    }
    if (!Remark) {
      messageBox.failSingleError('操作失败', '请输入公式说明');
      return false;
    }
    return true;
  }

  static checkCalculate(obj) { // 校验测试运算
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
      messageBox.failSingleError('计算失败', '获取提交信息出错');
      return false;
    }
    const { PropertyList, Content } = obj;
    // if (!PropertyList || PropertyList.length === 0) {
    //   messageBox.failSingleError('计算失败', '请添加元素并填写公式内容');
    //   return false;
    // }
    if (!Content) {
      messageBox.failSingleError('计算失败', '请填写公式内容');
      return false;
    }
    if (PropertyList && PropertyList.length > 0) {
      let t = PropertyList.find(it => !it.CalculateValue && it.CalculateValue !== 0 && Content.includes(it.DisplayContent));
      if (t) {
        messageBox.failSingleError('计算失败', `${t.Element.Name}未设置测试计算数值`);
        return false;
      }
      t = PropertyList.find(it => Content.includes(it.DisplayContent) && !getValueIsOrNotNumber(it.CalculateValue));
      if (t) {
        messageBox.failSingleError('计算失败', `${t.Element.Name}计算值不合法(检查是否为数字或是否允许小数)`);
        return false;
      }
    }

    return true;
  }
}
