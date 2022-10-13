export interface IPermissionList {
  [key: string]: {
    HavePomission: boolean,
    Obj: {
      [key: string]: boolean
    }
  }
}

export interface IUser {
  ID: string,
  Name: string,
  PermissionList: IPermissionList,
  Token: string
}
