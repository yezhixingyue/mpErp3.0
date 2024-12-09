import { mpEquipmentApi } from '@/api/equipment';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ICallinStateInfo, IRemarkSubmitParams, TEquipment } from '../types';
import { EquipmentHistoryTypeEnum, EquipmentStatusEnum } from '../types/enum';
import { EquipRemarkDialogManageClass } from './EquipRemarkDialogManageClass';
import { ManageEquipmentListClass } from './ManageEquipmentListClass';
import { EquipmentFormClass } from './ruleForm/EquipmentFormClass';

/** 单个设备项目的增删改查相关处理 */
export class EquipmentItemHandler {
  target: TEquipment = null

  protected visible = false // 保存弹窗使用

  setVisible(item?: TEquipment | null) {
    this.target = item || null;
    this.visible = !this.visible;
  }

  // 备注弹窗使用
  remarkDiaManageData = new EquipRemarkDialogManageClass()

  params: ReturnType<EquipmentFormClass['getParams']> | null = null

  // 新增 | 编辑
  onSave(params: ReturnType<EquipmentFormClass['getParams']>) { // 新增 | 编辑
    this.params = params;

    this.remarkDiaManageData.open(this.target ? EquipmentHistoryTypeEnum.update : EquipmentHistoryTypeEnum.create);
  }

  // 新增 | 编辑 提交请求
  async saveSubmit(localManageData: ManageEquipmentListClass, remarkData: IRemarkSubmitParams) { // 新增 | 编辑
    if (!this.params) return;

    const resp = await mpEquipmentApi.getEquipmentSave({ params: this.params, remarkData });

    if (resp.data.isSuccess) {
      const cb = () => {
        if (this.target) { // 编辑
          const i = localManageData.list.findIndex(it => it.id === this.target.id);
          if (i > -1) {
            localManageData.list.splice(i, 1, resp.data.Data);
          }
        } else {
          const _localManageData = localManageData;
          _localManageData.listNumber += 1;
          if (localManageData.condition.Type === '' || localManageData.condition.Type === resp.data.Data.type) {
            _localManageData.list.unshift(resp.data.Data);
          }
        }

        this.remarkDiaManageData.close();
        this.setVisible();
      };

      MpMessage.success({
        title: this.target ? '编辑成功' : '添加成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  // 改变设备状态
  async changeState(data: Pick<TEquipment, 'id' | 'status' | 'user'>, remarkData: IRemarkSubmitParams) { // 改变设备状态
    if (!data || !remarkData) return;

    const resp = await mpEquipmentApi.getEquipmentChangeState({ data, remarkData }).catch(() => null);

    if (resp?.data?.isSuccess) {
      const result: TEquipment = resp.data.Data;
      const cb = () => {
        this.target.status = result.status;
        this.target.user = result.user;
        this.target.updatedAt = result.updatedAt;

        this.remarkDiaManageData.close();
      };

      MpMessage.success({
        title: '设置成功',
        msg: '',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  // 打开备注弹窗
  openRemarkDialog(type: EquipmentHistoryTypeEnum, item: TEquipment) {
    this.target = item;

    this.remarkDiaManageData.open(type);
  }

  // 备注弹窗保存  作废 调出调入 创建 编辑
  remarkSubmit(localListManageData: ManageEquipmentListClass, remarkData: IRemarkSubmitParams, callinStateData?: ICallinStateInfo) {
    switch (remarkData.type) {
      case EquipmentHistoryTypeEnum.create:
        this.saveSubmit(localListManageData, remarkData);
        break;

      case EquipmentHistoryTypeEnum.update:
        this.saveSubmit(localListManageData, remarkData);
        break;

      case EquipmentHistoryTypeEnum.abandon:
        this.changeState({ id: this.target.id, user: null, status: EquipmentStatusEnum.abandoned }, remarkData);
        break;

      case EquipmentHistoryTypeEnum.callout:
        this.changeState({ id: this.target.id, user: null, status: EquipmentStatusEnum.calledout }, remarkData);
        break;

      case EquipmentHistoryTypeEnum.callin:
        this.changeState({ id: this.target.id, ...callinStateData }, remarkData);
        break;

      default:
        break;
    }
  }
}
