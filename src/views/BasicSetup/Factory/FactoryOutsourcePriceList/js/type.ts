/** 外购工厂产品价格设置条目 */
export interface IFactoryProductPrice {
  FactoryID: number

  Product: {
    FirstLevelID: number
    SecondLevelID: number
    ProductID: string
    ProductName: string
  }

  /** 外购价格方案 */
  Price: null | { ID: string; Name: string }

  /** 0 - 1000 不允许小数 */
  Discount: number | null
}
