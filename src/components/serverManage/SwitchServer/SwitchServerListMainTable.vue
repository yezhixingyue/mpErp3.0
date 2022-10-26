<template>
  <main class="mp-ts-switch-server-list-page-main-comp-wrap">
    <el-table
      :data="props.tableData"
      stripe
      resizable
      border
      style="width: 100%">
      <el-table-column prop="Name" label="名称" min-width="150" show-overflow-tooltip align="center" header-align="center" ></el-table-column>
      <el-table-column prop="Code" label="编码" min-width="150" show-overflow-tooltip align="center" header-align="center" ></el-table-column>
      <el-table-column prop="SellSide.Name" label="销售端" min-width="150" show-overflow-tooltip align="center" header-align="center"></el-table-column>
      <el-table-column prop="FactorySide.Name" label="生产端" min-width="150" show-overflow-tooltip align="center" header-align="center"></el-table-column>
      <el-table-column label="创建时间" width="150" show-overflow-tooltip align="center" header-align="center">
        <template #default="scope">
          {{formatDateForDisplay(scope.row.CreateTime)}}
        </template>
      </el-table-column>
      <el-table-column prop="Operator.Name" label="创建人" width="125" show-overflow-tooltip align="center" header-align="center"></el-table-column>
      <el-table-column label="操作" width="320" show-overflow-tooltip align="center" header-align="center">
        <template #default="scope">
          <div class="ctrl-box">
            <span class="blue-span" @click="onNotifySetupClick(scope.row)" style="margin-right: 12px">转换失败通知设置</span>
            <EditMenu @click="onEditClick(scope.row)" />
            <RemoveMenu @click="onRemoveClick(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { formatDateForDisplay } from '@/assets/js/filter';
import EditMenu from '@/components/common/menus/EditMenu.vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import { message } from '@/assets/js/message';
import { SwitchListItemPlainType } from '@/views/serverManage/utils/SwitchListItemClass';
import { recordScrollPosition } from '@/assets/js/recordScrollPositionMixin';

recordScrollPosition('.el-table__body-wrapper');

const props = defineProps<{
  tableData: SwitchListItemPlainType[],
}>();

const emit = defineEmits(['edit', 'remove', 'notify']);

const onEditClick = (row: SwitchListItemPlainType) => {
  emit('edit', row);
};

const onNotifySetupClick = (row: SwitchListItemPlainType) => {
  emit('notify', row);
};

const onRemoveClick = (row: SwitchListItemPlainType) => {
  message.confirm({
    title: '确定删除该转换器吗?',
    message: `名称：[ ${row.Name} ]`,
    onOk: () => {
      emit('remove', row);
    },
  });
};
</script>

<style scoped lang='scss'>
.mp-ts-switch-server-list-page-main-comp-wrap {
  flex: 1;
  overflow: hidden;
  .intro {
    height: 16px;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #585858;
    line-height: 14px;
    margin-top: 10px;
    &::before {
      content: '';
      display: inline-block;
      width: 5px;
      height: 5px;
      background-color: #585858;
      border-radius: 50%;
      margin-right: 6px;
      vertical-align: 2px;
    }
  }
  .el-table {
    height: calc(100% - 40px);
    :deep(.el-table__body-wrapper) {
      overflow: auto;
      overflow: overlay;
      height: calc(100% - 40px);
    }
  }
}
</style>
