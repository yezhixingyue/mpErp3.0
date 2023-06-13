import { FeedEdgePosition, GenerelMappingTypeEnum, UseModuleEnum } from '@/pinia/modules/transformer/map/enum';
import { OtherSetupGeneralTypeClass } from './OtherSetupGeneralTypeClass';

/**
 * 叼口设置列表数据及相关操作类
 *
 * @export
 * @class FeedEdgeSetupTypeClass
 * @extends {GeneralMapDataClass}
 */
export class FeedEdgeSetupTypeClass extends OtherSetupGeneralTypeClass {
  UseModule = UseModuleEnum.otherSetupGeneral

  Type = GenerelMappingTypeEnum.FeedEdge

  public getItemMapResult(item) {
    const arr = [];
    if (item.Position === FeedEdgePosition.Front) {
      arr.push('设为前叼口：');
    }
    if (item.Position === FeedEdgePosition.Back) {
      arr.push('设为后叼口：');
    }

    if (item.Formula) {
      arr.push(`${item.Formula.Name}`);
    } else if (item.Value) {
      arr.push(`${item.Value}mm`);
    }
    return arr.join('');
  }
}
