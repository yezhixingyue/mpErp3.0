import api from '@/api';
import { IMessageMember } from '../types';
import { MpMessage } from '@/assets/js/utils/MpMessage';

/** 消息提醒设置管理类 */
export class MessageMemberListManageModel {
  list: IMessageMember[] = []

  loading = false

  visible = false

  async getList() {
    this.loading = true;
    const resp = await api.getMessageMemberList();
    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data;
    }
  }

  async save(item: IMessageMember) {
    const resp = await api.getMessageMemberSave(item);

    if (resp?.data?.isSuccess) {
      const t = this.list.find(it => it.ID === item.ID);

      const cb = () => {
        if (t) {
          t.Types = [...item.Types];
        } else {
          this.list.unshift(item);
        }

        this.visible = false;
      };

      MpMessage.success(t ? '编辑成功' : '添加成功', '', cb, cb);
    }
  }

  async remove(item: IMessageMember) {
    const resp = await api.getMessageMemberRemove(item.ID);
    if (resp?.data?.isSuccess) {
      const cb = () => {
        this.list = this.list.filter(it => it.ID !== item.ID);
      };

      MpMessage.success('删除成功', '', cb, cb);
    }
  }

  staffList: { StaffID: string; StaffName: string }[] = []

  async getStaffList() {
    const resp = await api.getStaffList({ FieldType: 1 }).catch(() => null);

    if (resp?.data?.isSuccess) {
      this.staffList = (resp.data.Data || []).map(it => ({
        StaffID: it.StaffID,
        StaffName: it.StaffName,
      }));
    }
  }
}
