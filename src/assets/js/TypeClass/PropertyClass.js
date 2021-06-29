/* eslint-disable max-len */
import api from '@/api/index';
import { getValueIsOrNotNumber, getNumberValueList, getNameFromListByIDs } from '@/assets/js/utils/util';

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

// 下面3个方法主要用于已选择的物料类型在页面上的展示，会对其进行分类提交处理 使用地方：1条件关系选择为物料时 2 工厂列表物料显示文字处理 等
export const getTempMaterialListObj = (OptionList) => {
  if (!OptionList || !Array.isArray(OptionList) || OptionList.length === 0) return null;
  const _list = OptionList
    .map(it => ({ ...it, list: it.Second.split(' ') }))
    .map(it => ({ ...it, first: it.list[0], second: it.list.length > 1 ? it.list[1] : '', third: it.list.length > 2 ? it.list.slice(2).join(' ') : '' }));
  const _obj = {};
  _list.forEach(it => {
    const { first, second, third, First, Second } = it;
    if (!_obj[first]) _obj[first] = {};
    if (!_obj[first][second]) _obj[first][second] = [];
    _obj[first][second].push({ third, Data: { First, Second } });
  });
  return _obj;
};

export const getTempMaterialOptionList = (localMaterialListObj) => {
  if (!localMaterialListObj) return [];
  const list = [];
  Object.keys(localMaterialListObj).forEach(fKey => {
    const second = localMaterialListObj[fKey];
    const _temp1 = {};
    _temp1.Name = fKey;
    _temp1.List = [];
    Object.keys(second).forEach(sKey => {
      const thirdList = second[sKey];
      const _temp2 = {};
      _temp2.Name = sKey;
      _temp2.List = [];
      if (thirdList.length === 1 && !thirdList[0].third) {
        const { Data } = thirdList[0];
        _temp2.Data = Data;
      } else {
        thirdList.forEach(it => {
          const { third, Data } = it;
          const _temp3 = {};
          _temp3.Name = third;
          _temp3.Data = Data;
          _temp2.List.push(_temp3);
        });
      }
      _temp1.List.push(_temp2);
    });
    list.push(_temp1);
  });
  return list;
};

