<template>
  <section class="mp-coupon-add-page-right-comp-wrap">
    <div class="MaxReceiveNumber">
      <span>发放类型：</span>
      <el-checkbox v-model="UseNewCustomer">新人券</el-checkbox>
      <p style="font-size: 14px;min-width: 454px;">
        <span v-if="UseNewCustomer">
          数量：<el-input style="width: 60px;margin-right: 5px;" size="small" v-model.trim.number="SendNumber" maxlength="9"></el-input>张/人
        </span>
        <span class="is-origin">（此处仅针对新人券勾选，非新人券请不要勾选）</span>
      </p>
    </div>
    <checkbox-group-comp
      :itemList='orderTypeList'
      :selectList='selectOrderTypeList'
      @change="onOrderTypeListChange"
      :defaultProps="{ label: 'name', value: 'ID' }"
      />
    <checkbox-group-comp
      title="客户类型"
      :itemList='filterUserTypeList'
      :selectList='selectUserTypeList'
      @change="onUserTypeListChange"
      :isDisabled="UseNewCustomer"
      />
    <checkbox-group-comp
      title="客户等级"
      :itemList='filterUserRankList'
      :selectList='selectUserRankList'
      @change="onUserRankListChange"
      :isDisabled="UseNewCustomer"
      />
    <div class="MaxReceiveNumber">
      <span>客户领取：</span>
      <el-checkbox :disabled="UseNewCustomer" v-model="IsCustomerReceive">允许</el-checkbox>
      <template v-if="IsCustomerReceive">
        <span>单个客户最大可领取数量：</span>
        <el-input size="small" v-model.trim.number="MaxReceiveNumber" maxlength="9"></el-input>
      </template>
    </div>
    <!-- <tree-comp
      title="销售区域"
      :treeList='allAreaTreeList'
      :defaultCheckedKeys='defaultCheckedKeys'
      :handleChangeFunc='handleChangeFunc'
      checkAllTitle='所有地区'
      /> -->
    <p class="is-font-size-14 is-bold" style="color:#444;margin-bottom:10px">销售区域：</p>
    <NewAreaTreeSpreadComp :disabled="UseNewCustomer" v-model="AreaRange" :list='allAreaTreeList' ref="NewAreaTreeSpreadComp"/>
  </section>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import CheckboxGroupComp from '@/components/common/CheckboxGroupComp.vue';
// import TreeComp from '@/components/common/TreeComp.vue';
import NewAreaTreeSpreadComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp';

export default {
  components: {
    CheckboxGroupComp,
    // TreeComp,
    NewAreaTreeSpreadComp,
  },
  computed: {
    ...mapState('couponStore', ['condition2CouponSave']),
    ...mapState('common', ['orderCreateTypeList', 'userTypeList', 'userRankList']),
    ...mapGetters('common', ['allAreaTreeList']),
    orderTypeList() {
      if (!this.orderCreateTypeList) return [];
      return this.orderCreateTypeList.filter(item => !!item.ID);
    },
    filterUserTypeList() {
      if (!this.userTypeList) return [];
      return this.userTypeList.filter(it => it.CategoryID);
    },
    filterUserRankList() {
      if (!this.userRankList) return [];
      return this.userRankList.filter(item => !!item.CategoryID);
    },
    selectOrderTypeList() {
      return this.condition2CouponSave.OrderTypeList;
    },
    selectUserTypeList() {
      return this.condition2CouponSave.CustomerTypeList.map(it => ({ CategoryID: it.ID }));
    },
    selectUserRankList() {
      return this.condition2CouponSave.GradeList.map(it => ({ CategoryID: it.ID }));
    },
    // defaultCheckedKeys() {
    //   return this.condition2CouponSave.SellAreaArray.map(it => it.CountyID);
    // },
    AreaRange: {
      get() {
        return {
          IsIncludeIncreased: this.condition2CouponSave ? this.condition2CouponSave.IsIncludeIncreasedArea : false,
          List: this.condition2CouponSave ? this.condition2CouponSave.AreaList : [],
        };
      },
      set(val) {
        const { IsIncludeIncreased, List } = val;
        this.setCondition2CouponSave([['IsIncludeIncreasedArea', ''], IsIncludeIncreased || false]);
        this.setCondition2CouponSave([['AreaList', ''], List || []]);
      },
    },
    IsCustomerReceive: {
      get() {
        return this.condition2CouponSave.IsCustomerReceive;
      },
      set(val) {
        this.setCondition2CouponSave([['IsCustomerReceive', ''], val]);
      },
    },
    UseNewCustomer: {
      get() {
        return this.condition2CouponSave.UseNewCustomer;
      },
      set(val) {
        console.log();
        this.setCondition2CouponSave([['UseNewCustomer', ''], val]);
        if (val) {
          this.onUserTypeListChange(this.filterUserTypeList); // 客户类型
          this.onUserRankListChange(this.filterUserRankList); // 客户等级
          this.$refs.NewAreaTreeSpreadComp.getCheckAllHandler(true);
          this.IsCustomerReceive = false;
        } else {
          this.onUserTypeListChange([]); // 客户类型
          this.onUserRankListChange([]); // 客户等级
          this.$refs.NewAreaTreeSpreadComp.getCheckAllHandler(false);
        }
      },
    },
    SendNumber: {
      get() {
        return this.condition2CouponSave.SendNumber;
      },
      set(val) {
        this.setCondition2CouponSave([['SendNumber', ''], val]);
      },
    },
    MaxReceiveNumber: {
      get() {
        return this.condition2CouponSave.MaxReceiveNumber;
      },
      set(val) {
        this.setCondition2CouponSave([['MaxReceiveNumber', ''], val]);
      },
    },
  },
  methods: {
    ...mapMutations('couponStore', ['setCondition2CouponSave']),
    ...mapActions('common', ['getUserClassify', 'getAreaList']),
    onOrderTypeListChange(list) {
      this.setCondition2CouponSave([['OrderTypeList', ''], list]);
    },
    onUserTypeListChange(list) {
      const _list = list.map(it => ({ ID: it.CategoryID }));
      this.setCondition2CouponSave([['CustomerTypeList', ''], _list]);
    },
    onUserRankListChange(list) {
      const _list = list.map(it => ({ ID: it.CategoryID }));
      this.setCondition2CouponSave([['GradeList', ''], _list]);
    },
    // handleChangeFunc(checkedNodes) {
    //   const _list = checkedNodes.filter(it => it.Level === 3).map(it => ({ CountyID: it.ID }));
    //   this.setCondition2CouponSave([['SellAreaArray', ''], _list]);
    // },
  },
  mounted() {
    this.getUserClassify();
    this.getAreaList();
  },
};
</script>

<style lang="scss">
.mp-coupon-add-page-right-comp-wrap {
  padding-left: 60px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
  width: 95%;
  > div {
    > span {
      font-weight: 700;
    }
    margin-bottom: 20px;
    &.MaxReceiveNumber {
      display: flex;
      align-items: center;
      height: 32px;
      > span {
        color: #444;
        font-size: 14px;
        margin-right: 15px;
        line-height: 30px;
      }
      > .el-checkbox {
        margin-right: 30px;
        .el-checkbox__label {
          font-size: 14px;
        }
      }
      > .el-input {
        width: 120px;
        margin-right: 6px;
      }
      > span:last-of-type {
        font-weight: 700;
        font-size: 14px;
      }
    }
  }
  > section {
    width: 88%;
    > header {
      font-weight: 700;
      margin-bottom: 12px;
    }
  }
}
</style>
