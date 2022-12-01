import { PropertyClass, PropertyUtils } from '@/components/common/mpzj-sell-lib/lib';
import api from '../../../api';

export const { AllOperatorList } = PropertyUtils;
export const { ElementSelectTypeEnum } = PropertyUtils;
export const { PropertyFixedType } = PropertyUtils;
export const { getTempMaterialListObj } = PropertyUtils;
export const { getTempMaterialOptionList } = PropertyUtils;
export const { getTempMaterialSelectedListShowText } = PropertyUtils;
export default class LocalPropertyClass extends PropertyClass {
  static getPropertyList(params) {
    return PropertyClass.getPropertyList(params, api.getFormulaPropertyList);
  }
}
