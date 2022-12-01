<template>
  <div class="mp-erp-product-module-filename-item-content-show-single-craft-comp-wrap" v-if="craft">
    <SingleElement :ElementData='craft' @change="onCraftDataChange" :hidden="hidden" />
    <SingleElement v-for="it in craft.ElementList" :key="it.ID" :ElementData='it' @change="onCraftDataChange" :hidden="hidden" />
    <SingleElementGroup v-for="group in craft.GroupList" :key="group.ID" :group='group' @change="onCraftDataChange" :hidden="hidden" />
  </div>
</template>

<script>
import SingleElement from '../SingleElement/index.vue';
import SingleElementGroup from '../SingleElementGroup/index.vue';

export default {
  props: {
    craft: {
      type: Object,
      default: null,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    SingleElement,
    SingleElementGroup,
  },
  computed: {
  },
  methods: {
    onCraftDataChange(e) {
      this.$emit('change', { ...e, CraftID: this.craft.ID });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-filename-item-content-show-single-craft-comp-wrap {
  display: flex;
  flex-wrap: wrap;
  > div {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
