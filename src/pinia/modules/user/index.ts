import { defineStore, DefineStoreOptions } from 'pinia';
import { IUser } from './type';

interface IState {
  UserDetail: null | IUser
}

type IGetters = Record<string, never>;

interface IActions {
  setUserDetail: (userDetail: IUser | null) => void,
}

/** 仓库数据 */
const storeOptions: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'user',
  state: () => ({
    UserDetail: null,
  }),
  actions: {
    setUserDetail(userDetail: IUser | null) { // 登录用户详情
      this.UserDetail = userDetail || null;
    },
  },
};

export const useUserStore = defineStore(storeOptions);
