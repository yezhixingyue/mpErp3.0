<template>
  <header class="mp-finance-page-header">
    <div class="mp-finance-page-selector-wrap">
      <AreaSelector />
      <ProductSelector style="margin-right: 15px"
        :changePropsFunc="setFinanceRequestObj"
        :requestFunc="getFinanceTableData"
        :ClassID="searchCondition4Finance.ProductClass.First"
        :TypeID="searchCondition4Finance.ProductClass.Second"
        :ProductID="searchCondition4Finance.ProductID"
        :typeList="[['ProductClass', 'First'],['ProductClass', 'Second'],['ProductID', '']]" />
      <WriteComp />
      <ExpressSelector />
      <order-channel-selector
        :options='orderCreateTypeList'
        :requestFunc='getFinanceTableData'
        :changePropsFunc='setFinanceRequestObj'
        :typeList="[['OrderType', '']]"
        style="margin-right: 20px"
        :value='searchCondition4Finance.OrderType'
        label='下单方式'
        />
      <order-channel-selector
        :options='deliverStatus'
        :requestFunc='getFinanceTableData'
        :changePropsFunc='setFinanceRequestObj'
        :typeList="[['Status', '']]"
        style="margin-right: 59px"
        :value='searchCondition4Finance.Status'
        label='物流状态'
        />
        <order-channel-selector
        :options='unpayFilterList'
        :requestFunc='getFinanceTableData'
        :changePropsFunc='setFinanceRequestObj'
        :typeList="[['HaveUnPaid', '']]"
        style="margin-right: 15px"
        :value='searchCondition4Finance.HaveUnPaid'
        label='未付款'
        />
      <staff-selector
        title="销账人"
        needlimit
        :changePropsFunc='setFinanceRequestObj'
        :requestFunc='getFinanceTableData'
        :typeList="[['WriteOffOperator', '']]"
        :value='searchCondition4Finance.WriteOffOperator'
        />
    </div>
    <div class="s">
      <!-- <ElDateRangeSelector v-model="conditionDate" :menus="dateMenus" :condition="searchCondition4Finance" initText='今天入库' /> -->
      <LineDateSelectorComp
        :changePropsFunc='setFinanceRequestObj'
        :requestFunc='getFinanceTableData'
        :isFull="true"
        :typeList="[['DateType', ''], ['OutstoreDate', 'First'], ['OutstoreDate', 'Second']]"
        :dateValue='searchCondition4Finance.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="时间"
        :dateList="dateList"
      />
      <SearchInputComp
        class="search-section"
        :typeList="[['KeyWords', '']]"
        title="关键词"
        placeholder='请输入搜索关键词'
        :requestFunc='getFinanceTableData'
        :changePropsFunc='setFinanceRequestObj'
        :word='searchCondition4Finance.KeyWords'
        :searchWatchKey="PackageList"
        @reset='() => this.clearConfigObj()'
      />
    </div>
    <div class="title-remark">
      <span class="is-red">注：</span>
      <span class="is-gray">今天入库明天早上8点开始计入应收</span>
    </div>
  </header>
</template>

<script>
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import ProductSelector from '@/components/common/SelectorComps/ProductSelectorIndex.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import AreaSelector from './AreaSelector.vue';
// import UserSelector from './UserSelector.vue';
// import OrderStatusSelector from './OrderStatusSelector.vue';
// import ProductSelector from './ProductSelector.vue';
import ExpressSelector from './ExpressSelector.vue';
import WriteComp from './WriteComp.vue';
// import TimeSearchSelector from './TimeSearchSelector.vue';

