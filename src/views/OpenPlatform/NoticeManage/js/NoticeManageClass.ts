import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { Condition } from './Condition';
import { IDeveoperNotice } from './types';

/** 开发平台消息管理 */
export class NoticeManageClass {
  condition = new Condition()

  list: (IDeveoperNotice & { _IsSpread: boolean })[] = []

  listNumber = 0

  loading = false

  /** 发送信息弹窗使用 */
  visible = false

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
    const resp = await api.getDeveloperNoticeList(temp).catch(() => null);
    this.loading = false;

    // 3. 处理结果
    if (resp?.data.Status === 1000) {
      this.list = (resp.data.Data as IDeveoperNotice[]).map(it => ({ ...it, _IsSpread: false }));
      this.listNumber = resp.data.DataNumber;
    }
  }

  submited(data: IDeveoperNotice) { // 新增发送信息
    this.list.unshift({ ...data, _IsSpread: false });
    this.listNumber += 1;
  }

  spread(id: string) {
    const t = this.list.find(it => it.ID === id);

    if (t) t._IsSpread = !t._IsSpread;
  }

  async remove(id: string) {
    const resp = await api.getDeveloperNoticeRemove(id).catch(() => null);

    if (resp?.data.Status === 1000) {
      const cb = () => {
        const i = this.list.findIndex(it => it.ID === id);

        if (i > -1) {
          this.list.splice(i, 1);
          this.listNumber -= 1;
        }
      };

      MpMessage.success({
        title: '删除成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }
}
