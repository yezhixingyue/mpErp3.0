<template>
    <el-table
     :data="list" border stripe class="mp-finance-refund-exception-page-wrap-table-comp-wrap"
     :max-height="h" :height="h" fit style="width: 100%">
      <el-table-column show-overflow-tooltip width="85px" prop="ID" label="异常编号" />
      <el-table-column show-overflow-tooltip width="90px" prop="Customer.CustomerSN" label="客户编号" />
      <el-table-column show-overflow-tooltip width="145px" prop="Customer.CustomerName" label="客户名称" />
      <el-table-column show-overflow-tooltip width="95px" prop="Customer.Mobile" label="联系方式" />
      <el-table-column show-overflow-tooltip width="95px" prop="Customer.Type.Second" label="客户类型" />
      <el-table-column show-overflow-tooltip width="95px" prop="Customer.Grade.Second" label="会员等级" />
      <el-table-column show-overflow-tooltip width="90px" prop="_QRAccountText" label="原支付账户" />
      <el-table-column show-overflow-tooltip width="70px" prop="Amount" label="金额" />
      <el-table-column show-overflow-tooltip width="100px" prop="OrderID" label="订单号" />
      <el-table-column show-overflow-tooltip width="125px" prop="_PayTime" label="订单付款时间" />
      <el-table-column show-overflow-tooltip width="125px" prop="_ApplyTime" label="申请退款时间">
        <template #default="scope">
          <span :class="{'is-red': scope.row.Status === RefundExceptionStatusEnum.Pending}">{{ scope.row._ApplyTime || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="95px" prop="_ChannelText" label="退款渠道" />
      <el-table-column show-overflow-tooltip min-width="95px" prop="Error" label="异常原因" />
      <el-table-column show-overflow-tooltip width="60px" prop="_StatusText" label="状态">
        <template #default="scope">
          <span>{{ RefundExceptionStatusEnumList.find(it => it.ID === scope.row.Status)?.Name || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip width="85px" prop="OperatorName" label="处理人" />
      <el-table-column show-overflow-tooltip width="230px" label="操作">
        <template #default="scope">
          <div class="menus">
            <el-button type="text" v-if="haveHandlePermission" size="small" @click="emit('manualProcess', scope.row)" class="mr-20"
             :disabled="scope.row.Status !== RefundExceptionStatusEnum.Pending">
              <i class="iconfont icon-shoudongchuli mr-4" style="font-size: 14px;"></i>
              <span class="label">手动处理</span>
            </el-button>
            <el-button type="text" size="small" @click="emit('viewProgress', scope.row)">
              <i class="iconfont icon-xiangqing3 mr-4" style="font-size: 11px;"></i>
              <span class="label">查看进度</span>
            </el-button>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无数据</span>
      </template>
    </el-table>
</template>

<script setup lang='ts'>
import { IRefundExceptionItem } from '../types';
import { RefundExceptionStatusEnumList, RefundExceptionStatusEnum } from '../types/enum';

defineProps<{
  list: IRefundExceptionItem[]
  loading: boolean
  haveHandlePermission: boolean
}>();

const emit = defineEmits(['manualProcess', 'viewProgress']);

</script>

<!-- eslint-disable import/first -->
<script lang='ts'>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight(
        '.mp-finance-refund-exception-page-wrap > header',
        '.mp-finance-refund-exception-page-wrap > footer',
      ) - 8;
      this.h = tempHeight;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-finance-refund-exception-page-wrap-table-comp-wrap {
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
      padding: 0 2px;

      .menus {
        .label {
          transition: color 0.15s ease-in-out;
        }
        button:not(:hover):not(:active):not(.is-disabled) .label {
          color: #444;
        }
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
