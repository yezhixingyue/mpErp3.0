import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { AssistMappingTypeEnum } from './enum';
import { IPropertyType } from './types';

export class AssistMapItemClass {
  ServerID = ''

  InstanceID = ''

  ProductID = ''

  Type:AssistMappingTypeEnum = AssistMappingTypeEnum.AssistFile // 枚举数值

  /** 原属性ID */
  SourceID: string | number = ''

  /** 映射列表 */
  Target: string[] = []

  /** 映射属性列表 文字信息映射等地方用到 */
  TargetProperty: IPropertyType[] = []

  // /** 是否为印刷版 */
  IsPrintPlate = false

  /** 数值映射常数值 */
  Value:number | '' = ''

  constructor(data: Partial<AssistMapItemClass>) {
    if (data) {
      restoreInitDataByOrigin(this, data);
    }
  }
}
