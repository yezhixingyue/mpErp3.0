<template>
  <main>
    <el-table
     :data="list" border stripe class="mp-erp-factory-manage-convert-exception-order-list-manage-table-comp-wrap"
     :max-height="h" :height="h" fit style="width: 100%" @selection-change="handleSelectionChange" ref="multipleTableRef">
      <el-table-column type="selection" width="42" :selectable="(row) => !row.DealTime" />
      <el-table-column width="80px" prop="ID" label="序号" />
      <el-table-column width="120px" prop="OrderID" label="订单编号" />
      <el-table-column width="220px" prop="Server.Name" label="转换器" />
      <!-- '情况说明'列 如果需要靠左对齐时，在下面行上添加右侧属性以设置列的类名： class-name="content" -->
      <el-table-column min-width="150px" prop="Content" label="情况说明" />
      <el-table-column width="160px" prop="_CreateTime" label="异常时间" />
      <el-table-column width="125px" prop="_HaveDeal" label="处理状态" />
      <el-table-column width="210px" prop="_DealContent" label="处理时间（处理人）" />
      <el-table-column width="150px" label="操作">
        <template #default="scope">
          <span class="blue-span" v-if="!scope.row.DealTime" link @click="onDealClick(scope.row)">标记为已处理</span>
        </template>
      </el-table-column>
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无数据</span>
      </template>
    </el-table>
  </main>
</template>

<script lang='ts'>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  mixins: [tableMixin],
  methods: {
    setHeight() {
      const tempHeight = this.getHeight(
        '.mp-erp-factory-convert-exception-order-list-manage-page-wrap > header',
        '.mp-erp-factory-convert-exception-order-list-manage-page-wrap > footer',
      ) - 8;
      this.h = tempHeight;
    },
  },
};
</script>
<!-- eslint-disable import/first -->
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { IConvertExceptionListItem } from '../js/type';
import { Table } from 'element-ui';
import { MpMessage } from '@/assets/js/utils/MpMessage';

defineProps<{
  list: IConvertExceptionListItem[]
  loading: boolean
}>();

const emit = defineEmits(['setHaveDeal', 'select', 'setTableRef']);

const onDealClick = (row: IConvertExceptionListItem) => {
  MpMessage.warn({
    title: '确定标记为已处理吗 ?',
    msg: `订单号：[ ${row.OrderID} ]`,
    onOk: () => {
      emit('setHaveDeal', row);
    },
  });
};

const multipleTableRef = ref<InstanceType<typeof Table>>();

const handleSelectionChange = async (val: IConvertExceptionListItem[]) => {
  emit('select', val, multipleTableRef.value || null);
};

onMounted(() => {
  emit('setTableRef', multipleTableRef.value || null);
});
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-factory-manage-convert-exception-order-list-manage-table-comp-wrap {
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
