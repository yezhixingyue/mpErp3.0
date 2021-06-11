<template>
  <div v-if="itemData" class="mp-erp-comps-pruduct-module-material-select-dialog-comp-content-item-wrap">
    <p><el-checkbox v-model="checkAll">{{itemData.Name}}</el-checkbox></p>
    <div>
      <el-checkbox v-model="checkAll" v-for="it in itemData.List" :key="'item-check' + it.ID">{{it.itemContent}}</el-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      checkAll: false,
    };
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-material-select-dialog-comp-content-item-wrap {
  > div {
    padding-left: 10px;
  }
}
</style>
