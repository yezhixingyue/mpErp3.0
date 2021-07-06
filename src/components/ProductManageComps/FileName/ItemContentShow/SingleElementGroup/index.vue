<template>
  <div v-if="group" class="mp-erp-product-module-filename-item-content-show-single-group-comp-wrap">
    <SingleElement :ElementData='group' :isSizeGroup='isSizeGroup' @change="onElementDataChange" />
    <SingleElement v-for="it in group.ElementList" :key="it.ID" :ElementData='it' @change="onElementDataChange" />
  </div>
</template>

<script>
import SingleElement from '../SingleElement';

export default {
  props: {
    group: {
      type: Object,
      default: null,
    },
    isSizeGroup: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    SingleElement,
  },
  methods: {
    onElementDataChange(e) {
      this.$emit('change', { ...e, GroupID: this.group.ID });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-filename-item-content-show-single-group-comp-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
