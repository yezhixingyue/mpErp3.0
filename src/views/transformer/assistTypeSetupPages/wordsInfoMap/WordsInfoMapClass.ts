import api from '@/api';
import { message } from '@/assets/js/message';
import { AssistInfoTypeEnum, AssistMappingTypeEnum } from '@/store/modules/transformer/map/enum';
import { MapDataClass } from '@/store/modules/transformer/map/MapDataClass';
import { AssistMapItemClass } from '@/store/modules/transformer/map/AssistMapItemClass';

export interface IWordsInfoLeftType {
  ID: string | number
  Name: string
}

interface IWordsInfoRightType {
  ID: string
  Name: string
}

export class WordsInfoMapClass extends MapDataClass<IWordsInfoLeftType, IWordsInfoRightType, string[]> {
  visible = false

  setVisible = (bool: boolean) => {
    this.visible = bool;
  }

  public getItemMapResult(id: string, mapList: AssistMapItemClass[]) {
    const t = mapList.find(it => it.SourceID === id || it.SourceID === `${id}`);
    if (!t) return '无';
    return t.Target.map(_id => this.rightDataList.find(it => it.ID === _id)).filter(it => it).map(it => it?.Name).join('、') || '无';
  }

  public async saveItem(Target: string[]): Promise<void> {
    const temp = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.WordsInfo,
      SourceID: this.curEditItem?.ID || '',
      Target,
    };
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
   * @memberof WordsInfoMapClass
   */
  protected async getLeftList() {
    const resp = await api.getAssistantInfoList(this.ServerID, AssistInfoTypeEnum.text).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取右侧列表数据
   *
   * @protected
   * @returns
   * @memberof WordsInfoMapClass
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
   * @memberof WordsInfoMapClass
   */
  protected async getMapList() {
    const temp = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.WordsInfo,
    };
    const resp = await api.getAssistMappingList(temp).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }
}
