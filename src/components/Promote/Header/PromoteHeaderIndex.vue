<template>
  <header class="mp-promote-page-header-wrap">
    <ul>
      <li>
        <normal-btn-full
         @click.native='onClick'
         title="新建活动促销"
         v-if="Permission && Permission.PermissionList.PermissionPromote.Obj.Setup"
         />
      </li>
      <li class="selector-wrap-2">
        <!-- <AreaSelector
          :changePropsFunc='setPromoteListRequestObj'
          :requestFunc='getPromoteList'
          :RegionalID='promoteListRequestObj.SellArea.RegionalID'
          :CityID='promoteListRequestObj.SellArea.CityID'
          :CountyID='promoteListRequestObj.SellArea.CountyID'
          :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
         />
        <ProductSelector
          useCustomer
          :changePropsFunc='setPromoteListRequestObj'
          :requestFunc='getPromoteList'
          :ClassID='promoteListRequestObj.Product.ClassID'
          :TypeID='promoteListRequestObj.Product.TypeID'
          :ProductID='promoteListRequestObj.Product.ProductID'
          :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
         /> -->
        <EpCascaderByArea
           class="mr-25"
          :getList="getPromoteList"
          :setCondition="setPromoteListRequestObj"
          :RegionalID="promoteListRequestObj.SellArea.RegionalID"
          :CityID="promoteListRequestObj.SellArea.CityID"
          :CountyID="promoteListRequestObj.SellArea.CountyID"
          :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
        />
        <EpCascaderByProduct
           class="mr-24"
           useCustomer
          :getList="getPromoteList"
          :setCondition="setPromoteListRequestObj"
          :First="promoteListRequestObj.Product.ClassID"
          :Second="promoteListRequestObj.Product.TypeID"
          :ProductID="promoteListRequestObj.Product.ProductID"
          :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
        />
        <UserSelector
          :changePropsFunc='setPromoteListRequestObj'
          :requestFunc='getPromoteList'
          :userType='promoteListRequestObj.Customer.First'
          :userRank='promoteListRequestObj.Customer.Second'
          :typeList="[['Customer', 'First'],['Customer', 'Second']]"
         />
        <OrderChannelSelector
          :options='orderCreateTypeList'
          :requestFunc='getPromoteList'
          :changePropsFunc='setPromoteListRequestObj'
          :typeList="[['OrderType', '']]"
          :value='promoteListRequestObj.OrderType'
         />
      </li>
      <li class="selector-wrap-3">
        <div class="left">
          <!-- <order-channel-selector
            class="active-section"
            label='活动状态'
            :options='PromoteStatusList'
            :changePropsFunc='setPromoteListRequestObj'
            type='Status'
            :value='promoteListRequestObj.Status'
           /> -->
           <radio-button-group-comp
            :radioList="PromoteStatusList"
            :requestFunc='getPromoteList'
            class="status-section"
            v-model="localStatus"
            :isFull="true"
            title='活动状态'
            />
          <staff-selector class="first-section"
            needlimit
            :changePropsFunc='setPromoteListRequestObj'
            :requestFunc='getPromoteList'
            :typeList="[['ApplyUserID', '']]"
            title="申请人"
            :value='promoteListRequestObj.ApplyUserID'
           />
          <staff-selector
            title="操作人"
            needlimit
            :changePropsFunc='setPromoteListRequestObj'
            :requestFunc='getPromoteList'
            :typeList="[['OperateUserID', '']]"
            :value='promoteListRequestObj.OperateUserID'
           />
        </div>
        <div>
        </div>
      </li>
      <li class="selector-wrap-4">
        <LineDateSelectorComp
          :changePropsFunc='setPromoteListRequestObj'
          :requestFunc='getPromoteList'
          :isFull="true"
          :typeList="[['DateType', ''], ['ValidTime', 'key'], ['ValidTime', 'value']]"
          :dateValue='promoteListRequestObj.DateType'
          :dateList="dateList"
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
         />
        <search-input-comp
          class="search-section"
          :typeList="[['KeyWords', '']]"
          :requestFunc='getPromoteList'
          :changePropsFunc='setPromoteListRequestObj'
          :word='promoteListRequestObj.KeyWords'
          @reset='clearPromoteListRequestObj'
          :searchWatchKey="searchWatchKey"
         />
      </li>
    </ul>
  </header>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
