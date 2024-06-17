/** 外购价格设置条件类 */
export class Condition {
  FactoryID: number

  Page = 1

  PageSize = 999

  constructor(FactoryID: number) {
    this.FactoryID = FactoryID;
  }
}
