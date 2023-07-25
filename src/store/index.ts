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
import priceManage from './Price/priceManage';
import layout from './layout';
import basicSet from './basicSet';
import packageModule from './package';
import PriceRecord from './GetPriceRecord/GetPriceRecord';
import periodManage from './Period/periodManage';
import companyManage from './companyManage/companyManage';
import customerManage from './customerManage/customerManage';
import printBean from './printBean/printBeanStore';
import department from './department';
import cashback from './cashback/cashback';
import invoice from './invoice/invoiceStore';
import review from './review/reviewStore';
import AfterSaleQuestion from './AfterSaleQuestion';

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
    priceManage,
    layout,
    basicSet,
    packageModule,
    PriceRecord,
    periodManage,
    companyManage,
    customerManage,
    printBean,
    department,
    cashback,
    invoice,
    review,
    AfterSaleQuestion,
  },
});
