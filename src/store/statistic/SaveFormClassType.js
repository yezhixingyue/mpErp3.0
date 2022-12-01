/* eslint-disable max-len */
import store from '@/store';

const checkMinMaxVal = ([min, max], title) => {
  if (!min && min !== 0) return `请设置${title}最小值`;
  if (!max && max !== 0) return `请设置${title}最大值`;
  if (max < min && max !== -1) return `${title}最大值不能小于最小值`;
  if (max === min && max === 0) return `${title}最大值和最小值不能同时等于0`;
  return true;
};

/**
 * @description: 初始化数据，可转换还原编辑数据
 * @param {*} initData
 * @param {*} formTypeData
 * @return {*}
 */
const getInitFormData = (initData, formTypeData) => {
  const { DataType, ConditionAreaList, ConditionProductList, ConditionOptionList, ConditionRangeList } = initData;
  const temp = { ...formTypeData };
  temp.DataType = DataType;

  const propList = store ? store.state.common.StatisticalRowColumnList.filter(it => it.key) : [];
  const keys = Object.keys(temp);

  keys.forEach(key => {
    const prop = propList.find(item => item.key === key);
    if (prop) {
      if (prop.type === 'ConditionOptionList') {
        const t = ConditionOptionList.find(it => it.First === prop.ID); // 还原订单状态
        if (t) temp[key] = t.Second.map(it => ({ [prop.subKey]: it }));
      } else if (prop.type === 'ConditionRangeList') {
        const t = ConditionRangeList.find(it => it.First === prop.ID); // 订单金额最大最小值
        if (t) temp[key] = [t.Second.MinValue, t.Second.MaxValue];
      } else if (prop.type === 'ConditionProductList') {
        temp[key] = ConditionProductList;
      } else if (prop.type === 'ConditionAreaList') {
        temp[key] = ConditionAreaList;
      }
    }
  });

  return temp;
};

/**
 * @description: 获取订单数据类型表单
 * @param {*} data
 * @return {*}
 */
const getOrderForm = (data) => {
  const temp = {
    DataType: 0, // 数据
    orderStatusList: [], // 订单状态
    orderCreateTypeList: [], // 下单方式
    singleOrderMinMaxValList: [0, -1], // 单个订单金额范围： 最小 - 最大
    ProductList: [], // 选择产品
    AreaList: [], // 区域筛选
    selectUserTypeList: [], // 客户分类
    selectUserRankList: [], // 客户等级
    selectExpressList: [], // 物流方式
  };
  if (!data) return temp;
  return getInitFormData(data, temp);
};

const getCustomerForm = (data) => {
  const temp = {
    DataType: 3, // 数据   客户数量 | null
    AreaList: [], // 区域筛选
    selectCustomerRegistrationTimeList: [], // 注册时间
    selectUserTypeList: [], // 客户类型
    selectUserRankList: [], // 客户等级
    selectCustomerRegistrationTypeList: [], // 注册方式
  };
  if (!data) return temp;
  return getInitFormData(data, temp);
};

const getOrderCustomerFrom = (data) => {
  const temp = {
    DataType: 3, // 数据   客户数量 | null
    orderStatusList: [], // 订单状态
    orderCreateTypeList: [], // 客户下单方式
    orderMinMaxValList: [0, -1], // 客户订单总金额
    orderLossMinMaxValList: [0, -1], // 客户订单损失总金额
    ProductList: [], // 产品筛选
    AreaList: [], // 区域筛选
    selectUserTypeList: [], // 客户类型
    selectUserRankList: [], // 客户等级
    selectExpressList: [], // 物流方式
  };
  if (!data) return temp;
  return getInitFormData(data, temp);
};

const getAfterSalesForm = (data) => {
  const temp = {
    DataType: 2, // 数据   客户数量 | null
    selectAfterSalesOrderTypeList: [], // 售后单类型
    orderCreateTypeList: [], // 下单方式
    singleOrderMinMaxValList: [0, -1], // 单个订单金额
    singleOrderLossMinMaxValList: [0, -1], // 单个订单损失金额
    ProductList: [], // 产品筛选
    AreaList: [], // 区域筛选
    questionList: [], // 问题筛选
    selectUserTypeList: [], // 客户类型
    selectUserRankList: [], // 客户等级
    selectExpressList: [], // 物流方式
  };
  if (!data) return temp;
  return getInitFormData(data, temp);
};

/**
 * @description: 转换数据至可提交数据类型
 * @param {*} data
 * @return {*}
 */
const transformFormData = (data) => {
  if (!data) return '未获取订单表单数据';

  const { DataType } = data;
  const keys = Object.keys(data);
  const temp = { DataType, ConditionOptionList: [], ConditionRangeList: [], ConditionProductList: [], ConditionAreaList: [] };

  const propList = store ? store.state.common.StatisticalRowColumnList.filter(it => it.key) : [];

  let list;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const prop = propList.find(it => it.key === key);
    if (prop) {
      if (prop.type === 'ConditionOptionList') { // 转换选项类型
        if (data[prop.key].length === 0) return prop.errMsg;
        list = data[prop.key].map(it => it[prop.subKey]);
        temp.ConditionOptionList.push({ First: prop.ID, Second: [...list] });
      } else if (prop.type === 'ConditionRangeList') { // 最大最小值类型
        const trueOrErrMsg = checkMinMaxVal(data[prop.key], prop.errMsg);
        if (trueOrErrMsg !== true) return trueOrErrMsg;
        temp.ConditionRangeList.push({ First: prop.ID, Second: { MinValue: data[prop.key][0], MaxValue: data[prop.key][1] } });
      } else if (prop.type === 'ConditionProductList') { // 产品筛选
        if (data[prop.key].length === 0) return prop.errMsg;
        temp.ConditionProductList = [...data[prop.key]];
      } else if (prop.type === 'ConditionAreaList') {
        if (data[prop.key].length === 0) return prop.errMsg; // 区域筛选
        temp.ConditionAreaList = [...data[prop.key]];
      }
    }
  }
  return temp;
};

