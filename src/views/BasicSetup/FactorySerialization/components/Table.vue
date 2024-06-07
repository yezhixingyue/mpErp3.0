<template>
  <el-table
    class="mp-table"
    :data="localList"
    stripe
    resizable
    border
    style="max-width: 100%">
    <el-table-column prop="_ProductName" label="类别-产品" width="430" show-overflow-tooltip ></el-table-column>
    <el-table-column label="订单信息设置" show-overflow-tooltip width="430">
      <template #default="scope">
        <span class="blue-span" @click="onClick(scope.row, 'order')">订单信息序列化设置（<i>{{ scope.row.HaveSetupOrder ? '已设置' : '未设置' }}</i>）</span>
      </template>
    </el-table-column>
    <el-table-column label="生产需求设置" show-overflow-tooltip width="430">
      <template #default="scope">
        <span class="blue-span" @click="onClick(scope.row, 'product')">生产需求序列化设置（<i>{{ scope.row.HaveSetupProduct ? '已设置' : '未设置' }}</i>）</span>
      </template>
    </el-table-column>
    <el-table-column prop="Operator" label="最后修改" width="125" show-overflow-tooltip ></el-table-column>
    <el-table-column label="序列化有无变更" show-overflow-tooltip width="280px">
      <template #default="scope">
        <span :class="scope.row._ChangeInfo.className">{{ scope.row._ChangeInfo.text }}</span>
      </template>
    </el-table-column>
    <template #empty>
      <div>
        <span class="ft-13 is-gray" v-show="!loading">暂无数据</span>
      </div>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { recordScrollPosition } from '../../../../assets/ts/recordScrollPositionMixin';
import { IMRProduct } from '../js/types';
import { useGetProductName } from '../js/useGetProductName';

const props = defineProps<{
  list: IMRProduct[]
  loading: boolean
}>();

const emit = defineEmits(['click']);

recordScrollPosition('.el-table__body-wrapper');

const { getProductName } = useGetProductName();

const _getChangeTextInfo = (item: IMRProduct) => {
  let text = item.HaveChange === false ? '无' : '-';
  let className = '';

  if (item.HaveChange) {
    text = '有变更';
    className = 'is-pink';
  }

  return {
    text,
    className,
  };
};

const localList = computed(() => props.list.map(it => ({
  ...it,
  // 补充分类名称数据等
  _ProductName: getProductName(it),
  _ChangeInfo: _getChangeTextInfo(it),
})));

const onClick = (item: IMRProduct, type: 'order' | 'product') => {
  emit('click', item, type);
};
</script>

<style lang='scss' scoped>
.mp-table {
  height: 100%;
  :deep(.el-table__body-wrapper) {
    overflow-y: auto;
    overflow-y: overlay;
    height: calc(100% - 37px);
  }
}
</style>
