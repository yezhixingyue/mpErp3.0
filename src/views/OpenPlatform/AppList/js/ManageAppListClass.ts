import api from '@/api';
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
}
