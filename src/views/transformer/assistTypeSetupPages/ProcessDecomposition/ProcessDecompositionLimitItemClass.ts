import { GenerelMappingTypeEnum, UseModuleEnum } from '@/pinia/modules/transformer/map/enum';
import { GeneralMapDataClass } from '@/pinia/modules/transformer/map/GeneralMapDataClass';
import { GeneralMapItemClass } from '@/pinia/modules/transformer/map/GeneralMapItemClass';

/** 人工工艺分解 */
export class ProcessDecompositionLimitItemClass extends GeneralMapDataClass {
  UseModule = UseModuleEnum.ProcessDecomposition

  Type = GenerelMappingTypeEnum.FeedEdge

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  public getItemMapResult(item: GeneralMapItemClass) {
    return '需要人工分解工艺';
  }
}
