import api from '@/api';
// import { useUserStore } from '@/store/modules/user';
import { getTimeConvertFormat, restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';

interface Operator {
  ID: string
  Name: string
}

export enum NotifyTypeEnum {
  message = 0,
  WeChat = 1
}

/**
 * 类：销售和生产服务器列表数据单个项目类
 *
 * @export
 * @class SaleAndProductionListItemClass
 */
export class SaleAndProductionListItemClass {
  ID = ''

  Name = ''

  /** 服务器地址 */
  Url = ''

  /** 私钥 */
  PrivateKey = ''

  /** 公钥 */
  PublicKey = ''

  /** 关联数量 */
  RelationNumber = 0

  /** 通知类型 */
  NotifyType = NotifyTypeEnum.message

  /** 通知电话 以全角或半角逗号拆分 */
  Mobile = ''

  /** 创建人 */
  Operator: null | Operator = null

  /** 创建时间 */
  CreateTime = ''

  constructor(data?: SaleAndProductionListItemPlainType) {
    if (data) {
      if (typeof data === 'object') {
        restoreInitDataByOrigin(this, data);
        if (data.Operator) this.Operator = { ...data.Operator };
      }
    }
  }

  async save() {
    const temp: Partial<SaleAndProductionListItemPlainType> = {
      Url: this.Url,
      Name: this.Name,
    };
    if (this.ID) {
      temp.ID = this.ID;
    }
    const resp = await api.getConvertServerSave(temp).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      if (!this.ID) { // 新增  需要给ID、CreateTime、Operator 赋值
        this.ID = resp.data.Data;
        this.CreateTime = getTimeConvertFormat({ withHMS: true });
        // const userStore = useUserStore();
        // this.Operator = {
        //   ID: userStore.user?.ID || '',
        //   Name: userStore.user?.Name || '',
        // };
      }
      return true;
    }
    return false;
  }

  async setNotify() {
    const temp: Partial<SaleAndProductionListItemPlainType> = {
      NotifyType: this.NotifyType,
      Mobile: this.Mobile,
      ID: this.ID,
    };
    const resp = await api.getConvertServerNotifyReceiveSetup(temp).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      return true;
    }
    return false;
  }
}

export type SaleAndProductionListItemPlainType = Omit<SaleAndProductionListItemClass, 'save'>;
