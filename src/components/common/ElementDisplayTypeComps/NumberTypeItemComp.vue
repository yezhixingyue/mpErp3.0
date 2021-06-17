<template>
  <el-input v-model.trim="content" v-if="!InputContent" size="small" class="mp-erp-number-type-element-display-input-comp"></el-input>
  <el-select
    v-else
    v-model="content"
    filterable
    default-first-option
    :allow-create='Allow'
    :placeholder='placeholder'
    size="small"
    class="mp-erp-number-type-element-display-select-comp">
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
      default: '请选择或输入数字',
    },
    InputContent: { // 选项列表
      type: String,
      default: '',
    },
    Allow: { // 是否允许自定义
      type: Boolean,
      default: false,
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
.mp-erp-number-type-element-display-input-comp {
  .el-input__inner {
    font-size: 12px;
  }
}
.mp-erp-number-type-element-display-select-comp {
  .el-input__inner {
    font-size: 12px;
    &::placeholder {
      font-size: 12px;
    }
  }
}
</style>
