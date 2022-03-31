<template>
  <el-dialog
  title="查看详情"
  :visible.sync="isShowDia"
  width="880px"
  top="6.5vh"
  :modal='false'
  v-dialogDrag
  custom-class="mp-unpay-list-dia-wrap mp-img-style-header"
  :before-close="handleClose">
  <OrderDeatil :detailData="orderDetailData" v-if="!isLoading" />
  <LoadingComp v-else />
  <span slot="footer" class="dialog-footer">
      <normalBtn @click.native="setIsShowDia(false)" />
  </span>
</el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import normalBtn from '@/components/common/normalBtn.vue';
import LoadingComp from '@/components/common/LoadingComp.vue';
import OrderDeatil from '@/components/order/DialogContent/OrderDetail.vue';

export default {
  components: {
    OrderDeatil,
    normalBtn,
    LoadingComp,
  },
  computed: {
    ...mapState('unpaylist', ['isShowDia', 'orderDetailData']),
    ...mapState('common', ['isLoading']),
  },
  methods: {
    ...mapMutations('unpaylist', ['setIsShowDia']),
    handleClose() {
      this.setIsShowDia(false);
    },
  },
};
</script>

<style lang='scss'>
.mp-unpay-list-dia-wrap {
  height: 800px;
  position: relative;
  .el-dialog--center .el-dialog__body{
    text-align: left;
  }
  .el-dialog__header > span::before {
    background: url(../../../assets/images/detail.png) no-repeat center;
  }
  .el-dialog__footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    .dialog-footer {
      padding-top: 10px;
      .normal-btn {
        margin: 0;
      }
    }
  }
  > .el-dialog__body {
    padding-top: 5px;
  }

}

</style>
