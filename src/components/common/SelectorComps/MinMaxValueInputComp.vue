<template>
  <div class="mp-coms-common-min-max-value-input-comp-wrap">
    <span v-if="title">{{title}}：</span>
    <div>
      <el-input type="text" v-model="min" />
      <span>≤ {{text}} ≤</span>
      <el-input type="text" v-model="max" />
      <span style="color:#a2a2a2"><template v-if="unit">{{unit}}</template> ( 无穷大请填写 -1 ）</span>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'valueList',
    event: 'change',
  },
  props: {
    title: {
      type: String,
      default: '单个订单金额',
    },
    text: {
      type: String,
      default: '金额',
    },
    valueList: {
      type: Array,
      default: () => ([0, -1]),
    },
    unit: {
      type: String,
      default: '元',
    },
  },
  computed: {
    min: {
      get() {
        return this.valueList[0];
      },
      set(newVal) {
        let min = newVal.replace(/[^\d]/g, '');
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(min) && min) min = +min;
        this.$emit('change', [min, this.valueList[1]]);
      },
    },
    max: {
      get() {
        return this.valueList[1];
      },
      set(newVal) {
        let max = newVal.replace(/[^\d-]/g, '');
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(max) && max) {
          max = +max;
          if (max < -1) return;
        }
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(max) && max) {
          const _list = max.split('-');
          if (_list.length > 2) return;
          if (_list.length > 1 && !/^-/.test(max)) return;
        }
        this.$emit('change', [this.valueList[0], max]);
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-coms-common-min-max-value-input-comp-wrap {
  display: flex;
  align-items: center;
  > span {
    font-size: 14px;
  }
  > div {
    display: flex;
    align-items: center;
    color: #585858;
    > .el-input {
      width: 90px;
      height: 30px;
      font-size: 14px;
      > input {
        height: 30px;
        font-size: 14px;
        font-weight: 700;
        color: #2196f3;
        text-align: center;
        padding-right: 20px;
      }
    }
    > span {
      font-size: 12px;
      padding: 0 10px;
    }
  }
}
</style>
