import api from '@/api';
import { GeneralMapItemClass } from './GeneralMapItemClass';
import { GenerelMappingTypeEnum, UseModuleEnum } from './enum';
import { MapDataClass } from './MapDataClass';
import { IPart, IProduct } from '../types';
import { IPropertyType } from './types';

/**
 * 抽象类 - 辅助信息相关映射父类
 *
 * @export
 * @abstract
 * @class GeneralMapDataClass
 * @template L
 * @template R
 * @template P
 */
export abstract class GeneralMapDataClass extends MapDataClass<GeneralMapItemClass, IPropertyType, string[], GeneralMapItemClass> {
  abstract UseModule: UseModuleEnum

  abstract Type: GenerelMappingTypeEnum

  protected async getLeftList() {
    return this.leftDataList;
  }

  /**
   * 获取右侧列表数据 -- 属性列表数据
   *
   * @protected
   * @returns
   * @memberof UnionMakeupLimitItemClass
   */
  protected async getRightList() {
    console.log(this.UseModule);

    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const PartID = this.curPageData?.curPart?.ID || undefined;

    const temp = {
      ServerID: this.ServerID,
      UseModule: this.UseModule,
      ProductID,
      PartID,
    };
    console.log(temp);
    const resp = await api.getPropertyList(temp).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取映射列表数据 -- 表格数据
   *
   * @protected
   * @returns
   * @memberof UnionMakeupLimitItemClass
   */
  protected async getMapList() {
    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const InstanceID = this.curPageData?.curPart?.ID || ProductID;
    const temp = {
      ServerID: this.ServerID,
      Type: this.Type,
      ProductID,
      InstanceID,
    };
    const resp = await api.getGeneralMappingList(temp).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  public handleItemChange = (temp: Partial<GeneralMapItemClass>) => {
    const i = this.mapDataList.findIndex(it => it.ID === temp.ID);
    if (i > -1) {
      const _temp = { ...this.mapDataList[i], ...temp };
      this.mapDataList.splice(i, 1, _temp);
    } else {
      this.mapDataList.push(new GeneralMapItemClass(temp));
      if (this.curPageData) {
        const target = this.curPageData.curPart || this.curPageData.curEditItem;
        if (target) {
          const isIProduct = (t: IPart | IProduct): t is IProduct => (t as IProduct).Class !== undefined;
          switch (temp.Type) {
            case GenerelMappingTypeEnum.NormalLine:
              target.LineCount += 1;
              break;

            case GenerelMappingTypeEnum.NormalWorking:
              target.WorkingCount += 1;
              break;

            case GenerelMappingTypeEnum.UnionMakeupLimit:
              target.UnionMakeupLimitCount += 1;
              break;

            case GenerelMappingTypeEnum.UnionLine:
              if (isIProduct(target)) {
                target.UnionLineCount += 1;
              }
              break;
            case GenerelMappingTypeEnum.UnionWorking:
              if (isIProduct(target)) {
                target.UnionWorkingCount += 1;
              }
              break;

            default:
              break;
          }
        }
      }
    }
  }
}
