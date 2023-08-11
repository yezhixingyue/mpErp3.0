import api from '@/api';
import { AssistInfoTypeEnum, AssistMappingTypeEnum } from '@/pinia/modules/transformer/map/enum';
import { AssistMapDataClass } from '@/pinia/modules/transformer/map/AssistMapDataClass';
import { AssistMapItemClass } from '@/pinia/modules/transformer/map/AssistMapItemClass';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { PropertyClass } from '@/components/common/mpzj-sell-lib/lib';

export interface INumbericLeftType {
  ID: string
  Name: string
}

export interface INumbericRightType {
  ID: string
  Name: string
  PartID: null | string
}

export class NumbericMapClass extends AssistMapDataClass<INumbericLeftType, INumbericRightType, null | { ID: string, Name: string }> {
  public getItemMapResult(id: string, mapList: AssistMapItemClass[]) {
    const _mapList = mapList || this.mapDataList;
    const t = _mapList.find(it => it.SourceID === id || it.SourceID === `${id}`);
    if (!t) return '';
    if (typeof t.Value === 'number') return `${t.Value}`;
    return t.Formula?.Name || '';
  }

  public async saveItem(data: { ID: string, Name: string } | number, ID: string): Promise<void> {
    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const InstanceID = this.curPageData?.curInstance?.ID; // 如果为组合生产线数值映射 InstanceID不传值
    const temp: Partial<AssistMapItemClass> = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.Numberic,
      SourceID: this.curEditItem?.ID || '',
      ProductID,
      InstanceID,
      ID,
    };
    if (typeof data === 'number') {
      temp.Value = data;
      temp.Formula = null;
    } else {
      temp.Value = '';
      temp.Formula = data;
    }
    const resp = await api.getAssistMappingSave(temp).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        this.visible = false;
        if (!ID) temp.ID = resp.data.Data;
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
   * @memberof NumbericMapClass
   */
  protected async getLeftList() {
    const resp = await api.getAssistantInfoList(this.ServerID, AssistInfoTypeEnum.numerical).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取右侧列表数据
   *
   * @protected
   * @returns
   * @memberof NumbericMapClass
   */
  protected async getRightList() {
    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const PartID = this.curPageData?.curPart?.ID || null;

    const resp = await api.getProductFormulasList(ProductID).catch(() => null);
    const list = resp?.data.Status === 1000 ? resp.data.Data : [];

    return PropertyClass.filterProductFormulasList(list, PartID);
    // return list.map(transformProperty).filter((it: INumbericRightType) => it);
  }

  /**
   * 获取映射列表数据
   *
   * @protected
   * @returns
   * @memberof NumbericMapClass
   */
  protected async getMapList() {
    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const InstanceID = this.curPageData?.curInstance?.ID;
    const temp = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.Numberic,
      ProductID,
      InstanceID,
    };
    const resp = await api.getAssistMappingList(temp).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }
}
