import api from '@/api';
import { IFactoryProductPrice } from './type';
import { MpMessage } from '@/assets/js/utils/MpMessage';

/** 设置外购价格方式枚举 */
export enum PriceSetupTypeEnum {
  /** 不设置 */
  None = 0,
  /** 按照成交价折扣 */
  Discount = 1,
  /** 使用外购报价方案 */
  PriceOption = 2,
}

/** 设置外购价格表单类 */
export class PriceSetupRuleForm implements IFactoryProductPrice {
  readonly FactoryID: number

  readonly Product: IFactoryProductPrice['Product']

  Price = { ID: '', Name: '' }

  Discount: number | null = null // 0 - 1000 不允许小数

  _radio = PriceSetupTypeEnum.None

  _PriceOptionList: { ID: string; Name: string }[] = []

  constructor(item: IFactoryProductPrice) {
    this.FactoryID = item.FactoryID;
    this.Product = item.Product;

    if (item.Price) {
      this.Price.ID = item.Price.ID;
      this._radio = PriceSetupTypeEnum.PriceOption;
    } else if (item.Discount || item.Discount === 0) {
      this.Discount = item.Discount;
      this._radio = PriceSetupTypeEnum.Discount;
    }

    this._getPriceOptionList();
  }

  /** 获取提交参数 */
  getParams() {
    const _temp: IFactoryProductPrice = {
      FactoryID: this.FactoryID,
      Product: this.Product,
      Price: null,
      Discount: null,
    };

    if (this._radio === PriceSetupTypeEnum.Discount) {
      // 校验折扣数值
      if (!this.Discount && this.Discount !== 0) {
        MpMessage.error({ title: '保存失败', msg: '折扣数值不能为空' });
        return null;
      }
      if (!/^\d{1,4}$/.test(this.Discount.toString())) {
        MpMessage.error({ title: '保存失败', msg: '折扣数值格式不正确' });
        return null;
      }
      if (this.Discount > 1000) {
        MpMessage.error({ title: '保存失败', msg: '折扣数值最大不能超过1000' });
        return null;
      }

      _temp.Discount = this.Discount;

      return _temp;
    }

    if (this._radio === PriceSetupTypeEnum.PriceOption) {
      if (!this.Price.ID) {
        MpMessage.error({ title: '保存失败', msg: '请选择外购价格' });
        return null;
      }

      const t = this._PriceOptionList.find(it => it.ID === this.Price.ID);

      if (!t) { // 报价方案在列表中寻找不到
        MpMessage.error({ title: '保存失败', msg: '当前选中价格在下拉列表中无法找到' });
        return null;
      }

      this.Price.Name = t.Name;

      _temp.Price = this.Price;

      return _temp;
    }

    return _temp;
  }

  private async _getPriceOptionList() {
    const resp = await api.getProductPriceList(this.Product.ProductID).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      this._PriceOptionList = resp.data.Data;
    }
  }
}
