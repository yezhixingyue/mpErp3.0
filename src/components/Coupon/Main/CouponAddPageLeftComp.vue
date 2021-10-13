<template>
  <section class="mp-coupon-add-page-left-comp-wrap">
    <header>
      <single-bottom-line-input-comp v-model="couponAmount" /> <!-- 这2个为数字类型，后面进行相关约束 -->
      <single-bottom-line-input-comp title='满多少可用' v-model="minPayAmount" />
      <single-bottom-line-input-comp title='发放数量' remark='张' v-model="totalNumber" />
    </header>
    <div class="content">
        <disconnect-type-date-picker-comp
          isLineStyle
          title="开始领取时间"
          :DateValue='condition2CouponSave.ProvideStartTime'
          :handleFunc="newVal=>this.setCondition2CouponSave([['ProvideStartTime', ''], newVal])"
          showCheck
          :StartNow='condition2CouponSave.ProvideNow'
          :setStartNowFunc="newVal=>this.setCondition2CouponSave([['ProvideNow', ''], newVal])"
         />
        <disconnect-type-date-picker-comp
          isLineStyle
          title="结束领取时间"
          :DateValue='condition2CouponSave.ProvideEndTime'
          :handleFunc="newVal=>this.setCondition2CouponSave([['ProvideEndTime', ''], newVal])"
         />
        <disconnect-type-date-picker-comp
          isLineStyle
          title="有效期开始"
          :DateValue='condition2CouponSave.ValidStartTime'
          :handleFunc="newVal=>this.setCondition2CouponSave([['ValidStartTime', ''], newVal])"
          showCheck
          :StartNow='condition2CouponSave.StartNow'
          :setStartNowFunc="newVal=>this.setCondition2CouponSave([['StartNow', ''], newVal])" />
        <disconnect-type-date-picker-comp
          isLineStyle
          title="有效期结束"
          :DateValue='condition2CouponSave.ValidEndTime'
          :handleFunc="newVal=>this.setCondition2CouponSave([['ValidEndTime', ''], newVal])"
         />
        <staff-selector
          isLineStyle
          :changePropsFunc='setCondition2CouponSave'
          :typeList="[['ApplyUser', 'StaffID']]"
          :watchValue='addPageCurStaff'
          :value='condition2CouponSave.ApplyUser.StaffID'
          title="申请人"
         />
    </div>
    <footer>
        <tree-comp
         title="选择产品"
         isProduct
         :treeList='allProductClassify'
         :defaultCheckedKeys='defaultCheckedKeys'
         :handleChangeFunc='handleChangeFunc'
         checkAllTitle='所有产品'
         />
    </footer>
  </section>
</template>

<script>
import TreeComp from '@/components/common/TreeComp.vue';
import SingleBottomLineInputComp from '@/components/common/SingleBottomLineInputComp.vue';
import DisconnectTypeDatePickerComp from '@/components/common/DisconnectTypeDatePickerComp.vue';
import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    SingleBottomLineInputComp,
    DisconnectTypeDatePickerComp,
    StaffSelector,
    TreeComp,
  },
  computed: {
    ...mapGetters('common', ['allProductClassify']),
    ...mapState('couponStore', ['condition2CouponSave', 'addPageCurStaff']),
    watchValue4Tree() {
      return this.watchValue;
    },
    defaultCheckedKeys() {
      return this.condition2CouponSave.ProductList.map(it => it.ProductID);
    },
    // 优惠券面值金额
    couponAmount: {
      get() {
        return this.condition2CouponSave.Data.Amount;
      },
      set(newVal) {
        this.setCondition2CouponSave([['Data', 'Amount'], newVal]);
      },
    },
    // 优惠券满减金额
    minPayAmount: {
      get() {
        return this.condition2CouponSave.Data.MinPayAmount;
      },
      set(newVal) {
        this.setCondition2CouponSave([['Data', 'MinPayAmount'], newVal]);
      },
    },
    // 优惠券发放数量
    totalNumber: {
      get() {
        return this.condition2CouponSave.Data.TotalNumber;
      },
      set(newVal) {
        this.setCondition2CouponSave([['Data', 'TotalNumber'], newVal]);
      },
    },
  },
  methods: {
    ...mapMutations('couponStore', ['setCondition2CouponSave']),
    ...mapActions('common', ['getProductList', 'getAllProductNames']),
    handleChangeFunc(checkedNodes) {
      const _list = checkedNodes.filter(_it => _it.ShowName).map(_it => {
        const t = _it.ClassifyList.find(({ Type }) => Type === 1);
        if (t) {
          return {
            FirstLevelID: t.FirstLevel.ID,
            SecondLevelID: t.SecondLevel.ID,
            ProductID: _it.ID,
            ProductName: _it.Name,
          };
        }
        return null;
      }).filter(_it => _it);
      this.setCondition2CouponSave([['ProductList', ''], _list]);
    },
  },
  mounted() {
    this.getProductList();
    this.getAllProductNames();
  },
};
</script>

<style lang="scss">
@import "@/assets/css/common/var.scss";
.mp-coupon-add-page-left-comp-wrap {
  box-sizing: border-box;
  padding-left: 45px;
  height: 100%;
  width: 97%;
  overflow-y: auto;
  > header > div {
    margin-bottom: 14px;
  }
  > .content {
    margin-top: 30px;
    > section {
        > header {
          min-width: 7em;
        }
        margin-top: 18px;
    }
    > div {
      > span {
        min-width: 7em;
        font-weight: 600;
      }
      margin-bottom: 12px;
    }
  }
  > footer {
    margin-top: 17px;
    > section {
      > header {
        width: 7em;
        text-align: right;
        font-weight: 700;
        margin-bottom: 12px;
      }
      > div {
        padding-left: 56px;
      }
    }
  }
}
</style>
