import api from '@/api';
import { GenerelMappingTypeEnum, UseModuleEnum } from '@/store/modules/transformer/map/enum';
import { GeneralMapDataClass } from '@/store/modules/transformer/map/GeneralMapDataClass';
import { GeneralMapItemClass } from '@/store/modules/transformer/map/GeneralMapItemClass';
import { TransformerListPageDataPlainType } from '@/store/modules/transformer/TransformerListPageDataClass';
import { IGetWorkingProcedureParams } from '@/store/modules/transformer/types';

/**
 * 工序映射 - 类
 *
 * @export
 * @class WorkingMapItemClass
 * @extends {GeneralMapDataClass}
 */
export class WorkingMapItemClass extends GeneralMapDataClass {
  title = '工序'

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
    return str || '未知数据';
  }

  protected async getLeftList() {
    const data: IGetWorkingProcedureParams = {
      ServerID: this.ServerID,
      ProductID: this.curPageData?.curEditItem?.ID || '',
      InstanceID: this.curPageData?.curPart?.ID || this.curPageData?.curEditItem?.ID || '',
      Page: 1,
      PageSize: 10000,
    };
    if (this.Type === GenerelMappingTypeEnum.UnionWorking) {
      delete data.InstanceID;
    }
    const resp = await api.getWorkingProcedureList(data).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  constructor(UseModule: UseModuleEnum, Type: GenerelMappingTypeEnum, data: TransformerListPageDataPlainType | null) {
    super(data);

    this.UseModule = UseModule;
    this.Type = Type;

    if (Type === GenerelMappingTypeEnum.UnionWorking) {
      this.title = '组合工序';
    }
  }
}
