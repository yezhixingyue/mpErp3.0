import api from '@/api';
import { getTwoLevelsClassifyDataFromList, IProductClassItem, IProductClassLv1ListItem } from '@/assets/js/utils';
import { getFilterParams } from 'yezhixingyue-js-utils-4-mpzj';
import { TransformerListConditionClass } from './TransformerListConditionClass';
import { IPartChangeParams, IProduct } from './types';

export class TransformerListPageDataClass {
  ServerID = ''

  condition = new TransformerListConditionClass()

  private _productClassList: IProductClassItem[] = []

  productClassLevelList: IProductClassLv1ListItem[] = []

  productList:IProduct[] = []

  productListNumber = 0

  loading = false

  curEditItem: null | IProduct = null

  curPartID = '' // 当curPartID为''时说明设置对象为产品本身，否则就是该部件

  constructor(serverID: string) {
    this.ServerID = serverID;
    this.condition.ServerID = serverID;
    // 1. 获取产品分类数据
    this._getProductClassList();
    // 2. 获取产品列表数据
  }

  setCondtion([[key1], value]: [[keyof TransformerListConditionClass], string | number]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temp: { [key:string]: any } = this.condition;
    temp[key1] = value;
  }

  setCurEditItemAndPart(item: null | IProduct, PartID: string) {
    this.curEditItem = item;
    this.curPartID = PartID;
  }

  handlePartChange(data: IPartChangeParams) {
    if (!this.curEditItem) return;
    const { IsSelected, PartList } = data;
    this.curEditItem.IsSelected = IsSelected;
    const selectedIds = PartList.filter(it => it.IsSelected).map(it => it.ID);
    this.curEditItem.PartList.forEach(p => {
      const part = p;
      part.IsSelected = selectedIds.includes(part.ID);
    });
  }

  /** 获取产品分类列表 */
  private async _getProductClassList() {
    this.loading = true;
    const resp = await api.getProductClassList(this.ServerID).catch(() => null);
    this.loading = false;

    if (resp?.data.Status === 1000) {
      this._productClassList = resp.data.Data;
      if (this._productClassList.length > 0) {
        this.productClassLevelList = getTwoLevelsClassifyDataFromList(this._productClassList);
        this.getProductList();
      }
    }
  }

  /** 获取产品列表  */
  async getProductList(Page = 1) {
    this.condition.Page = Page;
    this.productList = [];

    const temp = getFilterParams(this.condition);

    this.loading = true;
    const resp = await api.getProductList(temp).catch(() => null);
    this.loading = false;

    if (resp?.data.Status === 1000) {
      this.productList = resp.data.Data;
      this.productListNumber = resp.data.DataNumber;
    }
  }
}

export type TransformerListPageDataPlainType = Omit<TransformerListPageDataClass, '_getProductClassList'>