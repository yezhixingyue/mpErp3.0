import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { AssistMappingTypeEnum } from './enum';

export class AssistMapItemClass {
  ServerID = ''

  InstanceID = ''

  ProductID = ''

  Type = AssistMappingTypeEnum.AssistFile // 枚举数值

  /** 原属性ID */
  SourceID: string | number = ''

  /** 映射列表 */
  Target: string[] = []

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
