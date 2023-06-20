import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { PropertyClass } from '@/components/common/mpzj-sell-lib/lib';
import { goBackLastPage } from '@/router';
import { GeneralMapItemClass } from './GeneralMapItemClass';
import { GenerelMappingTypeEnum, UseModuleEnum } from './enum';
import { MapDataClass } from './MapDataClass';
import { IGetDefaultLineSetupParams, IPart, IProduct } from '../types';
import { IPropertyType } from './types';

/**
 * 抽象类 - 含条件设置模块相关映射父类
 *
 * @export
 * @abstract
 * @class GeneralMapDataClass
 * @template L
 * @template R
 * @template P
 */
export abstract class GeneralMapDataClass extends MapDataClass<{ID: string, Name: string}, IPropertyType, Partial<GeneralMapItemClass>, GeneralMapItemClass> {
  title = ''

  abstract UseModule: UseModuleEnum

  abstract Type: GenerelMappingTypeEnum

  noLongerGetRightList = false // 如果在子类中为该属性赋值 且 设置为true 将不会再获取右侧列表数据

  /** 当前选中的左侧列表中的项 */
  curEditItem: GeneralMapItemClass | null = null

  /**
   * 保存项目
   *
   * @param {Partial<GeneralMapItemClass>} data
   * @returns {Promise<void>}
   * @memberof GeneralMapDataClass
   */
  public async saveItem(data: Partial<GeneralMapItemClass>): Promise<void> {
    const temp: Partial<GeneralMapItemClass> = {
      ServerID: this.ServerID,
      Type: this.Type,
      ID: this.curEditItem?.ID || '',
      InstanceID: this.curPageData?.curPart?.ID || this.curPageData?.curEditItem?.ID,
      ProductID: this.curPageData?.curEditItem?.ID,
      ...data,
    };
    if (this.Type === GenerelMappingTypeEnum.UnionLine || this.Type === GenerelMappingTypeEnum.UnionWorking) {
      delete temp.InstanceID;
    }
    const resp = await api.getGeneralMappingSave(temp).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        goBackLastPage(); // 返回页面
        if (!this.curEditItem) {
          temp.ID = resp.data.Data || ''; // 新增时 填充ID
        }
        this.handleItemChange(temp);
      };
      MpMessage.success({
        title: this.curEditItem ? '编辑成功' : '添加成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /**
   * 删除项目
   *
   * @param {GeneralMapItemClass} data
   * @memberof GeneralMapDataClass
   */
  public async removeItem(data: GeneralMapItemClass) {
    const resp = await api.getGeneralMappingRemove(data.ServerID, data.ID).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        this.handleItemChange(data, true);
      };
      MpMessage.success({
        title: '删除成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /**
   * 获取 生产线、组合生产线、工序、组合工序等列表数据
   *
   * @protected
   * @returns
   * @memberof GeneralMapDataClass
   */
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
    if (this.noLongerGetRightList) {
      return this.rightDataList;
    }
    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const PartID = this.curPageData?.curPart?.ID || undefined;

    const temp = {
      ServerID: this.ServerID,
      UseModule: this.UseModule,
      ProductID,
      PartID,
    };
    const resp = await PropertyClass.getPropertyList(temp, api.getPropertyList).catch(() => null);
    return resp || [];
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

  /**
   * 处理项目编辑、删除或新增成功后的改动
   *
   * @memberof GeneralMapDataClass
   */
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

  /**
   * 设置默认生产线|默认组合生产线
   *
   * @param {{ ID: string, Name: string }} lineData
   * @param {() => void} callback
   * @memberof GeneralMapDataClass
   */
  async getDefaultLineSetup(lineData: { ID: string, Name: string }, callback: () => void) {
    const temp: IGetDefaultLineSetupParams = {
      ServerID: this.ServerID,
      ProductID: this.curPageData?.curEditItem?.ID || '',
    };
    let target: undefined | IPart | IProduct;
    if (this.Type === GenerelMappingTypeEnum.NormalLine) {
      target = this.curPageData?.curPart || this.curPageData?.curEditItem || undefined;
      const InstanceID = target?.ID || '';
      temp.InstanceID = InstanceID;
      temp.DefaultLineID = lineData.ID;
    } else {
      target = this.curPageData?.curEditItem || undefined;
      temp.DefaultUnionLineID = lineData.ID;
    }
    const resp = await api.getDefaultLineSetup(temp).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        if (callback) callback();
        if (target) {
          if (this.Type === GenerelMappingTypeEnum.UnionLine) {
            const isIProduct = (t: IPart | IProduct): t is IProduct => (t as IProduct).Class !== undefined;
            if (isIProduct(target)) {
              target.DefaultUnionLine = lineData;
            }
          } else {
            target.DefaultLine = lineData;
          }
        }
      };
      MpMessage.success({
        title: '保存成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }
}
