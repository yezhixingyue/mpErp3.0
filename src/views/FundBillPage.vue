<template>
  <article class="mp-fund-bill-page-wrap">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- <el-tab-pane disabled label="" name=""></el-tab-pane> -->
        <el-tab-pane label="客户余额流水" name="second">
        </el-tab-pane>
        <el-tab-pane label="客户订单流水" name="third">
        </el-tab-pane>
      </el-tabs>
      <keep-alive>
        <BalanceTypePageComp v-if="activeName === 'second'" />
      </keep-alive>
      <keep-alive>
        <OrderTypePageComp v-if="activeName === 'third'" />
      </keep-alive>
  </article>
</template>

<script>
import BalanceTypePageComp from '@/components/FundBill/BalanceTypePageComp.vue';
import OrderTypePageComp from '@/components/FundBill/OrderTypePageComp.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapState } from 'vuex';

export default {
  name: 'FundBillPage',
  mixins: [recordScrollPositionMixin('.mp-fund-bill-page-wrap .el-table__body-wrapper')],
  components: {
    BalanceTypePageComp,
    OrderTypePageComp,
  },
  data() {
    return {
      activeName: 'second',
    };
  },
  computed: {
    ...mapState('fundBill', ['balanceTypeDataList', 'orderTypeDataList']),
  },
  methods: {
    handleClick() {
      switch (this.activeName) {
        case 'second':
          if (this.balanceTypeDataList.length === 0) {
            this.$store.dispatch('fundBill/getCustomerBill');
          }
          break;
        case 'third':
          if (this.orderTypeDataList.length === 0) {
            this.$store.dispatch('fundBill/getCustomerOrderBill');
          }
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.$store.commit('fundBill/clearConditionDate4Balance');
    this.$store.commit('fundBill/clearConditionDate4Order');
    this.$store.commit('fundBill/setBalanceTypeDataList', [[], 0]);
    this.$store.commit('fundBill/setOrderTypeDataList', [[], 0]);
    this.$store.dispatch('fundBill/getCustomerBill');
  },
};
</script>

<style lang="scss">
.mp-fund-bill-page-wrap {
  width: 100%;
  height: 100%;
  > .el-tabs {
    > .el-tabs__header {
      background-color: rgb(245, 245, 245);
      padding-left: 30px;
      padding-top: 13px;
      .el-tabs__nav {
        // border: none;
        > div {
          // border-top: 1px solid #E4E7ED;
          height: 38px;
          // background-color: rgb(245, 245, 245);
          line-height: 36px;
          // &:last-of-type {
          //   border-right: 1px solid #E4E7ED;
          // }
          &.is-active {
            position: relative;
            background-color: #fff;
            &::before {
              content: "";
              position: absolute;
              height: 2px;
              width: calc(100%);
              background-color: rgb(38, 188, 249);
              left: 0px;
              top: 0px;
              border-radius: 2px;
            }
          }
          font-size: 13px;
          // font-weight: 600;
        }
      }
    }
  }
}
</style>
