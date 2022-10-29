<template>
  <el-checkbox-group v-model="checkList" class="mp-common-comps-checkbox-group-comp-wrap">
    <el-checkbox
      v-for='(item, i) in itemList'
      :label="useLabel?item[defaultProps.label]:item[defaultProps.value]"
      :key='(item[defaultProps.value] + "-" + item[defaultProps.label] + i)'
      :disabled='isDisabled'
      >
      <span :title="item[defaultProps.label]">{{item[defaultProps.label]}}</span>
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  model: {
    prop: 'selectList',
    event: 'change',
  },
  props: {
    title: {
      type: String,
      default: '下单渠道',
    },
    itemList: {
      type: Array,
      default: () => [],
    },
    selectList: {
      type: Array,
      default: () => [],
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'CategoryName',
        value: 'CategoryID',
      }),
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    useLabel: {
      type: Boolean,
      default: true,
    },
    showTips: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    checkList: {
      get() {
        return this.selectList.map(
          sub => {
            const _t = this.itemList.find(
              item => item[this.defaultProps.value] === sub[this.defaultProps.value],
            );
            if (_t) return this.useLabel ? _t[this.defaultProps.label] : _t[this.defaultProps.value];
            return null;
          },
        ).filter(_it => !!_it);
      },
      set(list) {
        let _list = list.map(
          it => this.itemList.find(item => item[this.useLabel ? this.defaultProps.label : this.defaultProps.value] === it),
        );
        _list = _list.map(item => ({ [this.defaultProps.value]: item[this.defaultProps.value] }));
        this.$emit('change', _list);
      },
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-checkbox-group-comp-wrap {
  display: flex;
  flex-wrap: wrap;
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #26bcf9;
    border-color: #26bcf9;
    &::after {
      border-color: #fff;
    }
  }
  .el-checkbox__label {
    color: $--color-text-primary !important;
  }
}
</style>
