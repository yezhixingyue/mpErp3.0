<template>
  <div class="mp-unpay-page-footer-wrap"
   v-if="Permission.PermissionList.PermissionManageOrder.Obj.HelpSubmit">
    <count-comp
     :count='count'
     :watchPage='searchCondition4UnPayList.Page'
     :handlePageChange='handlePageChange' />
    <!-- <span class="is-blue" @click="handleClearClick">清空已付款已取消的订单</span>
    <span class="is-red" @click="handleCancleClick">取消选中订单</span>
    <span>
        <normalBtnFull @click.native="submitList2Payment" title="支付选中订单" />
    </span> -->
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
// import normalBtnFull from '@/components/common/normalBtnFull.vue';
import CountComp from '@/components/common/Count.vue';

export default {
  components: {
    // normalBtnFull,
    CountComp,
  },
  computed: {
    ...mapState('unpaylist', ['curSelectedList', 'count', 'searchCondition4UnPayList']),
    ...mapState('common', ['Permission']),
  },
  methods: {
    ...mapActions('unpaylist', ['getPrePayData', 'delTargetOrder', 'cancelOrderList', 'getTableData']),
    ...mapMutations('common', ['setIsLoading']),
    ...mapMutations('unpaylist', ['setIsShowPreDialog', 'clearInitTableData']),
    submitList2Payment() {
      if (this.curSelectedList.length === 0) {
        this.$message({
          showClose: true,
          message: '请先勾选需要支付的订单!',
          type: 'error',
        });
        return;
      }
      this.setIsLoading(true);
      this.$utils.handleLoadingHOF(
        () => this.getPrePayData({ type: 'all' }),
        () => this.setIsShowPreDialog(true),
        () => this.setIsShowPreDialog(false),
      );
    },
    handleClearClick() {
      this.clearInitTableData();
    },
    async handleCancleClick() {
      if (this.curSelectedList.length === 0) {
        this.$message({
          showClose: true,
          message: '未选择订单!',
          type: 'error',
        });
        return;
      }
      this.messageBox.warnCancelBox('确定取消被选中的订单吗 ?', '[ 取消后将无法恢复 ]', () => this.cancelOrderList(), null);
    },
    handlePageChange(page) {
      this.getTableData(page);
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-unpay-page-footer-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  box-shadow: 0px 3px 7px rgba(196, 196, 196, 1);
  > span {
    margin-right: 50px;
    font-size: 14px;
    cursor: pointer;
    flex: none;
    &:hover {
      color: $--color-primary-light !important;
    }
    &:nth-of-type(2):hover {
      color: $--color-text-orgin!important;
    }
    user-select: none;
    &:last-of-type {
      > .normal-full-btn {
        margin: 0;
        border: none;
        height: 30px;
        width: 130px;
        border-radius: 2px;
        background: linear-gradient(
            to right,
            $--color-primary,
            $--color-primary-light
        );
      }
    }
  }
}
</style>
