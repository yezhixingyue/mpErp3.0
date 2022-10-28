import api from '@/api';
import { message } from '@/assets/js/message';
import { GenerelMappingTypeEnum, UseModuleEnum } from '@/store/modules/transformer/map/enum';
import { GeneralMapDataClass } from '@/store/modules/transformer/map/GeneralMapDataClass';
import { GeneralMapItemClass } from '@/store/modules/transformer/map/GeneralMapItemClass';

export class UnionMakeupLimitItemClass extends GeneralMapDataClass {
  UseModule = UseModuleEnum.UnionMakeupLimit

  Type = GenerelMappingTypeEnum.UnionMakeupLimit

  public getItemMapResult(id: string, mapList: GeneralMapItemClass[]) {
    const _mapList = mapList || this.rightDataList;
    const t = _mapList.find(it => it.ID === id);
    if (!t) return '无';
    return t.List.map(it => it?.Name).join('、') || '无';
  }

  public async saveItem(Target: string[]): Promise<void> {
    const temp = {
      ServerID: this.ServerID,
      Type: GenerelMappingTypeEnum.UnionMakeupLimit,
      ID: this.curEditItem?.ID || '',
      Target,
    };
    const resp = await api.getGeneralMappingSave(temp).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        // this.visible = false; // 返回页面
        this.handleItemChange(temp);
      };
      message.success({
        title: '设置成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }
}
