import { DocTypeEnum } from './enum';

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
  children: IClassTreeItem[]
  /** 深度 */
  deep:number
}

/** 文章接口类型 */
export interface IArticle {
  id: string
  categoryID: number
  helpdocuTitle: string
  helpdocuContent: string
  helpdocuType: DocTypeEnum
  helpdocuURL: string
  helpdocuCreatdate: string
  helpdocuEditdate?: string
  helpdocuOrder: number
  internalID: string
  directory: string
}

export type ArticleCommandType = 'remove' | 'view' | 'edit' | 'copy' | 'history' | 'move2out' | 'move';
