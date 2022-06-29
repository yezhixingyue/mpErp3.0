<template>
  <div class="order-manage-header">
    <ul class="order-manage-header-content">
      <li class="row-one">
        <!-- 该动态类名为判断当前页面是否为包裹列表页面，如果是则做针对样式处理，另设置值方式为在对应table组件中所设置 -->
        <!-- <AreaSelector /> -->
        <!-- <ProductSelector /> -->
        <EpCascader :list="allAreaTreeList" v-model="EpCascaderAreaValue" :fiexdWidth="240" title="销售区域" />
        <EpCascader :list="allProductClassifyWithEmpty" v-model="EpCascaderProductValue" :fiexdWidth="240" />
        <!-- <ProductSelector
          :changePropsFunc="setOrderManageRequestObj"
          :requestFunc="getDataList"
          :ClassID="objForOrderList.ProductClass.First"
          :TypeID="objForOrderList.ProductClass.Second"
          :ProductID="objForOrderList.ProductID"
          :typeList="[['ProductClass', 'First'],['ProductClass', 'Second'],['ProductID', '']]" /> -->
        <UserSelector />
        <StaffSelector />
        <ExpressSelector />
        <!-- <OrderStatusSelector /> -->
        <OrderChannelSelector
          :options='OrderStatusList'
          :requestFunc='getDataList'
          :changePropsFunc='setOrderManageRequestObj'
          :typeList="[['Status', '']]"
          :value='objForOrderList.Status'
          label='订单状态'
          class="status"
          key='order-Status'
         />
        <OrderChannelSelector
          :options='orderCreateTypeList'
          :requestFunc='getDataList'
          :changePropsFunc='setOrderManageRequestObj'
          :typeList="[['OrderType', '']]"
          :value='objForOrderList.OrderType'
          label='下单方式'
          class="OrderType"
          key='order-OrderType'
         />
        <OrderChannelSelector
          class="terminal-select"
          :options='localSelfHelpOrderTypeList'
          :requestFunc='getDataList'
          :changePropsFunc='setOrderManageRequestObj'
          :typeList="[['Terminal', '']]"
          :value='objForOrderList.Terminal'
          v-show="objForOrderList.OrderType === 2"
          key='order-Terminal'
          label=''
        />
      </li>
      <li class="row-two">
        <!-- <TimeSearchSelector /> -->
        <LineDateSelectorComp
          :changePropsFunc='setOrderManageRequestObj'
          :requestFunc='getDataList'
          :typeList="[['DateType', ''], ['PlaceDate', 'First'], ['PlaceDate', 'Second']]"
          :dateValue='objForOrderList.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          :dateList="dateList"
          isFull
          label="时间筛选" />
        <!-- <ElDateRangeSelector v-model="conditionDate" :menus="dateMenus" :max-span="366" :condition="objForOrderList" initText='今天' /> -->
        <SearchInputComp
          class="search-section"
          :typeList="[['KeyWords', '']]"
          title="关键词"
          placeholder='请输入搜索关键词'
          :requestFunc='getDataList'
          :changePropsFunc='setOrderManageRequestObj'
          :word='objForOrderList.KeyWords'
          :searchWatchKey="orderListData"
          @reset='() => this.clearCondition()'
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
// import AreaSelector from '@/components/order/orderListHeader/AreaSelector.vue';
// import ProductSelector from '@/components/order/orderListHeader/ProductSelector.vue';
import UserSelector from '@/components/order/orderListHeader/UserSelector.vue';
import StaffSelector from '@/components/order/orderListHeader/StaffSelector.vue';
import ExpressSelector from '@/components/order/orderListHeader/ExpressSelector.vue';
// import OrderStatusSelector from '@/components/order/orderListHeader/OrderStatusSelector.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
// import DeliverStatusSelector from '@/components/order/orderListHeader/DeliverStatusSelector.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
// import ProductSelector from '@/components/common/SelectorComps/ProductSelectorIndex.vue';
import EpCascader from '../../packages/EpCascader/index.vue';

