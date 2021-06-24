import api from '@/api/index';

export const ElementSelectTypeEnum = [
  { label: '元素', ID: 0, nickName: '类型元素' },
  { label: '物料尺寸', ID: 1, nickName: '尺寸' },
  { label: '产品元素组', ID: 2, nickName: '元素组' },
  { label: '产品元素', ID: 3, nickName: '元素' },
  { label: ' 产品工艺', ID: 4, nickName: '工艺' },
  { label: ' 产品物料', ID: 5, nickName: '物料' },
  { label: ' 产品尺寸组', ID: 6, nickName: '尺寸组' },
  { label: ' 公式', ID: 7, nickName: '公式' },
  { label: ' 子公式', ID: 8, nickName: '子公式' },
  { label: ' 子条件', ID: 9, nickName: '子条件' },
  { label: ' 其他', ID: 254, nickName: '其他' },
  { label: ' 常量', ID: 255, nickName: '常量' },
];

export const PropertyFixedType = [
  { ID: 0, Name: '已选项数' },
  { ID: 1, Name: '和' },
  { ID: 2, Name: '最小值' },
  { ID: 3, Name: '最大值' },
  { ID: 4, Name: '使用次数' },
  { ID: 5, Name: '最短边' },
  { ID: 6, Name: '最长边' },
  { ID: 7, Name: '常规尺寸' },
  { ID: 8, Name: '物料尺寸长' },
  { ID: 9, Name: '物料尺寸宽' },
];

export const AllOperatorList = [ // 运算符号列表
  { ID: 1, Name: '等于' },
  { ID: 2, Name: '不等于' },
  { ID: 3, Name: '大于' },
  { ID: 4, Name: '大于等于' },
  { ID: 5, Name: '小于' },
  { ID: 6, Name: '小于等于' },
  { ID: 7, Name: '包含' },
  { ID: 8, Name: '不包含' },
  { ID: 9, Name: '选中' },
  { ID: 10, Name: '不选中' },
  { ID: 11, Name: '≥值≤' },
  { ID: 12, Name: '＞值≤' },
  { ID: 13, Name: '≥值＜' },
  { ID: 14, Name: '＞值＜' },
  { ID: 101, Name: '关联' },
  { ID: 102, Name: '排斥' },
];

export const ValueCompareType = [
  { ID: 0, Name: '值' },
  { ID: 1, Name: '单选' },
  { ID: 2, Name: '多选' },
  { ID: 3, Name: '多次使用选择项' },
  { ID: 4, Name: '开关' },
  { ID: 5, Name: '工艺' },
  { ID: 6, Name: '物料' },
];

/**
 * @description: 主要用于公式及条件组件弹窗属性选择数据获取及其相关格式转换等
 * @param {*}
 * @return {*}
 */
export default class PropertyClass {
  static transform(property) { // 向属性数据中保持原来的数据不变时添加2个新的属性：TipsContent提示内容 和 AvailableValueList校验列表
    const bool1 = !property || Object.prototype.toString.call(property) !== '[object Object]';
    if (bool1) return null;
    const { Element, FixedType } = property;
    if (!Element || Object.prototype.toString.call(Element) !== '[object Object]' || FixedType || FixedType === 0) return property;
    const { Type, DefaultValue, NumbericAttribute, OptionAttribute, SwitchAttribute } = Element;
    let TipsContent = '';
    const AvailableValueList = []; // 子项可为数值 也可为对象信息(此时为限制范围)
    if (DefaultValue || DefaultValue === 0) {
      AvailableValueList.push(DefaultValue);
      TipsContent += `隐藏运算值：${DefaultValue}；`;
    }
    switch (Type) {
      case 1: // 1 数字值 DefaultValue NumbericAttribute
        if (NumbericAttribute && Object.prototype.toString.call(NumbericAttribute) === '[object Object]') {
          const { SectionList, InputContent, AllowDecimal } = NumbericAttribute;
          if (SectionList && Array.isArray(SectionList) && SectionList.length > 0) {
            const _list = SectionList.map(it => {
              const { MinValue, MaxValue, IsGeneralValue, Increment } = it;
              const str = IsGeneralValue ? `需从${InputContent}中取符合该范围取值` : `增量应为${Increment}`;
              TipsContent += `范围在(${MinValue},${MaxValue}]时，${str}；`;
              return { ...it, InputContent, AllowDecimal };
            });
            AvailableValueList.push(..._list);
          }
        }
        break;
      case 2: // 选项值 DefaultValue OptionAttribute
        if (OptionAttribute && OptionAttribute.OptionList && Array.isArray(OptionAttribute.OptionList)) {
          OptionAttribute.OptionList.forEach((option, i) => {
            if (option.Value || option.Value === 0) {
              AvailableValueList.push(option.Value);
              TipsContent += `${i + 1}、 ${option.Name}（值：${option.Value}）；`;
            }
          });
        }
        break;
      case 3: // 开关 DefaultValue SwitchAttribute
        if (SwitchAttribute && Object.prototype.toString.call(SwitchAttribute) === '[object Object]') {
          const { CloseValue, OpenValue } = SwitchAttribute;
          if (OpenValue || OpenValue === 0) {
            AvailableValueList.push(OpenValue);
            TipsContent += `开值：${OpenValue}；`;
          }
          if (CloseValue || CloseValue === 0) {
            AvailableValueList.push(CloseValue);
            TipsContent += `关值：${CloseValue}`;
          }
        }
        break;
      default:
        break;
    }
    return { ...property, TipsContent, AvailableValueList };
  }

  static async getPropertyList(PositionID, moduleIndex) { // 获取弹窗属性列表并对其进行数据转换：附加校验和提示信息
    const resp = await api.getFormulaPropertyList(PositionID, moduleIndex).catch(() => {});
    if (resp && resp.status === 200 && resp.data.Status === 1000) {
      const t = resp.data.Data.find(it => it.OperatorList && it.OperatorList.length > 10);
      console.log(t);
      if (t) {
        // eslint-disable-next-line no-alert
        alert('关系数量超出');
      }
      return resp.data.Data.map(it => this.transform(it)).filter(it => it);
    }
    return undefined;
  }

  static getProperyName(item) {
    const { FixedType, Element, Name, Type } = item;
    if (FixedType || FixedType === 0) {
      const t = PropertyFixedType.find(it => it.ID === FixedType);
      if (t) return t.Name;
      return '';
    }
    if (Element && Element.Name) return Element.Name;
    if (!Element) {
      if (Name) return Name;
      if (Type || Type === 0) {
        const _t = ElementSelectTypeEnum.find(it => it.ID === Type);
        return _t ? _t.nickName : '';
      }
    }
    return '';
  }
}
