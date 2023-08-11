import api from '@/api';
import { AssistMappingTypeEnum } from '@/pinia/modules/transformer/map/enum';
import { AssistMapDataClass } from '@/pinia/modules/transformer/map/AssistMapDataClass';
import { AssistMapItemClass } from '@/pinia/modules/transformer/map/AssistMapItemClass';
import { MpMessage } from '@/assets/js/utils/MpMessage';

export interface IColorInfoLeftType {
  ID: string | number
  Name: string
}

interface IColorInfoRightType {
  ID: string
  Name: string
}

export class ColorInfoMapClass extends AssistMapDataClass<IColorInfoLeftType, IColorInfoRightType, string[]> {
  public getItemMapResult(id: string, mapList: AssistMapItemClass[]) {
    const t = mapList.find(it => it.SourceID === id || it.SourceID === `${id}`);
    if (!t) return '无';
    return t.Target.map(_id => this.rightDataList.find(it => it.ID === _id)).filter(it => it).map(it => it?.Name).join('、') || '无';
  }

  public async saveItem(Target: string[], ID: string): Promise<void> {
    const temp = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.SpecialColor,
      SourceID: this.curEditItem?.ID || '',
      Target,
      ID,
    };
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
   * @memberof ColorInfoMapClass
   */
  // eslint-disable-next-line class-methods-use-this
  protected async getLeftList() {
    const resp = await api.getOutputFileList({ onlyShowPdf: true, includeUseTimes: false }).catch(() => null);

    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取右侧列表数据
   *
   * @protected
   * @returns
   * @memberof ColorInfoMapClass
   */
  protected async getRightList() {
    const resp = await api.getColorList(this.ServerID).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取映射列表数据
   *
   * @protected
   * @returns
   * @memberof ColorInfoMapClass
   */
  protected async getMapList() {
    const temp = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.SpecialColor,
    };
    const resp = await api.getAssistMappingList(temp).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }
}
