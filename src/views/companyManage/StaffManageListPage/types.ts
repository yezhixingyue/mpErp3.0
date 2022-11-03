export interface IGetStaffListParams {
  KeyWords: string
  Page: number
  PageSize: number
}

export enum StaffStatusEnum {
  /** 正常 */
  Normal = 0,
  /** 离职 */
  Dimission = 1,
}

export interface IStaff {
  ID: string
  Name: string
  Mobile: string
  Password: string
  Status: StaffStatusEnum
  RegTime: string
}
