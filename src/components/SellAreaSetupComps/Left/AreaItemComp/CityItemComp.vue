<template>
  <li>
    <p class="header" @dblclick="onExtendClick" @click="onActiveIDClick(item.ID)" :class="{active: activeId === item.ID}">
      <span>{{item.ClassName}}</span>
      <i class="el-icon-arrow-right" v-show="item.children.length > 0" :class="{extend: extend}" @dblclick.stop @click.stop="onExtendClick"></i>
    </p>
    <div v-if="item.children" class="countys" v-show="extend">
      <span v-for="it in item.children" :key="it.ID" @click="onActiveIDClick(it.ID)" :class="{active: activeId === it.ID}">{{it.ClassName}}</span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    activeId: {
      default: '',
    },
  },
  data() {
    return {
      extend: true,
    };
  },
  methods: {
    onExtendClick() {
      if (this.item.children.length === 0) {
        return;
      }
      this.extend = !this.extend;
    },
    onActiveIDClick(id) {
      this.$emit('active', id);
    },
  },
};
</script>
<style lang='scss'>
</style>
