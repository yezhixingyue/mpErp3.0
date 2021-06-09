<template>
  <ul class="mp-erp-common-select-comps-three-level-select-comp-wrap" :class="showLine?'show-line':''">
    <li class="text" v-if="title">
      <span>{{title}}：</span>
    </li>
    <li :style='`width:${width1}`'>
      <SelectComp v-model="level1" :options='level1Options' :defaultProps='lv1DefaultProps || defaultProps' />
    </li>
    <li :style='`width:${width2}`'>
      <SelectComp v-model="level2" :options='level2Options' :defaultProps='lv2DefaultProps || defaultProps' />
    </li>
    <li :style='`width:${width3}`'>
      <SelectComp v-model="level3" :options='level3Options' :defaultProps='lv3DefaultProps || defaultProps' />
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
    level3Options: {
      type: Array,
      default: () => ([]),
    },
    defaultProps: {
      type: Object,
      default: () => ({ label: 'Name', value: 'ID' }),
    },
    lv1DefaultProps: {
      type: Object,
      default: null,
    },
    lv2DefaultProps: {
      type: Object,
      default: null,
    },
    lv3DefaultProps: {
      type: Object,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({ level1Val: '', level2Val: '', level3Val: '' }),
    },
    isAssociated: { // 2级分类关联 第一个改变时清除第二个内容
      type: Boolean,
      default: true,
    },
    showLine: { // 下拉框是框型样式  还是 下划线型样式
      type: Boolean,
      default: true,
    },
    width1: {
      type: String,
      default: '112px',
    },
    width2: {
      type: String,
      default: '112px',
    },
    width3: {
      type: String,
      default: '112px',
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
          level3Val: this.isAssociated ? '' : this.level3,
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
          level3Val: this.isAssociated ? '' : this.level3,
        });
      },
    },
    level3: {
      get() {
        return this.value.level3Val;
      },
      set(newVal) {
        this.$emit('change', {
          level1Val: this.level1,
          level2Val: this.level2,
          level3Val: newVal,
        });
      },
    },
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-erp-common-select-comps-three-level-select-comp-wrap{
  display: flex;
  > li {
    flex: none;
    margin-right: 15px;
    &.text {
      font-size: 14px;
      color: $--color-text-primary;
      font-weight: 600;
      line-height: 31px;
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
  }
  &.show-line {
    .el-select  {
      .el-input__inner {
        border-radius: 0;
        border: none;
        border-bottom: 1px solid #CBCBCB; // e790
      }
      .el-input__icon{
        color: #989898;
        &::before {
          content: '\e78f';
        }
      }
    }
  }
}
</style>
