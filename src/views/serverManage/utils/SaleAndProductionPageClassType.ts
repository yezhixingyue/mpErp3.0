import api from '@/api';
import { message } from '@/assets/js/message';
import { SaleAndProductionListItemPlainType } from './SaleAndProductionListItemClass';
import { ServerTypeDisplayEnum, ServerTypeEnum } from './types';

export class SaleAndProductionPageClassType {
  list: SaleAndProductionListItemPlainType[] = []

  listNumber = 0

  loading = false

  curEditItem: SaleAndProductionListItemPlainType | null = null

  visible = false

  setVisible(val:boolean) {
    this.visible = val;
  }

  setCurEditItem(item: SaleAndProductionListItemPlainType | null) {
    this.curEditItem = item;
  }

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
      this.list = resp.data.Data || [];
      this.listNumber = resp.data.DataNumber;
    }
  }

  async removeItem(item: SaleAndProductionListItemPlainType) {
    if (typeof item.ID !== 'number') return;
    const resp = await api.getServerRemove(item.ID).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        const i = this.list.findIndex(it => it.ID === item.ID);
        if (i > -1) {
          this.list.splice(i, 1);
          this.listNumber -= 1;
        }
      };
      message.success({
        title: '删除成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  async generate(item: SaleAndProductionListItemPlainType) {
    if (typeof item.ID !== 'number') return;
    const resp = await api.getServerGenerateSecretKey(item.ID).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        const t = this.list.find(it => it.ID === item.ID);
        if (t) {
          t.Key = resp.data.Data;
        }
      };
      message.success({
        title: '生成成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  constructor(type: ServerTypeEnum) {
    this.options.type = type;
    this.options.color = type === ServerTypeEnum.production ? ServerTypeDisplayEnum.productionColor : ServerTypeDisplayEnum.salesColor;
    this.options.title = type === ServerTypeEnum.production ? ServerTypeDisplayEnum.productionTitle : ServerTypeDisplayEnum.salesTitle;
    // 此处获取列表数据
    this.getList();
  }

  handleItemChange(item: SaleAndProductionListItemPlainType) {
    const title = this.curEditItem ? '编辑成功' : '添加成功';
    const cb = () => {
      // 修改列表数据
      if (this.curEditItem) {
        const i = this.list.findIndex(it => it.ID === this.curEditItem?.ID);
        if (i > -1) {
          this.list.splice(i, 1, item);
        }
      } else {
        this.list.unshift(item);
        this.listNumber += 1;
      }
      this.visible = false;
    };
    message.success({
      title,
      onOk: cb,
      onCancel: cb,
    });
  }
}
