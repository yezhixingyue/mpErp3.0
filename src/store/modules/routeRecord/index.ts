import { defineStore, DefineStoreOptions } from 'pinia';
import { Route } from 'vue-router';

interface IState {
  lastPagePaths: Route[]
}

type IGetters = Record<string, never>;

interface IActions {
  setLastPagePaths: (route: Route) => void
  setLastPagePathsFilterAfterGoback: (name: string) => void
}

const storeOptions: DefineStoreOptions<string, IState, IGetters, IActions> = {
  id: 'routeRecord',
  state: () => ({
    lastPagePaths: [], // 上一个页面的path路径
  }),
  actions: {
    setLastPagePaths(route: Route) { // 设置上一个页面的path路径
      this.lastPagePaths = this.lastPagePaths.filter(it => it.name !== route.name);
      this.lastPagePaths.push(route);
    },
    setLastPagePathsFilterAfterGoback(name: string) { // 回转页面信息后删除掉回转前的路由信息,
      this.lastPagePaths = this.lastPagePaths.filter(it => it.name !== name);
    },
  },
};

export const useRouteRecordStore = defineStore(storeOptions);
