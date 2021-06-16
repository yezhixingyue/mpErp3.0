<template>
  <el-input v-model.trim="content" v-if="!InputContent" size="small"></el-input>
  <el-select v-else v-model="content" filterable default-first-option :placeholder='placeholder' allow-create size="small">
    <el-option
      v-for="item in options"
      :key="item"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    placeholder: {
      type: String,
      default: '',
      // default: '请选择或输入数字',
    },
    InputContent: {
      type: String,
      default: '',
    },
    value: {},
  },
  computed: {
    options() {
      if (!this.InputContent) return [];
      const valueList = this.$utils.getNumberValueList(this.InputContent);
      return valueList;
    },
    content: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      },
    },
  },
  methods: {
  },
};
</script>
<style lang='scss'>
</style>
