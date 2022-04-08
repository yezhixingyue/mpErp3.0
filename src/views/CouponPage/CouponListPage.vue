<template>
  <div class="mp-coupon-page-wrap">
    <coupon-header />
    <coupon-table-list-comp
    @handleOpenDialog='handleOpenDialog' />
    <dialog-2-generate-coupons
     :dialogVisible='dialogVisible'
     :dialogData='dialogData'
     :dialogIndex='dialogIndex'
     :dialogProductInfo='dialogProductInfo'
     @close='handleDialogClose' />
    <footer>
      <count-comp
        :count='count'
        :pageSize='condition2ListData.PageSize'
        :watchPage='condition2ListData.Page'
        :handlePageChange='handlePageChange'
        />
    </footer>
  </div>
</template>

<script>
import CountComp from '@/components/common/Count.vue';
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import CouponHeader from '../../components/Coupon/Header/CouponHeaderIndex.vue';
import CouponTableListComp from '../../components/Coupon/Main/CouponTableListComp.vue';
import Dialog2GenerateCoupons from '../../components/Coupon/Main/Dialog2GenerateCoupons.vue';

export default {
  name: 'CouponListPage',
  mixins: [recordScrollPositionMixin('.mp-coupon-page-wrap .el-table__body-wrapper')],
  components: {
    CouponHeader,
    CouponTableListComp,
    CountComp,
    Dialog2GenerateCoupons,
  },
  computed: {
    ...mapState('couponStore', ['count', 'condition2ListData']),
  },
  data() {
    return {
      dialogVisible: false,
      dialogData: null,
      dialogIndex: -1,
      dialogProductInfo: [],
    };
  },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('couponStore/getCouponList', page);
    },
    handleOpenDialog([data, index, productInfo]) {
      this.dialogVisible = true;
      this.dialogData = data;
      this.dialogIndex = index;
      this.dialogProductInfo = productInfo;
    },
    handleDialogClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-coupon-page-wrap {
  width: 100%;
  height: 100%;
  background-color: $--bg-color-base;
  padding-left: 8px;
  box-sizing: border-box;
}
</style>
