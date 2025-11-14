import api from '@/api';
import { dialogSuccess, MpMessage } from '@/assets/js/utils/MpMessage';
import { SaleAndProductionListItemPlainType } from './SaleAndProductionListItemClass';

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

  notifyVisible = false;

  setNotifyVisible(val:boolean) {
    this.notifyVisible = val;
  }

  /** 获取服务器数据列表 */
  async getList() {
    this.list = [];

    this.loading = true;
    const resp = await api.getConvertServerList().catch(() => null);
    this.loading = false;

    if (resp?.data.Status === 1000) {
      this.list = resp.data.Data || [];
      this.listNumber = resp.data.DataNumber;
    }
  }

  async removeItem(item: SaleAndProductionListItemPlainType) {
    if (!item.ID) return;
    const resp = await api.getConvertServerRemove(item.ID).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        const i = this.list.findIndex(it => it.ID === item.ID);
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

  async generate(item: SaleAndProductionListItemPlainType) {
    if (!item.ID) return;
    const resp = await api.getServerGenerateSecretKey(item.ID).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        const t = this.list.find(it => it.ID === item.ID);
        if (t) {
          t.PrivateKey = resp.data.Data.PrivateKey;
          t.PublicKey = resp.data.Data.PublicKey;
        }
      };
      MpMessage.success({
        title: '生成成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  async setSmsStop(params: { row: SaleAndProductionListItemPlainType; stopEndTime: string | null }) {
    if (!params.row.ID) return;
    const resp = await api.getConvertServerNotifyReceiveSwitch(params.row.ID, params.stopEndTime).catch(() => null);
    if (resp?.data?.Status === 1000) {
      const cb = () => {
        const t = this.list.find(it => it.ID === params.row.ID);
        if (t) {
          t.StopEndTime = params.stopEndTime;
        }
      };
      dialogSuccess({
        title: params.stopEndTime ? '短信已停发' : '短信通知已恢复',
        onOk: cb,
      });
    }
  }

  constructor() {
    // 此处获取列表数据
    this.getList();
  }

  handleItemChange(item: SaleAndProductionListItemPlainType) {
    let title = this.curEditItem ? '编辑成功' : '添加成功';
    if (this.notifyVisible) title = '设置成功';
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
      this.notifyVisible = false;
    };
    MpMessage.success({
      title,
      onOk: cb,
      onCancel: cb,
    });
  }
}
