<template>
  <div class="mp-common-comps-field-input-wrap">
    <span>{{title}}：</span>
    <input
     type="text" :placeholder="placeholder" :value="value" @input="onInput" :disabled='isDisabled'>
  </div>
</template>

<script>
export default {
  model: {
    value: 'value',
    event: 'input',
  },
  props: {
    title: {
      type: String,
      default: '活动标题',
    },
    placeholder: {
      type: String,
      default: '请输入活动标题',
    },
    value: {
      type: String,
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-field-input-wrap {
  > input {
    outline: none;
    border: 1px solid $--color-text-secondary;
    height: 30px;
    box-sizing: border-box;
    width: 220px;
    color: $--color-text-primary;
    padding-left: 5px;
    &::placeholder {
      font-size: 12px;
      color: $--color-text-secondary;
    }
    font-size: 13px;
  }
  > span {
    font-size: 14px;
    color: $--color-text-primary;
    line-height: 30px;
    margin-right: 15px;
    min-width: 5em;
    text-align: right;
  }
}
</style>
