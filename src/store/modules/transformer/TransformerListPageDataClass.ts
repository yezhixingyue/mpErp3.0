import api from '@/api';
import { message } from '@/assets/js/message';
import { getTwoLevelsClassifyDataFromList, IProductClassItem, IProductClassLv1ListItem } from '@/assets/js/utils';
import { getFilterParams } from 'yezhixingyue-js-utils-4-mpzj';
import { TransformerListConditionClass } from './TransformerListConditionClass';
import {
  IPart, IPartChangeParams, IProduct, ISemiFinishedSaveParams,
} from './types';

export class TransformerListPageDataClass {
  ServerID = ''

  condition = new TransformerListConditionClass()

  private _productClassList: IProductClassItem[] = []

  productClassLevelList: IProductClassLv1ListItem[] = []

  productList:IProduct[] = []

  productListNumber = 0

  loading = false

  curEditItem: null | IProduct = null

  curPart: null | IPart = null // 当为null时说明设置对象为产品本身，否则就是该部件

  curEditProductName = ''

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
    this.curPart = item ? item.PartList.find(it => it.ID === PartID) || null : null;
    const arr = [];
    if (!item) {
      this.curEditProductName = '';
      return;
    }
    const { Class, Name } = item;
    const { FirstLevel, SecondLevel } = Class;
    if (FirstLevel.Name) arr.push(FirstLevel.Name);
    if (SecondLevel.Name) arr.push(SecondLevel.Name);
    arr.push(Name);
    this.curEditProductName = arr.join('-');
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
    const IsConnectResp = await api.getFactoryIsConnect(this.ServerID).catch(() => null);
    if (!IsConnectResp || IsConnectResp.data.Status !== 1000) {
      this.loading = false;
      return;
    }
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

  /** 设置半成品 */
  async getSemiFinishedSave(SemiFinished: { ID: string, Name: string }, callback: () => void) {
    if (!this.curEditItem) return;
    const temp: ISemiFinishedSaveParams = {
      ServerID: this.ServerID,
      ProductID: this.curEditItem.ID,
      InstanceID: this.curPart ? this.curPart.ID : this.curEditItem.ID,
      SemiFinishedID: SemiFinished.ID,
    };
    const resp = await api.getSemiFinishedSetup(temp).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        // 处理数据变动
        if (this.curPart) {
          this.curPart.SemiFinished = { ...SemiFinished };
        } else if (this.curEditItem) {
          this.curEditItem.SemiFinished = { ...SemiFinished };
        }
        callback();
      };
      message.success({
        title: '保存成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }
}

export type TransformerListPageDataPlainType = Omit<TransformerListPageDataClass, '_getProductClassList'>
