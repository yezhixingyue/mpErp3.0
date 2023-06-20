import api from '@/api';
import { getFilterParams } from 'yezhixingyue-js-utils-4-mpzj';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getTwoLevelsClassifyDataFromList, IProductClassItem, IProductClassLv1ListItem } from './utils';
import { TransformerListConditionClass } from './TransformerListConditionClass';
import {
  IFoldingSetupSaveParams,
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

  curInstance: null | IProduct | IPart = null // 当前实例 如果为产品实例则为产品本身 如果为部件实例则为对应部件 如果都不是（设置的是组合数值映射等情况时）则为null

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

  setCurEditItemAndPart(item: null | IProduct, PartID: string) { // PartID可能为产品ID、部件ID 或 空字符串
    this.curEditItem = item;
    this.curPart = item ? item.PartList.find(it => it.ID === PartID) || null : null;

    this.curInstance = null;
    if (this.curPart) this.curInstance = this.curPart;
    else if (PartID && PartID === item?.ID) this.curInstance = this.curEditItem;

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
    const resp = await api.getVersionValid({ Key: 6, Value: -1 }).catch(() => null);
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
    const resp = await api.getConvertServerProductList(temp).catch(() => null);
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
      InstanceID: this.curInstance?.ID,
      SemiFinishedID: SemiFinished.ID,
    };
    const resp = await api.getSemiFinishedSetup(temp).catch(() => null);
    if (resp?.data.Status === 1000) {
      const cb = () => {
        // 处理数据变动
        if (this.curInstance) {
          this.curInstance.SemiFinished = { ...SemiFinished };
        }
        callback();
      };
      MpMessage.success({
        title: '保存成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /** 设置是否需要折手 */
  async getFoldingSetup(NeedFolding: boolean, callback: () => void) {
    const temp: IFoldingSetupSaveParams = {
      ServerID: this.ServerID,
      ProductID: this.curEditItem.ID,
      InstanceID: this.curInstance?.ID,
      NeedFolding,
    };
    const resp = await api.getFoldingSetup(temp).catch(() => null);

    if (resp?.data.Status === 1000) {
      const cb = () => { // 处理数据变动
        if (this.curInstance) {
          this.curInstance.NeedFolding = NeedFolding;
        }
        callback();
      };
      MpMessage.dialogSuccess({ title: '设置成功', onOk: cb, onCancel: cb });
    }
  }
}

export type TransformerListPageDataPlainType = Omit<TransformerListPageDataClass, '_getProductClassList'>
