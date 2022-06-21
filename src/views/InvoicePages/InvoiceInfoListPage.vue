<template>
  <section class="mp-erp-invoice-info-manage-list-page-wrap">
    <header v-if="localPermission.Operate">
      <el-button type="primary" @click="setupInvoiceItem('new')" :disabled="InvoiceInfoList.length > 8">+新增开票类别</el-button>
    </header>
    <div class="content">
      <InvoiceInfoTable :InvoiceInfoList="InvoiceInfoList" :loading="loading" @edit="setupInvoiceItem" @remove="removeInvoiceItem" />
    </div>
    <footer>
      <span>共检索出 <i class="is-blue is-bold">{{InvoiceInfoListNumber}}</i> 条数据</span>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import InvoiceInfoTable from '../../components/InvoiceComps/InvoiceInfoComps/InvoiceInfoTable.vue';

export default {
  name: 'InvoiceInfoListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-invoice-info-manage-list-page-wrap .el-table__body-wrapper')],
  components: {
    InvoiceInfoTable,
  },
  computed: {
    ...mapState('invoice', ['InvoiceInfoList', 'InvoiceInfoListNumber', 'loading']),
    ...mapState('common', ['Permission']),
    localPermission() { // 后面需要更改为发票的权限
      if (this.Permission?.PermissionList?.PermissionInvoiceCategory?.Obj) {
        return this.Permission.PermissionList.PermissionInvoiceCategory.Obj;
      }
      return {};
    },
  },
  methods: {
    setupInvoiceItem(id) {
      this.$router.push({
        name: 'InvoiceInfoSetting',
        params: { id },
      });
    },
    async removeInvoiceItem(itemData) {
      // 接口处理删除
      const resp = await this.api.getInvoiceCategoryRemove(itemData.InvoiceCategoryID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const temp = { itemData, isRemove: true };
          this.$store.commit('invoice/setInvoiceInfoItemChange', temp);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
  mounted() {
    this.$store.dispatch('common/getProductClassifyData');
    this.$store.dispatch('common/getAllProductNames');
    this.$store.dispatch('invoice/getInvoiceInfoList');
  },
};
</script>
<style lang='scss'>
.mp-erp-invoice-info-manage-list-page-wrap {
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding-left: 8px;
  font-size: 14px;
  color: #585858;
  > header {
    flex: none;
    margin-bottom: 10px;
    background: #fff;
    box-sizing: border-box;
    padding: 14px 20px;
    > button {
      font-size: 14px;
      height: 30px;
      padding: 0;
      width: 120px;
    }
  }
  > div.content {
    flex: 1;
    background: #fff;
    padding-right: 2px;
  }
  > footer {
    flex: none;
    background: #fff;
    text-align: right;
    height: 50px;
    padding: 10px;
    padding-right: 80px;
    line-height: 30px;
    box-sizing: border-box;
  }
}
</style>
