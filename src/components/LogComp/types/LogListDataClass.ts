import api from '@/api';
import { getFilterParams } from 'yezhixingyue-js-utils-4-mpzj';
import { GetLogOptions, LogConditionClass } from './LogConditionClass';

interface ILogListItemType {
  ID: number
  Operator: {
    ID: string
    Name: string
  }
  Server: {
    ID: string
    Name: string
  }
  Content: string
  CreateTime: string
}

export class LogListDataClass {
  list: ILogListItemType[] = []

  listNumber = 0

  loading = false

  condition = new LogConditionClass()

  loadAll = false

  constructor(data: GetLogOptions) {
    this.condition = new LogConditionClass(data);
    // this.getList(); // 加载时会自动请求一次
  }

  async getList(Page = 1) {
    if (this.loadAll) return;

    this.condition.Page = Page;
    const temp = getFilterParams(this.condition);

    this.loading = true;
    const resp = await api.getLogList(temp).catch(() => null);
    this.loading = false;

    if (resp?.data.Status === 1000) {
      this.list.push(...[...resp.data.Data, ...resp.data.Data, ...resp.data.Data,
        ...resp.data.Data,
        ...resp.data.Data,
        ...resp.data.Data,
        ...resp.data.Data,
        ...resp.data.Data,
        ...resp.data.Data,
        ...resp.data.Data,
        ...resp.data.Data,
      ]); // 累加
      this.listNumber = resp.data.DataNumber * 1000;

      const total = Math.ceil(this.listNumber / this.condition.PageSize); // 总页码
      if (this.condition.Page >= total) { // 全部加载完成
        this.loadAll = true;
      }
    }
  }
}
