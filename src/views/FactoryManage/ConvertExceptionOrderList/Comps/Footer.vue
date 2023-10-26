<template>
  <footer class="footer">
    <div class="ctrl" v-show="ManageListData.listNumber > 0">
      <el-checkbox :disabled="status.disabled" :indeterminate="status.indeterminate" v-model="checkAllValue" label="">全选</el-checkbox>
      <span class="blue-span button" :class="{disabled: ManageListData.selectList.length <= 0}" @click="onclick">批量标记为已处理</span>
    </div>
    <MpPagination center :watchPage="ManageListData.condition.Page" :pageSize="ManageListData.condition.PageSize"
     :count="ManageListData.listNumber" :handlePageChange="(num) => ManageListData.getList(num)" />
  </footer>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import MpPagination from '../../../../components/common/Count.vue';
import { ManageListClass } from '../js/ManageListClass';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const props = defineProps<{
  ManageListData: ManageListClass
}>();

const onclick = () => {
  if (props.ManageListData.selectList.length === 0) return;

  MpMessage.warn({
    title: '确定批量标记为已处理吗?',
    msg: `共选中 ${props.ManageListData.selectList.length} 个订单`,
    onOk() {
      props.ManageListData.setRowsHaveDeal(props.ManageListData.selectList);
    },
  });
};

const status = computed(() => {
  const canSelectList = props.ManageListData.list.filter(it => !it.DealTime);
  return {
    disabled: canSelectList.length === 0,
    indeterminate: props.ManageListData.selectList.length > 0 && props.ManageListData.selectList.length < canSelectList.length,
    isCheckAll: props.ManageListData.selectList.length > 0 && props.ManageListData.selectList.length === canSelectList.length,
  };
});

const checkAllValue = computed({
  get() {
    return status.value.isCheckAll;
  },
  set() {
    props.ManageListData.multipleTableRef?.toggleAllSelection();
  },
});

</script>

<style scoped lang='scss'>
.footer {
  display: flex;
  align-items: center;
  .ctrl {
    font-size: 12px;
    margin: 0 15px;
    display: flex;
    flex: none;
    z-index: 9;

    width: 120px;

    --el-fill-color-light: #eee;

    .button {
      font-size: 12px;
      padding: 0;
      margin-left: 10px;
      white-space: nowrap;
      line-height: 20px;
    }

    :deep(.el-checkbox__label) {
      font-size: 13px;
    }
  }

  > section {
    flex: 1;
    overflow: hidden;
  }
}
</style>