export const getTempMaterialSelectedListShowText = (checkList, localMaterialOptionList) => {
  if (!Array.isArray(checkList) || checkList.length === 0 || localMaterialOptionList.length === 0) return '';
  const _list = localMaterialOptionList.map(lv1 => { // 找出并附加已选的物料信息
    const List = lv1.List.map(lv2 => {
      const lv3List = lv2.Data ? [{ Name: lv2.Name, Data: lv2.Data }] : lv2.List;
      const SelectedList = lv3List.filter(it => checkList.includes(it.Data.First));
      const isCheckedAll = lv3List.length === SelectedList.length;
      return { ...lv2, SelectedList, isCheckedAll };
    }).filter(it => it.SelectedList.length > 0);
    let isCheckedAll = false;
    if (lv1.List.length === List.length) {
      const t = List.find(it => !it.isCheckedAll);
      isCheckedAll = !t;
    }
    return { ...lv1, List, isCheckedAll };
  }).filter(it => it.List.length > 0);

  const _text = _list.map(lv1 => { // 从提取出的选择信息中转换出要显示的文字
    const { Name, List } = lv1;
    const text = lv1.isCheckedAll ? '全部' : List.map(lv2 => {
      const { SelectedList, isCheckedAll, Data } = lv2;
      let lv2Str = lv2.Name;
      if (isCheckedAll && !Data) lv2Str = `${lv2Str}（全部）`;
      else if (!Data) {
        const names = SelectedList.map(_it => _it.Name).join('、');
        lv2Str = `${lv2Str}（${names}）`;
      }
      return lv2Str;
    }).join('、');
    return `${Name}（${text}）`;
  }).join('、');
  return _text;
};

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
    if (!Element || Object.prototype.toString.call(Element) !== '[object Object]') return property;
    if (FixedType || FixedType === 0) {
      return property;
    }
    const { Type, DefaultValue, NumbericAttribute, OptionAttribute, SwitchAttribute, HiddenToCustomer } = Element;
    let TipsContent = '';
    const AvailableValueList = []; // 子项可为数值 也可为对象信息(此时为限制范围)
    if ((DefaultValue || DefaultValue === 0) && HiddenToCustomer) {
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
          } else {
            AvailableValueList.push({ AllowDecimal, MinValue: -1, MaxValue: -1 });
            TipsContent += '不限制分段范围控制';
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

  static async getPropertyList(data) { // 获取弹窗属性列表并对其进行数据转换：附加校验和提示信息
    const resp = await api.getFormulaPropertyList(data).catch(() => {});
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

  static AvailableValueListChecker(val, AvailableValueList) {
    if (AvailableValueList && Array.isArray(AvailableValueList)) {
      for (let i = 0; i < AvailableValueList.length; i += 1) {
        const AvailableValue = AvailableValueList[i]; // 有效数值

        if (typeof AvailableValue === 'number' && +val === AvailableValue) return true;

        if (typeof AvailableValue === 'object') {
          const { MinValue, MaxValue, IsGeneralValue, Increment, InputContent, AllowDecimal } = AvailableValue;
          if (MinValue === -1 && MaxValue === -1 && !IsGeneralValue && !Increment && !InputContent) {
            return getValueIsOrNotNumber(val, !(AllowDecimal === false));
          }
          const valueList = getNumberValueList(InputContent);
          if (valueList.includes(`${val}`)) return true;
          if (val > MinValue && (val <= MaxValue || MaxValue === -1)) { // 符合范围区间 进入判断
            if (!IsGeneralValue && (val - MinValue) % Increment === 0) return true;
          }
        }
      }
      return false;
    }
    return true;
  }

  static getPerfectPropertyByImperfectProperty(imperfectProp, PropertyList) {
    if (!imperfectProp || !PropertyList || !Array.isArray(PropertyList) || PropertyList.length === 0) return null;
    const t = PropertyList.find(it => {
      const { Product, Part, Craft, Material, Group, Element, FixedType, Type } = it;
      if (!((!Product && Product === imperfectProp.Product) || (Product && imperfectProp.Product && Product.ID === imperfectProp.Product.ID))) return false;
      if (!((!Part && Part === imperfectProp.Part) || (Part && imperfectProp.Part && Part.ID === imperfectProp.Part.ID))) return false;
      if (!((!Craft && Craft === imperfectProp.Craft) || (Craft && imperfectProp.Craft && Craft.ID === imperfectProp.Craft.ID))) return false;
      if (!((!Material && Material === imperfectProp.Material) || (Material && imperfectProp.Material && Material.ID === imperfectProp.Material.ID))) return false;
      if (!((!Group && Group === imperfectProp.Group) || (Group && imperfectProp.Group && Group.ID === imperfectProp.Group.ID))) return false;
      if (!((!Element && Element === imperfectProp.Element) || (Element && imperfectProp.Element && Element.ID === imperfectProp.Element.ID))) return false;
      if (FixedType !== imperfectProp.FixedType) return false;
      if (Type !== imperfectProp.Type) return false;
      return true;
    });
    return t || null;
  }

  static getMaterialListShowText(checkList, OptionList) {
    const tempMaterialObj = getTempMaterialListObj(OptionList);
    const tempMaterialOptionList = getTempMaterialOptionList(tempMaterialObj);
    const text = getTempMaterialSelectedListShowText(checkList, tempMaterialOptionList);
    return text;
  }

  static getPropertyConditionText(list) { // getNameFromListByIDs
    if (!list || !Array.isArray(list) || list.length === 0) return '';
    const _list = list.map(it => {
      const { Property, Operator, ValueList } = it;
      let _operator = getNameFromListByIDs(Operator, AllOperatorList); // 获取到关系类型名称
      // const PerfectProperty = this.getPerfectPropertyByImperfectProperty(Property, PropertyList); // 获取到完整属性
      // if (!PerfectProperty) return '';
      const { DisplayContent, OptionList, ValueType } = Property;
      if (ValueType === 1 || ValueType === 6) _operator += '下面任一选项时：';
      if (ValueType === 5) _operator += '时';
      const _name = DisplayContent.replace(/\[|\]/g, '');
      let _val = '';
      if (ValueList) {
        if (ValueList.length === 1) {
          if ((ValueList[0].Value || ValueList[0].Value === 0) && getValueIsOrNotNumber(ValueList[0].Value)) {
            _val = ValueList[0].Value;
          }
          if (!ValueList[0].Value && ValueList[0].Property && ValueList[0].Property.DisplayContent) {
            _val = ValueList[0].Property.DisplayContent.replace(/\[|\]/, '');
          }
        } else if (OptionList) {
          _val = ValueList.map(_it => OptionList.find(option => option.First === _it.Value)).filter(_it => _it).map(_it => _it.Second).join(' ');
          if (ValueType === 6) { // 为物料类型 对物料类型数据进行组合
            const checkList = ValueList.map(_it => _it.Value);
            _val = this.getMaterialListShowText(checkList, OptionList);
          }
        }
      }

      return {
        name: _name,
        operator: _operator,
        val: _val,
      };
    }).filter(it => it);

    return _list;
  }

  static getPropIDsObj(data) {
    if (!data) return {};
    const temp = {};
    Object.keys(data).forEach(key => {
      if (['Product', 'Part', 'Group', 'Craft', 'Price'].includes(key)) {
        if (data[key] && data[key].ID) temp[`${key}ID`] = data[key].ID;
      } else if (['ProductID', 'PartID', 'GroupID', 'CraftID', 'PriceID'].includes(key)) {
        if (data[key] || data[key] === 0) temp[key] = data[key];
      }
    });
    return temp;
  }
}