// import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
// import ProductSelector from '@/components/common/SelectorComps/ProductSelectorIndex.vue';
import UserSelector from '@/components/common/SelectorComps/UserSelectorIndex.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import RadioButtonGroupComp from '@/components/common/RadioButtonGroupComp.vue';
import EpCascaderByArea from '../../common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';
import EpCascaderByProduct from '../../common/SelectorComps/EpCascaderWrap/EpCascaderByProduct.vue';
// import ElDateRangeSelector from '@/components/common/SelectorComps/ElDateRangeSelector';


export default {
  components: {
    normalBtnFull,
    // AreaSelector,
    // ProductSelector,
    UserSelector,
    OrderChannelSelector,
    StaffSelector,
    SearchInputComp,
    LineDateSelectorComp,
    RadioButtonGroupComp,
    EpCascaderByArea,
    EpCascaderByProduct,
    // ElDateRangeSelector,
  },
  data() {
    return {
      dateMenus: [
        { text: '不限', key: 'all' },
        { text: '今天', key: 'TodayDate' },
        { text: '昨天', key: 'YesterdayDate' },
        { text: '前天', key: 'BeforeYesterdayTimeDate' },
        { text: '本月', key: 'curMonthDate' },
        { text: '上月', key: 'lastMonthDate' },
      ],
      dateList: [
        { name: '不限', ID: 'all' },
        { name: '今天', ID: 'today' },
        { name: '昨天', ID: 'yesterday' },
        { name: '前天', ID: 'beforeyesterday' },
        { name: '本月', ID: 'curMonth' },
        { name: '上月', ID: 'lastMonth' },
      ],
    };
  },
  computed: {
    ...mapState('common', ['orderCreateTypeList', 'PromoteStatusList', 'Permission']),
    ...mapState('promoteStore', ['promoteListRequestObj', 'searchWatchKey']),
    localStatus: {
      get() {
        return this.promoteListRequestObj.Status;
      },
      set(newVal) {
        this.setPromoteListRequestObj([['Status', ''], newVal]);
      },
    },
    UserDefinedTimeIsActive() {
      return this.promoteListRequestObj.DateType === '' && !!this.promoteListRequestObj.ValidTime.key && !!this.promoteListRequestObj.ValidTime.value;
    },
  },
  methods: {
    ...mapMutations('promoteStore', ['setPromoteListRequestObj', 'clearPromoteListRequestObj', 'clearPromoteAddEditObjClassType']),
    ...mapActions('promoteStore', ['getPromoteList']),
    onClick() {
      const type = 'add';
      this.clearPromoteAddEditObjClassType();
      this.$router.push({ name: 'promoteAdd', params: { type } });
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-promote-page-header-wrap {
  padding: 16px 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: $--color-white;
  color: $--color-text-primary;
  margin-bottom: 10px;
  > ul {
    > li {
      >.normal-full-btn {
        margin: 0;
        line-height: 26px;
        width: 120px;
        border-radius: 2px;
        background-color: $--color-primary;
        border-color: $--color-primary;
        font-size: 14px;
        letter-spacing: 1px;
        height: 30px;
      }
      display: flex;
      flex-wrap: wrap;
      &.selector-wrap-2 {
        > div {
          flex: none;
          margin-top: 24px;
          // margin-right: 70px;
        }
        > ul {
          flex: none;
          margin-right: 15px;
          align-items: center;
          margin-top: 20px;
        }
        > section {
          flex: none;
          margin-top: 20px;
        }
      }
      &.selector-wrap-3 {
        justify-content: space-between;
        > div {
          display: flex;
          flex-wrap: wrap;
          > section {
            margin-top: 18px;
            margin-right: 58px;
            &.first-section {
                margin-right: 30px;
            }
            // &.active-section {
            //     margin-right: 235px;
            // }
            &.status-section {
              margin-right: 125px;
            }
            // &.qperate-section {
            //   margin-right: 30px;
            // }
          }
        }
      }
      &.selector-wrap-4 {
        justify-content: space-between;
        .search-section {
            position: relative;
            top: -2px;
            margin-right: 0;
            height: 30px;
            margin-top: 18px;
        }
        .mp-line-date-selector-wrap.mp-line-date-selector-wrap-is-full {
          margin-top: 18px;
        }
      }
    }
  }
  .mp-radio-group-full-box.el-radio-group > .el-radio-button {
    > .el-radio-button__inner {
      width: 80px;
    }
    width: 80px;
  }
  .mp-line-date-selector-wrap-is-full {
    .mp-radio-group-full-box.el-radio-group > .el-radio-button {
      > .el-radio-button__inner {
        width: 80px;
      }
      width: 80px;
    }
    .manual-select-date-box {
      min-width: 160px;
    }
  }
}
</style>
