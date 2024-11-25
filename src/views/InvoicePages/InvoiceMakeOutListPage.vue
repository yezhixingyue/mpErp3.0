<template>
  <section class="mp-erp-invoice-makeup-list-page-wrap">
    <InvoiceMakeupHeader />
    <main>
      <InvoiceMakeupTable
        :list="InvoiceMakeUpList"
        :loading="loading"
        ref="oTable"
        @view="onViewClick"
        @detail="onDetailClick"
        @selection="onselection"
      />
      <InvoiceMakeupListDialog :visible.sync="visible" :curItem="curItem" />
    </main>
    <footer>
      <el-button class="btn" type="primary" size="mini" :disabled="multipleSelection.length===0" @click='onBatchCompleteClick' v-if="localPermission.Operate"
      >批量开票完成</el-button>
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
import { InvoiceStatusEnums } from '../../packages/InvoiceComps/enums';

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
      multipleSelection: [],
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
    onselection(list) {
      this.multipleSelection = list;
    },
    onBatchCompleteClick() {
      if (!this.multipleSelection.length) return;

      this.messageBox.warnCancelNullMsg('确定批量完成选中申请单吗 ?', async () => {
        // 成功后需要处理的事情：1.更改选中订单状态、处理人、处理时间  2. 清除批量选中
        const callback = () => {
          const OperaterUserName = this.$store.state.common.Permission.StaffName;
          const OperateTime = new Date().toLocaleString().replace(/\//g, '-').replace(' ', 'T');

          const temp = {
            multipleSelection: this.multipleSelection,
            info: {
              OperateTime,
              OperaterUserName,
              InvoiceStatus: InvoiceStatusEnums.haveMaked.ID,
            },
          };

          this.$store.commit('invoice/setInvoiceMakeUpListSuccess', temp);

          this.$refs.oTable.toggleSelection();
        };

        // 执行
        const ids = this.multipleSelection.map(it => it.InvoiceID);
        const resp = await this.api.getInvoiceManageComplete(ids).catch(() => null);
        if (resp && resp.data.Status === 1000) {
          this.messageBox.successSingle('批量开票成功', callback, callback);
        }
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
    height: 47px;
    display: flex;
    align-items: center;
    padding-bottom: 3px;
    padding-left: 10px;

    > .btn {
      flex: none;
      margin-right: 20px;
    }

    .mp-common-download-to-excel-comp-wrap {
      margin-left: 35px;
      margin-right: -24px;
    }
  }
}
</style>
