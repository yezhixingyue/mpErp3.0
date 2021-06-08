/* eslint-disable max-len */
/*
 * @Author: your name
 * @Date: 2020-05-26 09:16:49
 * @LastEditTime: 2021-04-16 17:36:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit 过滤器
 * @FilePath: /src/assets/js/filters/filters.js
 */

import Vue from 'vue';
import store from '@/store';

Vue.filter('formatDate', (date) => (date ? date.split('.')[0].slice(0, -3).replace('T', ' ') : ''));

const { OrderStatusList } = store.state.orderModule;
Vue.filter('formatStatus', (status) => {
  if (!status && status !== 0) return '';
  if (status === 10) return '待付款';
  const arr = OrderStatusList.find((item) => item.ID === status);
  if (arr) return arr.name.trim();
  return '';
});


const { selfHelpOrderTypeList } = store.state.common;
Vue.filter('formatTerminalType', (status) => {
  if (!status && status !== 0) return '';
  const arr = selfHelpOrderTypeList.find((item) => item.ID === status);
  if (arr) return arr.name.trim();
  return '';
});


const { OrderStatusList2Transport } = store.state.common;
Vue.filter('formatTransportStatus', (status) => {
  if (!status && status !== 0) return '';
  if (status === 10) return '待付款';
  const arr = OrderStatusList2Transport.find((item) => item.ID === status);
  if (arr) return arr.name.trim();
  return '';
});

/**
 * 促销活动 - 活动状态转换
 */
const { PromoteStatusList } = store.state.common;
Vue.filter('formatPromoteStatus', status => {
  if (!status && status !== 0) return '';
  const arr = PromoteStatusList.find((item) => item.ID === status);
  if (arr) return arr.name.trim();
  return '';
});

/**
 * 促销活动 - 活动商品名称转换
 */
Vue.filter('formatPromoteProductList', ProductList => {
//  console.log(ProductList);
  if (!ProductList || ProductList.length === 0) return '';
  const _textArr = [];
  ProductList.forEach(product => {
    product.LimitList.forEach(limit => _textArr.push(limit.ProductName));
  });
  const _text = _textArr.join('、');
  return _text;
});

/**
 * 促销活动 - 销售区域文字转换
 */
// console.log(store);
// const allAreaTreeList = store.getters['common/allAreaTreeList'];
// Vue.filter('formatPromoteSellAreaArray', SellAreaArray => {
//   if (!SellAreaArray || SellAreaArray.length === 0) return '';
//   let _allAreaTreeList = JSON.parse(JSON.stringify(allAreaTreeList));
//   const _firstList = SellAreaArray.map(it => it.RegionalID);
//   const _secondList = SellAreaArray.map(it => it.CityID);
//   const _thirdList = SellAreaArray.map(it => it.CountyID);
//   _allAreaTreeList = _allAreaTreeList.filter(level1 => _firstList.includes(level1.ID));
//   _allAreaTreeList = _allAreaTreeList.children.filter(level2 => _secondList.includes(level2.ID));
//   _allAreaTreeList = _allAreaTreeList.children.children.filter(level3 => _thirdList.includes(level3.ID));
//   return _allAreaTreeList;
// });

/**
 * 促销活动 - 获取用户类型
 */
Vue.filter('formatPromoteCustomerType', list => {
  const _arr = list.map(it => it.Name);
  return _arr.filter(it => it).join('、');
});

/**
 * 促销活动 -- 活动用户等级
 */
Vue.filter('formatPromoteCustomerGrade', list => {
  const _arr = list.map(it => it.Name);
  return _arr.join('、');
});

/**
 * 促销活动 -- 活动下单类型
 */
const { orderCreateTypeList } = store.state.common;
Vue.filter('formatPromoteOrderType', list => {
  const _list = list.map(it => orderCreateTypeList.find(type => type.ID === it.ID).name);
  return _list.join('、');
});
/**
 * 根据OrderType值获取其中文字段
 */
Vue.filter('formatOrderTypeToText', OrderType => {
  const t = orderCreateTypeList.find(type => type.ID === OrderType);
  if (t && t.name) return t.name;
  return '';
});

/**
 * 优惠券 -- 优惠券发放状态  ...mapState('common', ['CouponProvideStatusList', 'CouponUseStatusList']),
 */
const { CouponProvideStatusList } = store.state.common;
Vue.filter('formatProvideStatus', ProvideStatus => {
  const _t = CouponProvideStatusList.find(_it => _it.ID === ProvideStatus);
  return _t.name;
});

/**
 * 优惠券 -- 优惠券使用状态  ...mapState('common', ['CouponProvideStatusList', 'CouponUseStatusList']),
 */
const { CouponUseStatusList } = store.state.common;
Vue.filter('formatUseStatus', UseStatus => {
  const _t = CouponUseStatusList.find(_it => _it.ID === UseStatus);
  return _t.name;
});

/**
 * 转换长类型时间格式：   从 2020-07-24T23:59:59.997  转换为  2020-07-24  23:59:59
 */
Vue.filter('format2LangTypeDate', date => {
  if (!date) return '';
  const _arr = date.split('T');
  const [t1, t2s] = _arr;
  const t2 = t2s.split('.')[0];
  return `${t1} ${t2}`;
});

