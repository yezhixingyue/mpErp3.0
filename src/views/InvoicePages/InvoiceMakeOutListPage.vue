<template>
  <section class="mp-erp-invoice-makeup-list-page-wrap">
    <InvoiceMakeupHeader />
    <main>
      <InvoiceMakeupTable
        :list="InvoiceMakeUpList"
        :loading="loading"
        @view="onViewClick"
        @detail="onDetailClick"
      />
      <InvoiceMakeupListDialog :visible.sync="visible" :curItem="curItem" />
    </main>
    <footer>
      <Count
        :count="InvoiceMakeUpListNumber"
        :watchPage="condition4InvoiceMakeUpList.Page"
        :handlePageChange="getListByPage"
        :pageSize="condition4InvoiceMakeUpList.PageSize"
      >
        <DownLoadExcelComp
          :configObj="configObj"
          v-if="localPermission.ExportExcel"
        />
      </Count>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import InvoiceMakeupHeader from '../../components/InvoiceComps/Makeup/InvoiceMakeupHeader';
import InvoiceMakeupTable from '../../components/InvoiceComps/Makeup/InvoiceMakeupTable.vue';
import InvoiceMakeupListDialog from '../../components/InvoiceComps/Detail/InvoiceMakeupListDialog.vue';
import Count from '../../components/common/Count.vue';
import DownLoadExcelComp from '../../components/common/UploadComp/DownLoadExcelComp.vue';

export default {
  name: 'InvoiceMakeOutListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-invoice-makeup-list-page-wrap .el-table__body-wrapper')],
  components: {
    InvoiceMakeupHeader,
    InvoiceMakeupTable,
    InvoiceMakeupListDialog,
    Count,
    DownLoadExcelComp,
  },
  computed: {
    ...mapState('invoice', [
      'InvoiceMakeUpList',
      'loading',
      'InvoiceMakeUpListNumber',
      'condition4InvoiceMakeUpList',
    ]),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionInvoicing?.Obj) {
        return this.Permission.PermissionList.PermissionInvoicing.Obj;
      }
      return {};
    },
    configObj() {
      return {
        condition: this.condition4InvoiceMakeUpList,
        count: this.InvoiceMakeUpListNumber,
        fileDefaultName: '发票开具申请列表',
        fileDate: this.condition4InvoiceMakeUpList.InvoiceApplyTime,
        downFunc: data => this.api.getInvoiceManageExportExcel(data),
      };
    },
  },
  data() {
    return {
      visible: false,
      curItem: null,
    };
  },
  methods: {
    getListByPage(page = 1) {
      this.$store.dispatch('invoice/getInvoiceMakeUpList', page);
    },
    onViewClick(e) {
      // 查看开票信息
      if (!e) return;
      this.curItem = e;
      this.visible = true;
    },
    onDetailClick(e) {
      if (!e) return;
      this.$router.push({
        name: 'InvoiceMakeOutDetail',
        params: { invoiceID: e.InvoiceID },
      });
    },
  },
  mounted() {
    this.getListByPage();
  },
};
</script>
<style lang="scss">
.mp-erp-invoice-makeup-list-page-wrap {
  background: whitesmoke;
  padding-left: 8px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  > header {
    background: #fff;
    padding: 15px 20px;
    padding-top: 0;
    flex: none;

    > div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      > section,
      > div {
        margin-top: 15px;

        &.mp-common-comps-order-channel-selector-wrap {
          margin-right: 45px;
        }
      }

      &:last-of-type {
        justify-content: space-between;
        padding-right: 25px;

        > section,
        > div {
          height: 30px;
          padding: 0;

          .el-radio-group > label {
            width: 75px;
          }
        }
      }
    }
  }

  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 10px;
    padding-right: 2px;
  }

  > footer {
    flex: none;
    background-color: #fff;
    height: 50px;

    .mp-common-download-to-excel-comp-wrap {
      margin-left: 35px;
      margin-right: -24px;
    }
  }
}
</style>
