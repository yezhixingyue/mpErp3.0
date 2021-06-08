<template>
  <div class="mp-common-comp-single-bottom-line-input-wrap">
    <span class="title">{{title}}：</span>
    <input type="text" v-model="inpVal" />
    <span class="remark is-gray">{{remark}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '金额',
    },
    remark: {
      type: String,
      default: '元',
    },
    value: {},
    isNum: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  computed: {
    inpVal: {
      get() {
        return this.value;
      },
      set(newVal) {
        let _v = newVal;
        if (this.isNum) {
          _v = this.$utils.filterNumber(_v);
        }
        this.$emit('change', _v);
      },
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/common/var.scss";
.mp-common-comp-single-bottom-line-input-wrap {
  display: flex;
  align-items: center;
  > input {
    border: none;
    outline: none;
    border-bottom: 1px solid $--color-text-secondary;
    border-radius: 0;
    margin-right: 10px;
    width: 105px;
    line-height: 21px;
    padding-left: 6px;
    text-align: center;
    color: $--color-text-primary;
  }
  > .title {
    font-size: 14px;
    font-weight: 600;
    color: $--color-text-primary;
    min-width: 7em;
    text-align: right;
    margin-right: 15px;
  }
  > .remark {
    font-size: 12px;
  }
}
</style>
