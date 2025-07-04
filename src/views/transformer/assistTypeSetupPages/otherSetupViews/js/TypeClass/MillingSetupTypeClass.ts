import { GenerelMappingTypeEnum, UseModuleEnum } from '@/pinia/modules/transformer/map/enum';
import { OtherSetupGeneralTypeClass } from './OtherSetupGeneralTypeClass';

/**
 * 铣背设置列表数据及相关操作类
 *
 * @export
 * @class MillingSetupTypeClass
 * @extends {GeneralMapDataClass}
 */
export class MillingSetupTypeClass extends OtherSetupGeneralTypeClass {
  UseModule = UseModuleEnum.otherSetupGeneral

  Type = GenerelMappingTypeEnum.Milling

  public getItemMapResult(item) {
    const arr = [];

    if (item.Formula) {
      arr.push(`铣背深度设为：${item.Formula.Name}`);
    } else if (item.Value || item.Value === 0) {
      arr.push(`铣背深度设为：${item.Value}mm`);
    }

    return arr.join('');
  }
}
