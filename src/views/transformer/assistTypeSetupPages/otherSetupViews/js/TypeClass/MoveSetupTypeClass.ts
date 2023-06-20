import { GenerelMappingTypeEnum, MoveTypeEnum, UseModuleEnum } from '@/pinia/modules/transformer/map/enum';
import { OtherSetupGeneralTypeClass } from './OtherSetupGeneralTypeClass';

/**
 * 爬移设置列表数据及相关操作类
 *
 * @export
 * @class MoveSetupTypeClass
 * @extends {GeneralMapDataClass}
 */
export class MoveSetupTypeClass extends OtherSetupGeneralTypeClass {
  UseModule = UseModuleEnum.otherSetupGeneral

  Type = GenerelMappingTypeEnum.Move

  public getItemMapResult(item) {
    const arr: string[] = [];

    if (item.MoveType === MoveTypeEnum.Skewing) arr.push('使用偏移');
    if (item.MoveType === MoveTypeEnum.Zoom) arr.push('使用缩放');

    if (item.Formula) {
      arr.push(`内爬移设为：${item.Formula.Name}`);
    } else if (item.Value) {
      arr.push(`内爬移设为：${item.Value}mm`);
    }

    if (item.MoveOutFormula) {
      arr.push(`外爬移设为：${item.MoveOutFormula.Name}`);
    } else if (item.MoveOutValue) {
      arr.push(`外爬移设为：${item.MoveOutValue}mm`);
    }

    return arr.join('，');
  }
}
