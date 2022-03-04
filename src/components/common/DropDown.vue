<template>
    <el-dropdown size='service-order-drop'  :disabled='disabled' :class="{disabled: disabled, em: isUnSelect}"
      trigger="click" class="mp-dorp-down-wrap" placement="bottom-start" @command="onCommand">
      <span class="el-dropdown-link">
        {{localLabel}}
        <i class="el-icon-arrow-down el-icon-caret-bottom"></i>
      </span>
      <el-dropdown-menu slot="dropdown" :disabled='disabled'>
        <el-dropdown-item
          :disabled='disabled'
          v-for="(item,index) in localList"
          :key="item + '-' + index"
          :class="{active: item[defaultProps.value] === watchTarget}"
          :command="item"
        >{{item[defaultProps.label]}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
</template>

<script>

export default {
  props: {
    /**
     * 显示的标题
     */
    title: {
      type: String,
      default: '不限',
    },
    /**
     * 下拉列表中的选项数据
     */
    list: {
      type: Array,
      default: () => [],
    },
    /**
     * 序号，如果是使用v-for一次性生成多个下拉列表时，可以用此进行区分，需要重新返还给父级
     */
    index: {
      type: Number,
      default: 0,
    },
    /**
     * 监听对象，如果该对象改变为''，则本组件标题修改为传递进来的title
     */
    watchTarget: {
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'name',
        value: 'ID',
      }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selfTitle: '不限',
    };
  },
  computed: {
    localList() {
      return this.disabled ? [] : this.list;
    },
    localLabel() {
      if (this.watchTarget || this.watchTarget === 0) {
        const t = this.list.find(it => it[this.defaultProps.value] === this.watchTarget);
        if (t) return t[this.defaultProps.label];
      }
      return this.title;
    },
    isUnSelect() {
      return !this.watchTarget && this.watchTarget !== 0;
    },
  },
  watch: {
    watchTarget(newVal) {
      if (newVal === '') {
        this.selfTitle = this.title;
        return;
      }
      // eslint-disable-next-line max-len
      // else if (this.list[newVal - 1].Title !== this.selfTitle) this.selfTitle = this.list[newVal - 1].Title;
      const t = this.list.find(it => it[this.defaultProps.value] === newVal);
      if (t) this.selfTitle = t[this.defaultProps.label];
      else this.selfTitle = '';
    },
  },
  methods: {
    onCommand(command) {
      if (this.disabled || command[this.defaultProps.value] === this.watchTarget) return;
      this.selfTitle = command[this.defaultProps.label];
      this.$emit('select', [command[this.defaultProps.value], command[this.defaultProps.label], this.index]);
    },
  },
  mounted() {
    this.selfTitle = this.title;
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-dorp-down-wrap {
  height: 25px;
  width: 114px;
  box-sizing: border-box;
  border-bottom: 1px solid $--border-color-base;
  margin-left: 10px;
  user-select: none;
  &.el-dropdown {
    font-size: 13px;
    & > span {
      outline: none;
      display: flex;
      width: calc(100% - 15px);
      color: $--color-text-regular;
      line-height: 23px;
      justify-content: space-between;
      padding: 0 7px 0 5px;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      padding-right: 0px;
      > i {
        display: none;
      }
    }
    &.disabled {
      // background: #f5f5f5;
      > span {
        cursor: not-allowed;
        // background: #f8f8f8;
        // pointer-events: none;
      }
    }
    &.em {
      > span {
        color: #cbcbcb;
      }
      &::after {
        opacity: 0.4;
      }
    }
  }
  position: relative;
  &::after {
    content: "";
    position: absolute;
    background: url('../../assets/images/arrowbottom.png') no-repeat center;
    background-size: 100% 100%;
    height: 9px;
    width: 11px;
    right: 3px;
    top: 5px;
  }
}
.el-dropdown-menu--service-order-drop {
  padding: 0;
  // width: 99px;
  border-radius: 0px;
  &.el-popper[x-placement^=bottom] {
    margin: 0;
    & > div::after,
    & > div{
      display: none;
    }
  }
  > li{
    padding: 0;
    margin: 0;
    padding-left: 12px;
    font-size: 12px;
    text-align: left;
    &.active {
      font-weight: 700;
      color: #26bcf9;
    }
  }
}
</style>
