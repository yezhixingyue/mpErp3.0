/** 帮助文档文字类型接口类型 */
export interface IDocClass {
  id: number
  /** 名称 */
  categoryName: string
  /** 等级 */
  categoryLevel: number
  categoryParentID: number
  /** 排序 */
  categoryOrder: number
}

export interface IClassTreeItem extends IDocClass {
  children?: IClassTreeItem[]
}
