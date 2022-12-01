/* eslint-disable max-len */
import {
  getValueIsOrNotNumber, getNumberValueList, getNameFromListByIDs, getTreeTextDisplayContent,
} from '../util';

import {
  getTempMaterialListObj, getTempMaterialSelectedListShowText, getTempMaterialOptionList, ElementSelectTypeEnum, PropertyFixedType, AllOperatorList,
} from './propertyUtils';

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
    const {
      Type, DefaultValue, NumbericAttribute, OptionAttribute, SwitchAttribute, HiddenToCustomer,
    } = Element;
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
            const _list = SectionList.map((it) => {
              const {
                MinValue, MaxValue, IsGeneralValue, Increment,
              } = it;
              const str = IsGeneralValue ? `需从${InputContent}中取符合该范围取值` : `增量应为${Increment}`;
              TipsContent += `范围在[${MinValue},${MaxValue}]时，${str}；`;
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
              TipsContent += `选项${i + 1}：${option.Name}（值：${option.Value}）`;
              if (i < OptionAttribute.OptionList.length - 1) TipsContent += '、';
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

  static async getPropertyList(data, fetchFunc) { // 获取弹窗属性列表并对其进行数据转换：附加校验和提示信息
    const resp = await fetchFunc(data).catch(() => null);
    if (resp && resp.status === 200 && resp.data.Status === 1000) {
      const t = resp.data.Data.find((it) => it.OperatorList && it.OperatorList.length > 10);
      if (t) {
        // eslint-disable-next-line no-alert
        alert('关系数量超出');
      }
      return resp.data.Data.map((it) => this.transform(it)).filter((it) => it);
    }
    return undefined;
  }

  static getProperyName(item) { // 传入一个属性 获取到其属性名称
    const {
      FixedType, Element, Name, Type, Formula, Constraint, TableData, Cost,
    } = item;
    if (FixedType || FixedType === 0) {
      const t = PropertyFixedType.find((it) => it.ID === FixedType);
      if (t) return t.Name;
      return '';
    }
    if (Element && Element.Name) return Element.Name;
    if (!Element) {
      if (Name) return Name;
      if (Formula && Formula.Name) return Formula.Name; // 公式 | 子公式
      if (Constraint && Constraint.Name) return Constraint.Name; // 子条件
      if (TableData && TableData.Name) return TableData.Name; // 表数据
      if (Cost && Cost.Name) return Cost.Name; // 费用
      const _t = ElementSelectTypeEnum.find((it) => it.ID === Type);
      return _t ? _t.nickName : '';
    }
    return '';
  }

  static AvailableValueListChecker(val, AvailableValueList) {
    if (AvailableValueList && Array.isArray(AvailableValueList)) {
      for (let i = 0; i < AvailableValueList.length; i += 1) {
        const AvailableValue = AvailableValueList[i]; // 有效数值

        if (typeof AvailableValue === 'number' && +val === AvailableValue) return true;

        if (typeof AvailableValue === 'object') {
          const {
            MinValue, MaxValue, IsGeneralValue, Increment, InputContent, AllowDecimal,
          } = AvailableValue;
          if (MinValue === -1 && MaxValue === -1 && !IsGeneralValue && !Increment && !InputContent) {
            return getValueIsOrNotNumber(val, !(AllowDecimal === true));
          }
          const valueList = getNumberValueList(InputContent);
          if (valueList.includes(`${val}`)) return true;
          if (val >= MinValue && (val <= MaxValue || MaxValue === -1) && Increment) { // 符合范围区间 进入判断
            let T = Increment.toString().indexOf('.');
            T = T === -1 ? 0 : Increment.toString().length - T - 1;
            const arr = new Array(T);
            arr.fill('0');
            T = `1${arr.join('')}`;
            if ((+val * T - MinValue * T) % (Increment * T) === 0) {
              return true;
            }
          }
        }
      }
      return false;
    }
    return true;
  }

  static getPerfectPropertyByImperfectProperty(imperfectProp, PropertyList) {
    if (!imperfectProp || !PropertyList || !Array.isArray(PropertyList) || PropertyList.length === 0) return null;
    const t = PropertyList.find((it) => {
      const {
        Product, Part, Craft, Material, Group, Element, FixedType, Type, TableData, Cost, Constraint, Formula,
      } = it;
      if (!((!Product && Product === imperfectProp.Product) || (Product && imperfectProp.Product && Product.ID === imperfectProp.Product.ID))) return false;
      if (!((!Part && Part === imperfectProp.Part) || (Part && imperfectProp.Part && Part.ID === imperfectProp.Part.ID))) return false;
      if (!((!Craft && Craft === imperfectProp.Craft) || (Craft && imperfectProp.Craft && Craft.ID === imperfectProp.Craft.ID))) return false;
      if (!((!Material && Material === imperfectProp.Material) || (Material && imperfectProp.Material && Material.ID === imperfectProp.Material.ID))) return false;
      if (!((!Group && Group === imperfectProp.Group) || (Group && imperfectProp.Group && Group.ID === imperfectProp.Group.ID))) return false;
      if (!((!Element && Element === imperfectProp.Element) || (Element && imperfectProp.Element && Element.ID === imperfectProp.Element.ID))) return false;
      if (!((!TableData && TableData === imperfectProp.TableData) || (TableData && imperfectProp.TableData && TableData.ID === imperfectProp.TableData.ID))) return false;
      if (!((!Cost && Cost === imperfectProp.Cost) || (Cost && imperfectProp.Cost && Cost.ID === imperfectProp.Cost.ID))) return false;
      if (!((!Constraint && Constraint === imperfectProp.Constraint) || (Constraint && imperfectProp.Constraint && Constraint.ID === imperfectProp.Constraint.ID))) return false;
      if (!((!Formula && Formula === imperfectProp.Formula) || (Formula && imperfectProp.Formula && Formula.ID === imperfectProp.Formula.ID))) return false;
      if (FixedType !== imperfectProp.FixedType) return false;
      if (Type !== imperfectProp.Type) return false;
      return true;
    });
    if (t) {
      if (t.FixedType === 255) { // 常量
        const { DefaultValue } = imperfectProp;
        return { ...t, DefaultValue };
      }
      if (t.Type === 9) {
        const { CraftOptionList } = imperfectProp;
        if (CraftOptionList && t.CraftOptionList) {
          const list = t.CraftOptionList.map((it) => {
            const _t = CraftOptionList.find((_it) => _it.ID === it.ID && JSON.stringify(_it.Part) === JSON.stringify(it.Part));
            return _t ? { ..._t, Name: it.Name } : it;
          });
          return { ...t, CraftOptionList: list };
        }
      }
      return t;
    }
    return null;
  }

  static getMaterialListShowText(checkList, OptionList, Type) {
    const tempMaterialObj = getTempMaterialListObj(OptionList);
    const tempMaterialOptionList = getTempMaterialOptionList(tempMaterialObj);
    let text = getTempMaterialSelectedListShowText(checkList, tempMaterialOptionList);
    if (Type && Type !== 5) text = text.replace('（全部）', '');
    return text;
  }

  static getPropertyConditionText(list, target, allAdAreaTreeList = [], allProductClassify = [], allSellAreaTreeList = []) { // getNameFromListByIDs
    if (!list || !Array.isArray(list) || list.length === 0) return '';
    const _list = list.map((it) => {
      const { Property, Operator, ValueList } = it;
      let _operator = getNameFromListByIDs(Operator, AllOperatorList); // 获取到关系类型名称
      // const PerfectProperty = this.getPerfectPropertyByImperfectProperty(Property, PropertyList); // 获取到完整属性
      // if (!PerfectProperty) return '';
      const {
        DisplayContent, OptionList, ValueType, Module, Element, Group, Part, Type, FixedType,
      } = Property;
      if (ValueType === 1 || ValueType === 6) _operator += '下面任一选项时：';
      // if (ValueType === 2) _operator += '下面所有选项时：';
      if (ValueType === 3 || ValueType === 2) {
        let str = '下面所有选项时：';
        if (target && Module === 255 && Element && Element.Type === 2 && Element.OptionAttribute && Element.OptionAttribute.IsRadio) {
          // eslint-disable-next-line no-nested-ternary
          if (Group && Group.ID && target.Group && target.Group.ID && Group.ID === target.Group.ID) str = '下面任一选项时：';
          if (Part && Part.ID && target.Part && target.Part.ID && Part.ID === target.Part.ID) str = '下面任一选项时：';
        }
        _operator += str;
      }
      if (ValueType === 5) _operator += '时';
      const _name = DisplayContent ? DisplayContent.replace(/\[|\]/g, '') : '';
      let _val = '';
      if (ValueList) {
        if ([41, 46, 47, 52].includes(FixedType)) {
          if (FixedType === 41) {
            _val = ValueList[0].Value ? ValueList[0].Value.split('T')[0] : '';
          } else if (Array.isArray(ValueList) && ValueList.length > 0) {
            const vals = ValueList.filter((_it) => _it && _it.Value).map((_it) => JSON.parse(_it.Value)).filter((_it) => _it);
            if (FixedType === 46) {
              _val = getTreeTextDisplayContent(vals, allAdAreaTreeList);
            }
            if (FixedType === 47) {
              _val = getTreeTextDisplayContent(vals, allProductClassify, 'product');
            }
            if (FixedType === 52) {
              _val = getTreeTextDisplayContent(vals, allSellAreaTreeList, 'sellArea');
            }
          }
        } else {
          if (ValueList.length === 1) {
            if ((ValueList[0].Value || ValueList[0].Value === 0)) {
              if (getValueIsOrNotNumber(ValueList[0].Value)) {
                _val = ValueList[0].Value;
                if (Property && Property.DisplayContent) {
                  if (Array.isArray(Property.OptionList)) {
                    const t = Property.OptionList.find((_it) => _it.First === _val);
                    if (t) _val = t.Second;
                  }
                }
              } else {
                if (ValueList[0].Value === 'True') _val = Property.FixedType === 35 ? '是' : '开';
                if (ValueList[0].Value === 'False') _val = Property.FixedType === 35 ? '否' : '关';
              }
            }
            if (!ValueList[0].Value && ValueList[0].Property && ValueList[0].Property.DisplayContent) {
              _val = ValueList[0].Property.DisplayContent.replace(/\[|\]/g, '');
            }
          }
          if (!_val && OptionList) {
            _val = ValueList.map((_it) => OptionList.find((option) => option.First === _it.Value)).filter((_it) => _it).map((_it) => _it.Second).join('、');
            if (ValueType === 6) { // 为物料类型 对物料类型数据进行组合
              const checkList = ValueList.map((_it) => _it.Value);
              _val = this.getMaterialListShowText(checkList, OptionList, Type);
            }
          }
        }
      }
      return {
        name: _name,
        operator: _operator,
        val: _val,
      };
    }).filter((it) => it);

    return _list;
  }

  static getPropIDsObj(data) {
    if (!data) return {};
    const temp = {};
    Object.keys(data).forEach((key) => {
      if (['Product', 'Part', 'Group', 'Craft', 'Price'].includes(key)) {
        if (data[key] && data[key].ID) temp[`${key}ID`] = data[key].ID;
      } else if (['ProductID', 'PartID', 'GroupID', 'CraftID', 'PriceID'].includes(key)) {
        if (data[key] || data[key] === 0) temp[key] = data[key];
      }
    });
    return temp;
  }

  static getConstraintAndTextByImperfectConstraint(Constraint, PropertyList, RightPropertyList, allAdAreaTreeList = [], allProductClassify = [], allAreaTreeList = []) {
    let _Constraint = null;
    let _ConditionText = '无';
    // if (!Constraint) return { ...it, conditionText: '无' };
    if (Constraint) {
      const ItemList = Array.isArray(Constraint.ItemList) ? Constraint.ItemList.map((item) => {
        let { ValueList } = item;
        if (Array.isArray(ValueList) && ValueList.length === 1 && !ValueList[0].Value && ValueList[0].Property) {
          const Property = this.getPerfectPropertyByImperfectProperty(ValueList[0].Property, RightPropertyList || PropertyList);
          if (Property) ValueList = [{ Property }];
        }
        return {
          ...item,
          Property: this.getPerfectPropertyByImperfectProperty(item.Property, PropertyList, allAdAreaTreeList, allProductClassify, allAreaTreeList),
          ValueList,
        };
      }).filter((item) => item.Property) : [];

      _Constraint = { ...Constraint, ItemList };
      _ConditionText = this.getPropertyConditionText(ItemList, this.PropertyList, allAdAreaTreeList, allProductClassify, allAreaTreeList);
      _ConditionText = _ConditionText || '无';
    }

    return [_Constraint, _ConditionText];
    // return _Constraint;
  }

  /**
   * 筛选接口/Api/ProductFormula/List返回结果
   *
   * 产品显示产品公式
   * 部件显示产品公式以及当前部件的子公式(不含元素组子公式)
   *
   * @static
   * @param {*} list
   * @param {*} PartID 需要当前部件ID，如果无则说明是产品本身
   * @returns
   * @memberof PropertyClass
   */
  static filterProductFormulasList(list, PartID) {
    // 1. 找出产品公式（非子公式） UseModule: 1为公式  2为子公式
    const _productFormulas = list.filter(it => it.UseModule === 1 && !it.PartID);

    // 2. 找出部件本身子公式（非元素组子公式）
    const _partFormulas = PartID ? list.filter(it => it.PartID === PartID && !it.GroupID) : [];

    // 3. 合并结果
    return [..._productFormulas, ..._partFormulas];
  }
}
