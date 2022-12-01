<template>
  <ul v-if="conditionData">
    <!-- <li v-for="item in conditionData.ItemList" :key="item.ID">
      <SelectComp />
    </li> -->
    <ConditionSingleComp
       :conditionList='conditionList'
       v-for="(item,i) of conditionData.ItemList"
       :key="item.selfID + '' + i"
       @editCondition='editCondition'
       @delCondition='delCondition'
       :hasDecimal="hasDecimal"
       :itemList='conditionData.ItemList'
       :itemIndex='i'
       :itemData='item'
       />
  </ul>
</template>

<script>
import ConditionSingleComp from '@/components/Promote/Comps/ConditionSingleComp.vue';
// import SelectComp from '@/components/common/SelectComp.vue';

export default {
  props: {
    conditionList: { // 条件列表
      type: Array,
      required: true,
    },
    conditionData: {
      type: Object,
      default: () => ({}),
    },
    hasDecimal: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ConditionSingleComp,
    // SelectComp,
  },
  methods: {
    editCondition([data, itemIndex]) {
      // console.log(data, this.conditionList);
      this.$emit('handleConditionItemDEdit', [data, itemIndex]);
    },
    delCondition(itemIndex) {
      this.$emit('handleConditionItemDel', itemIndex);
    },
  },
};
</script>

<style>

</style>
