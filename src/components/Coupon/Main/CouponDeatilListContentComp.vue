<template>
  <section class="mp-coupon-deatail-list-content-comp-wrap">
    <CouponDeatilListContentTableComp />
    <bind-users-dia-comp />
    <OrderDeatailDialogComp />
    <footer>
      <count-comp
        :count='couponUseListCount'
        :watchPage='condition2CouponUseList.Page'
        :handlePageChange='handlePageChange'
        />
       <div class="go-back-box">
          <normalBtnFull
            @click.native="handleBackClick" class='blue-full-color-btn-styles' title='<<返回列表' />
       </div>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CountComp from '@/components/common/Count.vue';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import CouponDeatilListContentTableComp from './CouponDeatilListContentTableComp.vue';
import BindUsersDiaComp from '../Comps/BindUsersDiaComp.vue';
import OrderDeatailDialogComp from '../Comps/OrderDeatailDialogComp.vue';

export default {
  components: {
    CouponDeatilListContentTableComp,
    CountComp,
    normalBtnFull,
    BindUsersDiaComp,
    OrderDeatailDialogComp,
  },
  computed: {
    ...mapState('couponStore', ['couponUseListCount', 'condition2CouponUseList']),
  },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('couponStore/getCouponUseList', page);
    },
    handleBackClick() {
      this.$router.replace('/couponList');
    },
  },
  beforeDestroy() {
    this.$store.commit('couponStore/setCouponUseListData', [[], '']);
    this.$store.commit('couponStore/clearCondition2CouponUseList');
    this.$store.commit('couponStore/setInfo2CouponUseListPage', [null, null]);
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-coupon-deatail-list-content-comp-wrap {
  padding-top: 10px;
  background-color: $--bg-color-base;
  > footer {
    > .go-back-box {
      height: 70px;
      background-color: #fff;
      text-align: center;
      padding-top: 15px;
      box-sizing: border-box;
      > button {
        width: 120px;
      }
    }
    > .count-wrap {
      padding-right: 55px;
      .count {
        margin-left: 45px;
      }
    }
  }
}
</style>
