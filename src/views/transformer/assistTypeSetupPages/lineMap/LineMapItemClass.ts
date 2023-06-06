import api from '@/api';
import { GenerelMappingTypeEnum, UseModuleEnum } from '@/pinia/modules/transformer/map/enum';
import { GeneralMapDataClass } from '@/pinia/modules/transformer/map/GeneralMapDataClass';
import { GeneralMapItemClass } from '@/pinia/modules/transformer/map/GeneralMapItemClass';
import { TransformerListPageDataPlainType } from '@/pinia/modules/transformer/TransformerListPageDataClass';

export class LineMapItemClass extends GeneralMapDataClass {
  title = '生产线'

  UseModule = UseModuleEnum.NormalLine

  Type = GenerelMappingTypeEnum.NormalLine

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  public getItemMapResult(item: GeneralMapItemClass) {
    const str = item.List
      .map(it => it.ID)
      .map(id => this.leftDataList.find(it => it.ID === id))
      .map(it => it?.Name || '')
      .filter(it => it)
      .join('、');
    return str || '';
  }

  protected async getLeftList() {
    const resp = await api.getProduceLineList(this.ServerID, this.Type === GenerelMappingTypeEnum.UnionLine).catch(() => null);
    if (resp?.data.Status === 1000) {
      return resp.data.Data || [];
    }
    return [];
  }

  constructor(UseModule: UseModuleEnum, Type: GenerelMappingTypeEnum, data: TransformerListPageDataPlainType | null) {
    super(data);

    this.UseModule = UseModule;
    this.Type = Type;

    if (Type === GenerelMappingTypeEnum.UnionLine) {
      this.title = '组合生产线';
    }
  }
}
