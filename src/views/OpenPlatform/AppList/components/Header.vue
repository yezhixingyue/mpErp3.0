<template>
  <header class="app-list-page-header">
    <SearchInputComp
      :typeList="[['Key', '']]"
      :requestFunc='getList'
      :changePropsFunc='setCondition'
      :word='condition.Key'
      :showResetBtn="false"
      title="Key"
      placeholder="请输入要查找的Key"
      :searchWatchKey="list"
      />
    <SearchInputComp
      :typeList="[['KeyWords', '']]"
      :requestFunc='getList'
      :changePropsFunc='setCondition'
      :word='condition.KeyWords'
      :showResetBtn="false"
      title="关键词"
      placeholder="请输入应用名称、所属账号关键字"
      :searchWatchKey="list"
      />
  </header>
</template>

<script setup lang='ts'>
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import { Condition } from '../js/Condition';

defineProps<{
  condition: Condition
  list: object[]
}>();

const emit = defineEmits(['setCondition', 'getList']);

const setCondition = (e) => {
  emit('setCondition', e);
};

const getList = () => {
  emit('getList');
};

</script>

<style scoped lang='scss'>
.app-list-page-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  :deep(.mp-common-comps-search-box) {
    .el-input {
      width: 240px;
    }
  }
}

</style>
