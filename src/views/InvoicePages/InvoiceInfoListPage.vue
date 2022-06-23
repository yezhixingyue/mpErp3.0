<template>
  <section class="mp-erp-invoice-info-manage-list-page-wrap">
    <header v-if="localPermission.Operate">
      <el-button type="primary" @click="setupInvoiceItem('new')" :disabled="InvoiceInfoList.length >= 7">+新增开票类别</el-button>
      <div class="d-c">
        <label for="">默认开票类别：</label>
        <span>{{defaultItemInfo ? defaultItemInfo.CategoryName : '未设置'}}</span>
        <!-- <span> ( 张 )</span> -->
        <el-tooltip effect="light" popper-class="invoice-info-default-classify-tooltip" content="未设置开票类别的产品将会使用此类别" placement="bottom">
          <i class="el-icon-info"></i>
        </el-tooltip>
        <span class="blue-span" @click="visible=true">{{defaultItemInfo ? '编辑' : '设置'}}</span>
      </div>
    </header>
    <div class="content">
      <InvoiceInfoTable :InvoiceInfoList="InvoiceInfoList" :loading="loading" @edit="setupInvoiceItem" @remove="removeInvoiceItem" />
      <InvoiceDefaultInfoSetupDialog :visible.sync="visible" :defaultItemInfo="defaultItemInfo" @submit="onDefaultInfoSubmit" />
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
import InvoiceDefaultInfoSetupDialog from '../../components/InvoiceComps/InvoiceInfoComps/InvoiceDefaultInfoSetupDialog';

export default {
  name: 'InvoiceInfoListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-invoice-info-manage-list-page-wrap .el-table__body-wrapper')],
  components: {
    InvoiceInfoTable,
    InvoiceDefaultInfoSetupDialog,
  },
  computed: {
    ...mapState('invoice', ['InvoiceInfoList', 'InvoiceInfoListNumber', 'loading', 'defaultItemInfo']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionInvoiceCategory?.Obj) {
        return this.Permission.PermissionList.PermissionInvoiceCategory.Obj;
      }
      return {};
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    setupInvoiceItem(id) {
      if (!this.defaultItemInfo) {
        this.messageBox.failSingleError('操作失败', '请先设置默认开票类别');
        return;
      }
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
    async onDefaultInfoSubmit(e) {
      const resp = await this.api.getInvoiceCategorySave(e).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('invoice/setDefaultItemInfo', { ...e, InvoiceCategoryID: +resp.data.Data });
          this.visible = false;
        };
        const msg = e.InvoiceCategoryID || e.InvoiceCategoryID === 0 ? '编辑成功' : '设置成功';
        this.messageBox.successSingle(msg, cb, cb);
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
  min-width: 800px;
  color: #585858;
  > header {
    flex: none;
    margin-bottom: 10px;
    background: #fff;
    box-sizing: border-box;
    padding: 14px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > button {
      font-size: 14px;
      height: 30px;
      padding: 0;
      width: 120px;
    }
    > .d-c {
      display: inline-block;
      margin-right: 30px;
      font-size: 13px;
      > label {
        color: #444;
      }
      > span {
        color: #989898;
        font-size: 13px;
        &.blue-span {
          margin-left: 16px;
          font-size: 14px;
        }
      }
      > i {
        margin-left: 8px;
        cursor: pointer;
        color: #999;
        &:hover {
          color: lighten($color: #26bcf9, $amount: 15);
        }
      }
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
.invoice-info-default-classify-tooltip {
  color: #585858;
  border-color: #ddd;
}
</style>
