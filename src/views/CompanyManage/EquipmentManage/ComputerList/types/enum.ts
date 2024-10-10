/** 电脑使用状态 */
export enum ComputerUseStateEnum {
  /** 空闲 */
  leisure = 0,
  /** 使用中 */
  inUse = 1,
}

export const ComputerUseStateEnumList = [
  { ID: ComputerUseStateEnum.leisure, Name: '空闲' },
  { ID: ComputerUseStateEnum.inUse, Name: '使用中' },
];
