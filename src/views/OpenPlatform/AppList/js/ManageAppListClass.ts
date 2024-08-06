import api from '@/api';
import { Message } from 'element-ui';
import { Condition } from './Condition';
import { IApplication } from './type';

export class ManageAppListClass {
  condition = new Condition()

  list: IApplication[] = []

  listNumber = 0

  loading = false

  async getList(Page = 1) {
    this.condition.Page = Page;
    this.list = [];

    this.loading = true;
    const resp = await api.getApplicationList(this.condition).catch(() => null as null);
    this.loading = false;

    if (resp?.data.Status === 1000) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  bindVisible = false

  currentItem: null | IApplication = null

  /** 绑定IP和客户 */
  async submitBind(data) {
    const resp = await api.getDeveloperBindCustomer(data);

    if (resp?.data?.isSuccess) {
      Message.success('设置成功');
      this.bindVisible = false;

      const i = this.list.findIndex(it => it.ID === data.ID);
      if (i < 0) return;

      const temp = { ...this.list[i] };
      if (!temp.Customer) {
        temp.Customer = { Name: '', Mobile: '' };
      }

      temp.BindIP = data.BindIP;
      temp.Customer.Mobile = data.Customer.Mobile;
      temp.Customer.Name = resp.data.Data || '';

      this.list.splice(i, 1, temp);
    }
  }
}
