/* eslint-disable object-curly-newline */
/* eslint-disable max-len */

import { IPropertyType } from '@/store/modules/transformer/map/types';

/**
 * 通过一个信息不完成的属性从属性列表中找到其对应的包含完整信息的属性
 *
 * @param {IPropertyType} imperfectProp
 * @param {IPropertyType[]} PropertyList
 * @returns
 */
export const getPerfectPropertyByImperfectProperty = (imperfectProp: IPropertyType, PropertyList: IPropertyType[]) => {
  if (!imperfectProp || !PropertyList || !Array.isArray(PropertyList) || PropertyList.length === 0) return null;
  const t = PropertyList.find(it => {
    const { Product, Part, Craft, Material, Group, Element, FixedType, Type, TableData, Cost, Constraint, Formula } = it;
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
        const list = t.CraftOptionList.map(it => {
          const _t = CraftOptionList.find(_it => _it.ID === it.ID && JSON.stringify(_it.Part) === JSON.stringify(it.Part));
          return _t ? { ..._t, Name: it.Name } : it;
        });
        return { ...t, CraftOptionList: list };
      }
    }
    return t;
  }
  return null;
};
