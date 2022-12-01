import messageBox from '@/assets/js/utils/message';
import { getValueIsOrNotNumber } from '@/assets/js/utils/util';
import { NotChineseWideCharReg } from '@/assets/js/utils/regexp';

export const FormulaUseModuleEnum = [
  { type: 'ProductProperty', label: '产品' },
  { type: 'MaterialProperty', label: '物料' },
];

export default class FormulaClass {
  ID = '';

  Name = '';

  Content = '';

  // PositionID = '';

  UseModule = '';

  UseTimes = '';

  Unit = '';

  Remark = '';

  PropertyList = [];

  constructor(initData) { // 初始化
    if (!initData || Object.prototype.toString.call(initData) !== '[object Object]') return;
    // eslint-disable-next-line max-len
    const { ID, Name, Content, PositionID, UseModule, UseTimes, Unit, PropertyList, Remark, MaterialTypeID, PartID, ProductID, PriceID, TableID, GroupID, ElementID, CraftID } = JSON.parse(JSON.stringify(initData));
    if (ID) this.ID = ID;
    if (Name) this.Name = Name;
    if (Content) this.Content = Content;
    if (PositionID) this.PositionID = PositionID;
    if (MaterialTypeID) this.MaterialTypeID = MaterialTypeID;
    if (PartID) this.PartID = PartID;
    if (ProductID) this.ProductID = ProductID;
    if (PriceID) this.PriceID = PriceID;
    if (TableID) this.TableID = TableID;
    if (GroupID) this.GroupID = GroupID;
    if (ElementID) this.ElementID = ElementID;
    if (CraftID) this.CraftID = CraftID;
    if (UseModule || UseModule === 0) this.UseModule = UseModule;
    if (UseTimes) this.UseTimes = UseTimes;
    if (Unit) this.Unit = Unit;
    if (Remark) this.Remark = Remark;
    if (PropertyList && Array.isArray(PropertyList) && PropertyList.length > 0) this.PropertyList = PropertyList;
  }

  static checkSubmit(obj, hiddenHeader) { // 校验是否符合提交条件
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') {
      messageBox.failSingleError('操作失败', '获取提交信息出错');
      return false;
    }
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { Name, PropertyList, Content } = obj;
    if (!Name && !hiddenHeader) {
      messageBox.failSingleError('操作失败', '请输入公式名称');
      return false;
    }
    // if (!PropertyList || PropertyList.length === 0) { // ---- 最开始注释
    //   messageBox.failSingleError('操作失败', '请添加元素并填写公式内容');
    //   return false;
    // }
    // if (PropertyList && PropertyList.length > 0) { // ---- 后面注释
    //   let t = PropertyList.find(it => !it.DefaultValue && it.DefaultValue !== 0 && it.Type !== 8 && it.Type !== 9);
    //   if (!(t && [8, 9].includes(t.FixedType))) {
    //     if (t) {
    //       messageBox.failSingleError('操作失败', `${t.Element ? t.Element.Name : t.DisplayContent}未设置空值`);
    //       return false;
    //     }
    //     t = PropertyList.find(it => {
    //       if (!it.Element) {
    //         return !getValueIsOrNotNumber(it.DefaultValue) && !(it.Type === 8 && !it.DefaultValue) && !(it.Type === 9 && !it.DefaultValue);
    //       }
    //       const { Type, NumbericAttribute } = it.Element;
    //       const isInteger = Type === 1 ? !(NumbericAttribute && NumbericAttribute.AllowDecimal) : false;
    //       return !getValueIsOrNotNumber(it.DefaultValue, isInteger);
    //     });
    //     if (t) {
    //       messageBox.failSingleError('操作失败', `${t.Element ? t.Element.Name : t.DisplayContent}空值设置值不正确(检查是否为数字或是否允许小数)`);
    //       return false;
    //     }
    //     for (let i = 0; i < PropertyList.length; i += 1) {
    //       const it = PropertyList[i];
    //       if (it.ValueRange) {
    //         const { MinValue, MaxValue } = it.ValueRange;
    //         if ((MinValue || MinValue === 0) && +it.DefaultValue < MinValue) {
    //           messageBox.failSingleError('操作失败', `${it.Element ? it.Element.Name : it.DisplayContent}空值设置值不能小于${MinValue}`);
    //           return false;
    //         }
    //         if ((MaxValue || MaxValue === 0) && +it.DefaultValue > MaxValue && MaxValue !== -1) {
    //           messageBox.failSingleError('操作失败', `${it.Element ? it.Element.Name : it.DisplayContent}空值设置值不能大于${MaxValue}`);
    //           return false;
    //         }
    //       }
    //     }

    //     t = PropertyList.find(({ DefaultValue, AvailableValueList }) => !PropertyClass.AvailableValueListChecker(DefaultValue, AvailableValueList));
    //     if (t) {
    //       messageBox.failSingleError('操作失败', `${t.Element ? t.Element.Name : t.DisplayContent}空值设置值不正确，请检查其取值范围`);
    //       return false;
    //     }
    //   }
    // }

    if (!Content) {
      messageBox.failSingleError('操作失败', '请填写公式内容');
      return false;
    }

    const matchRes = Content.match(NotChineseWideCharReg);
    if (matchRes) {
      messageBox.failSingleError('操作失败', `公式中[ ${matchRes} ]请转为半角字符`);
      return false;
    }
    // if (!Remark) {
    //   messageBox.failSingleError('操作失败', '请输入公式说明');
    //   return false;
    // }
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
    const matchRes = Content.match(NotChineseWideCharReg);
    if (matchRes) {
      messageBox.failSingleError('计算失败', `公式中[ ${matchRes} ]等字符为全角字符，请转换为半角`);
      return false;
    }
    if (PropertyList && PropertyList.length > 0) {
      let t = PropertyList.find(it => !it.CalculateValue && it.CalculateValue !== 0 && Content.includes(it.DisplayContent));
      if (t) {
        messageBox.failSingleError('计算失败', `${t.Element ? t.Element.Name : t.DisplayContent}未设置测试计算数值`);
        return false;
      }
      t = PropertyList.find(it => Content.includes(it.DisplayContent) && !getValueIsOrNotNumber(it.CalculateValue));
      if (t) {
        messageBox.failSingleError('计算失败', `${t.Element ? t.Element.Name : t.DisplayContent}计算值不正确(检查是否为数字或是否允许小数)`);
        return false;
      }
    }

    return true;
  }
}
