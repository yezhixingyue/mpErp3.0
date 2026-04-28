import api from '@/api';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/filters';
import { BillAccountEnumList } from '@/packages/enums/billEnumList.js';
import { IRefundExceptionItem } from '../types';
import { RefundExceptionCondition } from './Condition';
import { RefundApplyChannelEnumList, RefundExceptionStatusEnum } from '../types/enum';
import { MyMessage } from '@/basic/message';
import { getFormatDateString } from '@/assets/js/utils/util';

const getRefundExceptionItemFormat = (it: IRefundExceptionItem) => ({
  ...it,
  /** 订单付款时间 */
  _PayTime: format2MiddleLangTypeDateFunc2(it.PayTime),
  /** 申请退款时间 */
  _ApplyTime: format2MiddleLangTypeDateFunc2(it.ApplyTime),
  /** 原支付账户 */
  _QRAccountText: BillAccountEnumList.find(_it => _it.ID === it.QRAccount)?.Name || '',
  /** 申请退款渠道 网页|移动端|客服 */
  _ChannelText: RefundApplyChannelEnumList.find(_it => _it.ID === it.Channel)?.Name || '',
});

export type RefundExceptionTableRow = ReturnType<typeof getRefundExceptionItemFormat>;

export class ManageRefundExceptionListModel {
  condition = new RefundExceptionCondition()

  list: RefundExceptionTableRow[] = []

  listNumber = 0

  loading = false

  clearCondition() {
    this.condition = new RefundExceptionCondition();
  }

  async getList(Page = 1) {
    if (!this.condition) return;

    this.condition.Page = Page;

    this.list = [];

    this.loading = true;

    const temp = this.condition.filter();
    const resp = await api.getRefundOriginalAccountList(temp).catch(() => null);

    this.loading = false;
    if (resp?.data.Status === 1000) {
      this.list = resp.data.Data.map((it: IRefundExceptionItem) => getRefundExceptionItemFormat(it));

      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 手动处理 */
  async manualProcess(item: RefundExceptionTableRow, StaffName: string) {
    const resp = await api.getRefundOriginalAccountHandle(item.ID);
    if (resp.data.isSuccess) {
      MyMessage.success({
        title: '处理成功',
        onClose: () => {
          const t = this.list.find(it => it.ID === item.ID);
          if (t) {
            t.Status = RefundExceptionStatusEnum.ManualProcessed;
            t.FinishTime = getFormatDateString();
            t.OperatorName = StaffName;
          }
        },
      });
    }
  }
}
