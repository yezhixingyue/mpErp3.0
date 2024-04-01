import { GenerelMappingTypeEnum, UseModuleEnum } from '@/pinia/modules/transformer/map/enum';
import { GeneralMapDataClass } from '@/pinia/modules/transformer/map/GeneralMapDataClass';
import { GeneralMapItemClass } from '@/pinia/modules/transformer/map/GeneralMapItemClass';

/** 数码自动拼版 */
export class NumericalCodeAutoMakeupLimitItemClass extends GeneralMapDataClass {
  UseModule = UseModuleEnum.NumericalCodeAutoMakeup

  Type = GenerelMappingTypeEnum.NumericalCodeAutoMakeup

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  public getItemMapResult(item: GeneralMapItemClass) {
    return '使用系统自动拼版';
  }
}
