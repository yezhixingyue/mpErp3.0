<template>
  <header>
    <el-button type="primary" @click="onClick" class="blue-full-color-btn-styles is-blue-button">添加生产工厂</el-button>
    <div class="input-box">
      <el-input placeholder="请输入搜索关键字" v-model.trim="keyWord" @keyup.enter.native="onFilterClick"></el-input>
      <el-button type="primary" @click="onFilterClick">筛选</el-button>
      <span class="blue-span" @click="onFilterClick('clear')">清除筛选项</span>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    filterWords: {},
  },
  data() {
    return {
      keyWord: '',
    };
  },
  methods: {
    onClick() {
      this.$emit('onFactoryAddClick');
    },
    onFilterClick(type) {
      if (type && type === 'clear') this.$emit('onFilterClick', '');
      else this.$emit('onFilterClick', this.keyWord);
    },
  },
  watch: {
    filterWords: {
      handler(newVal) {
        if (newVal !== this.keyWord) this.keyWord = newVal;
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
</style>
