import api from '@/api';
import { AssistMappingTypeEnum } from './enum';
import { MapDataClass } from './MapDataClass';

interface L {
  ID: string
  Name: string
}

interface R {
  ID: string
  Name: string
}

interface M {
  ServerID: string
  InstanceID: string
  ProductID: string
  Type: AssistMappingTypeEnum
  SourceID: string
  Target: string[]
  IsPrintPlate: boolean
  Value: number | ''
}

export class AssistInfoMapClass extends MapDataClass<L, R, M> {
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
    const resp = await api.getAssistantInfoList(this.ServerID).catch(() => null);
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
