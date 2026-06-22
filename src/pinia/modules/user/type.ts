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
    /** 开放平台 */
    PermissionOpenApi?: {
      Obj: {
        BindCustomer: boolean
      },
    }
    /** 抛货管理 */
    PermissionBulkyCargo: IBasicModulePermission
    /** 退款异常 */
    PermissionManageRefund?: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Handle: boolean
      },
    }
    /** 信息提醒设置 */
    PermissionManageMessage?: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      },
    }
  }
}
