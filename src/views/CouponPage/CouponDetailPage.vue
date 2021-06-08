<template>
  <div class="mp-coupon-use-list-detail-page-wrap">
    <coupon-deatil-list-header />
    <coupon-deatil-list-content-comp />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CouponDeatilListHeader from '@/components/Coupon/Header/CouponDeatilListHeader.vue';
import CouponDeatilListContentComp from '@/components/Coupon/Main/CouponDeatilListContentComp.vue';

export default {
  components: {
    CouponDeatilListHeader,
    CouponDeatilListContentComp,
  },
  computed: {
    ...mapState('common', ['Permission']),
  },
  mounted() {
    if (!this.Permission || !this.Permission.PermissionList.PermissionCoupon.Obj.Query) {
      this.$router.replace('/notauth');
    }
  },
};
</script>

<style lang='scss'>
.mp-coupon-use-list-detail-page-wrap {
  height: 100%;
  width: 100%;
}
</style>
