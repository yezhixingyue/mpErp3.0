<template>
<div class="mp-textarea">
  <!-- 组件主要用于优化文本域输入文字长度达到 maxlength 限制最大长度时还能输入中文符号的问题 -->
  <el-input
    type="textarea"
    v-model="valueText"
    :placeholder="placeholder"
    @input="input"
    :maxlength='maxlength'
  >
  </el-input>
  <span v-if="showWordLimit" id="mp-textarea-const">{{value.length}}/{{maxlength}}</span>
</div>
</template>

<script>
export default {
  name: 'textarea-input',
  props: {
    maxlength: {
      type: Number,
      default: 13,
    },
    value: {
      type: null,
      required: true,
    },
    placeholder: {
      type: String,
      default: '请输入文字',
    },
    showWordLimit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valueText: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.valueText = newVal;
    },
  },
  methods: {
    input() {
      let text = this.valueText;
      if (this.valueText.length > this.maxlength) {
        text = this.valueText.slice(0, 300);
        this.valueText = this.value;
      }
      this.$emit('input', text);
    },
  },
};
</script>

<style lang="scss">
  .mp-textarea{
    position: relative;
    >#mp-textarea-const{
      width: calc(100% - 22px);
      position: absolute;
      bottom: 1px;
      font-size: 12px;
      line-height: 12px;
      padding-bottom: 2px;
      left: 2px;
      color: #909399;
      text-align: right;
      background-color: #fff;
    }
  }
</style>
