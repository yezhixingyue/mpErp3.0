<!--
 * @Describe: 胶囊样式并列单选框 - 背景全蓝组件 外部直接使用v-model进行数据传输绑定 其可以直接绑定data数据也可以使用计算属性绑定vuex中状态
 * @FilePath: /src/components/common/RadioButtonGroupComp.vue
-->
<template>
  <section class="mp-common-comps-radio-group-wrap">
    <header v-if="title">{{title}}：</header>
    <el-radio-group
    :class="{
      'mp-radio-group-full-box': isFull && !isRound,
      'mp-radio-group-line-box': !isFull && !isRound,
    }"
    v-model="radio"
    size='mini'>
      <el-radio-button
        v-for="(item, i) of radioList"
        :key="item[defaultProps.label] + '-' + i"
        :label="item[defaultProps.label]"
      />
    </el-radio-group>
  </section>
</template>

<script>
export default {
  model: {
    prop: 'radioValue',
    event: 'handleChange',
  },
  props: {
    radioList: {
      type: Array,
      default: () => [],
    },
    radioValue: {
      default: '',
    },
    isFull: {
      type: Boolean,
      default: true,
    },
    isRound: {
      type: Boolean,
      default: false,
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'name',
        value: 'ID',
      }),
    },
    title: {
      default: '',
      type: String,
    },
    requestFunc: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    radio: {
      get() {
        const it = this.radioList.find(item => item[this.defaultProps.value] === this.radioValue);
        if (it) return it[this.defaultProps.label];
        return '';
      },
      set(e) {
        const it = this.radioList.find(item => item[this.defaultProps.label] === e);
        this.$emit('handleChange', it[this.defaultProps.value]);
        this.requestFunc();
      },
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-radio-group-full-box.el-radio-group {
  height: 28px;
  white-space: nowrap;
  > .el-radio-button {
    height: 100%;
    width: 100px;
    // box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.15);
    > .el-radio-button__inner{
      height: 100%;
      width: 100%;
      font-size: 14px;
      line-height: 12px;
      color: $--color-text-primary;
      background-color: $--bg-color-base;
      border-color: $--border-color-base;
      transition: background-color 0s;
      &:hover {
        background-color: $--color-text-table-hover;
      }
    }
    &.is-active {
      > .el-radio-button__inner{
        border-color: $--color-primary;
        color: $--color-primary;
        background-color: $--color-white;
        &:hover {
          background-color: $--color-text-table-hover;
        }
        // text-shadow: 0 0px 1px rgba($--color-primary, 0.3);
        // box-shadow: inset 0px 1px 3px rgba($--color-primary, 0.3), -1px 0 0 0 #26bcf9;
      }
    }
    &:last-of-type > .el-radio-button__inner{
      border-radius: 0 2px 2px 0;
    }
    &:first-of-type > .el-radio-button__inner{
      border-radius: 2px 0px 0px 2px;
    }
  }
}
.mp-radio-group-line-box.el-radio-group {
  > .el-radio-button {
    // box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.15);
    > .el-radio-button__inner {
      border: none;
      border-bottom: 1px solid $--border-color-base;
      color: $--color-text-primary;
      background-color: #fff;
      font-size: 13px;
      width: 80px;
      border-radius: 0;
      padding-top: 2px;
      height: 28px;
      &:hover {
        background-color: $--color-text-table-hover;
      }
    }
    &.is-active > .el-radio-button__inner {
      background-color: #fff;
      color: $--color-primary;
      box-shadow: none;
      border-color: $--color-primary;
    }
    &:focus{
      box-shadow: none !important;
    }
  }
}
.mp-common-comps-radio-group-wrap {
  display: flex;
  align-items: center;
  > header {
    min-width: 5em;
    font-size: 14px;
    font-weight: 600;
    color: $--color-text-primary;
    line-height: 24px;
    margin-right: 15px;
  }
}
</style>
