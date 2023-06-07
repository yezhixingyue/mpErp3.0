import api from '@/api';
import { AssistMappingTypeEnum } from '@/pinia/modules/transformer/map/enum';
import { AssistMapDataClass } from '@/pinia/modules/transformer/map/AssistMapDataClass';
import { AssistMapItemClass } from '@/pinia/modules/transformer/map/AssistMapItemClass';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { PropertyClass } from '@/components/common/mpzj-sell-lib/lib';

export interface IWorkTimesLeftType {
  ID: string
  Name: string
}

export interface IWorkTimesRightType {
  ID: string
  Name: string
  PartID: null | string
}

export class WorkTimesMapClass extends AssistMapDataClass<IWorkTimesLeftType, IWorkTimesRightType, string[]> {
  public getItemMapResult(id: string, mapList: AssistMapItemClass[]) {
    const _mapList = mapList || this.mapDataList;
    const t = _mapList.find(it => it.SourceID === id || it.SourceID === `${id}`);
    if (!t) return '';
    if (typeof t.Value === 'number') return `${t.Value}次`;
    return t.Target.map(_id => this.rightDataList.find(it => it.ID === _id)).map(it => (it ? `公式：${it.Name}` : '')).filter(it => it).join('、') || '1次';
  }

  public async saveItem(data: string[] | number): Promise<void> {
    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const InstanceID = this.curPageData?.curPart?.ID || ProductID;
    const temp: Partial<AssistMapItemClass> = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.WorkTimes,
      SourceID: this.curEditItem?.ID || '',
      ProductID,
      InstanceID,
    };
    if (typeof data === 'number') {
      temp.Value = data;
      temp.Target = [];
    } else {
      temp.Target = data;
      temp.Value = '';
    }
    const resp = await api.getAssistMappingSave(temp).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        this.visible = false;
        this.handleItemChange(temp);
      };
      MpMessage.success({
        title: '设置成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /**
   * 获取左侧列表数据
   *
   * @protected
   * @returns
   * @memberof WorkTimesMapClass
   */
  protected async getLeftList() {
    const data = {
      ServerID: this.ServerID,
      ProductID: this.curPageData?.curEditItem?.ID || '',
      InstanceID: this.curPageData?.curPart?.ID || this.curPageData?.curEditItem?.ID || '',
      OnlyShowNormal: true,
      Page: 1,
      PageSize: 10000,
    };
    const resp = await api.getWorkingProcedureList(data).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取右侧列表数据
   *
   * @protected
   * @returns
   * @memberof WorkTimesMapClass
   */
  protected async getRightList() {
    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const PartID = this.curPageData?.curPart?.ID || null;

    const resp = await api.getProductFormulasList(ProductID).catch(() => null);
    const list = resp?.data.Status === 1000 ? resp.data.Data : [];

    return PropertyClass.filterProductFormulasList(list, PartID);
    // return list.map(transformProperty).filter((it: IWorkTimesRightType) => it);
  }

  /**
   * 获取映射列表数据
   *
   * @protected
   * @returns
   * @memberof WorkTimesMapClass
   */
  protected async getMapList() {
    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const InstanceID = this.curPageData?.curPart?.ID || ProductID;
    const temp = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.WorkTimes,
      ProductID,
      InstanceID,
    };
    const resp = await api.getAssistMappingList(temp).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }
}
