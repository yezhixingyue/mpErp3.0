<template>
  <div class="mp-qutstanding-page-wrap">
    <header>
      <unpay-header-comp />
    </header>
    <div class="content-table-wrap">
      <Table4UnPayList />
    </div>
    <footer>
      <UnpayPageFooter />
    </footer>
    <UnpayOrderDetailDialog /> <!-- 弹窗1 - 详情 -->
    <PrePayDialogComp /> <!-- 弹窗2 - 预支付 -->
    <Dialog2Pay />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Table4UnPayList from '@/components/UnPayList/content/Table4UnPayList.vue';
import UnpayPageFooter from '@/components/UnPayList/footer/UnpayPageFooter.vue';
import UnpayHeaderComp from '@/components/UnPayList/header/UnpayHeaderComp.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'QutstandingPage',
  mixins: [recordScrollPositionMixin('.mp-qutstanding-page-wrap .mp-unpay-order-list-table > main')],
  components: {
    Table4UnPayList,
    UnpayOrderDetailDialog: () => import(/* webpackChunkName: "unpaylist" */ '@/components/UnPayList/dialog/UnpayOrderDetailDialog.vue'),
    UnpayPageFooter,
    UnpayHeaderComp,
    PrePayDialogComp: () => import(/* webpackChunkName: "unpaylist" */ '@/components/UnPayList/dialog/PrePayDialogComp.vue'),
    Dialog2Pay: () => import(/* webpackChunkName: "unpaylist" */ '@/components/UnPayList/dialog/Dialog2Pay.vue'),
  },
  methods: {
    ...mapActions('unpaylist', ['getTableData']),
  },
  mounted() {
    this.getTableData();
  },
};
</script>

<style lang="scss">
@import "@/assets/css/common/var.scss";
.mp-qutstanding-page-wrap {
  width: 100%;
  height: 100%;
  border: 1px solid $--border-color-light;;
  box-sizing: border-box;
  background-color: #fff;
  > .content-table-wrap {
    height: calc(100% - 110px);
  }
  > footer {
    height: 60px;
  }
}
</style>
