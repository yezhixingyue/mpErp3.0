<template>
  <header>
    <el-button type="primary" v-if="Permission && Permission.PermissionList.PermissionSetupFactoryBase.Obj.Setup"
     @click="onClick" class="blue-full-color-btn-styles is-blue-button">添加生产工厂</el-button>
    <div class="input-box">
      <el-input placeholder="请输入搜索关键字" v-model.trim="keyWord" @keyup.enter.native="onFilterClick"></el-input>
      <el-button type="primary" @click="onFilterClick">筛选</el-button>
      <span class="blue-span" @click="onFilterClick('clear')">清除筛选项</span>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    filterWords: {},
  },
  data() {
    return {
      keyWord: '',
    };
  },
  computed: {
    ...mapState('common', ['Permission']),
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
