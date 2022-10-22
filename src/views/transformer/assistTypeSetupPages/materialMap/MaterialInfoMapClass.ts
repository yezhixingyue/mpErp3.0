import api from '@/api';
import { message } from '@/assets/js/message';
import { AssistMappingTypeEnum } from '@/store/modules/transformer/map/enum';
import { MapDataClass } from '@/store/modules/transformer/map/MapDataClass';
import { AssistMapItemClass } from '@/store/modules/transformer/map/AssistMapItemClass';
import { IFactoryMaterialClass } from '@/store/modules/transformer/map/types';

export interface IMaterialInfoLeftType {
  ID: string | number
  Name: string
  TypeID: string
}

interface IMaterialInfoRightType {
  ID: string
  Name: string
  TypeID: string
}

export class MaterialInfoMapClass extends MapDataClass<IMaterialInfoLeftType, IMaterialInfoRightType, string[]> {
  visible = false

  setVisible = (bool: boolean) => {
    this.visible = bool;
  }

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
   * @memberof MaterialInfoMapClass
   */
  protected async getLeftList() {
    const resp = await api.getMaterialList(this.ServerID).catch(() => null);
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
