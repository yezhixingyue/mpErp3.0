import api from '@/api';
import { Condition } from './Condition';
import { IMRProduct } from './types';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useUserStore } from '@/pinia/modules/user';

const getStaffName = () => useUserStore().UserDetail?.StaffName || '';

/** 制作需求设置类 - 生成产品名称序列化设置 */
export class FactorySerializationClass {
  condition = new Condition()

  list: IMRProduct[] = []

  listNumber = 0

  loading = false

  async getList(Page = 1) { // 获取列表数据
    this.condition.Page = Page;

    this.loading = true;
    const resp = await api.getProductMRList(this.condition.getParams()).catch(() => null);
    this.loading = false;

    if (resp?.data.Status === 1000) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  currentItem: null | IMRProduct = null

  orderVisible = false

  productVisible = false

  onSetupClick(item: IMRProduct, type: 'order' | 'product') {
    this.currentItem = item;
    if (type === 'order') this.orderVisible = true;
    if (type === 'product') this.productVisible = true;
  }

  async setupMROrder(data: Pick<IMRProduct, 'ShowOrderID' | 'ShowOrderName' | 'ShowPeriod'>) {
    if (!this.currentItem) return;

    const temp = { ID: this.currentItem.ID, ...data };

    const resp = await api.getProductSetupMROrder(temp).catch(() => null);

    if (resp?.data.Status === 1000) {
      const callback = () => {
        this.orderVisible = false;
        const i = this.list.findIndex(it => it.ID === temp.ID);
        if (i > -1) {
          this.list.splice(i, 1, { ...this.list[i], ...temp, HaveSetupOrder: true, Operator: getStaffName() });
        }
      };

      MpMessage.success({
        title: '保存成功',
        onOk: callback,
        onCancel: callback,
      });
    }
  }

  async setupMRProduct(data: IMRProduct) {
    if (!this.currentItem) return;

    const resp = await api.getProductSetupMRProduct(data).catch(() => null);

    if (resp?.data.Status === 1000) {
      const callback = () => {
        this.productVisible = false;
        const i = this.list.findIndex(it => it.ID === data.ID);
        if (i > -1) {
          this.list.splice(i, 1, { ...this.list[i], HaveSetupProduct: true, HaveChange: false, Operator: getStaffName() });
        }
      };

      MpMessage.success({
        title: '保存成功',
        onOk: callback,
        onCancel: callback,
      });
    }
  }
}
