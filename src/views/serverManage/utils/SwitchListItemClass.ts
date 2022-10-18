import api from '@/api';
import { useUserStore } from '@/store/modules/user';
import { getTimeConvertFormat, restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';

interface Operator {
  ID: string
  Name: string
}

interface IServerSide {
  ID: '' | number,
  Name: string,
}

export enum NotifyTypeEnum {
  message = 0,
  WeChat = 1
}

/**
 * 类：转换服务器列表数据单个项目类
 *
 * @export
 * @class SwitchListItemClass
 */
export class SwitchListItemClass {
  ID = ''

  Name = ''

  /** 创建人 */
  Operator: null | Operator = null

  /** 编码 */
  Code = -1

  /** 创建时间 */
  CreateTime = ''

  /** 通知电话 以全角或半角逗号拆分 */
  Mobile = ''

  /** 通知类型 */
  NotifyType = NotifyTypeEnum.message

  /** 销售端信息 */
  SellSide: IServerSide = {
    ID: '',
    Name: '',
  }

  /** 生产端信息 */
  FactorySide: IServerSide = {
    ID: '',
    Name: '',
  }

  constructor(data?: SwitchListItemPlainType) {
    if (data) {
      restoreInitDataByOrigin(this, data);
      if (data.Operator) this.Operator = { ...data.Operator };
    }
  }

  async save() {
    const temp: Partial<SwitchListItemPlainType> = {
      FactorySide: this.FactorySide,
      Name: this.Name,
      SellSide: this.SellSide,
    };
    if (this.ID) {
      temp.ID = this.ID;
    }
    const resp = await api.getConvertServerSave(temp).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      if (!this.ID) { // 新增  需要给ID、CreateTime、Operator 赋值
        this.ID = resp.data.Data.ID;
        this.Code = resp.data.Data.Code;
        this.CreateTime = getTimeConvertFormat({ withHMS: true });
        const userStore = useUserStore();
        this.Operator = {
          ID: userStore.user?.ID || '',
          Name: userStore.user?.Name || '',
        };
      }
      return true;
    }
    return false;
  }

  async setNotify() {
    const temp: Partial<SwitchListItemPlainType> = {
      NotifyType: this.NotifyType,
      Mobile: this.Mobile,
      ID: this.ID,
    };
    const resp = await api.getConvertServerNotifyReceiveSetup(temp).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      // if (!this.ID) { // 新增  需要给ID、CreateTime、Operator 赋值
      //   this.ID = resp.data.Data.ID;
      //   this.Code = resp.data.Data.Code;
      //   this.CreateTime = getTimeConvertFormat({ withHMS: true });
      //   const userStore = useUserStore();
      //   this.Operator = {
      //     ID: userStore.user?.ID || '',
      //     Name: userStore.user?.Name || '',
      //   };
      // }
      return true;
    }
    return false;
  }
}

export type SwitchListItemPlainType = Omit<SwitchListItemClass, 'save' | 'setNotify'>;
