import api from '@/api';
import { AssistMappingTypeEnum } from '@/pinia/modules/transformer/map/enum';
import { AssistMapDataClass } from '@/pinia/modules/transformer/map/AssistMapDataClass';
import { AssistMapItemClass } from '@/pinia/modules/transformer/map/AssistMapItemClass';
import { MpMessage } from '@/assets/js/utils/MpMessage';

export interface IMakeupInfoLeftType {
  ID: string | number
  Name: string
}

export interface IMakeupInfoRightType {
  ID: string
  Name: string
  IsPrintingPlate: boolean
  IsSameSizeWithPrintingPlate: boolean
}

export class MakeupInfoMapClass extends AssistMapDataClass<IMakeupInfoLeftType, IMakeupInfoRightType, Pick<AssistMapItemClass, 'Target'>> {
  public getItemMapResult(id: string, mapList: AssistMapItemClass[]) {
    const t = mapList.find(it => it.SourceID === id || it.SourceID === `${id}`);
    if (!t) return '无';
    return t.Target.map(_id => this.rightDataList.find(it => it.ID === _id)).filter(it => it).map(it => it?.Name).join('、') || '无';
  }

  public async saveItem({ Target }: { Target: string[] }): Promise<void> {
    const temp: Partial<AssistMapItemClass> = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.MakeupFile,
      SourceID: this.curEditItem?.ID || '',
      Target,
    };
    if (Target.length === 0) {
      MpMessage.error({ title: '保存失败', msg: '请选择生产拼版模板' });
      return;
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
   * @memberof MakeupInfoMapClass
   */
  // eslint-disable-next-line class-methods-use-this
  protected async getLeftList() {
    const resp = await api.getOutputFileList({ onlyShowMakeupUsed: true, includeUseTimes: false }).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取右侧列表数据
   *
   * @protected
   * @returns
   * @memberof MakeupInfoMapClass
   */
  protected async getRightList() {
    const resp = await api.getImpositionTemplateList(this.ServerID).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }

  /**
   * 获取映射列表数据
   *
   * @protected
   * @returns
   * @memberof MakeupInfoMapClass
   */
  protected async getMapList() {
    const temp = {
      ServerID: this.ServerID,
      Type: AssistMappingTypeEnum.MakeupFile,
    };
    const resp = await api.getAssistMappingList(temp).catch(() => null);
    return resp?.data.Status === 1000 ? resp.data.Data : [];
  }
}
