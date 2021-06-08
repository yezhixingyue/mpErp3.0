<template>
  <section class="mp-payment-type-select-wrap">
    <header>付款状态：</header>
    <main>
      <ul class="type-list">
        <li :class="{'is-selected':selectedItemArr[0]}" @click="handleClick(0, '全部')">全部</li>
        <li
          :class="{'is-selected':selectedItemArr[1]}"
          @click="handleClick(1, '待付款')"
          class="li-today"
        >待付款</li>
        <li :class="{'is-selected':selectedItemArr[2]}" @click="handleClick(2, '已付款')">已付款</li>
        <li :class="{'is-selected':selectedItemArr[3]}" @click="handleClick(3, '已取消')">已取消</li>
      </ul>
    </main>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('paymentModule', ['selectedItemArr']),
    ...mapState('common', ['PayStatusList']),
  },
  methods: {
    ...mapMutations('paymentModule', ['setPaymentStatus']),
    ...mapActions('paymentModule', ['getPaymentListTableData']),
    handleClick(i, value) {
      const id = this.getStatusID(value);
      this.setPaymentStatus([i, id]);
      this.getPaymentListTableData();
    },
    getStatusID(value) {
      const list = this.PayStatusList;
      for (let i = 0; i < list.length; i += 1) {
        if (list[i].Name === value) return list[i].ID;
      }
      return '';
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-payment-type-select-wrap {
  margin-right: 10%;
  font-size: 14px;
  display: flex;
  > header {
    font-size: 14px;
    text-align: right;
    line-height: 28px;
    font-weight: 600;
    color: $--color-text-table;
    width: 70px;
  }
  > main > ul {
    margin-left: 10px;
    font-size: 14px;
    user-select: none;
    > li {
      display: inline-block;
      padding: 0 20px;
      box-sizing: border-box;
      height: 28px;
      line-height: 26px;
      border: 1px solid $--border-color-base;
      border-right-color: transparent;
      background-color: $--bg-color-base;
      cursor: pointer;
      &.is-selected {
        border-right: 1px solid $--border-color-base;
        color: $--color-primary;
        border-color: $--color-primary !important;
        background-color: $--color-white;
      }
      &:hover {
        background-color: $--color-text-table-hover;
      }
      &:not(:first-of-type) {
        width: 98px;
      }
      &:last-of-type {
        border-right: 1px solid $--border-color-base;
      }
    }
  }
  @media screen and (max-width: 1610px) {
    margin-right: 8%;
  }
}
</style>
