<template>
  <ul class="mp-erp-review-setting-panels-size-number-panel-dialog-bleed-comp-wrap">
    <li>
      <span>上：</span>
      <el-input size="mini" maxlength="9" v-model.trim="top"></el-input>
      <em>mm</em>
    </li>
    <li class="m">
      <span>左：</span>
      <el-input size="mini" maxlength="9" v-model.trim="left"></el-input>
      <em>mm</em>

      <span>右：</span>
      <el-input size="mini" maxlength="9" v-model.trim="right"></el-input>
      <em>mm</em>
    </li>
    <li>
      <span>下：</span>
      <el-input size="mini" maxlength="9" v-model.trim="bottom"></el-input>
      <em>mm</em>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    ruleForm: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    top: {
      get() {
        return this.ruleForm.BleedTop;
      },
      set(val) {
        this.$emit('change', ['BleedTop', val]);
      },
    },
    left: {
      get() {
        return this.ruleForm.BleedLeft;
      },
      set(val) {
        this.$emit('change', ['BleedLeft', val]);
      },
    },
    right: {
      get() {
        return this.ruleForm.BleedRight;
      },
      set(val) {
        this.$emit('change', ['BleedRight', val]);
      },
    },
    bottom: {
      get() {
        return this.ruleForm.BleedBottom;
      },
      set(val) {
        this.$emit('change', ['BleedBottom', val]);
      },
    },
  },
};
</script>
<style lang='scss'>
  .mp-erp-review-setting-panels-size-number-panel-dialog-bleed-comp-wrap {
    margin-top: -15px;
    margin-left: 64px;
    margin-left: -28px;
    margin-bottom: 24px;
    > li {
      color: #888;
      font-size: 13px;
      margin-bottom: 8px;
      margin-left: 100px;
      &.m {
        margin-left: 0;
      }
      .el-input {
        width: 100px;
        input {
          text-align: center;
        }
      }
      > em {
        margin-left: 6px;
        font-size: 12px;
        margin-right: 45px;
      }
      > span {
        font-size: 13px;
      }
    }
  }
</style>
