import api from '../../api';
import { InvoiceStatusEnums } from '../../packages/InvoiceComps/enums';
import { getFormatDateString } from '../../assets/js/utils/util';
import messageBox from '../../assets/js/utils/message';
import store from '..';

/**
 * 需要处理的情况有：
 * 1. 未审核时，可以审核通过（上下2处） 可以驳回 --  个人普票不会到这一步
 * 2. 开票中时，可以开票完成
 * 3. 已开票且为专票时，可以填写邮寄信息然后进行提交
 * 其余情况都仅显示返回按钮
 */

/**
 * 处理时，会对订单详情进行修改，主要修改的内容有：
 * 1. 未审核时，Ⅰ、 如果选择审核通过 -- 修改未审核状态为开票中状态  Ⅱ、如果选择驳回，则修改状态为驳回状态，且补充驳回原因（此处有弹窗交互）
 * 2. 开票中， 点击完成，修改状态为已开票状态
 * 3. 专票已开票时，提交配送企业后，修改为已邮寄状态且补充配送企业和单号信息
 */

// ----------------------------------- 修改状态时，还需要添加对应状态的修改时间（日志记录）

// 写一个类， 实现上面的交互和处理

export default class InvoiceHandlerClass {
  handleTarget = null

  constructor(data = {}) {
    this.handleTarget = data;
  }

  async auditPass() { // 审核
    if (!this.handleTarget || this.handleTarget.InvoiceStatus !== InvoiceStatusEnums.pendingCheck.ID) return;
    const resp = await api.getInvoiceManagePass(this.handleTarget.InvoiceID).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      // 通过成功
      const cb = () => {
        this.handleTarget.InvoiceStatus = InvoiceStatusEnums.makingUp.ID;
        if (!this.handleTarget.InvoiceLog) this.handleTarget.InvoiceLog = [];
        this.handleTarget.InvoiceLog.unshift({
          LogType: InvoiceStatusEnums.makingUp.ID,
          CreateTime: getFormatDateString(),
        });
        this.handleTarget.OperateTime = getFormatDateString();
        this.syncForStore();
      };
      messageBox.successSingle('已审核通过', cb, cb);
    }
  }

  async reject(params) { // 驳回
    if (!params || !this.handleTarget || this.handleTarget.InvoiceStatus !== InvoiceStatusEnums.pendingCheck.ID) return;
    const resp = await api.getInvoiceManageReject(params).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      // 驳回成功
      const cb = () => {
        this.handleTarget.InvoiceStatus = InvoiceStatusEnums.rejected.ID;
        if (!this.handleTarget.InvoiceLog) this.handleTarget.InvoiceLog = [];
        this.handleTarget.InvoiceLog.unshift({
          LogType: InvoiceStatusEnums.rejected.ID,
          CreateTime: getFormatDateString(),
        });
        this.handleTarget.RejectReason = params.Opinion;
        this.handleTarget.OperateTime = getFormatDateString();
        this.syncForStore();
      };
      messageBox.successSingle('已驳回', cb, cb);
    }
  }

  async makeout() { // 开票
    if (!this.handleTarget || this.handleTarget.InvoiceStatus !== InvoiceStatusEnums.makingUp.ID) return;
    const resp = await api.getInvoiceManageComplete(this.handleTarget.InvoiceID).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      const cb = () => {
        this.handleTarget.InvoiceStatus = InvoiceStatusEnums.haveMaked.ID;
        if (!this.handleTarget.InvoiceLog) this.handleTarget.InvoiceLog = [];
        this.handleTarget.InvoiceLog.unshift({
          LogType: InvoiceStatusEnums.haveMaked.ID,
          CreateTime: getFormatDateString(),
        });
        this.handleTarget.OperateTime = getFormatDateString();
        this.syncForStore();
      };
      messageBox.successSingle('已开票完成', cb, cb);
    }
  }

  async cancel(params) { // 取消
    if (!params || !this.handleTarget || this.handleTarget.InvoiceStatus !== InvoiceStatusEnums.makingUp.ID) return;
    // 下方需要更改为取消处理内容
    // const resp = await api.getInvoiceManageComplete(this.handleTarget.InvoiceID).catch(() => null);
    // if (resp && resp.data.Status === 1000) {
    //   const cb = () => {
    //     this.handleTarget.InvoiceStatus = InvoiceStatusEnums.haveMaked.ID;
    //     if (!this.handleTarget.InvoiceLog) this.handleTarget.InvoiceLog = [];
    //     this.handleTarget.InvoiceLog.unshift({
    //       LogType: InvoiceStatusEnums.haveMaked.ID,
    //       CreateTime: getFormatDateString(),
    //     });
    //     this.handleTarget.OperateTime = getFormatDateString();
    //     this.syncForStore();
    //   };
    //   messageBox.successSingle('已开票完成', cb, cb);
    // }
    console.log(params);
    const resp = await api.getInvoiceManageCancel(params).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      // 取消成功
      const cb = () => {
        this.handleTarget.InvoiceStatus = InvoiceStatusEnums.canceled.ID;
        if (!this.handleTarget.InvoiceLog) this.handleTarget.InvoiceLog = [];
        this.handleTarget.InvoiceLog.unshift({
          LogType: InvoiceStatusEnums.canceled.ID,
          CreateTime: getFormatDateString(),
        });
        this.handleTarget.RejectReason = params.Opinion;
        this.handleTarget.OperateTime = getFormatDateString();
        this.syncForStore();
      };
      messageBox.successSingle('已取消', cb, cb);
    }
  }

  async mail(params) { // 邮寄
    if (!params || !this.handleTarget || this.handleTarget.InvoiceStatus !== InvoiceStatusEnums.haveMaked.ID) return;
    const resp = await api.getInvoiceManagePost({ ...params, InvoiceID: this.handleTarget.InvoiceID }).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      const cb = () => {
        this.handleTarget.InvoiceStatus = InvoiceStatusEnums.haveToMail.ID;
        this.handleTarget.ExpressCompany = params.ExpressCompany;
        this.handleTarget.ExpressNumber = params.ExpressNumber;
        if (!this.handleTarget.InvoiceLog) this.handleTarget.InvoiceLog = [];
        this.handleTarget.InvoiceLog.unshift({
          LogType: InvoiceStatusEnums.haveToMail.ID,
          CreateTime: getFormatDateString(),
        });
        this.handleTarget.OperateTime = getFormatDateString();
        this.syncForStore();
      };
      messageBox.successSingle('已邮寄', cb, cb);
    }
  }

  syncForStore() { // 同步仓库中对应列表项的发票状态的改变
    if (!this.handleTarget) return;
    const { InvoiceStatus, ExpressCompany, ExpressNumber, OperateTime, InvoiceLog, RejectReason, InvoiceID } = this.handleTarget;
    const OperaterUserName = store.state.common.Permission.StaffName;
    const temp = { InvoiceStatus, ExpressCompany, ExpressNumber, OperateTime, RejectReason, InvoiceID, OperaterUserName };
    temp.InvoiceLog = [...InvoiceLog];
    store.commit('invoice/setItemStatusChange', temp);
  }
}
