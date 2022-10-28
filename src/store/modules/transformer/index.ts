import api from '@/api';
import { SwitchListItemPlainType } from '@/views/serverManage/utils/SwitchListItemClass';
import { defineStore, DefineStoreOptions } from 'pinia';
import { GeneralMapDataClass } from './map/GeneralMapDataClass';
import { TransformerListPageDataClass } from './TransformerListPageDataClass';

interface IState {
  TransformerListPageData: null | TransformerListPageDataClass
  convertServerList: SwitchListItemPlainType[]
  GeneralMapDataClassData: null | GeneralMapDataClass
}

type IGetters = Record<string, never>;

interface IActions {
  setTransformerListPageData: (serverID: string | null) => void,
  setGeneralMapDataClassData: (data: GeneralMapDataClass | null) => void,
  getConvertServerList: () => void,
}

/** 仓库数据 */
const storeOptions: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'transformer',
  state: () => ({
    TransformerListPageData: null,
    GeneralMapDataClassData: null, // GeneralMapDataClass
    convertServerList: [],
    loading: false,
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
  },
};

export const useTransformerStore = defineStore(storeOptions);
