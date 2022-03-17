<template>
  <ul class="mp-erp-common-select-comps-two-level-select-comp-wrap">
    <li class="text" v-if="title">
      <span>{{title}}：</span>
    </li>
    <li class="first-select-box">
      <SelectComp v-model="level1" :options='level1Options' :defaultProps='defaultProps' :showLine='showLine' />
    </li>
    <li>
      <SelectComp v-model="level2" :options='level2Options' :defaultProps='lv2DefaultProps || defaultProps' :showLine='showLine' />
    </li>
  </ul>
</template>

<script>
import SelectComp from './NewSelectComp.vue';

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    level1Options: {
      type: Array,
      default: () => ([]),
    },
    level2Options: {
      type: Array,
      default: () => ([]),
    },
    defaultProps: {
      type: Object,
      default: () => ({ label: 'Name', value: 'ID' }),
    },
    lv2DefaultProps: {
      type: Object,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({ level1Val: '', level2Val: '' }),
    },
    isAssociated: { // 2级分类关联 第一个改变时清除第二个内容
      type: Boolean,
      default: true,
    },
    showLine: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  components: {
    SelectComp,
  },
  computed: {
    level1: {
      get() {
        return this.value.level1Val;
      },
      set(newVal) {
        if (this.value.level1Val === newVal) return;
        this.$emit('change', {
          level1Val: newVal,
          level2Val: this.isAssociated ? '' : this.level2,
        });
      },
    },
    level2: {
      get() {
        return this.value.level2Val;
      },
      set(newVal) {
        this.$emit('change', {
          level1Val: this.level1,
          level2Val: newVal,
        });
      },
    },
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-erp-common-select-comps-two-level-select-comp-wrap{
  display: flex;
  > li {
    margin-right: 15px;
    &.text {
      font-size: 14px;
      color: $--color-text-primary;
      font-weight: 600;
      line-height: 25px;
      width: 5em;
      text-align: right;
      > span {
        line-height: 18px;
      }
    }
    > .el-select.mp-common-select-comp-wrap {
      > .el-input > input {
        color: $--color-text-primary;
        font-size: 13px;
      }
    }
    .el-input__inner {
      width: 150px;
    }
  }
}
</style>
