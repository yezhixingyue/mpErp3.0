import api from '@/api';
import { IFactoryAccount } from './types';
import { AccountItemRuleForm } from './AccountItemRuleForm';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { MpMessage } from '@/assets/js/utils/MpMessage';

/**
 * 工厂账号列表设置页面类
 *
 * @export
 * @class FactoryAccountListClass
 */
export class FactoryAccountListClass {
  FactoryID: number

  list: IFactoryAccount[] = []

  listNumber = 0

  loading = false

  curEditInfo: { visible: boolean, item: null | IFactoryAccount } = {
    visible: false,
    item: null,
  }

  constructor(FactoryID: number) {
    this.FactoryID = FactoryID;
  }

  async getList() {
    this.list = [];

    this.loading = true;
    const resp = await api.getFactoryAccountList(this.FactoryID).catch(() => null);
    this.loading = false;

    if (resp && resp.data.Status === 1000) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  async submitItem(ruleForm: AccountItemRuleForm) {
    const temp = { ...ruleForm };
    const resp = await api.getFactoryAccountSave(temp).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      const callback = () => {
        if (!temp.CreateTime) temp.CreateTime = getTimeConvertFormat({ date: new Date(), withHMS: true });
        if (!temp.ID) temp.ID = resp.data.Data;

        if (ruleForm.ID) { // 编辑
          const i = this.list.findIndex(it => it.ID === ruleForm.ID);
          if (i > -1) {
            this.list.splice(i, 1, temp);
          }
        } else { // 新增
          this.list.unshift(temp);
          this.listNumber += 1;
        }

        this.curEditInfo.visible = false;
      };

      MpMessage.success({ title: ruleForm.ID ? '编辑成功' : '添加成功', onOk: callback, onCancel: callback });
    }
  }

  async removeItem(this: FactoryAccountListClass, item: IFactoryAccount) {
    const resp = await api.getFactoryAccountRemove(item.ID).catch(() => null);
    if (resp?.data.Status === 1000) {
      const callback = () => {
        const i = this.list.findIndex(it => it.ID === item.ID);
        if (i > -1) {
          this.list.splice(i, 1);
          this.listNumber -= 1;
        }
      };
      MpMessage.success({ title: '删除成功', onOk: callback, onCancel: callback });
    }
  }
}
