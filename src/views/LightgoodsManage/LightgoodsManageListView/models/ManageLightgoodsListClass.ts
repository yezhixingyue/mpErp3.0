import api from '@/api';
import { IBaseProduct, ILightgoodsProduct } from '../../types/types';
import { LightgoodsListCondition } from './LightgoodsListCondition';
import { MpMessage } from '@/assets/js/utils/MpMessage';

export class ManageLightgoodsListClass {
  condition = new LightgoodsListCondition()

  list: ILightgoodsProduct[] = []

  listNumber = 0

  loading = false

  clearConditon() {
    this.condition = new LightgoodsListCondition();
  }

  async getList(Page = 1) {
    this.condition.Page = Page;

    this.list = [];
    const temp = this.condition.filter();

    this.loading = true;
    const resp = await api.lightgoodsApis.getLightgoodsProductList(temp);
    this.loading = false;

    if (resp.data.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  async addProduct(product: IBaseProduct) {
    if (!product) return false;

    const resp = await api.lightgoodsApis.getLightgoodsProductSetup(product.ID);
    if (resp?.data.isSuccess) {
      const temp: ILightgoodsProduct = {
        ProductID: product.ID,
        ProductName: product.Name,
        SolutionNumber: 0,
        CategoryList: product.ClassifyList,
      };

      this.list.unshift(temp);
      this.listNumber += 1;
      this.lightgoodsPoductIds.push(product.ID);

      return true;
    }

    return false;
  }

  async removeProduct(row: ILightgoodsProduct) {
    const resp = await api.lightgoodsApis.getLightgoodsProductRemove(row.ProductID);
    if (resp?.data.isSuccess) {
      const cb = () => {
        this.list = this.list.filter(it => it.ProductID !== row.ProductID);
        this.listNumber -= 1;
        this.lightgoodsPoductIds = this.lightgoodsPoductIds.filter(id => id !== row.ProductID);
      };

      MpMessage.success('删除成功', undefined, cb, cb);
    }
  }

  /** 所有抛货产品id集合 */
  lightgoodsPoductIds: string[] = []

  setLightgoodsPoductIds(ids: string[]) {
    this.lightgoodsPoductIds = ids;
  }
}
