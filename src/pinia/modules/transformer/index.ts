import api from '@/api';
import { defineStore, DefineStoreOptions } from 'pinia';
import { LineMapItemClass } from '@/views/transformer/assistTypeSetupPages/lineMap/LineMapItemClass';
import { SaleAndProductionListItemPlainType } from '@/views/serverManage/utils/SaleAndProductionListItemClass';
import { GeneralMapDataClass } from './map/GeneralMapDataClass';
import { TransformerListPageDataClass, TransformerListPageDataPlainType } from './TransformerListPageDataClass';
import { OtherSetupListClass } from '@/views/transformer/assistTypeSetupPages/otherSetupViews/js/OtherSetupListClass';

export interface IListPageTableList {
  data: GeneralMapDataClass,
  title: string,
  buttonContent: string,
  remark: string,
  rightText?: string,
  operationTitle?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderColumns?: (item: any) => void
}

interface IState {
  TransformerListPageData: null | TransformerListPageDataClass
  convertServerList: SaleAndProductionListItemPlainType[]
  GeneralMapDataClassData: null | GeneralMapDataClass | LineMapItemClass
  OtherSetupListClassData: OtherSetupListClass | null
}

type IGetters = Record<string, never>;

interface IActions {
  setTransformerListPageData: (serverID: string | null) => void,
  setGeneralMapDataClassData: (data: GeneralMapDataClass | null) => void,
  getConvertServerList: () => void,
  setOtherSetupListClassData: (data: TransformerListPageDataPlainType) => void
}

/** 仓库数据 */
const storeOptions: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'transformer',
  state: () => ({
    TransformerListPageData: null,
    GeneralMapDataClassData: null, // GeneralMapDataClass
    convertServerList: [],
    loading: false,
    OtherSetupListClassData: null, // 转换设置 - 其它设置模块 - 存储使用的数据信息
  }),
  actions: {
    setTransformerListPageData(serverID: string | null) { // 设置当前转换数据（类内部获取远程数据）
      this.TransformerListPageData = serverID ? new TransformerListPageDataClass(serverID) : null; // 此处需要传递入转换器ID？
    },
    setGeneralMapDataClassData(data: GeneralMapDataClass | null) {
      this.GeneralMapDataClassData = data;
    },
    async getConvertServerList() {
      this.convertServerList = [];
      const resp = await api.getConvertServerList().catch(() => null);
      if (resp?.data.Status === 1000) {
        this.convertServerList = resp.data.Data;
      }
    },
    setOtherSetupListClassData(data) {
      this.OtherSetupListClassData = new OtherSetupListClass(data);
    },
  },
};

export const useTransformerStore = defineStore(storeOptions);
