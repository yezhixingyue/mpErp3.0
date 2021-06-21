/* eslint-disable import/no-cycle */
import Vue from 'vue';
import Vuex from 'vuex';
import orderModule from './orderModule';
import timeSelectModule from './timeSelectModule';
import paymentModule from './paymentModule';
import common from './common';
import service from './service';
import finance from './finance';
import timelimit from './timeLimit/timelimit';
import unpaylist from './unpaylist';
import fundBill from './fundBill/fundBill';
import couponStore from './coupon/couponStore';
import promoteStore from './Promote/promoteStore';
import deposit from './deposit/deposit';
import statistic from './statistic/statisticAnalysis';
import productManage from './productManage/productManage';
import layout from './layout';
import basicSet from './basicSet';
import packageModule from './package';


Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    orderModule,
    timeSelectModule,
    paymentModule,
    common,
    service,
    finance,
    unpaylist,
    couponStore,
    promoteStore,
    deposit,
    fundBill,
    timelimit,
    statistic,
    productManage,
    layout,
    basicSet,
    packageModule,
  },
});