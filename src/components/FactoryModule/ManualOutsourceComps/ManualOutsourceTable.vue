<template>
  <el-table
    class="mp-erp-factory-manage-outsource-manage-table-comp-wrap"
    :max-height="h"
    :height="h"
    fit
    :data="list"
    stripe
    border
    style="width: 100%"
    ref="multipleTable"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="40" :selectable="(row) => row._canComfirm"></el-table-column>
    <el-table-column width="85px" prop="OrderID" show-overflow-tooltip label="订单号"></el-table-column>
    <el-table-column min-width="100px" show-overflow-tooltip label="产品名称">
      <template slot-scope="scope">{{scope.row | getFullName(true)}}</template>
    </el-table-column>
    <el-table-column width="120px" show-overflow-tooltip label="数量">
      <template slot-scope="scope">{{scope.row | formarProductAmount}}</template>
    </el-table-column>
    <el-table-column width="120px" show-overflow-tooltip label="尺寸">
      <template slot-scope="scope">{{scope.row.SizeList.join('、')}}</template>
    </el-table-column>
    <el-table-column width="120px" show-overflow-tooltip label="工艺">
      <template slot-scope="scope">{{scope.row.CraftList.join('、')}}</template>
    </el-table-column>
    <el-table-column width="105px" prop="Funds.FinalPrice" show-overflow-tooltip label="成交价">
      <span class="is-pink" slot-scope="scope">{{scope.row.Funds.FinalPrice}}元</span>
    </el-table-column>
    <el-table-column width="110px" prop="Factory.Name" show-overflow-tooltip label="原外协工厂"></el-table-column>
    <el-table-column width="150px" show-overflow-tooltip label="更换外协工厂" class-name="el-box">
      <el-select :disabled="!localPermission.ChangeFactory || !scope.row._canComfirm"
       :value="scope.row.Factory.ID" placeholder="请选择" slot-scope="scope" @change="(e) => scope.row.changeFactory(e)" size="mini">
        <el-option v-for="it in factorys" :key="it.FactoryID" :label="it.FactoryName" :value="it.FactoryID"></el-option>
      </el-select>
    </el-table-column>
    <el-table-column width="120px" show-overflow-tooltip label="外协价" class-name="el-box">
      <el-input
        v-model.trim="scope.row.Funds.OutPrice"
        slot-scope="scope"
        @blur="()=>scope.row.changeOutPrice()"
        @focus="(e) => e.target.select()"
        placeholder="请输入外协价格"
        maxlength="9"
        :disabled="!localPermission.ChangePrice || !scope.row._canComfirm"
        class="p"
        size="mini">
      </el-input>
    </el-table-column>
    <el-table-column width="100px" prop="_statusText" show-overflow-tooltip label="外协状态"></el-table-column>
    <el-table-column width="125px" show-overflow-tooltip label="付款时间">
      <template slot-scope="scope">{{scope.row.PayTime | format2MiddleLangTypeDate}}</template>
    </el-table-column>
    <el-table-column width="155px" show-overflow-tooltip label="预计工期">
      <template slot-scope="scope">{{scope.row.ProducePeriod | getDoneTime}}</template>
    </el-table-column>
    <el-table-column width="180px" label="操作" v-if="localPermission.Query">
      <div class="menus" slot-scope="scope">
        <span class="blue-span" @click="onOutsourceClick(scope.row)" v-if="localPermission.ReceiveOrder && scope.row._canComfirm">确认外协</span>
        <span class="red-span" @click="onOutsourceClick(scope.row)" v-if="localPermission.ReceiveOrder && scope.row._canCancel">取消外协</span>
        <span class="blue-span ml-15" @click="onStatusDisplayClick(scope.row)">修改记录</span>
      </div>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

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
    factorys: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    localPermission: {
      type: Object,
      default: () => ({}),
    },
  },
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight(
        '.mp-erp-factory-manual-out-source-manage-page-wrap > header',
        '.mp-erp-factory-manual-out-source-manage-page-wrap > footer',
      );
      this.h = tempHeight;
    },
    handleSelectionChange(val) {
      this.$emit('input', val);
    },
    toggleSelection(bool) {
      this.$refs.multipleTable.clearSelection();
      if (bool) {
        this.$refs.multipleTable.toggleAllSelection();
      }
    },
    toggleRowSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    onOutsourceClick(item) { // 确认外协
      const title = item._canCancel ? '确认取消该订单外协吗 ?' : '确认外协该订单吗 ?';
      this.messageBox.warnCancelBox(title, `订单号：[ ${item.OrderID} ]`, () => {
        if (item._canCancel) {
          this.$emit('comfirmCancle', [item]);
        } else {
          this.$emit('singleOutsource', item);
        }
      });
    },
    onStatusDisplayClick(item) { // 操作记录
      this.$emit('showStatus', item);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-erp-factory-manage-outsource-manage-table-comp-wrap {
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
      color: #989898;
    }
    padding: 6px 0;
    > .cell {
      color: #585858;
      height: 32px;
      input {
        padding: 0 10px;
      }
      .p {
        input {
          text-align: center;
        }
      }
      .menus {
        text-align: right;
        padding-right: 25px;
      }
    }
    &.left {
      text-align: left;
    }
    &.el-table-column--selection > .cell {
      padding: 0;
    }
    &:not(.el-box) > .cell {
      line-height: 32px;
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
