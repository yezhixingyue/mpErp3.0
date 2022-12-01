import api from '@/api';
import { AssistMappingTypeEnum } from '@/pinia/modules/transformer/map/enum';
import { AssistMapDataClass } from '@/pinia/modules/transformer/map/AssistMapDataClass';
import { AssistMapItemClass } from '@/pinia/modules/transformer/map/AssistMapItemClass';
import { IFactoryMaterialClass } from '@/pinia/modules/transformer/map/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';

export interface IMaterialInfoLeftType {
  ID: string | number
  DisplayName: string
  Type: {
    ID: string
    InternalName: string
  }
}

interface IMaterialInfoRightType {
  ID: string
  Name: string
  TypeID: string
}

export class MaterialInfoMapClass extends AssistMapDataClass<IMaterialInfoLeftType, IMaterialInfoRightType, string[]> {
  public getItemMapResult(id: string, mapList: AssistMapItemClass[], FactoryMaterialClassList: IFactoryMaterialClass[]) {
    const t = mapList.find(it => it.SourceID === id || it.SourceID === `${id}`);
    if (!t || t.Target.length === 0) return '无';
    const m = this.rightDataList.find(it => it.ID === t.Target[0]);
    if (m) {
      let TypeName = '';
      FactoryMaterialClassList.forEach(lv1 => {
        if (TypeName) return;
        const t2 = lv1.List.find(lv2 => lv2.ID === m.TypeID);
        if (t2) {
          TypeName = t2.Name;
        }
      });
      return TypeName ? `${TypeName}：${m.Name}` : m.Name;
    }
    return '';
  }

  public async saveItem(Target: string[]): Promise<void> {
    const temp = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.Material,
      SourceID: this.curEditItem?.ID || '',
      Target,
    };
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
   * @memberof MaterialInfoMapClass
   */
  // eslint-disable-next-line class-methods-use-this
  protected async getLeftList() {
    const resp = await api.getMaterialList({ page: 1, pageSize: 100000 }).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取右侧列表数据
   *
   * @protected
   * @returns
   * @memberof MaterialInfoMapClass
   */
  protected async getRightList() {
    const resp = await api.getFactoryMaterialList(this.ServerID).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取映射列表数据
   *
   * @protected
   * @returns
   * @memberof MaterialInfoMapClass
   */
  protected async getMapList() {
    const temp = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.Material,
    };
    const resp = await api.getAssistMappingList(temp).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }
}
