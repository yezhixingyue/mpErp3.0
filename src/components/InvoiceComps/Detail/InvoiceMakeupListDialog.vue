<template>
  <CommonDialogComp
      width="900px"
      top="13vh"
      title="开票信息"
      :visible.sync="localVisible"
      @closed="onClosed"
      @open="onOpen"
      @submit="localVisible = false"
      submitText="确定"
      :showCancel="false"
      class="mp-erp-invoice-makeout-info-display-comp-dialog-comp-wrap"
    >
      <!-- 内容区 -->
      <CombineTable :list="result" onlyOpenningInfo :loading="loading" />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../packages/CommonDialogComp';
import CombineTable from '../../../packages/InvoiceComps/ApplyDetailContent/CombineTable.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curItem: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    CommonDialogComp,
    CombineTable,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
  },
  data() {
    return {
      result: [],
      loading: false,
    };
  },
  methods: {
    async onOpen() {
      if (!this.curItem) return;
      this.loading = true;
      const resp = await this.api.getInvoiceManageMakeUpInfo(this.curItem.InvoiceID).catch(() => null);
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.result = resp.data.Data || [];
      }
    },
    onClosed() {
      this.result = [];
      this.loading = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-invoice-makeout-info-display-comp-dialog-comp-wrap {
  .el-dialog__body {
    .mp-invoice-combine-list-table-comp-wrap {
      > header, > footer {
        display: none;
      }
    }
  }
}
</style>
