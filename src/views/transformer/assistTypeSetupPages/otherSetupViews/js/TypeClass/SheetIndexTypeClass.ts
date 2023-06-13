import { GenerelMappingTypeEnum, UseModuleEnum } from '@/pinia/modules/transformer/map/enum';
import { OtherSetupGeneralTypeClass } from './OtherSetupGeneralTypeClass';

/**
 * 贴序(帖标)设置列表数据及相关操作类
 *
 * @export
 * @class SheetIndexTypeClass
 * @extends {OtherSetupGeneralTypeClass}
 */
export class SheetIndexTypeClass extends OtherSetupGeneralTypeClass {
  UseModule = UseModuleEnum.otherSetupGeneral

  Type = GenerelMappingTypeEnum.SheetIndex

  public getItemMapResult() {
    return '添加帖标';
  }
}
