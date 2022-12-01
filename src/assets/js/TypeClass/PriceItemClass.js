/**
 * @description: 产品价格单行条目类
 * @param {*}
 * @return {*}
 */
export default class PriceItemClass {
  ID = '';

  Name = '';

  ProductID = '';

  IsOwnPrice = true;

  BasePriceID = '';

  ReferencePriceList = []; // 参考价格列表

  NumberSwapList = []; // 数值转换

  MakeupList = []; // 拼版方案

  CostList = []; // 价格表

  SolutionList = []; // 解决方案列表

  ResultList = []; // 报价结果

  PriceTableList = [];

  CraftPriceList = [];

  IsIncludeIncreasedArea = false; // 是否包含新加大区

  AreaList = []; // 适用价格区域

  IsIncludeIncreasedGrade = false; // 是否包含新加价格等级

  GradeList = []; // 适用价格等级

  constructor(initData) {
    if (!initData || Object.prototype.toString.call(initData) !== '[object Object]') return;
    const { ID, Name, ProductID, IsOwnPrice, BasePriceID, ReferencePriceList, NumberSwapList, MakeupList, CostList, SolutionList, ResultList,
      IsIncludeIncreasedArea, AreaList, GradeList, IsIncludeIncreasedGrade } = initData;
    if (ID) this.ID = ID;
    if (Name) this.Name = Name;
    if (ProductID) this.ProductID = ProductID;
    if (typeof IsOwnPrice === 'boolean') this.IsOwnPrice = IsOwnPrice;
    if (BasePriceID) this.BasePriceID = BasePriceID;
    if (ReferencePriceList && ReferencePriceList.length > 0) this.ReferencePriceList = ReferencePriceList;
    if (NumberSwapList && NumberSwapList.length > 0) this.NumberSwapList = NumberSwapList;
    if (MakeupList && MakeupList.length > 0) this.MakeupList = MakeupList;
    if (CostList && CostList.length > 0) this.CostList = CostList;
    if (SolutionList && SolutionList.length > 0) this.SolutionList = SolutionList;
    if (ResultList && ResultList.length > 0) this.ResultList = ResultList;
    if (IsIncludeIncreasedArea) this.IsIncludeIncreasedArea = IsIncludeIncreasedArea;
    if (AreaList && AreaList.length > 0) this.AreaList = AreaList;
    if (GradeList && GradeList.length > 0) this.GradeList = GradeList;
    if (IsIncludeIncreasedGrade) this.IsIncludeIncreasedGrade = IsIncludeIncreasedGrade;
  }
}
