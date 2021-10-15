<template>
  <div class="mp-deposit-add-page-content-right-comp-wrap">
    <SingleBottomLineInputComp title="单笔订单大于等于" v-model="MinAmount" />
    <SingleBottomLineInputComp class='second-line' title="定金百分比" v-model="Percent" remark="%" />
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
    <checkbox-group-comp
      title="物流方式"
      :itemList='subExpressList'
      :selectList='selectSubExpressList'
      @change="onSubExpressListChange"
      :defaultProps="{ label: 'Name', value: 'ID' }"
      />
    <div>
      <span class="mp-head-page-title">是否扣物流费用：</span>
      <SingleRadioNew :list='radioList' v-model="IsChargeFreight" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SingleBottomLineInputComp from '@/components/common/SingleBottomLineInputComp.vue';
import CheckboxGroupComp from '@/components/common/CheckboxGroupComp.vue';
import SingleRadioNew from '@/components/common/SingleRadioNew.vue';

export default {
  components: {
    SingleBottomLineInputComp,
    CheckboxGroupComp,
    SingleRadioNew,
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    ...mapGetters('common', ['subExpressList']),
    ...mapState('deposit', ['objForDepositAdd']),
    MinAmount: {
      get() {
        return this.objForDepositAdd.MinAmount;
      },
      set(newVal) {
        this.$store.commit('deposit/setObjForDepositAdd', [['MinAmount', ''], newVal]);
      },
    },
    Percent: {
      get() {
        return this.objForDepositAdd.Percent;
      },
      set(newVal) {
        this.$store.commit('deposit/setObjForDepositAdd', [['Percent', ''], newVal]);
      },
    },
    IsChargeFreight: {
      get() {
        return this.objForDepositAdd.IsChargeFreight;
      },
      set(newVal) {
        this.$store.commit('deposit/setObjForDepositAdd', [['IsChargeFreight', ''], newVal]);
      },
    },
    filterUserTypeList() {
      if (!this.userTypeList) return [];
      return this.userTypeList.filter(item => item.Value || item.Value === 0);
    },
    selectUserTypeList() {
      return this.objForDepositAdd.CustomerTypeList.map(it => ({ CategoryID: it.ID }));
    },
    selectSubExpressList() {
      return this.objForDepositAdd.LogisticsList.map(it => ({ ID: it.ID }));
    },
    selectUserRankList() {
      return this.objForDepositAdd.GradeList.map(it => ({ CategoryID: it.ID }));
    },
    filterUserRankList() {
      if (!this.userRankList) return [];
      return this.userRankList.filter(item => item.Value || item.Value === 0);
    },
  },
  data() {
    return {
      val1: '',
      radioList: [{ name: '是', ID: true }, { name: '否', ID: false }],
    };
  },
  methods: {
    onUserTypeListChange(list) {
      const _list = list.map(it => ({ ID: it.CategoryID }));
      this.$store.commit('deposit/setObjForDepositAdd', [['CustomerTypeList', ''], _list]);
    },
    onUserRankListChange(list) {
      const _list = list.map(it => ({ ID: it.CategoryID }));
      this.$store.commit('deposit/setObjForDepositAdd', [['GradeList', ''], _list]);
    },
    onSubExpressListChange(list) {
      const _list = list.map(it => ({ ID: it.ID }));
      this.$store.commit('deposit/setObjForDepositAdd', [['LogisticsList', ''], _list]);
    },
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
    this.$store.dispatch('common/getExpressList');
  },
};
</script>

<style lang='scss'>
.mp-deposit-add-page-content-right-comp-wrap {
  > div {
    margin-bottom: 22px;
    > span:first-of-type {
      width: 9em;
      display: inline-block;
      text-align: right;
      font-size: 14px;
      font-weight: 600;
      color: #444;
    }
    &.mp-common-comp-single-bottom-line-input-wrap {
      > input {
        width: 215px;
      }
      > .remark {
        position: relative;
        top: 3px;
      }
      &.second-line {
        margin-bottom: 55px;
      }
    }
    &.mp-common-comps-checkbox-group-comp-wrap {
      > div {
          max-width: 580px;
          > label {
            width: 6em;
            margin-bottom: 10px;
            >  span {
              font-size: 12px;
            }
          }
      }
    }
    > span.mp-single-radio-wrap {
      margin-left: 16px;
    }
  }
}
</style>
