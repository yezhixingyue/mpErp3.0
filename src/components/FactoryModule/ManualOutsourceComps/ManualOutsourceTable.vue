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
    <el-table-column type="selection" width="35" :selectable="(row) => selectableStatuses.includes(row.CheckFileStatus)"></el-table-column>
    <el-table-column width="80px" prop="OrderID" show-overflow-tooltip label="订单号"></el-table-column>
    <el-table-column width="170px" show-overflow-tooltip label="产品名称">
      <template slot-scope="scope">{{scope.row | getFullName(true)}}</template>
    </el-table-column>
    <el-table-column width="135px" prop="Content" show-overflow-tooltip label="文件内容"></el-table-column>
    <el-table-column width="110px" show-overflow-tooltip label="数量-款数">
      <template slot-scope="scope">{{formarProductAmountFunc(scope.row).replace(' ', '-')}}</template>
    </el-table-column>
    <el-table-column width="90px" prop="Checker" show-overflow-tooltip label="审稿人"></el-table-column>
    <!-- <el-table-column width="120px" show-overflow-tooltip label="尺寸">
      <template slot-scope="scope">{{scope.row.SizeList.join('、')}}</template>
    </el-table-column>
    <el-table-column width="120px" show-overflow-tooltip label="工艺">
      <template slot-scope="scope">{{scope.row.CraftList.join('、')}}</template>
    </el-table-column> -->
    <el-table-column width="90px" prop="Funds.FinalPrice" show-overflow-tooltip label="成交价">
      <template  slot-scope="scope">{{scope.row.Funds.FinalPrice}}</template>
    </el-table-column>
    <!-- <el-table-column width="110px" prop="Factory.Name" show-overflow-tooltip label="原外购工厂"></el-table-column> -->
    <el-table-column width="140px" show-overflow-tooltip label="外购价格" class-name="el-box">
      <template  slot-scope="scope">
        <el-input
          v-model.trim="scope.row.Funds.OutPrice"
          @blur="onBlur(scope.row)"
          @focus="(e) => e.target.select()"
          placeholder="请输入外购价格"
          maxlength="9"
          :disabled="!localPermission.ChangePrice || !scope.row._canChangePriceFactory"
          class="p"
          size="mini">
        </el-input>
        <span style="vertical-align: -3px;">元</span>
      </template>
    </el-table-column>
    <el-table-column width="150px" show-overflow-tooltip label="外购厂" class-name="el-box">
      <el-select
       :disabled="!localPermission.ChangeFactory || !scope.row._canChangePriceFactory"
       filterable
       style="width: 130px;"
       :value="scope.row.Factory.ID"
       placeholder="请选择"
       slot-scope="scope"
       ref="oSelects"
       @change="(e) => scope.row.changeFactory(e, factorys, $refs.oSelects)"
       size="mini">
        <el-option v-for="it in factorys" :key="it.FactoryID" :label="it.FactoryName" :value="it.FactoryID"></el-option>
      </el-select>
    </el-table-column>
    <!-- <el-table-column width="95px" prop="_statusText" show-overflow-tooltip label="外购状态"></el-table-column> -->
    <el-table-column width="90px" show-overflow-tooltip label="外购状态">
      <span v-if="scope.row._status" slot-scope="scope" :class="scope.row._status.className">{{scope.row._status.Name}}</span>
    </el-table-column>
    <el-table-column width="115px" show-overflow-tooltip label="付款时间">
      <template slot-scope="scope">{{scope.row.PayTime | format2MiddleLangTypeDate}}</template>
    </el-table-column>
    <el-table-column width="150px" show-overflow-tooltip label="预计工期">
      <template slot-scope="scope">{{scope.row.ProducePeriod | getDoneTime}}</template>
    </el-table-column>
    <el-table-column width="90px" prop="Sender" show-overflow-tooltip label="外购操作人"></el-table-column>
    <el-table-column min-width="250px" label="操作" v-if="localPermission.Query">
      <div class="menus" slot-scope="scope">
        <div v-if="localPermission.ReceiveOrder">
          <span class="blue-span" @click="onOutsourceClick(scope.row)" v-if="scope.row._canComfirm"><i class="iconfont icon-waigou"></i> 外购</span>
          <span class="blue-span" @click="onHelpOrderClick(scope.row)" v-else-if="scope.row._canHelpOrder">
            <i class="iconfont icon-querenjiedan"></i> 确认接单</span>
          <!-- <span class="red-span" @click="onOutsourceClick(scope.row)" v-if="scope.row._canCancel">取消外购</span> -->
          <span class="red-span" @click="onForceCancelClick(scope.row)" v-else-if="scope.row._canForceCancel">
            <i class="iconfont icon-qiangzhichehui"></i> 强制撤回</span>
          <span class="is-cancel" v-else><i class="iconfont icon-qiangzhichehui"></i> 强制撤回</span>
        </div>
        <span class="blue-span ml-15" @click="onDownloadClick(scope.row)"> <i class="iconfont icon-caozuodexiazai"></i> 下载</span>
        <span class="blue-span ml-15" @click="onStatusDisplayClick(scope.row)"> <i class="iconfont icon-bianji1"></i> 详情/记录</span>
      </div>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import { formarProductAmountFunc } from '@/packages/commonFilters';

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
    value: { // multipleSelection
      type: Array,
      default: () => [],
    },
    localPermission: {
      type: Object,
      default: () => ({}),
    },
    selectableStatuses: { // 可勾选的状态集合
      type: Array,
      default: () => [],
    },
  },
  mixins: [tableMixin],
  data() {
    return {
      oSelects: null,
      isChanging: false,
    };
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight(
        '.mp-erp-factory-manual-out-source-manage-page-wrap > header',
        '.mp-erp-factory-manual-out-source-manage-page-wrap > footer',
      );
      this.h = tempHeight - 75;
    },
    handleSelectionChange(val) {
      this.$emit('input', val);
    },
    toggleSelection(bool) {
      this.$refs.multipleTable.clearSelection();
      if (bool) {
        this.list.forEach(row => {
          if (this.selectableStatuses.includes(row.CheckFileStatus)) this.$refs.multipleTable.toggleRowSelection(row);
        });
        // this.$refs.multipleTable.toggleAllSelection();
      }
    },
    toggleRowSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    onOutsourceClick(item) { // 确认外购
      if (item.Funds.OutPrice === '') {
        this.messageBox.failSingleError('外购失败', '外购价格不能为空，请填写外购价格');
        return;
      }
      // const bool = item._canCancel;
      const bool = false;

      const title = bool ? '确认取消该订单外购吗 ?' : '确认外购该订单吗 ?';

      this.messageBox.warnCancelBox(title, `订单号：[ ${item.OrderID} ]`, () => {
        if (bool) {
          this.$emit('comfirmCancle', [item]);
        } else {
          this.$emit('singleOutsource', item);
        }
      });
    },
    onHelpOrderClick(item) {
      if (item.Funds.OutPrice === '') {
        this.messageBox.failSingleError('接单失败', '外购价格不能为空，请填写外购价格');
        return;
      }
      this.messageBox.warnCancelBox('接单提醒！', `${item.OrderID}已与[${item.Factory.Name}]沟通确认接单`, () => {
        this.$emit('helpOrder', [item], true);
      });
    },
    onForceCancelClick(item) { // 强制取消 - 在对方已接单 但未完成状态下可以点击
      this.$emit('forceCancel', [item]);
    },
    onStatusDisplayClick(item) { // 操作记录
      this.$emit('showStatus', item);
    },
    onDownloadClick(item) { // 下载文件
      this.$emit('download', [item]);
    },
    formarProductAmountFunc(row) {
      return formarProductAmountFunc(row);
    },
    async onBlur(row) {
      if (!this.isChanging) {
        this.isChanging = true;
        await row.changeOutPrice();
        this.isChanging = false;
      }
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
          .el-checkbox {
            display: none;
          }
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
      padding: 0 2px;
      input {
        padding: 0 10px;
        padding-left: 12px;
        height: 30px;
      }
      .p {
        width: calc(100% - 18px);
        width: 70px;
        margin-right: 4px;
        input {
          text-align: center;
          padding: 0 6px;
          // height: 30px;
        }
      }
      .el-input.is-disabled .el-input__inner {
        background: #F1F1F2;
        border-color: #DCDFE6;
        color: #AEAEAE;
      }
      .menus {
        text-align: right;
        padding-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;

        > div {
          width: 70px;
          text-align: center;

          .is-cancel {
            cursor: not-allowed;
          }

          .iconfont {
            margin-right: 2px;
          }
        }

        > span {
          margin-left: 20px;
        }
      }
      .is-gray {
        color: #AEAEAE !important;
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

.factory-change-title {
  display: inline-block;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 1px;
    background-color: #ff3769;
  }

  &.is-blue::after {
    background-color: #26bcf9;
  }
}
</style>
