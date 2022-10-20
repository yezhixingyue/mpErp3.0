<template>
  <main class="mp-ts-sale-and-production-list-page-main-comp-wrap">
    <el-table
      :data="props.tableData"
      stripe
      resizable
      border
      style="width: 100%">
      <el-table-column prop="Name" label="名称" min-width="180" show-overflow-tooltip align="center" header-align="center" ></el-table-column>
      <el-table-column prop="Url" label="服务器地址" min-width="180" show-overflow-tooltip align="center" header-align="center"></el-table-column>
      <el-table-column prop="Key" label="密钥" min-width="220" show-overflow-tooltip align="center" header-align="center"></el-table-column>
      <el-table-column label="关联转换器" width="120" show-overflow-tooltip align="center" header-align="center">
        <template #default="scope">
          {{ scope.row.RelationNumber }}个
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" show-overflow-tooltip align="center" header-align="center">
        <template #default="scope">
          {{formatDateForDisplay(scope.row.CreateTime)}}
        </template>
      </el-table-column>
      <el-table-column prop="Operator.Name" label="创建人" width="120" show-overflow-tooltip align="center" header-align="center"></el-table-column>
      <el-table-column label="操作" width="280" show-overflow-tooltip align="center" header-align="center">
        <template #default="scope">
          <div class="ctrl-box">
            <span class="blue-span" @click="onGenerateClick(scope.row)">{{scope.row.Key ? '重新生成' : '生成密钥'}}</span>
            <EditMenu @click="onEditClick(scope.row)" />
            <RemoveMenu @click="onRemoveClick(scope.row)" :disabled="scope.row.RelationNumber > 0" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <p class="intro">说明：新建{{props.title}}后，需要生成密钥，在{{props.title}}填写此密钥，然后点击同步数据，成功即完成添加操作。</p>
    <GenerateDialog :visible.sync="visible" @submit="generate" />
  </main>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { SaleAndProductionListItemPlainType } from '@/views/serverManage/utils/SaleAndProductionListItemClass';
import { formatDateForDisplay } from '@/assets/js/filter';
import EditMenu from '@/components/common/menus/EditMenu.vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import { message } from '@/assets/js/message';
import { recordScrollPosition } from '@/assets/js/recordScrollPositionMixin';
import GenerateDialog from './GenerateDialog.vue';

recordScrollPosition('.el-table__body-wrapper');

const props = defineProps<{
  title: string,
  tableData: SaleAndProductionListItemPlainType[],
}>();

const emit = defineEmits(['edit', 'remove', 'generate']);

const onEditClick = (row: SaleAndProductionListItemPlainType) => {
  emit('edit', row);
};

const onRemoveClick = (row: SaleAndProductionListItemPlainType) => {
  message.confirm({
    title: '确定删除该服务器吗?',
    message: `服务器名称：[ ${row.Name} ]`,
    onOk: () => {
      emit('remove', row);
    },
  });
};

const visible = ref(false);
const visibleData = ref<null | SaleAndProductionListItemPlainType>(null);

const onGenerateClick = (row: SaleAndProductionListItemPlainType) => {
  if (!row.Key) {
    emit('generate', row);
    return;
  }
  visibleData.value = row;
  visible.value = true;
};

const generate = () => {
  visible.value = false;
  emit('generate', visibleData.value);
};

</script>

<style lang='scss'>
.mp-ts-sale-and-production-list-page-main-comp-wrap {
  overflow: hidden;
  flex: 1;
  .intro {
    height: 16px;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #585858;
    line-height: 14px;
    margin-top: 10px;
    height: 30px;
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
    .el-table__body-wrapper {
      overflow: auto;
      overflow: overlay;
      height: calc(100% - 40px);
    }
  }
}
</style>
