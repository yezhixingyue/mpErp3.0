import api from '@/api';
import { message } from '@/assets/js/message';
import { goBackLastPage } from '@/router/handleRouterEach';
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
export abstract class GeneralMapDataClass extends MapDataClass<GeneralMapItemClass, IPropertyType, Partial<GeneralMapItemClass>, GeneralMapItemClass> {
  abstract UseModule: UseModuleEnum

  abstract Type: GenerelMappingTypeEnum

  public async saveItem(data: Partial<GeneralMapItemClass>): Promise<void> {
    const temp = {
      ServerID: this.ServerID,
      Type: this.Type,
      ID: this.curEditItem?.ID || '',
      InstanceID: this.curPageData?.curPart?.ID || this.curPageData?.curEditItem?.ID,
      ProductID: this.curPageData?.curEditItem?.ID,
      ...data,
    };
    const resp = await api.getGeneralMappingSave(temp).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        goBackLastPage(); // 返回页面
        if (!this.curEditItem) {
          temp.ID = resp.data.Data || ''; // 新增时 填充ID
        }
        this.handleItemChange(temp);
      };
      message.success({
        title: this.curEditItem ? '编辑成功' : '添加成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  public async removeItem(data: GeneralMapItemClass) {
    const resp = await api.getGeneralMappingRemove(data.ServerID, data.ID).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        this.handleItemChange(data, true);
      };
      message.success({
        title: '删除成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

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
    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const PartID = this.curPageData?.curPart?.ID || undefined;

    const temp = {
      ServerID: this.ServerID,
      UseModule: this.UseModule,
      ProductID,
      PartID,
    };
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

  public handleItemChange = (temp: Partial<GeneralMapItemClass>, isRemove = false) => {
    const i = this.mapDataList.findIndex(it => it.ID === temp.ID);
    if (i > -1) {
      const _temp = { ...this.mapDataList[i], ...temp };
      this.mapDataList.splice(i, 1, _temp);
      if (!isRemove) return;
      this.mapDataList.splice(i, 1);
    }

    if (!isRemove) this.mapDataList.push(new GeneralMapItemClass(temp));

    if (this.curPageData) {
      const target = this.curPageData.curPart || this.curPageData.curEditItem;
      if (target) {
        const isIProduct = (t: IPart | IProduct): t is IProduct => (t as IProduct).Class !== undefined;
        const num = isRemove ? -1 : 1;
        switch (temp.Type) {
          case GenerelMappingTypeEnum.NormalLine:
            target.LineCount += num;
            break;

          case GenerelMappingTypeEnum.NormalWorking:
            target.WorkingCount += num;
            break;

          case GenerelMappingTypeEnum.UnionMakeupLimit:
            target.UnionMakeupLimitCount += num;
            break;

          case GenerelMappingTypeEnum.UnionLine:
            if (isIProduct(target)) {
              target.UnionLineCount += num;
            }
            break;
          case GenerelMappingTypeEnum.UnionWorking:
            if (isIProduct(target)) {
              target.UnionWorkingCount += num;
            }
            break;

          default:
            break;
        }
      }
    }
  }

  /**
   * 获取映射结果 用于右侧展示 - 子类实现
   *
   * @protected
   * @abstract
   * @returns {string}
   * @memberof MapDataClass
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public abstract getItemMapResult(item: GeneralMapItemClass): string
}
