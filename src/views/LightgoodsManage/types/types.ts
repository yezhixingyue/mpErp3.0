import { IBaseProperty } from '@/assets/types';
import { ProductClassifyTypeEnum } from './enum';
import { IConstraint } from '@/pinia/modules/transformer/map/types';

export interface IBaseProduct extends IBaseProperty<string> {
  ClassifyList: [
    {
      Type: ProductClassifyTypeEnum.helpOrder
      FirstLevel: IBaseProperty<number>
      SecondLevel: IBaseProperty<number>
    },
    {
      Type: ProductClassifyTypeEnum.selfOrder
      FirstLevel: IBaseProperty<number>
      SecondLevel: IBaseProperty<number>
    },
  ]
  ShowName: string
  /** 是否为抛货产品 */
  IsBuckyCargo: boolean
}

/** 抛货产品 */
export interface ILightgoodsProduct {
  ProductID: string
  ProductName: string
  SolutionNumber: number
  CategoryList: IBaseProduct['ClassifyList']
}

/** 容器规格表 - 表数据 */
export interface ILightgoodsProductSolutionTableItem {
  ID: string
  /** 最小值 */
  MinValue: number
  /** 最大值 */
  MaxValue: number
  /** 长 */
  Length: number
  /** 宽 */
  Width: number
  /** 高 */
  Height: number
}

/** 抛货产品方案 */
export interface ILightgoodsProductSolution {
  ID: string
  Name: string
  /** 序号 */
  // Index: number
  ProductID: string
  Constraint: IConstraint | null
  /** 优先级 */
  Priority: number
  /** 容器规格表 - 设置数据 */
  InputContent: string
  /** 容器规格表 - 区间对比符号 */
  Operator: { First: number; Second: number } | null
  /** 容器规格表 - 表数据 */
  DataList: ILightgoodsProductSolutionTableItem[]
  Formula: unknown | null
}

/** 给一个类型上值类型为number的字段增加''类型  */
export type AddEmptyString4Number<T> = {
  [K in keyof T]: T[K] extends number | null | undefined ? T[K] | '': T[K]
};

/** 给一个类型上值类型为boolean的字段增加''类型  */
export type AddEmptyString4Boolean<T> = {
  [K in keyof T]: T[K] extends boolean | null | undefined ? T[K] | '': T[K]
};

/** 去除类的私有属性 */
/** 给一个类型上值类型为number的字段增加''类型  */
export type RemovePrivateAttr<T> = {
  [K in keyof T]: T[K]
};
