<template>
  <section class="mp-erp-invoice-enterprise-list-page-wrap">
    <InvoiceEnterpriseHeader
      :clearCondition="clearCondition" :conditon="condition" :getList="getList" :list="InvoiceEnterpriseList" />
    <main>
      <InvoiceEnterpriseTable :list="InvoiceEnterpriseList" :loading="loading" @edit="onItemEditClick" />
      <InvoiceEnterpriseEditDialog :visible.sync="visible" :curEditItemData="curEditItemData" @submit="onItemChangeSubmit" />
    </main>
    <footer>
      <Count :count='ListNumber' :watchPage='condition.Page' :handlePageChange='getList' :pageSize='condition.PageSize' />
    </footer>
  </section>
</template>

<script>
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import Condition4InvoiceEnterpriseList from '../../store/invoice/Condition4InvoiceEnterpriseList';
import CommonClassType from '../../store/CommonClassType';
import InvoiceEnterpriseHeader from '../../components/InvoiceComps/InvoiceEnterprise/InvoiceEnterpriseHeader.vue';
import InvoiceEnterpriseTable from '../../components/InvoiceComps/InvoiceEnterprise/InvoiceEnterpriseTable';
import InvoiceEnterpriseEditDialog from '../../components/InvoiceComps/InvoiceEnterprise/InvoiceEnterpriseEditDialog.vue';
import Count from '../../components/common/Count.vue';

export default {
  name: 'InvoiceQualificationManagePage',
  mixins: [recordScrollPositionMixin('.mp-erp-invoice-enterprise-list-page-wrap .el-table__body-wrapper')],
  components: {
    InvoiceEnterpriseHeader,
    InvoiceEnterpriseTable,
    InvoiceEnterpriseEditDialog,
    Count,
  },
  data() {
    return {
      condition: new Condition4InvoiceEnterpriseList(),
      InvoiceEnterpriseList: [],
      ListNumber: 0,
      loading: false,
      visible: false,
      curEditItemData: null,
    };
  },
  methods: {
    async getList(page = 1) {
      this.condition.setCondition([['Page', ''], page]);
      CommonClassType.setDate(this.condition, 'AuditTime');
      const temp = CommonClassType.filter(this.condition, true);
      this.InvoiceEnterpriseList = [];
      this.loading = true;
      const resp = await this.api.getInvoiceEnterpriseList(temp).catch(() => null);
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.InvoiceEnterpriseList = resp.data.Data || [];
        this.ListNumber = resp.data.DataNumber;
      }
    },
    clearCondition() {
      this.condition = new Condition4InvoiceEnterpriseList();
    },
    onItemEditClick(item) {
      this.curEditItemData = item;
      this.visible = true;
    },
    async onItemChangeSubmit([item, submitData] = []) { // 资质修改提交
      if (!item || !submitData) return;
      const resp = await this.api.getInvoiceEnterpriseSave(submitData).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.visible = false;
          const i = this.InvoiceEnterpriseList.findIndex(it => it.CustomerNo === item.CustomerNo);
          if (i > -1) {
            this.InvoiceEnterpriseList.splice(i, 1, item);
          }
        };
        this.messageBox.successSingle('资质修改成功', cb, cb);
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style lang='scss'>
.mp-erp-invoice-enterprise-list-page-wrap {
  background: whitesmoke;
  padding-left: 8px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  >header {
    background: #fff;
    padding: 15px 20px;
    padding-top: 0;
    flex: none;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    >section,
    >div {
      margin-top: 15px;
    }

    justify-content: space-between;
    padding-right: 25px;

    >section,
    >div {
      height: 30px;
      padding: 0;

      &.mp-line-date-selector-wrap {
        >.title {
          width: 7em;
        }

        .el-radio-group>label {
          width: 75px;
        }
      }

      >.text {
        width: 7em;
      }
    }
  }

  >main {
    flex: 1;
    background-color: #fff;
    margin-top: 10px;
    padding-right: 2px;
  }

  >footer {
    flex: none;
    background-color: #fff;
    height: 50px;
  }
}
</style>
