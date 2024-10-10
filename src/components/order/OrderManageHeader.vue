<template>
  <div class="order-manage-header">
    <ul class="order-manage-header-content">
      <li class="row-one">
        <!-- 该动态类名为判断当前页面是否为包裹列表页面，如果是则做针对样式处理，另设置值方式为在对应table组件中所设置 -->
        <!-- <AreaSelector /> -->
        <!-- <ProductSelector /> -->
        <EpCascaderByArea
          class="mr-12 mb-20"
          :getList="getDataList"
          :setCondition="setOrderManageRequestObj"
          :RegionalID="objForOrderList.SellArea.RegionalID"
          :CityID="objForOrderList.SellArea.CityID"
          :CountyID="objForOrderList.SellArea.CountyID"
          :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
        />
        <EpCascaderByProduct
          class="mr-12 mb-20"
          :getList="getDataList"
          :setCondition="setOrderManageRequestObj"
          :First="objForOrderList.ProductClass.First"
          :Second="objForOrderList.ProductClass.Second"
          :ProductID="objForOrderList.ProductID"
          :typeList="[['ProductClass', 'First'],['ProductClass', 'Second'],['ProductID', '']]"
         />
        <!-- <ProductSelector
          :changePropsFunc="setOrderManageRequestObj"
          :requestFunc="getDataList"
          :ClassID="objForOrderList.ProductClass.First"
          :TypeID="objForOrderList.ProductClass.Second"
          :ProductID="objForOrderList.ProductID"
          :typeList="[['ProductClass', 'First'],['ProductClass', 'Second'],['ProductID', '']]" /> -->
        <UserSelector />
        <StaffSelector />
      </li>
      <li class="row-one">
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
        <el-checkbox v-model="localOnlyShowOwnQuestionOrder" style="margin-right: 30px;margin-top: -1px;margin-left: -10px;" v-show="isProblemShipment">
          <span style="font-size: 12px;">仅显示自己的问题件</span>
        </el-checkbox>
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
          minDate="2022-01-01 00:00:00"
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
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';
// import ProductSelector from '@/components/common/SelectorComps/ProductSelectorIndex.vue';
import EpCascaderByArea from '../common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';
import EpCascaderByProduct from '../common/SelectorComps/EpCascaderWrap/EpCascaderByProduct.vue';

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
    // EpCascader,
    EpCascaderByArea,
    EpCascaderByProduct,
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
    isProblemShipment() {
      const t = this.OrderStatusList.find(it => it.ID === this.objForOrderList.Status);

      return !!(t && t.isProblemShipment);
    },
    localOnlyShowOwnQuestionOrder: {
      get() {
        return this.objForOrderList.OnlyShowOwnQuestionOrder;
      },
      set(val) {
        this.setOrderManageRequestObj([['OnlyShowOwnQuestionOrder'], val]);
        this.getDataList();
      },
    },
    // :changePropsFunc="setOrderManageRequestObj"
    //       :requestFunc="getDataList"
    //       :ClassID="objForOrderList.ProductClass.First"
    //       :TypeID="objForOrderList.ProductClass.Second"
    //       :ProductID="objForOrderList.ProductID"
    //       :typeList="[['ProductClass', 'First'],['ProductClass', 'Second'],['ProductID', '']]"
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
          margin-right: 38px;
        }
      }
      > .terminal-select {
        margin-left: 25px;
        > header {
          display: none;
        }
      }
      > .mp-common-comps-ep-cascader-comp-wrap {
        margin-bottom: 22px;
        > .title {
          margin-right: 15px
        }
      }
      > .order-express-selector-wrap {
        margin-right: 40px;
        > .text {
          margin-right: 15px;
        }
      }
      > .mp-order-user-select-wrap {
        margin-right: 10px;
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
