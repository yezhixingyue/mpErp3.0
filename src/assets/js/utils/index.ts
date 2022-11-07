export interface IProductClassItem {
  ID: number
  Index: number
  Name: string
  ParentID: number
  Level: number
}

export interface IProductClassLv1ListItem extends IProductClassItem {
  children: IProductClassItem[]
}

export const getTwoLevelsClassifyDataFromList = (list: IProductClassItem[], bool?: boolean) => {
  if (!list || !Array.isArray(list) || list.length === 0) return [];

  let level1List: IProductClassLv1ListItem[] = list // 挑选第一级分类
    .filter(item => item.Level === 1)
    .map(item => ({ ...item, children: [] }))
    .sort((a, b) => a.Index - b.Index);
  // 设置第二级分类
  level1List.forEach(level1 => {
    const _list = list.filter(item => item.Level === 2 && item.ParentID === level1.ID).sort((a, b) => a.Index - b.Index);
    const _level1 = level1;
    _level1.children = _list;
  });
  // 筛选去除无下属产品的分类 bool --- 确定是否保留无下属产品分类 （当设置排序时不应删除） 为true时不删除
  if (!bool) level1List = level1List.filter(leve1 => leve1.children.length > 0);

  return level1List;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type setConditionParams = [[string, string | undefined], any];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setConditionFunc = ([[key1, key2], val]: setConditionParams, condition: { [key: string]: any }) => { // 设置条件值
  if (!condition || typeof condition !== 'object') {
    throw new Error('condition is an invalid parameter');
  }

  if (!key1 || !Object.hasOwnProperty.call(condition, key1)) {
    throw new Error('key1 is an invalid parameter');
  }

  if (key2 && !Object.hasOwnProperty.call(condition[key1], key2)) {
    throw new Error('key2 is an invalid parameter');
  }

  const _condition = condition;

  if (key2) {
    _condition[key1][key2] = val;
  } else {
    _condition[key1] = val;
  }
};
