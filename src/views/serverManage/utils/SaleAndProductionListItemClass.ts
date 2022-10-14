import api from '@/api';
import { useUserStore } from '@/store/modules/user';
import { getTimeConvertFormat, restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { ServerTypeEnum } from './types';

interface Operator {
  ID: string
  Name: string
}

/**
 * 类：销售和生产服务器列表数据单个项目类
 *
 * @export
 * @class SaleAndProductionListItemClass
 */
export class SaleAndProductionListItemClass {
  ID: '' | number = ''

  Name = ''

  /** 服务器类型：销售端 0  生产端 1  */
  Type = ServerTypeEnum.sales

  /** 服务器地址 */
  Url = ''

  /** 密钥 */
  Key = ''

  /** 关联数量 */
  RelationNumber = 0

  /** 创建人 */
  Operator: null | Operator = null

  /** 创建时间 */
  CreateTime = ''

  constructor(data?: SaleAndProductionListItemPlainType | ServerTypeEnum) {
    if (data) {
      if (typeof data === 'object') {
        restoreInitDataByOrigin(this, data);
      } else {
        this.Type = data;
      }
    }
  }

  async save() {
    const resp = await api.getServerSave(this).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      if (!this.ID && this.ID !== 0) { // 新增  需要给ID、CreateTime、Operator 赋值
        this.ID = +resp.data.Data;
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
}

export type SaleAndProductionListItemPlainType = Omit<SaleAndProductionListItemClass, ''>;
