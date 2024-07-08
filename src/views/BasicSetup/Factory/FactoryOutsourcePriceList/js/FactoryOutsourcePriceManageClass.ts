import api from '@/api';
import { Condition } from './Condition';
import { IFactoryProductPrice } from './type';
import { useGlobalStore } from '@/pinia/modules/global';
import { MpMessage } from '@/assets/js/utils/MpMessage';
// import store from '@/store';
// import { PriceSetupRuleForm, PriceSetupTypeEnum } from './PriceSetupRuleForm';

/** 外购价格设置管理类 */
export class FactoryOutsourcePriceManageClass {
  Factory: { ID: number, Name: string }

  condition: Condition

  loading = false

  list: IFactoryProductPrice[] = []

  constructor(data: { ID: number, Name: string }) {
    this.Factory = data;
    this.condition = new Condition(data.ID);

    this._init();
  }

  /** 设置外购价格保存 */
  async submitPrice(params: IFactoryProductPrice, cb: () => void) {
    const resp = await api.getFactoryProductPriceSave(params).catch(() => null);

    if (resp?.data.Status === 1000) {
      const callback = () => {
        cb();
        // 处理当前列表
        const i = this.list.findIndex(it => it.Product.ProductID === params.Product.ProductID);
        if (i > -1) {
          // let diff = 0;

          // const _oldRadio = new PriceSetupRuleForm(this.list[i])._radio;
          // const _newRadio = new PriceSetupRuleForm(params)._radio;

          // if (_oldRadio === PriceSetupTypeEnum.None && _newRadio !== PriceSetupTypeEnum.None) diff = 1;
          // if (_oldRadio !== PriceSetupTypeEnum.None && _newRadio === PriceSetupTypeEnum.None) diff = -1;

          // if (diff !== 0) {
          //   // 处理工厂列表ProductNumber数据
          //   const _factoryList = (store.state as any).common.factoryList;
          //   const _targetFactory = _factoryList.find(it => it.FactoryID === params.FactoryID);
          //   if (_targetFactory) {
          //     const ProductNumber = _targetFactory.ProductNumber + diff;
          //     store.commit('common/setFactoryChange', { type: 'edit', data: { ..._targetFactory, ProductNumber } });
          //   }
          // }

          this.list.splice(i, 1, params);
        }
      };
      MpMessage.success({
        title: '保存成功',
        onOk: callback,
        onCancel: callback,
      });
    }
  }

  private async _init() {
    this.loading = true;
    await Promise.all([this._getList(), this._getClassList()]);
    this.loading = false;
  }

  private async _getList() { // 获取列表数据
    const resp = await api.getFactoryProductPriceList(this.condition).catch(() => null);

    if (resp?.data.Status === 1000) {
      this.list = resp.data.Data;
    }
  }

  private async _getClassList() {
    return useGlobalStore().getProductClassList();
  }
}
