<template>
  <el-table
    class="mp-erp-invoice-enterprise-list-page-main-table-comp-wrap"
    :max-height="h"
    :height="h"
    fit
    :data="localDataList"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column width="100px" prop="CustomerNo" show-overflow-tooltip label="客户编号"></el-table-column>
    <el-table-column width="150px" prop="CustomerName" show-overflow-tooltip label="客户"></el-table-column>
    <el-table-column width="120px" prop="Mobile" show-overflow-tooltip label="手机号码"></el-table-column>
    <el-table-column min-width="160px" prop="EnterpriseName" show-overflow-tooltip label="企业名称"></el-table-column>
    <el-table-column min-width="170px" prop="CreditCode" show-overflow-tooltip label="统一社会信用代码"></el-table-column>
    <el-table-column min-width="150px" prop="RegisteredAddress" show-overflow-tooltip label="注册地址"></el-table-column>
    <el-table-column width="150px" prop="RegisteredTelephone" show-overflow-tooltip label="注册电话"></el-table-column>
    <el-table-column width="135px" prop="OpeningBank" show-overflow-tooltip label="开户银行"></el-table-column>
    <el-table-column width="160px" prop="BankAccount" show-overflow-tooltip label="银行账号"></el-table-column>
    <el-table-column width="135px" show-overflow-tooltip label="审核通过时间">
      <template slot-scope="scope" >{{scope.row.AuditTime | format2MiddleLangTypeDate}}</template>
    </el-table-column>
    <el-table-column width="135px" show-overflow-tooltip label="修改时间">
      <span slot-scope="scope" class="is-gray">{{scope.row.ModifyTime | format2MiddleLangTypeDate}}</span>
    </el-table-column>

    <el-table-column min-width="130px" label="操作" v-if="localPermission.Operate">
      <template slot-scope="scope">
        <CtrlMenus
          :showList="['edit']"
          editText="修改"
          @edit="onCrtlClick(scope.row)"
        />
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import CtrlMenus from '../../common/NewComps/CtrlMenus/index.vue';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [tableMixin],
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('common', ['Permission']),
    localPermission() { // 后面需要更改为发票的权限
      if (this.Permission?.PermissionList?.PermissionInvoiceEnterprise?.Obj) {
        return this.Permission.PermissionList.PermissionInvoiceEnterprise.Obj;
      }
      return {};
    },
    localDataList() {
      if (!Array.isArray(this.list)) return [];
      return this.list.map(it => ({
        ...it,
      }));
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-invoice-enterprise-list-page-wrap > header', 55);
      this.h = tempHeight;
    },
    onCrtlClick(item) {
      this.$emit('edit', item);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-erp-invoice-enterprise-list-page-main-table-comp-wrap {
  margin-right: 2px;
  border: 1px solid $--border-color-base;
  &.el-table::before {
    display: none;
  }
  .el-table__header-wrapper .el-table__header thead {
    tr {
      th {
        font-size: 14px;
        .cell {
          height: 34px;
          line-height: 34px;
          color: $--color-text-primary;
        }
      }
    }
  }
  .el-table__body-wrapper .el-table__body tbody tr td {
    color: $--color-text-primary;
    &.is-gray > .cell {
      font-size: 12px;
    }
    > .cell {
      color: #585858;
      height: 24px;
      line-height: 24px;
      padding: 0 8px;
    }
  }
}

  .el-tooltip__popper {
    max-width: 400px;
    line-height: 180%;
    // white-space: pre;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 16px;
  }
</style>
