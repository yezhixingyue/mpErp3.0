import api from '@/api';
import { Condition } from './Condition';
import { IDeveloper } from './types';
import { getDeveloperTableList } from './utils';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { DeveloperStatusEnum } from './enum';
import { useUserStore } from '@/pinia/modules/user';
import { getFormatDateString } from '@/assets/js/utils/util';

/** 开发者列表管理类 */
export class DeveloperListManageClass {
  condition = new Condition()

  list: IDeveloper[] = []

  listNumber = 0

  loading = false

  /** 清空条件筛选项 */
  clearCondition() {
    this.condition = new Condition();
  }

  async getList(Page = 1) {
    this.condition.Page = Page;
    this.list = [];

    // 1. 处理条件转换
    const temp = this.condition.filter();

    // 2. 处理loading 及 执行数据获取
    this.loading = true;
    const resp = await api.getDeveloperList(temp).catch(() => null);
    this.loading = false;

    // 3. 处理结果
    if (resp?.data.Status === 1000) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 审核通过 */
  async check(row: ReturnType<typeof getDeveloperTableList>, cb: () => void) {
    const resp = await api.getDeveloperChecked(row.ID).catch(() => null);

    if (resp?.data.Status === 1000) {
      const callback = () => {
        cb();
        const t = this.list.find(it => it.ID === row.ID);
        if (t) {
          t.Status = DeveloperStatusEnum.Checked;
          const userStore = useUserStore();
          t.Checker = userStore.UserDetail.StaffName;
          t.CheckTime = getFormatDateString();
        }
      };

      MpMessage.dialogSuccess({
        title: '审核通过',
        onOk: callback,
        onCancel: callback,
      });
    }
  }

  /** 审核不通过 */
  async refuse(row: ReturnType<typeof getDeveloperTableList>, Remark: string, cb: () => void) {
    const temp = { ID: row.ID, Remark };
    const resp = await api.getDeveloperRefuse(temp).catch(() => null);
    console.log('row', row.AppNumber);
    if (resp?.data.Status === 1000) {
      const callback = () => {
        cb();
        const t = this.list.find(it => it.ID === row.ID);
        if (t) {
          t.Status = DeveloperStatusEnum.Forbit;
          t.Remark = Remark;
        }
      };

      MpMessage.dialogSuccess({
        title: '已设置为不通过状态',
        onOk: callback,
        onCancel: callback,
      });
    }
  }

  /** 锁定 */
  async lock(row: ReturnType<typeof getDeveloperTableList>) {
    const resp = await api.getDeveloperLock(row.ID, !row.IsLock).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      const title = row.IsLock ? '解锁成功' : '锁定成功';
      const cb = () => {
        const t = this.list.find(it => it.ID === row.ID);
        if (t) t.IsLock = !t.IsLock;
      };
      MpMessage.success({
        title,
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /** 重置密码 */
  async resetPwd(row: ReturnType<typeof getDeveloperTableList>) {
    const resp = await api.getDeveloperResetPassword(row.ID).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      MpMessage.success({
        title: '密码重置成功',
        msg: `[ ${resp.data.Message} ]`,
      });
    }
  }
}
