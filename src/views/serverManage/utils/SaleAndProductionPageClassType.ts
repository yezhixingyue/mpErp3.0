import api from '@/api';
import { SaleAndProductionListItemPlainType } from './SaleAndProductionListItemClass';
import { ServerTypeDisplayEnum, ServerTypeEnum } from './types';

export class SaleAndProductionPageClassType {
  list: SaleAndProductionListItemPlainType[] = []

  listNumber = 0

  loading = false

  options = {
    type: ServerTypeEnum.sales,
    color: ServerTypeDisplayEnum.salesColor,
    title: ServerTypeDisplayEnum.salesTitle,
  }

  /** 获取服务器数据列表 */
  async getList() {
    this.list = [];

    this.loading = true;
    const resp = await api.getServerList(this.options.type).catch(() => null);
    this.loading = false;

    if (resp?.data.Status === 1000) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  constructor(type: ServerTypeEnum) {
    this.options.type = type;
    this.options.color = type === ServerTypeEnum.production ? ServerTypeDisplayEnum.productionColor : ServerTypeDisplayEnum.salesColor;
    this.options.title = type === ServerTypeEnum.production ? ServerTypeDisplayEnum.productionTitle : ServerTypeDisplayEnum.salesTitle;
    // 此处获取列表数据
    this.getList();
  }
}
