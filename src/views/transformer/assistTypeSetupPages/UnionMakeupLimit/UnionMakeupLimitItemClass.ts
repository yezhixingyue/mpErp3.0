import { GenerelMappingTypeEnum, UseModuleEnum } from '@/pinia/modules/transformer/map/enum';
import { GeneralMapDataClass } from '@/pinia/modules/transformer/map/GeneralMapDataClass';
import { GeneralMapItemClass } from '@/pinia/modules/transformer/map/GeneralMapItemClass';

export class UnionMakeupLimitItemClass extends GeneralMapDataClass {
  UseModule = UseModuleEnum.UnionMakeupLimit

  Type = GenerelMappingTypeEnum.UnionMakeupLimit

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  public getItemMapResult(item: GeneralMapItemClass) {
    return '不允许合拼';
  }
}
