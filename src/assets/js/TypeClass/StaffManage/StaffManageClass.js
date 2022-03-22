import CommonClassType from '@/store/CommonClassType';
import StaffListContion from './Condition';
import { getValueIsOrNotNumber, getFormatDateString } from '../../utils/util';
import api from '../../../../api';
// import Staff from './Staff';
import messageBox from '../../utils/message';
import { StaffStatusEnumObj } from './enums';

/**
 * 员工管理页面类
 *
 * @export
 * @class StaffManageClass
 */
export default class StaffManageClass {
  dataList = []

  dataNumber = 0

  condition = new StaffListContion()

  loading = false

  /**
   * 设置条件
   *
   * @param {*} [[key1, key2], value]
   * @returns
   * @memberof StaffManageClass
   */
  setCondition([[key1, key2], value]) {
    if (!key1) return;
    if (key2) {
      this.condition[key1][key2] = value;
    } else {
      this.condition[key1] = value;
    }
  }

  /**
   * 清除条件
   *
   * @memberof StaffManageClass
   */
  clearConditon() {
    this.condition = new StaffListContion();
  }

  /**
   * 获取列表数据
   *
   * @param {number} [Page=1]
   * @memberof StaffManageClass
   */
  async getDataList(Page = 1) {
    const _Page = getValueIsOrNotNumber(Page, true) ? Page : 1;
    this.setCondition([['Page'], _Page]);

    const temp = CommonClassType.filter(this.condition, true);

    this.dataList = [];
    this.loading = true;
    const resp = await api.getStaffList(temp).catch(() => null);
    this.loading = false;

    if (resp && resp.data.Status === 1000) {
      this.dataList = resp.data.Data || [];
      this.dataNumber = resp.data.DataNumber;
    }
  }

  /**
   * 员工删除
   *
   * @param {*} item 员工对象
   * @param {*} index 索引位
   * @returns
   * @memberof StaffManageClass
   */
  async removeItem(item, index, callback) {
    if (!item || !item.StaffID || typeof index !== 'number') return;
    const resp = await api.getStaffRemove(item.StaffID).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      const cb = () => {
        if (callback) callback();
        if (index >= 0) this.dataList.splice(index, 1);
      };
      messageBox.successSingle('删除成功', cb, cb);
    }
  }

  /**
   * 审核员工或修改员工岗位/部门
   *
   * @param {*} item
   * @param {*} index
   * @param {*} callback
   * @returns
   * @memberof StaffManageClass
   */
  async checkOrSetJobSubmit(item, index, Permission, callback) {
    if (!item || !item.StaffID || typeof index !== 'number') return;
    const resp = await api.getCheckStaffPassed(item).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      const cb = () => {
        const temp = item;
        // 修改成功后补充审核人信息
        if (Permission && !temp.CheckUser?.StaffID) {
          temp.CheckUser = { StaffName: Permission.StaffName, StaffID: Permission.StaffID };
        }
        // 如果之前未审核，则修改审核状态为通过 并 补充审核时间为当前时间
        if (temp.Status === StaffStatusEnumObj.pending.ID) {
          temp.Status = StaffStatusEnumObj.approved.ID;
          if (!temp.TimeRecord) {
            temp.TimeRecord = { CheckTime: getFormatDateString() };
          } else {
            temp.TimeRecord.CheckTime = getFormatDateString();
          }
        }
        if (callback) callback();
        if (index >= 0) this.dataList.splice(index, 1, temp);
      };
      messageBox.successSingle('删除成功', cb, cb);
    }
  }

  /**
   * 员工状态修改， 离职|取消离职
   *
   * @param {*} item
   * @param {*} expectStatus 期待的状态
   * @param {*} index
   * @returns
   * @memberof StaffManageClass
   */
  async setItemStatusChange(item, expectStatus, index) {
    if (!item || !item.StaffID || typeof index !== 'number' || typeof expectStatus !== 'number') return;
    const temp = {
      staffID: item.StaffID,
      status: expectStatus,
    };
    const resp = await api.getStaffChangeStatus(temp).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      let title = '设置成功';
      if (expectStatus === StaffStatusEnumObj.leaved.ID) title = '设置离职成功';
      if (expectStatus === StaffStatusEnumObj.approved.ID) title = '取消离职成功';
      const cb = () => {
        if (this.dataList[index]) {
          this.dataList[index].Status = expectStatus;
          // 如果是离职应更新离职时间
          if (expectStatus === StaffStatusEnumObj.leaved.ID) {
            this.dataList[index].TimeRecord.OutTime = getFormatDateString();
          } else if (expectStatus === StaffStatusEnumObj.approved.ID) {
            this.dataList[index].TimeRecord.OutTime = '';
          }
        }
      };
      messageBox.successSingle(title, cb, cb);
    }
  }
}
