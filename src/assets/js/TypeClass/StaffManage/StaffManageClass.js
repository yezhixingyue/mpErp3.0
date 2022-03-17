import CommonClassType from '@/store/CommonClassType';
import StaffListContion from './Condition';
import { getValueIsOrNotNumber } from '../../utils/util';
import api from '../../../../api';

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
}
