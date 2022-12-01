<template>
  <ul class="mp-erp-common-select-comps-two-level-select-comp-wrap">
    <li class="text" v-if="title">
      <span>{{title}}：</span>
    </li>
    <li class="first-select-box">
      <SelectComp v-model="level1" :options='level1Options' :size="size" :defaultProps='defaultProps' :showLine='showLine' />
    </li>
    <li>
      <SelectComp v-model="level2" :options='level2Options' :size="size" :defaultProps='lv2DefaultProps || defaultProps' :showLine='showLine' />
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
    size: {
      type: String,
      default: 'small',
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
        const level1Item = this.level1Options.find(it => it[this.defaultProps.value] === newVal);
        const level2Val = this.isAssociated ? '' : this.level2;
        const level2Item = this.level2Options.find(it => it[this.defaultProps.value] === level2Val);
        this.$emit('change', {
          level1Val: newVal,
          level2Val: this.isAssociated ? '' : this.level2,
          level1Item,
          level2Item,
        });
      },
    },
    level2: {
      get() {
        return this.value.level2Val;
      },
      set(newVal) {
        const level1Item = this.level1Options.find(it => it[this.defaultProps.value] === this.level1);
        const level2Item = this.level2Options.find(it => it[this.defaultProps.value] === newVal);
        this.$emit('change', {
          level1Val: this.level1,
          level2Val: newVal,
          level1Item,
          level2Item,
        });
      },
    },
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
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
