<template>
  <CommonDialogComp
    width="600px"
    top='15vh'
    title="选择优惠券:"
    :visible="dialogVisible"
    cancelText='取消'
    @cancle="dialogVisible = false"
    @open='handleCouponDialogOpen'
    @closed='dialogVisible = false'
    @submit="onSelectClick"
    class="mp-erp-select-coupon-dialog-comp-wrap"
  >
    <ul>
      <li v-for="it in couponList" :key="it.CouponID">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
      </li>
    </ul>
  </CommonDialogComp>
</template>

<script>
import { mapState } from 'vuex';
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    backLabel: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-select-coupon-dialog-comp-wrap{
  .el-dialog__body{
    padding: 20px 43px;
    padding-bottom: 0;
  }
  .coupon-dialog-content{
    height: 448px;
    li{
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
}
</style>
