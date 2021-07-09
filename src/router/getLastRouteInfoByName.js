import routeConfig from './routes';

const findNameByList = (list, name, lastName, getType) => {
  if (Array.isArray(list)) {
    for (let i = 0; i < list.length; i += 1) {
      const item = list[i];
      if (item.name === name) {
        return lastName;
      }
      const _lastName = getType === 'root' ? lastName : item.name;
      const t = findNameByList(item.children, name, _lastName);
      if (t) return t;
    }
  }
  return '';
};


export const getLastRouteInfoByName = (Name, getType = 'last') => { // getType 为last时指返回上一级页面  为root时指返回当前模块的根页面
  if (!Name) return '';
  const { routeTree } = routeConfig;
  for (let i = 0; i < routeTree.length; i += 1) {
    const lv1Route = routeTree[i];
    if (lv1Route.name === Name) return '';
    for (let index2 = 0; index2 < lv1Route.children.length; index2 += 1) {
      const lv2Route = lv1Route.children[index2];
      if (lv2Route.name === Name) return '';
      const t = findNameByList(lv2Route.children, Name, lv2Route.name, getType);
      if (t) return t;
    }
  }
  return '';
};

let modulePageNames = routeConfig.routeTree.map(it => it.children || null).filter(it => it);
modulePageNames = modulePageNames.reduce((prev, cur) => [...prev, ...cur]).map(it => it.name);

export const getJudgmentWhetherIsSamePage = (newRoute, oldRoute) => {
  if (!newRoute || !oldRoute) return false;
  const newRouteRootPageName = modulePageNames.includes(newRoute.name) ? newRoute.name : getLastRouteInfoByName(newRoute.name);
  const oldRouteRootPageName = modulePageNames.includes(oldRoute.name) ? oldRoute.name : getLastRouteInfoByName(oldRoute.name);
  return newRouteRootPageName === oldRouteRootPageName;
};

export default getLastRouteInfoByName;
