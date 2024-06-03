import { defineStore, DefineStoreOptions } from 'pinia';
import { getTwoLevelsClassifyDataFromList, IProductClassItem, IProductClassLv1ListItem } from '../transformer/utils';
import api from '@/api';

interface IState {
  productClassList4Staff: IProductClassItem[]
  productClassLevelList4Staff: IProductClassLv1ListItem[]

  productClassList4Customer: IProductClassItem[]
  productClassLevelList4Customer: IProductClassLv1ListItem[]

}

type IGetters = Record<string, never>;

interface IActions {
  getProductClassList: (Key?: number) => Promise<void>
}

/** 仓库数据 */
const storeOptions: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'global',
  state: () => ({
    /** 代客下单产品分类数据
    --------------------------------- */
    productClassList4Staff: [],
    productClassLevelList4Staff: [],
    /** 自主上传产品分类数据
    --------------------------------- */
    productClassList4Customer: [],
    productClassLevelList4Customer: [],
  }),
  actions: {
    async getProductClassList(Key = 6, classList: IProductClassItem[] = []) { // 获取产品分类列表数据 - 区分 代客下单 | 自主上传
      if (Key === 6 && this.productClassList4Staff.length && this.productClassLevelList4Staff.length) {
        return;
      }

      if (Key === 2 && this.productClassList4Customer.length && this.productClassLevelList4Customer.length) {
        return;
      }

      let _classList = classList;

      if (!classList.length) {
        const resp = await api.getVersionValid({ Key, Value: -1 }).catch(() => null);

        if (resp?.data.Status === 1000) {
          _classList = resp.data.Data;
        }
      }

      if (_classList.length > 0) {
        const classLevelList = getTwoLevelsClassifyDataFromList(_classList);

        if (Key === 6) {
          this.productClassList4Staff = _classList;
          this.productClassLevelList4Staff = classLevelList;
        }

        if (Key === 2) {
          this.productClassList4Customer = _classList;
          this.productClassLevelList4Customer = classLevelList;
        }
      }
    },
  },
};

export const useGlobalStore = defineStore(storeOptions);
