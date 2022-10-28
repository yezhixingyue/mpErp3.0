import api from '@/api';
import { message } from '@/assets/js/message';
import { AssistMappingTypeEnum } from '@/store/modules/transformer/map/enum';
import { AssistMapDataClass } from '@/store/modules/transformer/map/AssistMapDataClass';
import { AssistMapItemClass } from '@/store/modules/transformer/map/AssistMapItemClass';

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
    if (!t) return '1次';
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
    } else {
      temp.Target = data;
    }
    const resp = await api.getAssistMappingSave(temp).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        this.visible = false;
        this.handleItemChange(temp);
      };
      message.success({
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
    const PartID = this.curPageData?.curPart?.ID || undefined;
    const temp = {
      ServerID: this.ServerID,
      ProductID,
      PartID,
    };
    const resp = await api.getFormulaList(temp).catch(() => null);
    const list = resp?.data.Status === 1000 ? resp.data.Data : [];
    return list;
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
