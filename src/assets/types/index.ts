// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ISetConditionParams = [[string, string | undefined], any];

export interface IBaseProperty<T> {
  ID: T | ''
  Name: string
}

export type localEnumValueIDType = '' | number;

export interface ILocalEnumValue {
  ID: localEnumValueIDType,
  Name: string,
}