/**
 * @description: 统计表保存类型
 * @param {*}
 * @return {*}
 */
export default class SaveFormClassType {
  Title = '' // 统计表标题

  Type = 0 // 数据类型

  OrderFormData = getOrderForm(); // 4种表单数据之 订单类型表单

  CustomerFormData = getCustomerForm(); // 客户类型

  OrderCustomerFormData = getOrderCustomerFrom(); // 客户订单类型

  AfterSalesFormData = getAfterSalesForm(); // 售后单 ------------------------------------- 暂缺少问题筛选

  TimeSpan = 0; // 日期分组

  ShowTimeRate = true; // 显示占比 -- 日期分组不为0（不分组）的时候显示

  ShowYoy = true; // 显示同比 --- 只有当日期分组为2（月）的时候显示

  Row = {
    Type: '', // 分组类型
    ShowSummary: true, // 显示汇总
    ShowRate: true, // 显示占比
  }

  Column = {
    Type: '', // 分组类型
    ShowSummary: true, // 显示汇总
    ShowRate: true, // 显示占比
  }

  ChartList = [0] // 图表样式

  SplitType = 0 // 数据拆分

  ID = ''

  constructor(initData) { // 可传参设置初始数据
    if (!initData || typeof initData !== 'object') return;
    const { ID, Title, Type, TimeSpan, ShowTimeRate, ShowYoy, Row, Column, ChartList, SplitType,
      DataType, ConditionAreaList, ConditionProductList, ConditionOptionList, ConditionRangeList } = initData;
    if (ID) this.ID = ID;
    if (Title) this.Title = Title;
    if (Type) this.Type = Type;
    if (TimeSpan) this.TimeSpan = TimeSpan;
    if (ShowTimeRate) this.ShowTimeRate = ShowTimeRate;
    if (ShowYoy) this.ShowYoy = ShowYoy;
    if (Row) this.Row = Row;
    if (Column) this.Column = Column;
    if (ChartList) this.ChartList = ChartList;
    if (SplitType) this.SplitType = SplitType;
    if (!Type && Type !== 0) return;
    const data = { DataType, ConditionAreaList, ConditionProductList, ConditionOptionList, ConditionRangeList };
    switch (Type) { // 转换表单信息
      case 0:
        this.OrderFormData = getOrderForm(data); // 订单
        break;
      case 1:
        this.CustomerFormData = getCustomerForm(data); // 客户
        break;
      case 2:
        this.OrderCustomerFormData = getOrderCustomerFrom(data); // 客户订单
        break;
      case 3:
        this.AfterSalesFormData = getAfterSalesForm(data); // 售后
        break;
      default:
        break;
    }
  }

  /**
   * @description: 处理收集到的数据信息 以转换成适合接口提交的数据形式
   * @param {*} obj 需要转换的数据
   * @return {*} 返回： 1.对象 转换成功后的数据；2.字符串：转换失败的错误信息
   */
  static transform(obj) {
    const { Title, Type } = obj;
    if (!Title) return '请输入统计标题!';
    let subData = null;
    switch (Type) { // 转换表单信息
      case 0:
        subData = transformFormData(obj.OrderFormData); // 订单
        break;
      case 1:
        subData = transformFormData(obj.CustomerFormData); // 客户
        break;
      case 2:
        subData = transformFormData(obj.OrderCustomerFormData); // 客户订单
        break;
      case 3:
        subData = transformFormData(obj.AfterSalesFormData); // 售后
        break;
      default:
        break;
    }
    if (!subData) return '转换表单信息失败，未获取数据类型';
    if (typeof subData === 'string') return subData;
    /**
     * 已有： Type， TimeSpan（日期分组）, ShowTimeRate, ShowYoy, Row, Column, ChartList, SplitType, ID, Title
     * 需要获取： DataType（全部），ConditionAreaList(全部)， ConditionProductList（客户没有，其它有），ConditionRangeList（都有都不同）， ConditionOptionList（都有都不同）
     */

    const { TimeSpan, ShowTimeRate, ShowYoy, Row, Column, ChartList, SplitType, ID } = obj;
    if (ChartList.length === 0) return '请选择图表样式!';

    const temp = { Title, Type, ...subData, TimeSpan, ChartList, SplitType };
    if (temp.TimeSpan) temp.ShowTimeRate = ShowTimeRate;
    if (temp.TimeSpan === 2) temp.ShowYoy = ShowYoy;
    if (Row.Type || Row.Type === 0) temp.Row = Row;
    if (Column.Type || Column.Type === 0) temp.Column = Column;
    if (ID) temp.ID = ID;
    if (temp.Row && temp.Column && temp.TimeSpan && ChartList.includes(2)) return '日期、行、列三个分组都设置有分组时不能选择饼状图';

    return temp;
  }
}
