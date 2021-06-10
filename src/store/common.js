/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/**
 * 公共模块，存放一些公共数据 或着 提取出来的列表数据(方便以后有变动时统一修改)
 */
// import { getTimeStamp } from '@/assets/js/util';
import api from '@/api/index';
import messageBox from '../assets/js/utils/message';

const getTwoLevelsClassifyDataFromList = (list, bool) => { // 通过平级的列表数据区分出上下两层的列表数据（用于产品|工艺分类2级列表数据形成树形数据结构）
  if (!list || !Array.isArray(list) || list.length === 0) return [];

  let level1List = list // 挑选第一级分类
    .filter(item => item.Level === 1)
    .map(item => ({ ...item, children: [] }))
    .sort((a, b) => a.Index - b.Index);
  // 设置第二级分类
  level1List.forEach(level1 => {
    const _list = list.filter(item => item.ParentID === level1.ID).sort((a, b) => a.Index - b.Index);
    level1.children = _list;
  });
  // 筛选去除无下属产品的分类 bool --- 确定是否保留无下属产品分类 （当设置排序时不应删除） 为true时不删除
  if (!bool) level1List = level1List.filter(leve1 => leve1.children.length > 0);

  return level1List;
};

export default {
  namespaced: true,
  state: {
    /** 付款列表页面支付状态列表
     ---------------------------------------- */
    PayStatusList: [
      { ID: 1, Name: '待付款' },
      { ID: 2, Name: '已付款' },
      { ID: 255, Name: '已取消' },
    ],
    /** 付款列表页面支付方式列表
     ---------------------------------------- */
    PayTypeList: [
      { name: '不限', ID: '' },
      { name: '货到付款', ID: 0 },
      { name: '支付定金', ID: 1 },
      { name: '在线支付', ID: 2 },
    ],
    /** 服务器地址
     ---------------------------------------- */
    baseurl: 'http://192.168.3.68:8055',
    /** 用于控制全局与个别加载中样式是否显示
     ---------------------------------------- */
    showDefaultLoading: true,
    showSpecialLoading: false,
    /** 付款单超时时间设置， 单位为分钟
     ---------------------------------------- */
    MinuteOfPayTimeout: 24 * 60,
    /** 付款单创建时间
     ---------------------------------------- */
    payOrderCreateTime: null,
    /** 当前时间
     ---------------------------------------- */
    curTime: new Date().getTime(),
    /* 付款单详情信息 到期时间
    -------------------------------*/
    ValidTime: '',
    /* 是否正在加载中
    -------------------------------*/
    isLoading: false,
    /* 放置权限信息
    -------------------------------*/
    Permission: null,
    /* 销售区域相关
    -------------------------------*/
    areaList: [],
    /* 产品类别
    -------------------------------*/
    productList: [],
    /* 产品全部第三级
    -------------------------------*/
    productNames: [],
    /* 用户相关
    -------------------------------*/
    userTypeList: [{ CategoryID: '', CategoryName: '不限' }], // 客户类型
    userRankList: [{ CategoryID: '', CategoryName: '不限' }], // 客户等级
    userTypeListNoneEmpty: [], // 客户类型 -- 不包含不限
    userRankListNoneEmpty: [], // 客户等级 -- 不包含不限
    /* 下单方式相关
    -------------------------------*/
    orderCreateTypeList: [
      { name: '不限', ID: '' },
      { name: '自助上传', ID: 2 },
      { name: '代客下单', ID: 1 },
    ],
    /* 自助下单途径
    -------------------------------*/
    selfHelpOrderTypeList: [
      { name: '不限', ID: '' },
      { name: '客户端', ID: 0 },
      { name: '网页版', ID: 1 },
    ],
    /* 订单状态相关 --- 只用于包裹列表等运单部分状态显示
    -------------------------------*/
    OrderStatusList2Transport: [
      { name: '不限', ID: 0 },
      { name: '待分发', ID: 20 },
      { name: '已分发', ID: 30 },
      { name: '已审稿', ID: 40 },
      { name: '拼版中', ID: 45 },
      { name: '已拼版', ID: 50 },
      { name: '生产中', ID: 55 },
      { name: '未揽收', ID: 60 },
      { name: '已入库', ID: 70 },
      { name: '已发货', ID: 80 },
      { name: '已完成', ID: 200 },
      { name: '已取消', ID: 254 },
      { name: '已过期', ID: 255 },
      { name: '问题件', ID: 35 },
    ],
    /* 接单员列表数据
    -------------------------------*/
    staffList: [],
    /* 物流方式列表数据
    -------------------------------*/
    ExpressList: [],
    /* 活动状态列表
    -------------------------------*/
    PromoteStatusList: [
      { name: '不限', ID: '' },
      { name: '未开始', ID: 0 },
      { name: '进行中', ID: 1 },
      { name: '已结束', ID: 3 },
      { name: '已中止', ID: 2 },
      { name: '已取消', ID: 255 },
    ],
    /* 优惠券发放状态列表
    -------------------------------*/
    CouponProvideStatusList: [
      { name: '不限', ID: '' },
      { name: '未发放', ID: 0 },
      { name: '发放中', ID: 1 },
      { name: '已结束发放', ID: 2 },
    ],
    /* 优惠券使用状态列表
    -------------------------------*/
    CouponUseStatusList: [
      { name: '不限', ID: '' },
      { name: '未开始', ID: 0 },
      { name: '可使用', ID: 1 },
      { name: '已过期', ID: 2 },
    ],
    /* 优惠券码状态列表
    -------------------------------*/
    CouponCodeStatusList: [
      { name: '不限', ID: '' },
      { name: '未激活', ID: 0 },
      { name: '已激活', ID: 1 },
      { name: '已使用', ID: 2 },
      { name: '已删除', ID: 255 },
    ],
    /* 优惠券生成方式列表
    -------------------------------*/
    CouponGenerateTypeList: [
      { name: '不限', ID: '' },
      { name: '手动生成', ID: 0 },
      { name: '自动生成', ID: 1 },
    ],
    /* 客户余额流水类型列表
    -------------------------------*/
    FundBillBalanceTypeList: [
      { name: '不限', ID: '' },
      { name: '充值', ID: 11 },
      { name: '支出', ID: 21 },
    ],
    /* 客户余额流水方式列表
    -------------------------------*/
    FundBillBalanceCurrencyList: [
      { name: '不限', ID: '' },
      { name: '余额', ID: 1 },
      { name: '支付宝', ID: 3 },
      { name: '微信支付', ID: 4 },
      { name: '物流代收', ID: 5 },
      { name: '退款', ID: 12 },
      { name: '返现', ID: 15 },
      { name: '手动入账', ID: 16 },
      { name: '手动扣款', ID: 23 },
      { name: '支付订单', ID: 24 },
    ],
    /* 客户订单类型流水类型列表
    -------------------------------*/
    FundBillOrderTypeList: [
      { name: '不限', ID: '' },
      { name: '订单退款', ID: 12 },
      { name: '支付订单', ID: 21 },
    ],
    /* 客户订单类型流水渠道列表
    -------------------------------*/
    FundBillOrderCurrencyList: [
      { name: '不限', ID: '' },
      { name: '余额', ID: 1 },
      { name: '退款', ID: 12 },
      { name: '支付宝', ID: 3 },
      { name: '微信支付', ID: 4 },
      { name: '物流代收', ID: 5 },
      { name: '订单支付', ID: 24 },
    ],
    /* 属性间的关系列表
    -------------------------------*/
    OperatorKeyValueList: [
      { name: '等于', ID: 1 },
      { name: '不等于', ID: 2 },
      { name: '大于', ID: 3 },
      { name: '大于等于', ID: 4 },
      { name: '小于', ID: 5 },
      { name: '小于等于', ID: 6 },
      { name: '包含', ID: 7 },
      { name: '不包含', ID: 8 },
    ],
    /* 促销活动价格单位
    -------------------------------*/
    PriceUnitList: [
      { name: '产品单价', ID: 0 },
      { name: '单款总价', ID: 1 },
      { name: '百分比', ID: 3 },
      { name: '减款', ID: 4 },
    ],
    /* 条件选择对应列表
    -------------------------------*/
    conditionTypeList: [{ ID: 1, name: '满足以上所有条件' }, { ID: 2, name: '满足以上任一条件' }],
    /* 优惠券类型列表
    -------------------------------*/
    // couponTypeList: [{ ID: 1, name: '满减券' }, { ID: 2, name: '产品券' }],
    /* 行政区域
    -------------------------------*/
    adAreaList: [],
    /* 售后申请类型（诉求意向）
    -------------------------------*/
    AppealList: [
      { name: '退货退款', ID: 0 },
      { name: '补印', ID: 1 },
      { name: '减款', ID: 2 },
      { name: '其它', ID: 255 },
    ],
    /* 售后申请处理进度
    -------------------------------*/
    FeedbackProgress: [
      { name: '已提交', ID: 0 },
      { name: '处理中', ID: 1 },
      { name: '处理成功', ID: 2 },
      { name: '已拒绝', ID: 3 },
      { name: '已取消', ID: 255 },
    ],
    /* 售后问题原因 - 问题列表
    -------------------------------*/
    FeedbackQuestionList: [],
    /* 售后 - 责任部门列表
    -------------------------------*/
    DepartmentList: [],
    /* 统计分析 --- 统计表数据类型
    -------------------------------*/
    StatisticalFormTypeList: [
      { ID: 0, name: '订单', key: 'OrderForm' },
      { ID: 1, name: '客户', key: 'CustomerForm' },
      { ID: 2, name: '客户订单', key: 'OrderCustomerForm' },
      { ID: 3, name: '售后单', key: 'AfterSalesForm' },
    ],
    /* 统计分析 --- 数据来源类型 -- 订单类型表单
    -------------------------------*/
    StatisticalDataTypeList: [
      { ID: 0, name: '订单总金额' },
      { ID: 1, name: '订单实际金额（减去售后损失）' },
      { ID: 2, name: '订单数量' },
      { ID: 3, name: '客户数量' },
      { ID: 4, name: '客单价' },
    ],
    /* 统计分析 --- 新建统计表 - 售后单 - 数据类型列表     正常订单 | 有售后订单 | 已取消 | 已过期
    -------------------------------*/
    StatisticalAfterSalesDataTypeList: [
      { ID: 2, name: '订单数量' },
      { ID: 3, name: '客户数量' },
      { ID: 5, name: '售后损失金额' },
    ],
    /* 统计分析 --- 数据来源类型 -- 客户类型表单
    -------------------------------*/
    StatisticalCustomerTypeList: [
      { ID: 3, name: '客户数量' },
    ],
    /* 统计分析 --- 订单状态列表
    -------------------------------*/
    StatisticalOrderStatusList: [
      { ID: 0, name: '正常下单' },
      { ID: 254, name: '已取消' },
      { ID: 255, name: '已过期' },
    ],
    /* 统计分析 --- 下单方式列表
    -------------------------------*/
    StatisticalOrderCreateTypeList: [
      { name: '代客下单', ID: 1 },
      { name: '客户端', ID: 2 },
      { name: '网页版', ID: 3 },
    ],
    /* 统计分析 --- 编辑统计表 --- 日期分组列表
    -------------------------------*/
    StatisticalDateTypeList: [
      { ID: 0, name: '不分组' },
      { ID: 1, name: '按年' },
      { ID: 2, name: '按月' },
      { ID: 3, name: '按周' },
      { ID: 4, name: '按日' },
      { ID: 5, name: '按小时' },
    ],
    /* 统计分析 --- 编辑统计表 --- 行 和 列分组数据列表 -*------------------------ ！
    -------------------------------*/
    StatisticalRowColumnList: [
      { ID: '', name: '不分组', valid: [0, 1, 2, 3] },
      { ID: 0, name: '订单状态', valid: [0, 2], key: 'orderStatusList', subKey: 'ID', type: 'ConditionOptionList', errMsg: '请选择订单状态!' },
      { ID: 1, name: '下单方式', valid: [0, 2, 3], key: 'orderCreateTypeList', subKey: 'ID', type: 'ConditionOptionList', errMsg: '请选择下单方式!' },
      { ID: 2, name: '单个订单金额', valid: [0, 3], key: 'singleOrderMinMaxValList', subKey: 'ID', type: 'ConditionRangeList', errMsg: '单个订单金额' },
      { ID: 3, name: '单个订单损失金额', valid: [3], key: 'singleOrderLossMinMaxValList', subKey: 'ID', type: 'ConditionRangeList', errMsg: '单个订单损失金额' },
      { ID: 4, name: '客户分类', valid: [0, 1, 2, 3], key: 'selectUserTypeList', subKey: 'CategoryID', type: 'ConditionOptionList', errMsg: '请选择客户分类!' },
      { ID: 5, name: '客户等级', valid: [0, 1, 2, 3], key: 'selectUserRankList', subKey: 'CategoryID', type: 'ConditionOptionList', errMsg: '请选择客户等级!' },
      { ID: 6, name: '注册方式', valid: [1], key: 'selectCustomerRegistrationTypeList', subKey: 'ID', type: 'ConditionOptionList', errMsg: '请选择客户注册方式!' },
      { ID: 7, name: '注册时间', valid: [1], key: 'selectCustomerRegistrationTimeList', subKey: 'ID', type: 'ConditionOptionList', errMsg: '请选择客户注册时间!' },
      { ID: 8, name: '客户总订单金额', valid: [2], key: 'orderMinMaxValList', subKey: 'ID', type: 'ConditionRangeList', errMsg: '客户订单总金额' },
      { ID: 9, name: '客户总损失金额', valid: [2], key: 'orderLossMinMaxValList', subKey: 'ID', type: 'ConditionRangeList', errMsg: '客户订单损失总金额' },
      { ID: 10, name: '售后单类型', valid: [3], key: 'selectAfterSalesOrderTypeList', subKey: 'ID', type: 'ConditionOptionList', errMsg: '请选择售后单类型!' },
      { ID: 11, name: '售后问题', valid: [3], key: 'questionList', subKey: 'ID', type: 'ConditionOptionList', errMsg: '请选择问题!' },
      { ID: 12, name: '物流方式', valid: [0, 2, 3], key: 'selectExpressList', subKey: 'ID', type: 'ConditionOptionList', errMsg: '请选择物流方式!' },
      { ID: 21, name: '产品一级分类', valid: [0, 2, 3], key: 'ProductList', type: 'ConditionProductList', errMsg: '请选择产品!' },
      { ID: 22, name: '产品二级分类', valid: [0, 2, 3] },
      { ID: 23, name: '产品三级分类', valid: [0, 2, 3] },
      { ID: 31, name: '大区', valid: [0, 1, 2, 3], key: 'AreaList', type: 'ConditionAreaList', errMsg: '请选择区域!' },
      { ID: 32, name: '城市', valid: [0, 1, 2, 3] },
      { ID: 33, name: '县区', valid: [0, 1, 2, 3] },
    ],
    StatisticalIconStyleList: [ // 图标样式列表
      { ID: 0, name: '柱状图', key: 'histogram' },
      { ID: 1, name: '折线图', key: 'lineChart' },
      { ID: 2, name: '饼状图', key: 'pieChart' },
    ],
    StatisticalDataSplitList: [ // 数据拆分方式列表
      { ID: 0, name: '拆分行', key: 'row' },
      { ID: 1, name: '拆分列', key: 'column' },
      { ID: 2, name: '拆分日期', key: 'date' },
    ],
    /* 统计分析 --- 客户注册时间 新注册 老客户
    -------------------------------*/
    StatisticalCustomerRegistrationTimeList: [
      { ID: 0, name: '新注册客户' },
      { ID: 1, name: '老客户' },
    ],
    /* 统计分析 --- 客户注册方式     员工添加 | 客户端 | 网页 | 微信
    -------------------------------*/
    StatisticalCustomerRegistrationTypeList: [ //
      { ID: 255, name: '员工添加' },
      { ID: 0, name: '客户端' },
      { ID: 1, name: '网页版' },
      { ID: 2, name: '微信端' },
    ],
    /* 统计分析 --- 订单状态     正常订单 | 有售后订单 | 已取消 | 已过期
    -------------------------------*/
    StatisticalCustomerOrderStatusList: [
      { ID: 0, name: '正常订单' },
      { ID: 1, name: '有售后订单' },
      { ID: 254, name: '已取消' },
      { ID: 255, name: '已过期' },
    ],
    /* 统计分析 --- 售后单处理类型
    -------------------------------*/
    AfterSalesTypeList: [
      { name: '补印', ID: 7 },
      { name: '减款', ID: 2 },
    ],
    /* 物流状态筛选
    -------------------------------*/
    deliverStatus: [
      { name: '不限', ID: '' },
      { name: '已揽收', ID: 70 },
      { name: '已发货', ID: 80 },
      { name: '已完成', ID: 200 },
    ],
    /* 生产工厂列表数据
    -------------------------------*/
    factoryList: [],
    /* 文件类型列表数据
    -------------------------------*/
    FileTypeList: [],
    /* 文件类目列表数据
    -------------------------------*/
    FileDataList: [],
    /* 工艺二级分类列表数据
    -------------------------------*/
    CraftClassifyData: [],
    /* 产品分类管理相关
    -------------------------------*/
    ProductClassifyIDList: [
      { ID: 6, Name: '代客下单', Type: 1 }, // ID只与从缓存获取数据有关  其它分类管理 和 分类筛选等 都使用Type
      { ID: 2, Name: '自助上传', Type: 2 },
    ],
    ProductMultipleClassifyList: [], // 产品多分类列表数据
  },
  getters: {
    /* 配送方式相关
    -------------------------------*/
    expressList(state) {
      if (state.ExpressList && state.ExpressList.length === 0) return [{ ID: '', name: '不限' }];
      const arr1 = state.ExpressList.filter((item) => item.List.length > 0);
      const arr2 = arr1.map((item) => ({ ID: item.Type, name: item.Name }));
      const arr = [{ ID: '', name: '不限' }];
      return [...arr, ...arr2];
    },
    /** 转换付款单超时时间为毫秒单位时间
     ---------------------------------------- */
    PayTimeout(state) {
      if (!state.ValidTime) return '';
      const endTime = new Date(state.ValidTime).getTime();
      if (state.curTime > endTime) return '已超时';
      const totalS = (endTime - state.curTime) / 1000;
      const h = `0${Math.floor(totalS / (60 * 60))}`.slice(-2);
      const m = `0${Math.floor((totalS / 60) % 60)}`.slice(-2);
      const s = `0${Math.floor(totalS % 60)}`.slice(-2);
      // if (+h > 1) return (`${h}时${m}分`);
      return (`${h}: ${m}: ${s}`);
    },
    /* 全部产品分类结构树，用于报价目录等地方展示
    -------------------------------*/
    allProductClassify(state) {
      // console.log('allProductClassifyallProductClassifyallProductClassify');
      if (
        state.productList.length === 0
        || state.productNames.length === 0
      ) {
        return [];
      }
      // console.log('allProductC22222222222222lassifyallProductClassifyallProductClassify');

      let level1List = state.productList // 挑选第一级分类
        .filter(item => item.Level === 1)
        .map(item => ({ ...item, children: [] }));
      // 设置第二级分类
      level1List.forEach(level1 => {
        const _list = state.productList
          .filter(item => item.ParentID === level1.ID)
          .map(item => ({ ...item, children: [] }));
        level1.children = _list;
      });
      // 添加第三级产品内容
      state.productNames.forEach(item => level1List.forEach(leve1 => {
        if (item.ProductClass.First === leve1.ID) {
          leve1.children.forEach(level2 => {
            if (item.ProductClass.Second === level2.ID) {
              level2.children.push({ ...item, ClassName: item.ProductName, ID: item.ProductID });
            }
          });
        }
      }));
      // 筛选去除无下属产品的分类
      level1List = level1List.filter(leve1 => leve1.children.length > 0);
      level1List.forEach(
        level1 => (level1.children = level1.children.filter(
          level2 => level2.children.length > 0,
        )),
      );
      return level1List;
    },
    /* 全部销售区域分级树形结构
    -------------------------------*/
    allAreaTreeList(state) {
      const _list = state.areaList;
      if (_list.length === 0) return [];
      const level1List = _list.filter(item => item.Level === 1).map(i => ({ ...i, children: [] }));
      level1List.forEach(level1 => {
        const _level1list = _list.filter(item => item.ParentID === level1.ID)
          .map(item => ({ ...item, children: [] }));
        level1.children = _level1list;
        level1.children.forEach(level2 => {
          const _level3list = _list.filter(item => item.ParentID === level2.ID);
          level2.children = _level3list;
        });
      });
      return level1List;
    },
    /* 全部行政区域分级树形结构
    -------------------------------*/
    allAdAreaTreeList(state) {
      const _list = state.adAreaList;
      if (_list.length === 0) return [];
      const level1List = _list.filter(item => item.Level === 1).map(i => ({ ...i, children: [] }));
      level1List.forEach(level1 => {
        const _level2list = _list.filter(item => item.ParentID === level1.ID)
          .map(item => ({ ...item, children: [] }));
        level1.children = _level2list;
        level1.children.forEach(level2 => {
          const _level3list = _list.filter(item => item.ParentID === level2.ID);
          level2.children = _level3list;
        });
      });
      return level1List;
    },
    /* 2级分类 产品 树结构
    -------------------------------*/
    twoLevelsProductClassify(state) { // 去除子列表为空的类别
      return getTwoLevelsClassifyDataFromList(state.productList);
    },
    twoLevelsProductClassify4Sort(state) { // 不去除 用于类别管理
      return getTwoLevelsClassifyDataFromList(state.productList, true);
    },
    twoLevelsMultipleProductClassifyList(state) { // 去除子列表为空的类别
      return state.ProductMultipleClassifyList.map(it => ({ ...it, List: getTwoLevelsClassifyDataFromList(it.List) })).sort((a, b) => a.Type - b.Type);
    },
    twoLevelsMultipleProductClassifyList4Sort(state) { // 不去除 用于类别管理
      return state.ProductMultipleClassifyList.map(it => ({ ...it, List: getTwoLevelsClassifyDataFromList(it.List, true) })).sort((a, b) => a.Type - b.Type);
    },
    /* 2级分类 工艺 树结构
    -------------------------------*/
    twoLevelsCraftClassify(state) {
      return getTwoLevelsClassifyDataFromList(state.CraftClassifyData);
    },
    twoLevelsCraftClassify4Sort(state) {
      return getTwoLevelsClassifyDataFromList(state.CraftClassifyData, true);
    },
    /* 细分类 物流配送方式列表
    -------------------------------*/
    subExpressList(state) {
      if (state.ExpressList.length === 0) return [];
      const _list = [];
      state.ExpressList.forEach(level1 => {
        level1.List.forEach(level2 => {
          const _obj = { ...level2 };
          _obj.name = level2.Name;
          _list.push(_obj);
        });
      });
      return _list;
    },
  },
  mutations: {
    /** 打开全局默认loading图标显示
     ---------------------------------------- */
    setDefaultLoadingClose(state) {
    //  console.log(112233);
      state.showDefaultLoading = false;
      state.showSpecialLoading = true;
    },
    /** 关闭全局默认loading图标显示
     ---------------------------------------- */
    setDefaultLoadingOpen(state) {
      state.showDefaultLoading = true;
      state.showSpecialLoading = false;
    },
    /** 设置付款单创建时间
     ---------------------------------------- */
    setPayOrderCreateTime(state, time) {
      state.payOrderCreateTime = time;
    },
    /* 设置付款单详情信息 到期时间
    -------------------------------*/
    setValidTime(state, value) {
      state.ValidTime = value;
    },
    /** 刷新当前时间
     ---------------------------------------- */
    setCurTime(state, time) {
      state.curTime = time;
    },
    /** 设置当前加载状态
     ---------------------------------------- */
    setIsLoading(state, bool) {
      state.isLoading = bool;
    },
    /* 设置行政区域
    -------------------------------*/
    setAdAreaList(state, data) {
      state.adAreaList = data;
    },
    /* 设置权限信息
    -------------------------------*/
    setPermission(state, data) {
      state.Permission = data;
    },
    /* 设置销售区域
    -------------------------------*/
    setAreaList(state, arr) {
      state.areaList = arr;
    },
    /* 设置产品类别数据
    -------------------------------*/
    setProductList(state, arr) {
      state.productList = arr;
    },
    /* 设置产品类别数据
    -------------------------------*/
    setProductNames(state, list) {
      state.productNames = list;
    },
    /* 设置用户类别数据
    -------------------------------*/
    setUserInfo(state, [type, rank]) {
      state.userTypeList = type;
      state.userRankList = rank;
      state.userTypeListNoneEmpty = type.filter(it => it.CategoryID);
      state.userRankListNoneEmpty = rank.filter(it => it.CategoryID);
    },
    /* 设置接单员列表数据
    -------------------------------*/
    setStaffList(state, list) {
      const tempArr = [{ StaffID: '', StaffName: '不限' }];
      const arr = [...tempArr, ...list];
      state.staffList = arr;
    },
    /* 设置配送方式列表
    -------------------------------*/
    setExpressList(state, list) {
      state.ExpressList = list;
    },
    /* 设置售后问题原因 - 问题列表
    -------------------------------*/
    setFeedbackQuestionList(state, list) {
      state.FeedbackQuestionList = list;
    },
    /* 设置售后 - 责任部门列表
    -------------------------------*/
    setDepartmentList(state, list) {
      state.DepartmentList = list;
    },
    /* 设置生产工厂列表数据
    -------------------------------*/
    setFactoryList(state, list) { // 设置列表为空时应赋值为[]
      if (!list || !Array.isArray(list)) return;
      state.factoryList = list;
    },
    setFactoryChange(state, { type, data }) {
      let editTargetIndex;
      switch (type) {
        case 'add':
          state.factoryList.unshift(data);
          break;
        case 'edit':
          editTargetIndex = state.factoryList.findIndex(it => it.FactoryID === data.FactoryID);
          if (editTargetIndex || editTargetIndex === 0) {
            state.factoryList.splice(editTargetIndex, 1, data);
          }
          break;
        case 'remove':
          state.factoryList = state.factoryList.filter(it => it.FactoryID !== data.FactoryID);
          break;
        default:
          break;
      }
    },
    /* 设置文件类型列表数据
    -------------------------------*/
    setFileTypeList(state, list) {
      if (!list) return;
      state.FileTypeList = list;
    },
    /* 设置文件类目列表数据
    -------------------------------*/
    setFileDataList(state, list) {
      if (!list) return;
      state.FileDataList = list;
    },
    /* 设置文件类目保存成功
    -------------------------------*/
    setFileSaveSuccess(state, { isEdit, data, ID }) {
      const _temp = isEdit ? data : { ...data, ID };
      if (!isEdit) state.FileDataList.push(_temp);
      else {
        const i = state.FileDataList.findIndex(it => it.ID === _temp.ID);
        if (i >= 0) state.FileDataList.splice(i, 1, _temp);
      }
    },
    /* 删除文件类目
    -------------------------------*/
    setFileInfoRemove(state, ID) {
      state.FileDataList = state.FileDataList.filter(it => it.ID !== ID);
    },
    /* 设置工艺二级分类列表数据
    -------------------------------*/
    setCraftClassifyData(state, list) {
      state.CraftClassifyData = list;
    },
    /* 设置产品多分类列表数据
    -------------------------------*/
    setProductMultipleClassifyList(state, data) {
      if (!data.Type && data.Type !== 0) {
        const t = state.ProductClassifyIDList.find(it => it.ID === data.ID);
        if (t) data.Type = t.Type;
      }
      if (state.ProductMultipleClassifyList.length === 0) state.ProductMultipleClassifyList.push(data);
      else {
        const i = state.ProductMultipleClassifyList.findIndex(it => it.ID === data.ID);
        if (i > -1) state.ProductMultipleClassifyList.splice(i, 1, data);
        else state.ProductMultipleClassifyList.push(data);
      }
    },
  },
  actions: {
    async getAreaList({ state, commit }) { // 获取地区列表数据
      if (state.areaList.length > 0) return;

      const resp = await api.getVersionValid({ Key: 3 });
      if (resp.data.Status === 1000) commit('setAreaList', resp.data.Data);
    },
    async getProductList({ state, commit }, { bool = false, key = 6 } = {}) { // 获取产品二级分类数据 2.0版本  3.0弃用
      if (state.productList.length > 0 && !bool) return true;
      const Key = (key || key === 0) ? key : state.ProductClassifyIDList[0].ID;
      const resp = await api.getVersionValid({ Key, Value: -1 }).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        commit('setProductList', resp.data.Data);
        return true;
      }
      return false;
    },
    async getProductClassifyData({ state, commit }, { bool = false, key = 6 } = {}) { // 获取产品二级分类数据1  -      ---- !
      const t = state.ProductMultipleClassifyList.find(it => it.ID === key);
      if (t && t.List.length > 0 && !bool) return true;
      // { type: key, List: resp.data.Data }
      const Key = (key || key === 0) ? key : state.ProductClassifyIDList[0].ID;
      const resp = await api.getVersionValid({ Key, Value: -1 }).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        if (Key === 0) {
          state.ProductClassifyIDList.forEach(it => {
            const { Type, ID } = it;
            const List = resp.data.Data.filter(_it => _it.Type === Type);
            commit('setProductMultipleClassifyList', { Type, ID, List });
          });
        } else {
          const _t = state.ProductClassifyIDList.find(it => it.ID === key);
          const Type = _t ? _t.Type : '';
          commit('setProductMultipleClassifyList', { ID: Key, Type, List: resp.data.Data });
        }
        return true;
      }
      return false;
    },
    async getCraftClassifyData({ state, commit }, bool) { // 获取工艺二级分类数据
      if (state.CraftClassifyData.length > 0 && !bool) return true;
      let key = true;
      const resp = await api.getVersionValid({ Key: 5, Value: -1 }).catch(() => { key = false; });
      if (key && resp && resp.data.Status === 1000) {
        commit('setCraftClassifyData', resp.data.Data);
        return true;
      }
      return false;
    },
    async getAllProductNames({ state, commit }) { // 获取全部产品第三级分类数据
      if (state.productNames.length > 0) return;

      const resp = await api.getAllProductLists();
      if (resp.data.Status === 1000) commit('setProductNames', resp.data.Data);
    },
    async getUserClassify({ state, commit }) { // 获取用户等级
      if (state.userTypeList.length > 1 && state.userRankList.length > 1) return;

      const resp = await api.getVersionValid({ Key: 71 });
      if (resp.data.Status === 1000) {
        const tempArr = resp.data.Data;
        const type = tempArr.filter((item) => item.Type === 1);
        const rank = tempArr.filter((item) => item.Type === 2);
        const arr = [{ CategoryID: '', CategoryName: '不限' }];
        commit('setUserInfo', [[...arr, ...type], [...arr, ...rank]]);
      }
    },
    async getStaffList({ state, commit }) { // 获取员工列表
      if (state.staffList.length > 1) return;

      const res = await api.getStaffList({ FieldType: 1 });
      if (res.data.Status !== 1000) return;

      commit('setStaffList', res.data.Data);
    },
    // 获取配送方式列表
    async getExpressList({ state, commit }) {
      if (state.ExpressList.length > 1) return;
      const res = await api.getExpressList();
      if (res.data.Status !== 1000) return;
      commit('setExpressList', res.data.Data);
    },
    // 获取客户售后申请反馈问题列表
    async getFeedbackQuestionList({ state, commit }) {
      if (state.FeedbackQuestionList.length > 0) return;
      const res = await api.getApplyQuestionList();
      if (res.data.Status !== 1000) return;
      commit('setFeedbackQuestionList', res.data.Data);
    },
    // 获取客户售后申请反馈问题列表
    async getAfterSalesDepartmentList({ state, commit }) {
      if (state.DepartmentList.length > 0) return;
      const res = await api.getAfterSalesDepartmentList();
      if (res.data.Status !== 1000) return;
      commit('setDepartmentList', res.data.Data);
    },
    /* 获取行政区域列表数据 - 全部列表数据
    -------------------------------*/
    async fetchAdAreaList({ state, commit }) {
      if (state.adAreaList.length > 1) return;
      let res = [];
      const localAdAreaData = localStorage.getItem('localAdAreaData');
      if (localAdAreaData) {
        res = JSON.parse(localAdAreaData);
      } else {
        const resp = await api.getDistrictList();
        if (resp.data.Status !== 1000) return;
        res = resp.data.Data;
        localStorage.setItem('localAdAreaData', JSON.stringify(res));
      }
      commit('setAdAreaList', res);
    },
    /* 获取生产工厂列表数据
    -------------------------------*/
    async getFactoryList({ state, commit }) { // bool为true时 代表必须从服务器重新获取数据
      if (state.factoryList.length > 0) return;
      let list;
      let key = true;
      const resp = await api.getFactoryList().catch(() => { key = false; });
      if (key && resp && resp.status === 200 && resp.data.Status === 1000) list = resp.data.Data;
      if (list) commit('setFactoryList', list);
    },
    async getFactorySave(context, data) {
      let key = true;
      const resp = await api.getFactorySave(data).catch(() => { key = false; });
      if (key && resp && resp.status === 200 && resp.data.Status === 1000) {
        return resp.data.Data;
      }
      return false;
    },
    async getFactoryRemove({ commit }, data) {
      let key = true;
      const resp = await api.getFactoryRemove(data.FactoryID).catch(() => { key = false; });
      if (key && resp && resp.status === 200 && resp.data.Status === 1000) {
        const func = () => {
          commit('setFactoryChange', { type: 'remove', data });
        };
        messageBox.successSingle('删除成功', func, func);
      }
    },
    /* 获取文件类型列表数据
    -------------------------------*/
    async getFileTypeList({ state, commit }) {
      if (state.FileTypeList && Array.isArray(state.FileTypeList) && state.FileTypeList.length > 0) return;
      const resp = await api.getFileTypeList().catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setFileTypeList', resp.data.Data);
      }
    },
    /* 文件类目相关
    -------------------------------*/
    async getFileInfoSave(context, data) {
      const resp = await api.getFileInfoSave(data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        return resp.data.Data || true;
      }
      return false;
    },
    async getFileInfoList({ commit }) { // 获取文件类目列表数据
      // if (state.FileDataList && Array.isArray(state.FileDataList) && state.FileDataList.length > 0) return true;
      const resp = await api.getFileInfoList().catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        commit('setFileDataList', resp.data.Data);
        return true;
      }
      return false;
    },
    async getFileInfoRemove({ commit }, ID) { // 删除文件类目
      if (!ID && ID !== 0) return;
      const resp = await api.getFileInfoRemove(ID).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const callback = () => { commit('setFileInfoRemove', ID); };
        messageBox.successSingle('删除成功', callback, callback);
      }
    },
  },
};
