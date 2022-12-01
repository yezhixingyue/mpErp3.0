import CommonClassType from '@/store/CommonClassType';

export interface IProductClassItem {
  ID: number
  Index: number
  ClassName: string
  ParentID: number
  Level: number
}

export interface IProductClassLv1ListItem extends IProductClassItem {
  children: IProductClassItem[]
}

export const { getTwoLevelsClassifyDataFromList } = CommonClassType;

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