export default {
  components: {
    AreaSelector,
    ProductSelector,
    ExpressSelector,
    // OrderStatusSelector,
    WriteComp,
    // TimeSearchSelector,
    OrderChannelSelector,
    StaffSelector,
    // ElDateRangeSelector,
    SearchInputComp,
    LineDateSelectorComp,
  },
  computed: {
    ...mapState('common', ['orderCreateTypeList', 'deliverStatus']),
    ...mapState('finance', ['searchCondition4Finance', 'PackageList']),
    // conditionDate: {
    //   get() {
    //     return [this.searchCondition4Finance.OutstoreDate.First, this.searchCondition4Finance.OutstoreDate.Second];
    //   },
    //   set(newVal) {
    //     const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
    //     this.setFinanceRequestObj([['OutstoreDate', 'First'], key]);
    //     this.setFinanceRequestObj([['OutstoreDate', 'Second'], value]);
    //     this.getFinanceTableData();
    //   },
    // },
    UserDefinedTimeIsActive() {
      // eslint-disable-next-line max-len
      return this.searchCondition4Finance.DateType === '' && !!this.searchCondition4Finance.OutstoreDate.First && !!this.searchCondition4Finance.OutstoreDate.Second;
    },
  },
  data() {
    return {
      unpayFilterList: [
        { ID: '', name: '不限' },
        { ID: true, name: '有' },
        { ID: false, name: '无' },
      ],
      // dateMenus: [
      //   { text: '今天入库', key: 'TodayDate' },
      //   { text: '昨天入库', key: 'YesterdayDate' },
      //   { text: '前天入库', key: 'BeforeYesterdayTimeDate' },
      //   { text: '本月入库', key: 'curMonthDate' },
      //   { text: '上月入库', key: 'lastMonthDate' },
      // ],
      // eslint-disable-next-line max-len
      dateList: [{ name: '今天入库', ID: 'today' }, { name: '昨天入库', ID: 'yesterday' }, { name: '前天入库', ID: 'beforeyesterday' }, { name: '本月入库', ID: 'curMonth' }, { name: '上月入库', ID: 'lastMonth' }],
    };
  },
  methods: {
    ...mapMutations('finance', ['setFinanceRequestObj', 'clearConfigObj']),
    ...mapActions('finance', ['getFinanceTableData']),
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
header.mp-finance-page-header {
  font-size: 14px;
  width: 100%;
  padding-top: 20px;
  margin-bottom: 10px;
  background-color: $--color-white;
  padding-left: 20px;
  box-sizing: border-box;
  .mp-finance-page-selector-wrap {
    > ul {
      padding-left: 0 !important;
      > li {
        color: $--color-text-primary;
        &.text {
          width: 5em;
          text-align: right;
          font-weight: 600;
          line-height: 25px;
        }
        > .dorp-down {
          > span {
            color: $--color-text-primary;
          }
        }
      }
      &.mp-order-user-select-wrap,
      &.order-express-selector-wrap {
        margin-right: 20px;
        .text {
          margin-right: 15px;
        }
      }
      &.mp-order-status-select-wrap{
        display: flex;
        .text {
          margin-right: 10px;
        }
      }
      padding-bottom: 20px;
      padding-left: 20px;
    }
    > .mp-common-comps-order-channel-selector-wrap, .mp-common-comps-staff-selector-wrap {
      padding-bottom: 18px;
    }
    display: flex;
    flex-wrap: wrap;
    .mp-common-remote-select-comp-wrapper .mp-common-remote-select-comp-wrap .el-input > input,
    .mp-common-select-comp-wrap .el-input > input {
      width: 114px;
    }
  }
  > .s {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-right: 40px;
    > div, > section {
      margin-bottom: 12px;
    }
    // .mp-line-date-selector-wrap {
    //   margin-top: 18px;
    // }
  }
  .mp-order-time-select-box {
    .mp-head-page-title {
      width: 5em;
      flex: none;
    }
  }
  .mp-time-serach-wrap {
    .mp-time-select-box .time-menu {
      width: 692px;
    }
    > div > span.text {
      padding-left: 0;
    }
  }
  > .title-remark {
    font-size: 12px;
    padding-left: calc(5em + 26px);
    // margin-top: -8px;
    margin-bottom: 18px;
  }
}
.el-dropdown-menu {
  .el-dropdown-menu__item {
    color: $--color-text-primary !important;
  }
}
</style>
