<template>
  <el-table
    class="mp-erp-invoice-info-manage-list-page-table-comp-wrap"
    :max-height="h"
    :height="h"
    fit
    :data="localInvoiceInfoList"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column width="350px" prop="CategoryName" show-overflow-tooltip label="开票类别名称"></el-table-column>
    <el-table-column width="160px" prop="Unit" show-overflow-tooltip label="单位"></el-table-column>
    <el-table-column min-width="220px" label="产品种类" class-name='left'>
      <span slot-scope="scope" :title="scope.row._ProductsContent">{{scope.row._ProductsContent.replaceAll('\r\n', '、')}}</span>
    </el-table-column>

    <el-table-column width="300px" label="操作" v-if="localPermission.Operate">
      <template slot-scope="scope">
        <CtrlMenus @edit='onEditClick(scope.row)' @remove='onRemoveClick(scope.row)' />
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import { mapState, mapGetters } from 'vuex';
import CommonClassType from '../../../store/CommonClassType';

export default {
  props: {
    InvoiceInfoList: {
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
    ...mapGetters('common', ['allProductClassify']),
    ...mapState('common', ['Permission']),
    localInvoiceInfoList() {
      return this.InvoiceInfoList.map(it => ({
        ...it,
        _ProductsContent: CommonClassType.generateProductString(it.ProductList, this.allProductClassify, {
          FirstLevelID: 'ClassID',
          SecondLevelID: 'TypeID',
          ProductID: 'ProductID',
        }),
      }));
    },
    localPermission() { // 后面需要更改为发票的权限
      if (this.Permission?.PermissionList?.PermissionInvoiceCategory?.Obj) {
        return this.Permission.PermissionList.PermissionInvoiceCategory.Obj;
      }
      return {};
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-erp-invoice-info-manage-list-page-wrap > header', 60);
      this.h = tempHeight;
    },
    onEditClick(data) {
      this.$emit('edit', data.InvoiceCategoryID);
    },
    onRemoveClick(data) {
      this.messageBox.warnCancelBox('确定删除该开票类别吗', `类别名称：[ ${data.CategoryName} ]`, () => {
        this.$emit('remove', data);
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-invoice-info-manage-list-page-table-comp-wrap {
  margin-right: 2px;
  border: 1px solid #e6e6e6;
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
          color: #444;
        }
        &.left {
          text-align: left;
          padding-left: 35px;
        }
      }
    }
  }
  .el-table__body-wrapper .el-table__body tbody tr td {
    color: #444;
    &.is-gray > .cell {
      font-size: 12px;
    }
    > .cell {
      color: #585858;
      height: 24px;
      line-height: 24px;
    }
    &.left {
      text-align: left;
      padding-left: 25px;
    }
  }
}
</style>
