interface IBasicModulePermission {
  HavePomission: boolean
  Obj: {
    Query: boolean
    Setup: boolean
  }
}

export interface IUser {
  Mobile: string
  StaffID: string
  StaffName: string
  PermissionList: {
    /** 转换服务器模块 */
    PermissionCheckFileConvertion: IBasicModulePermission
    /** 转换设置模块 */
    PermissionManageConvert: IBasicModulePermission
    /** 回货标签打印 */
    PermissionPrintPackage?: {
      Obj: {
        PrintLimit: boolean
      }
    }
  }
}