/**
 * 转换中长类型时间格式：   从 2020-07-24T23:59:59.997  转换为  2020-07-24  23:59
 */
Vue.filter('format2MiddleLangTypeDate', date => {
  if (!date) return '';
  const _arr = date.split('T');
  const [t1, t2s] = _arr;
  const t2 = t2s.split('.')[0].slice(0, -3);
  return `${t1}  ${t2}`;
});

/**
 * 优惠券 -- 优惠券码状态  ...mapState('common', ['CouponCodeStatusList']),
 */
const { CouponCodeStatusList } = store.state.common;
Vue.filter('formatCouponCordStatus', CordStatus => {
  const _t = CouponCodeStatusList.find(_it => _it.ID === CordStatus);
  if (!_t) return '';
  return _t.name;
});

/**
 * 优惠券 -- 优惠券码生成方式  ...mapState('common', ['CouponGenerateTypeList']),
 */
const { CouponGenerateTypeList } = store.state.common;
Vue.filter('formatGenerateType', GenerateType => {
  const _t = CouponGenerateTypeList.find(_it => _it.ID === GenerateType);
  return _t.name;
});

/**
 * 客户余额流水类型
 */
const { FundBillBalanceTypeList } = store.state.common;
Vue.filter('formatFundBillBalanceType', Type => {
  const _t = FundBillBalanceTypeList.find(_it => _it.ID === Type);
  if (_t) return _t.name;
  return '';
});

/**
 * 客户余额流水方式
 */
const { FundBillBalanceCurrencyList } = store.state.common;
Vue.filter('formatFundBillBalanceCurrency', Currency => {
  const _t = FundBillBalanceCurrencyList.find(_it => _it.ID === Currency);
  if (_t) return _t.name;
  return '';
});

/**
 * 客户订单流水类型
 */
const { FundBillOrderTypeList } = store.state.common;
Vue.filter('formatFundBillOrderType', Type => {
  const _t = FundBillOrderTypeList.find(_it => _it.ID === Type);
  if (_t) return _t.name;
  return '';
});
/**
 * 客户订单流水渠道
 */
const { FundBillOrderCurrencyList } = store.state.common;
Vue.filter('formatFundBillOrderCurrency', Currency => {
  const _t = FundBillOrderCurrencyList.find(_it => _it.ID === Currency);
  if (_t) return _t.name;
  return '';
});

/**
 * 工期时间
 */
Vue.filter('formatProducePeriod', ProducePeriod => {
  if (!ProducePeriod) return '';
  const { IncludeDiliveryTime, TotalTime } = ProducePeriod;
  const str = IncludeDiliveryTime ? '送达' : '出货';

  const fullDay = TotalTime.split('T')[0];
  let dayTimeStr = fullDay;

  const y = fullDay.split('-')[0];
  const _y = `${new Date().getFullYear()}`;

  if (y === _y) {
    const m = fullDay.split('-')[1];
    const d = fullDay.split('-')[2];
    dayTimeStr = `${m}月${d}日`;
    const _m = `${new Date().getMonth() + 1}`;
    const _d = `${new Date().getDate()}`;
    if (m === _m) {
      if (d === _d) dayTimeStr = '今日';
      if (d - _d === 1) dayTimeStr = '明日';
      if (d - _d === 2) dayTimeStr = '后日';
    } else if ((_m - m === 1 || (m === '1' && _m === '12')) && (d === '1' || d === '2')) {
      const year = new Date().getFullYear();
      const surMonthDayCount = new Date(year, _m, 0).getDate();
      if (surMonthDayCount - _d === 0) {
        // eslint-disable-next-line no-nested-ternary
        dayTimeStr = d === '1' ? '明日' : (d === '2' ? '后日' : dayTimeStr);
      } else if (surMonthDayCount - _d === 1 && d === '1') {
        dayTimeStr = '后日';
      }
    }
  }

  const hour = TotalTime.split('T')[1].split('+')[0].slice(0, 5);
  return `${dayTimeStr}${hour}${str}`;
});

/**
 * 获取客户申请诉求文字
 */
const { AppealList } = store.state.common;
Vue.filter('formatAppealType', status => {
  const t = AppealList.find(it => it.ID === status);
  if (t) return t.name;
  return '';
});

/**
 * 获取客户申请进度文字
 */
const { FeedbackProgress } = store.state.common;
Vue.filter('formatFeedbackProgress', status => {
  const t = FeedbackProgress.find(it => it.ID === status);
  if (t) return t.name;
  return '';
});

/**
 * 获取客户申请进度文字
 */
const { DepartmentList } = store.state.common;
Vue.filter('getAfterSalesDepartmentText', ID => {
  const t = DepartmentList.find(it => it.ID === ID);
  if (t) return t.Title;
  return '';
});

/**
 * 获取统计分析表单数据类型
 */
const { StatisticalFormTypeList } = store.state.common;
Vue.filter('formatStatisticFormType', ID => {
  const t = StatisticalFormTypeList.find(it => it.ID === ID);
  if (t) return t.name;
  return '';
});
