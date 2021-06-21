/**
 * @description: 产品部件类
 * @param {*}
 * @return {*}
 */
export default class Part {
  ID = '';

  ProductID = '';

  Name = ''; // 名称

  UseTimes = {
    MinValue: '',
    MaxValue: '',
  }

  CraftList = [];

  ElementList = [];

  MaterialList = []; // 物料列表

  GroupList = [];

  SizeList = [];

  MinNumber = null; // 库存最小数量

  Mobile = null; // 库存预警手机号码

  constructor(initData) {
    if (!initData || Object.prototype.toString.call(initData) !== '[object Object]') return;
    const { ID, ProductID, Name, UseTimes } = JSON.parse(JSON.stringify(initData));
    if (ID) this.ID = ID;
    if (ProductID) this.ProductID = ProductID;
    if (Name) this.Name = Name;
    if (UseTimes && (UseTimes.MinValue || UseTimes.MinValue === 0) && (UseTimes.MaxValue || UseTimes.MaxValue === 0)) this.UseTimes = UseTimes;
  }
}