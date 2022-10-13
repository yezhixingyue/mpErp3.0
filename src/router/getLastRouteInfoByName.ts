import { Route } from 'vue-router';
import routeConfig from './routes/index';
import { IRouteTreeItem } from './types/types';

type GetType = 'last' | 'root' | 'children';

const findNameByList = (list: IRouteTreeItem[], name: string, lastName: string, getType: GetType): string|IRouteTreeItem[] => {
  if (Array.isArray(list)) {
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i];
      if (item.name === name) {
        if (getType === 'children') return item.children;
        return lastName;
      }
      let _lastName = '';
      if (getType === 'last') _lastName = item.name;
      if (getType === 'root') _lastName = lastName;

      const t = findNameByList(item.children, name, _lastName, getType);
      if (t) {
        return t;
      }
    }
  }
  return '';
};

export const getLastRouteInfoByName = (Name: string, getType: GetType = 'last') => { // getType 为last时指返回上一级页面  为root时指返回当前模块的根页面
  if (!Name) return '';
  const { routeTree } = routeConfig;
  for (let i = 0; i < routeTree.length; i += 1) {
    const lv1Route = routeTree[i];
    if (lv1Route.name === Name) return '';
    for (let index2 = 0; index2 < lv1Route.children.length; index2 += 1) {
      const lv2Route = lv1Route.children[index2];
      if (lv2Route.name === Name) return '';
      const t = findNameByList(lv2Route.children, Name, lv2Route.name, getType);
      if (t) {
        return t;
      }
    }
  }
  return '';
};

const findChildren = (children: IRouteTreeItem[]) => {
  const list: string[] = [];
  if (Array.isArray(children)) {
    children.forEach(it => {
      list.push(it.name);
      const _list = findChildren(it.children);
      list.push(..._list);
    });
  }
  return list;
};

export const getChildrenRouteNamesByParentRouteName = (parentRouteName: string) => {
  if (!parentRouteName) return '';
  const { routeTree } = routeConfig;
  for (let i = 0; i < routeTree.length; i += 1) {
    const lv1Route = routeTree[i];
    for (let index2 = 0; index2 < lv1Route.children.length; index2 += 1) {
      const lv2Route = lv1Route.children[index2];
      if (lv2Route.name === parentRouteName) {
        return findChildren(lv2Route.children);
      }
      const t = findNameByList(lv2Route.children, parentRouteName, lv2Route.name, 'children');
      if (t && typeof t === 'object') return findChildren(t);
    }
  }
  return '';
};

export const modulePageNames = routeConfig.routeTree
  .map(it => it.children || null)
  .filter(it => it)
  .reduce((prev, cur) => [...prev, ...cur]).map(it => it.name);

export const getJudgmentWhetherIsSamePage = (newRoute: Route, oldRoute: Route) => {
  if (!newRoute || !oldRoute || !newRoute.name || !oldRoute.name) return false;
  const newRouteRootPageName = modulePageNames.includes(newRoute.name) ? newRoute.name : getLastRouteInfoByName(newRoute.name, 'root');
  const oldRouteRootPageName = modulePageNames.includes(oldRoute.name) ? oldRoute.name : getLastRouteInfoByName(oldRoute.name, 'root');
  return newRouteRootPageName === oldRouteRootPageName;
};

export default getLastRouteInfoByName;
