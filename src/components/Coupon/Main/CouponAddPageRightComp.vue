<template>
  <section class="mp-coupon-add-page-right-comp-wrap">
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
      />
    <checkbox-group-comp
      title="客户等级"
      :itemList='filterUserRankList'
      :selectList='selectUserRankList'
      @change="onUserRankListChange"
      />
    <!-- <tree-comp
      title="销售区域"
      :treeList='allAreaTreeList'
      :defaultCheckedKeys='defaultCheckedKeys'
      :handleChangeFunc='handleChangeFunc'
      checkAllTitle='所有地区'
      /> -->
    <p class="is-font-size-14 is-bold" style="color:#444;margin-bottom:10px">销售区域：</p>
    <NewAreaTreeSpreadComp v-model="AreaRange" :list='allAreaTreeList' />
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
