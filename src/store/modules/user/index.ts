import { defineStore, DefineStoreOptions } from 'pinia';
import { IUser } from './types';

interface IState {
  user: null | IUser
}

type IGetters = Record<string, never>;

interface IActions {
  setUser: (user: IUser | null) => void;
}

const storeOptions: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'user',
  state: () => ({
    user: null,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
  },
};

export const useUserStore = defineStore(storeOptions);
