<template>
  <header class="mp-coupon-page-header-wrap">
    <ul>
      <li v-if="Permission.PermissionList.PermissionCoupon.Obj.Setup">
        <normal-btn-full @click.native="jump2AddPage" title="新建优惠券" />
      </li>
      <li class="selector-wrap-2">
        <!-- <radio-button-group-comp :radioList='couponTypeList' v-model='radio1' /> -->
        <!-- <AreaSelector
          :changePropsFunc="setCondition2ListData"
          :requestFunc="getCouponList"
          :RegionalID="condition2ListData.SellArea.RegionalID"
          :CityID="condition2ListData.SellArea.CityID"
          :CountyID="condition2ListData.SellArea.CountyID"
          :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
        /> -->
        <EpCascaderByArea
          class="mr-25"
          :getList="getCouponList"
          :setCondition="setCondition2ListData"
          :RegionalID="condition2ListData.SellArea.RegionalID"
          :CityID="condition2ListData.SellArea.CityID"
          :CountyID="condition2ListData.SellArea.CountyID"
          :typeList="[['SellArea', 'RegionalID'],['SellArea', 'CityID'],['SellArea', 'CountyID']]"
        />
        <!-- <ProductSelector
          useCustomer
          :changePropsFunc="setCondition2ListData"
          :requestFunc="getCouponList"
          :ClassID="condition2ListData.Product.ClassID"
          :TypeID="condition2ListData.Product.TypeID"
          :ProductID="condition2ListData.Product.ProductID"
          :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
        /> -->
        <EpCascaderByProduct
           class="mr-25"
           useCustomer
          :getList="getCouponList"
          :setCondition="setCondition2ListData"
          :First="condition2ListData.Product.ClassID"
          :Second="condition2ListData.Product.TypeID"
          :ProductID="condition2ListData.Product.ProductID"
          :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
         />
        <user-selector
          :changePropsFunc="setCondition2ListData"
          :requestFunc="getCouponList"
          isValueEq1
          :userType="condition2ListData.Customer.First"
          :userRank="condition2ListData.Customer.Second"
          :typeList="[['Customer', 'First'],['Customer', 'Second']]"
        />
      </li>
      <li>
        <RadioButtonGroupComp
          :radioList="CouponProvideStatusList"
          :requestFunc="getCouponList"
          v-model="CouponProvideStatus"
          :isFull="true"
          title="发放状态"
        />
      </li>
      <li class="last-row-selector-wrap">
        <RadioButtonGroupComp
          :radioList="CouponUseStatusList"
          :requestFunc="getCouponList"
          v-model="CouponUseStatus"
          :isFull="true"
          title="使用状态"
        />
        <div>
          <StaffSelector
            class="first-section"
            needlimit
            :changePropsFunc="setCondition2ListData"
            :requestFunc="getCouponList"
            :typeList="[['ApplyUserID', '']]"
            title="申请人"
            :value="condition2ListData.ApplyUserID"
          />
          <StaffSelector
            title="操作人"
            needlimit
            class="second-section"
            :changePropsFunc="setCondition2ListData"
            :requestFunc="getCouponList"
            :typeList="[['OperateUserID', '']]"
            :value="condition2ListData.OperateUserID"
          />
          <search-input-comp
            title="关键词"
            placeholder="请输入搜索关键词"
            :typeList="[['KeyWords', '']]"
            :requestFunc="getCouponList"
            :changePropsFunc="setCondition2ListData"
            :word="condition2ListData.KeyWords"
            @reset="clearCondition2ListData"
            :searchWatchKey="searchWatchKey"
          />
        </div>
      </li>
    </ul>
  </header>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import RadioButtonGroupComp from '@/components/common/RadioButtonGroupComp.vue';
// import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
// import ProductSelector from '@/components/common/SelectorComps/ProductSelectorIndex.vue';
import UserSelector from '@/components/common/SelectorComps/UserSelectorIndex.vue';
import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';
import EpCascaderByArea from '../../common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';
import EpCascaderByProduct from '../../common/SelectorComps/EpCascaderWrap/EpCascaderByProduct.vue';

export default {
  components: {
    normalBtnFull,
    RadioButtonGroupComp,
    // AreaSelector,
    // ProductSelector,
    UserSelector,
    StaffSelector,
    SearchInputComp,
    EpCascaderByArea,
    EpCascaderByProduct,
  },
  computed: {
    ...mapState('couponStore', ['condition2ListData', 'searchWatchKey']),
    ...mapState('common', ['CouponProvideStatusList', 'CouponUseStatusList', 'Permission']),
    CouponProvideStatus: {
      get() {
        return this.condition2ListData.ProvideStatus;
      },
      set(newVal) {
        this.setCondition2ListData([['ProvideStatus', ''], newVal]);
      },
    },
    CouponUseStatus: {
      get() {
        return this.condition2ListData.UseStatus;
      },
      set(newVal) {
        this.setCondition2ListData([['UseStatus', ''], newVal]);
      },
    },
  },
  methods: {
    ...mapMutations('couponStore', ['setCondition2ListData', 'clearCondition2ListData']),
    ...mapActions('couponStore', ['getCouponList']),
    jump2AddPage() {
      this.$router.push({ name: 'couponAdd', params: { type: 'add' } });
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-coupon-page-header-wrap {
  padding: 16px 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: $--color-white;
  color: $--color-text-primary;
  > ul {
    > li {
      > .normal-full-btn {
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
        }
        > ul {
          flex: none;
          margin-right: 15px;
          align-items: center;
          margin-top: 20px;
        }
        .mp-common-comps-radio-group-wrap {
          height: 25px;
          margin-top: 20px;
          margin-right: 70px;
        }
      }
      > section {
        margin-top: 20px;
      }
      &.last-row-selector-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          > section {
            margin-top: 20px;
            &:last-of-type {
              position: relative;
              top: -1px;
              margin-right: 30px;
            }
            &.first-section {
              margin-right: 6px;
            }
            &.second-section {
              margin-right: 45px;
            }
          }
        }
      }
    }
  }
}
</style>
