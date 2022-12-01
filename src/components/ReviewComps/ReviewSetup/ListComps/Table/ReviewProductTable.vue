<template>
  <ul :class="{ loading: loading }">
    <Item
      v-for="(it, i) in list"
      :key="it.ID"
      :item="it"
      :itemIndex="i"
      :activeId="activeId"
      :hasPermission="hasPermission"
      @menuClick="onMenuClick"
      @OrderNameMustInputChange="onOrderNameMustInputChange"
      @active="handleActive"
    />
    <li v-if="!loading && list.length === 0" class="em">
      <span>暂无数据</span>
    </li>
  </ul>
</template>

<script>
import Item from './Item.vue';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasPermission: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Item,
  },
  data() {
    return {
      activeId: '',
    };
  },
  methods: {
    onMenuClick(e) {
      this.$emit('menuClick', e);
    },
    handleActive(id) {
      this.activeId = id;
    },
    onOrderNameMustInputChange(e) {
      this.$emit('OrderNameMustInputChange', e);
    },
  },
};
</script>
<style lang='scss'>
</style>
