import api from '@/api';
import { message } from '@/assets/js/message';
import { AssistInfoTypeEnum, AssistMappingTypeEnum } from '@/store/modules/transformer/map/enum';
import { AssistMapDataClass } from '@/store/modules/transformer/map/AssistMapDataClass';
import { AssistMapItemClass } from '@/store/modules/transformer/map/AssistMapItemClass';

export interface IAssistInfoLeftType {
  ID: string | number
  Name: string
}

interface IAssistInfoRightType {
  ID: string
  Name: string
}

export class AssistInfoMapClass extends AssistMapDataClass<IAssistInfoLeftType, IAssistInfoRightType, string[]> {
  public getItemMapResult(id: string, mapList: AssistMapItemClass[]) {
    const t = mapList.find(it => it.SourceID === id || it.SourceID === `${id}`);
    if (!t) return '无';
    return t.Target.map(_id => this.rightDataList.find(it => it.ID === _id)).filter(it => it).map(it => it?.Name).join('、') || '无';
  }

  public async saveItem(Target: string[]): Promise<void> {
    const temp = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.AssistFile,
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
   * @memberof AssistInfoMapClass
   */
  protected async getLeftList() {
    const resp = await api.getFileList({ serverID: this.ServerID }).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取右侧列表数据
   *
   * @protected
   * @returns
   * @memberof AssistInfoMapClass
   */
  protected async getRightList() {
    const resp = await api.getAssistantInfoList(this.ServerID, AssistInfoTypeEnum.file).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取映射列表数据
   *
   * @protected
   * @returns
   * @memberof AssistInfoMapClass
   */
  protected async getMapList() {
    const temp = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.AssistFile,
    };
    const resp = await api.getAssistMappingList(temp).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }
}
