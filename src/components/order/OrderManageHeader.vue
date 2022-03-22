<template>
  <div class="order-manage-header">
    <ul class="order-manage-header-content">
      <li class="row-one">
        <!-- 该动态类名为判断当前页面是否为包裹列表页面，如果是则做针对样式处理，另设置值方式为在对应table组件中所设置 -->
        <AreaSelector />
        <!-- <ProductSelector /> -->
        <ProductSelector
          :changePropsFunc="setOrderManageRequestObj"
          :requestFunc="getDataList"
          :ClassID="objForOrderList.ProductClass.First"
          :TypeID="objForOrderList.ProductClass.Second"
          :ProductID="objForOrderList.ProductID"
          :typeList="[['ProductClass', 'First'],['ProductClass', 'Second'],['ProductID', '']]" />
        <UserSelector />
        <StaffSelector />
        <ExpressSelector />
        <OrderStatusSelector />
        <OrderChannelSelector
          :options='orderCreateTypeList'
          :requestFunc='getDataList'
          :changePropsFunc='setOrderManageRequestObj'
          :typeList="[['OrderType', '']]"
          :value='objForOrderList.OrderType'
          label='下单方式'
          key='order-OrderType'
         />
        <OrderChannelSelector
          class="terminal-select"
          :options='selfHelpOrderTypeList'
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
        <ElDateRangeSelector v-model="conditionDate" :max-span="366" :menus="dateMenus" />
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
import { mapState, mapMutations, mapActions } from 'vuex';
import AreaSelector from '@/components/order/orderListHeader/AreaSelector.vue';
// import ProductSelector from '@/components/order/orderListHeader/ProductSelector.vue';
import UserSelector from '@/components/order/orderListHeader/UserSelector.vue';
import StaffSelector from '@/components/order/orderListHeader/StaffSelector.vue';
import ExpressSelector from '@/components/order/orderListHeader/ExpressSelector.vue';
import OrderStatusSelector from '@/components/order/orderListHeader/OrderStatusSelector.vue';
// import DeliverStatusSelector from '@/components/order/orderListHeader/DeliverStatusSelector.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
import ProductSelector from '@/components/common/SelectorComps/ProductSelectorIndex.vue';

export default {
  components: {
    ExpressSelector,
    AreaSelector,
    ProductSelector,
    UserSelector,
    StaffSelector,
    OrderStatusSelector,
    OrderChannelSelector,
    ElDateRangeSelector,
    SearchInputComp,
  },
  computed: {
    ...mapState('common', ['orderCreateTypeList', 'selfHelpOrderTypeList']),
    ...mapState('orderModule', ['objForOrderList', 'orderListData']),
    conditionDate: {
      get() {
        return [this.objForOrderList.PlaceDate.First, this.objForOrderList.PlaceDate.Second];
      },
      set(newVal) {
        const [key, value] = newVal?.length === 2 ? newVal : ['', ''];
        this.setOrderManageRequestObj([['PlaceDate', 'First'], key]);
        this.setOrderManageRequestObj([['PlaceDate', 'Second'], value]);
        this.getDataList();
      },
    },
  },
  data() {
    return {
      dateMenus: [
        { text: '今天', key: 'TodayDate' },
        { text: '昨天', key: 'YesterdayDate' },
        { text: '前天', key: 'BeforeYesterdayTimeDate' },
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
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
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
          margin-right: 65px;
        }
      }
      > .mp-common-comps-order-channel-selector-wrap {
        margin-left: -128px;
        margin-top: -4px;
        > main {
          > .mp-common-select-comp-wrap > div > input {
            width: 114px;
          }
        }
      }
      > .terminal-select {
        margin-left: 15px;
        > header {
          display: none;
        }
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
