<template>
  <main class="mp-ts-sale-and-production-list-page-main-comp-wrap">
    <el-table
      :data="props.tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column prop="Name" label="名称" min-width="180"></el-table-column>
      <el-table-column prop="Url" label="服务器地址" min-width="180"></el-table-column>
      <el-table-column prop="Key" label="密钥" min-width="220"></el-table-column>
      <el-table-column label="关联转换器" width="120">
        <template #default="scope">
          {{ scope.row.RelationNumber }}个
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150">
        <template #default="scope">
          {{formatDateForDisplay(scope.row.CreateTime)}}
        </template>
      </el-table-column>
      <el-table-column prop="Operator.Name" label="创建人" width="120"></el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="scope">
          <span class="blue-span">{{scope.row.Key ? '重新生成' : '生成密钥'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <p class="intro">说明：新建{{props.title}}后，需要生成密钥，在{{props.title}}填写此密钥，然后点击同步数据，成功即完成添加操作。</p>
  </main>
</template>

<script setup lang='ts'>
import { SaleAndProductionListItemPlainType } from '@/views/serverManage/utils/SaleAndProductionListItemClass';
import { formatDateForDisplay } from '@/assets/js/filter';

const props = defineProps<{
  title: string,
  tableData: SaleAndProductionListItemPlainType[],
}>();

</script>

<style scoped lang='scss'>
.mp-ts-sale-and-production-list-page-main-comp-wrap {
  .intro {
    height: 16px;
    font-size: 12px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #585858;
    line-height: 14px;
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
}
</style>
