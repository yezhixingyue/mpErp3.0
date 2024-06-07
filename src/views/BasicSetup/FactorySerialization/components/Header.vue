<template>
  <header class="header">
    <EpCascaderByLv2ProductOrOther
       title="产品"
      style="margin-right: 30px"
      :setCondition="setCondition"
      :getList="getList"
      :First="condition.ProductClass.First"
      :Second="condition.ProductClass.Second"
      :typeList="[['ProductClass', 'First'],['ProductClass', 'Second']]"
    />
    <OrderChannelSelector
      :options='HaveChangeOPtionList'
      :requestFunc='getList'
      :changePropsFunc='setCondition'
      :typeList="[['HaveChange', '']]"
      style="margin-right: 20px"
      :value='condition.HaveChange'
      :defaultProps="{ label: 'Name', value: 'ID', }"
      label='序列化有无变更'
      />
  </header>
</template>

<script setup lang='ts'>
import EpCascaderByLv2ProductOrOther from '@/components/common/SelectorComps/EpCascaderWrap/EpCascaderByLv2ProductOrOther.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import { Condition, HaveChangeOPtionList } from '../js/Condition';

const props = defineProps<{
  condition: Condition
}>();

const emit = defineEmits(['getList']);

const setCondition = (e) => props.condition.setCondition(e);

const getList = () => {
  emit('getList');
};

</script>

<style scoped lang='scss'>
.header {
  display: flex;
  align-items: center;
  padding: 20px;

  :deep(.mpzj-sell-lib-comps-ep-cascader-comp-wrap) {
    > .title {
      width: auto;
      min-width: unset;
    }
  }

  :deep(.mp-common-comps-order-channel-selector-wrap) {
    > header {
      width: auto;
    }
  }
}
</style>