export default {
  components: {
    ExpressSelector,
    // AreaSelector,
    // ProductSelector,
    UserSelector,
    StaffSelector,
    // OrderStatusSelector,
    OrderChannelSelector,
    // ElDateRangeSelector,
    LineDateSelectorComp,
    SearchInputComp,
    EpCascader,
  },
  computed: {
    ...mapState('common', ['orderCreateTypeList', 'selfHelpOrderTypeList']),
    ...mapState('orderModule', ['objForOrderList', 'orderListData', 'OrderStatusList']),
    ...mapGetters('common', ['allProductClassifyWithEmpty', 'allAreaTreeList']),
    // conditionDate: {
    //   get() {
    //     return [this.objForOrderList.PlaceDate.First, this.objForOrderList.PlaceDate.Second];
    //   },
    //   set(newVal) {
    //     const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
    //     this.setOrderManageRequestObj([['PlaceDate', 'First'], key]);
    //     this.setOrderManageRequestObj([['PlaceDate', 'Second'], value]);
    //     this.getDataList();
    //   },
    // },
    UserDefinedTimeIsActive() {
      return this.objForOrderList.DateType === ''
       && !!this.objForOrderList.PlaceDate.First && !!this.objForOrderList.PlaceDate.Second;
    },
    localSelfHelpOrderTypeList() {
      return this.selfHelpOrderTypeList?.filter(it => it.name !== '移动端') || [];
    },
    // :changePropsFunc="setOrderManageRequestObj"
    //       :requestFunc="getDataList"
    //       :ClassID="objForOrderList.ProductClass.First"
    //       :TypeID="objForOrderList.ProductClass.Second"
    //       :ProductID="objForOrderList.ProductID"
    //       :typeList="[['ProductClass', 'First'],['ProductClass', 'Second'],['ProductID', '']]"
    EpCascaderAreaValue: {
      get() {
        const list = [
          this.objForOrderList.SellArea.RegionalID,
          this.objForOrderList.SellArea.CityID,
          this.objForOrderList.SellArea.CountyID,
        ];
        return list.filter(it => it || it === 0);
      },
      set(ids) {
        const [_RegionalID, _CityID, _CountyID] = ids;
        const RegionalID = _RegionalID || _RegionalID === 0 ? _RegionalID : '';
        const CityID = _CityID || _CityID === 0 ? _CityID : '';
        const CountyID = _CountyID || _CountyID === 0 ? _CountyID : '';
        this.setOrderManageRequestObj([['SellArea', 'RegionalID'], RegionalID]);
        this.setOrderManageRequestObj([['SellArea', 'CityID'], CityID]);
        this.setOrderManageRequestObj([['SellArea', 'CountyID'], CountyID]);
        this.getDataList();
      },
    },
    EpCascaderProductValue: {
      get() {
        const list = [
          this.objForOrderList.ProductClass.First,
          this.objForOrderList.ProductClass.Second,
          this.objForOrderList.ProductID,
        ];
        return list.filter(it => it || it === 0);
      },
      set(ids) {
        const [_First, _Second, _ProductID] = ids;
        const First = _First || _First === 0 ? _First : '';
        const Second = _Second || _Second === 0 ? _Second : '';
        const ProductID = _ProductID || _ProductID === 0 ? _ProductID : '';
        this.setOrderManageRequestObj([['ProductClass', 'First'], First]);
        this.setOrderManageRequestObj([['ProductClass', 'Second'], Second]);
        this.setOrderManageRequestObj([['ProductID', ''], ProductID]);
        this.getDataList();
      },
    },
  },
  data() {
    return {
      dateList: [
        { name: '今天下单', ID: 'today' },
        { name: '昨天下单', ID: 'yesterday' },
        { name: '前天下单', ID: 'beforeyesterday' },
        { name: '本月下单', ID: 'curMonth' },
        { name: '上月下单', ID: 'lastMonth' },
      ],
      dateMenus: [
        { text: '今天', key: 'TodayDate' },
        { text: '昨天', key: 'YesterdayDate' },
        { text: '前天', key: 'BeforeYesterdayTimeDate' },
        { text: '本周', key: 'curWeekDate' },
        { text: '上周', key: 'lastWeekDate' },
        { text: '本月', key: 'curMonthDate' },
        { text: '上月', key: 'lastMonthDate' },
      ],
    };
  },
  methods: {
    ...mapMutations('orderModule', ['setOrderManageRequestObj']),
    ...mapActions('orderModule', ['getOrderTableData']),
    ...mapActions('common', ['getAreaList']),
    getDataList() {
      this.getOrderTableData();
    },
    clearCondition() {
      this.$store.commit('orderModule/clearConfigObj');
    },
  },
  created() {
    this.$store.dispatch('common/getAreaList');
    this.$store.dispatch('common/getProductClassifyData', { key: 6 });
    this.$store.dispatch('common/getAllProductNames');
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.order-manage-header {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 20px;
  padding-bottom: 0;
  .order-manage-header-content {
    max-width: 1720px;
    .row-one {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
      > ul {
        display: flex;
        margin-bottom: 22px;
        height: 20px;
        &.mp-order-status-select-wrap {
          width: 450px;
        }
        > li {
          &:first-of-type {
            margin-right: 10px;
          }
        }
        &:nth-of-type(1),
        &:nth-of-type(2) {
          margin-right: -10px;
        }
        &:nth-of-type(3) {
          margin-right: 0px;
        }
        &:nth-of-type(4) {
          margin-right: 20px;
        }
        &:nth-of-type(5) {
          margin-right: 59px;
        }
      }
      > .mp-common-comps-order-channel-selector-wrap {
        margin-top: -4px;
        margin-bottom: 22px;
        > main {
          > .mp-common-select-comp-wrap > div > input {
            width: 114px;
          }
        }
        &.status {
          margin-right: 33px;
        }
      }
      > .terminal-select {
        margin-left: 15px;
        > header {
          display: none;
        }
      }
      > .mp-common-comps-ep-cascader-comp-wrap {
        margin-bottom: 22px;
      }
    }
    .row-two {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      > div, > section {
        margin-bottom: 18px;
      }
    }
  }
  .text {
    font-size: 14px;
    text-align: right;
    line-height: 18px;
    font-weight: 600;
    color: $--color-text-primary;
    width: 5em;
  }
  .dorp-down {
    height: 22px;
    width: 114px;
    box-sizing: border-box;
    border-bottom: 1px solid $--border-color-base;
    &.el-dropdown {
      font-size: 14px;
      color: $--color-text-regular;
      .el-dropdown-menu {
        padding: 0;
        width: 112px;
        border-radius: 0px;
        &.el-popper[x-placement^="bottom"] {
          margin: 0;
          & > div::after,
          & > div {
            display: none;
          }
        }
      }
      & > span {
        color: $--color-text-regular;
        outline: none;
        display: flex;
        width: 100%;
        line-height: 18px;
        justify-content: space-between;
        padding: 0 5px 0 5px;
        box-sizing: border-box;
        > i {
          align-self: center;
          height: 15px;
          width: 10px;
          font-size: 14px;
          font-weight: 600;
          color: rgb(146, 146, 146);
        }
      }
    }
  }
}
</style>
