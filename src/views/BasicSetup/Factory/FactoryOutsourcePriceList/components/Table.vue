<template>
  <el-table
    class="mp-table"
    :data="localList"
    stripe
    resizable
    border
    style="width: 100%;">
    <el-table-column prop="_LabelName" label="类别-产品" min-width="300" show-overflow-tooltip ></el-table-column>
    <el-table-column label="外购价格设置" show-overflow-tooltip min-width="500px">
      <template #default="scope">
        <span class="blue-span" @click="onClick(scope.row)">设置外购价</span>
        <span class="text">（{{ scope.row._SetupValue }}）</span>
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
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { recordScrollPosition } from '../../../../../assets/ts/recordScrollPositionMixin';
import { useGlobalStore } from '../../../../../pinia/modules/global';
import { IFactoryProductPrice } from '../js/type';

const props = defineProps<{
  list: IFactoryProductPrice[]
  loading: boolean
}>();

const emit = defineEmits(['setPrice']);

recordScrollPosition('.el-table__body-wrapper');

const globalStore = useGlobalStore();
const { productClassLevelList4Staff } = storeToRefs(globalStore);

const _getLabelName = (item: IFactoryProductPrice) => { // 获取分类与产品组合名称
  const { FirstLevelID, SecondLevelID, ProductName } = item.Product;

  let FirstLevelName = '';
  let SecondLevelName = '';

  const _lv1 = productClassLevelList4Staff.value.find(it => it.ID === FirstLevelID);
  if (_lv1) {
    FirstLevelName = _lv1.ClassName;
    const _lv2 = _lv1.children.find(it => it.ID === SecondLevelID);
    if (_lv2) {
      SecondLevelName = _lv2.ClassName;
    }
  }

  return [FirstLevelName, SecondLevelName, ProductName].filter(it => it).join('-');
};

const _getSetupValue = (item: IFactoryProductPrice) => {
  const { Price, Discount } = item;

  if (Price) return Price.Name;

  if (typeof Discount === 'number' && Discount >= 0) return `按成交价折扣${+Discount.toFixed(2)}%`;

  return typeof Discount === 'number' ? '--' : '不设置';
};

const localList = computed(() => props.list.map(it => ({
  ...it,
  // 补充分类名称数据等
  _LabelName: _getLabelName(it),
  _SetupValue: _getSetupValue(it),
})));

const onClick = (row: IFactoryProductPrice) => {
  emit('setPrice', row);
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
