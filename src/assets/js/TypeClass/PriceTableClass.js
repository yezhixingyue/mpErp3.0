/**
 * @description: 价格表类
 * @param {*}
 * @return {*}
 */
export default class PriceTableClass {
  ID = '';

  PriceID = '';

  SolutionID = '';

  Unit = '';

  Constraint = null;
  // {
  //   ConstraintID: '',
  //   FilterType: 1,
  //   ItemList: [],
  // }

  Priority = '';

  XAxis = {
    Property: null,
    Operator: 0, // ?
    InputContent: '',
    IsCumsum: false, // 分段累加吗
    List: [],
    // {
    //   ID:"",
    //   SolutionID:"",
    //   TableID:"",
    //   IsXAxis:true,
    //   Index:0,
    //   Value:"",
    //   Values:[
    //     {
    //       First:"",
    //       Second:""
    //     }
    //   ]
    // }
  }

  YAxis = {
    Property: null,
    Operator: 0, // ?
    InputContent: '',
    IsCumsum: false, // 分段累加吗
    List: [],
  }

  ElementList = []; // 其它数据
  // {
  //   Unit:"",
  //   Index:0,
  //   ID:"",
  //   Name:""
  // }

  PriceList = [];
  // {
  //   XAxisID:"",
  //   YAxisID:"",
  //   List:[
  //     {
  //       First:"",
  //       Second:0
  //     }
  //   ]
  // }

  FormulaList = [];

  constructor(initData) {
    if (!initData || Object.prototype.toString.call(initData) !== '[object Object]') return;
    const { ID, PriceID, SolutionID, Unit, Constraint, Priority, XAxis, YAxis, ElementList, PriceList, FormulaList } = initData;
    if (ID) this.ID = ID;
    if (PriceID) this.PriceID = PriceID;
    if (SolutionID) this.SolutionID = SolutionID;
    if (Unit) this.Unit = Unit;
    if (Constraint) this.Constraint = Constraint;
    if (Priority || Priority === 0) this.Priority = Priority;
    if (XAxis) this.XAxis = XAxis;
    if (YAxis) this.YAxis = YAxis;
    if (Array.isArray(ElementList)) this.ElementList = ElementList;
    if (Array.isArray(PriceList)) this.PriceList = PriceList;
    if (Array.isArray(FormulaList)) this.FormulaList = FormulaList;
  }
}
