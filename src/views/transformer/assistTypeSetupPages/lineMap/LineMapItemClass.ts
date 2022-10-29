import { GenerelMappingTypeEnum, UseModuleEnum } from '@/store/modules/transformer/map/enum';
import { GeneralMapDataClass } from '@/store/modules/transformer/map/GeneralMapDataClass';
import { GeneralMapItemClass } from '@/store/modules/transformer/map/GeneralMapItemClass';
import { TransformerListPageDataPlainType } from '@/store/modules/transformer/TransformerListPageDataClass';

export class LineMapItemClass extends GeneralMapDataClass {
  UseModule = UseModuleEnum.NormalLine

  Type = GenerelMappingTypeEnum.NormalLine

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  public getItemMapResult(item: GeneralMapItemClass) {
    return '不允许合拼';
  }

  constructor(UseModule: UseModuleEnum, Type: GenerelMappingTypeEnum, data: TransformerListPageDataPlainType | null) {
    super(data);

    this.UseModule = UseModule;
    this.Type = Type;
  }
}
