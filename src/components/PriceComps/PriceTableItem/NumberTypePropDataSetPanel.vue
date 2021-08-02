<template>
  <ul class="mp-erp-comps-price-module-price-table-item-axis-prop-data-number-type-panel-wrap">
    <li class="operator">
      <span class="label">区间对比符号：</span>
      <span>下限</span>
      <el-select v-model="LeftOperator" size="mini">
        <el-option
          v-for="item in OperatorList"
          :key="item.ID"
          :label="item.label"
          :value="item.ID">
        </el-option>
      </el-select>
      <span>值</span>
      <el-select v-model="RightOperator" size="mini">
        <el-option
          v-for="item in OperatorList"
          :key="item.ID"
          :label="item.label"
          :value="item.ID">
        </el-option>
      </el-select>
      <span>上限</span>
    </li>
    <li class="input">
      <el-input v-model="inpContent" size="small" maxlength="200" />
    </li>
    <li class="tip">
      <div class="tips-box">
        <span class="l"> <i class="el-icon-warning"></i> 注：</span>
        <p>
          <span>各段之间以逗号“，”分开，固定数值和区间范围可以混合在一起；</span>
          <span>区间范围的上下限以空格（全角或半角）分开；</span>
          <span>-1 表示无限大；</span>
        </p>
      </div>
    </li>
    <li class="intro">
      <p>例如：</p>
      <div>
        <p>名片数量输入：10，20，50，50 70，70 100，100  -1</p>
        <p>对比符号设为：下限 ＜ 值 ≤ 上限</p>
        <p>则被分解成：10盒，20盒，50盒，50盒 ＜ 数量 ≤ 70盒，70盒 ＜ 数量 ≤ 100盒，100盒 ＜ 数量 ≤ 无穷大</p>
      </div>
      <div>
        <p>名片数量输入：10 50，50 100，200 500，500 -1</p>
        <p>对比符号设为：下限 ＜ 值 ≤ 上限</p>
        <p>则被分解成：10 ＜ 数量  ≤ 50盒，50  ＜ 数量  ≤ 100盒， 200  ＜ 数量  ≤ 500盒，500盒  ＜ 数量  ≤ 无穷大</p>
      </div>
    </li>
  </ul>
</template>

<script>
import { AllOperatorList } from '@/assets/js/TypeClass/PropertyClass';

export default {
  props: {
    Property: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: String,
      default: '',
    },
    Operator: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
    };
  },
  computed: {
    OperatorList() {
      const list = ['小于', '小于等于'];
      return AllOperatorList.filter(it => list.includes(it.Name));
    },
    LeftOperator: {
      get() {
        return this.Operator.First;
      },
      set(val) {
        this.$emit('update:operator', { ...this.Operator, First: val });
      },
    },
    RightOperator: {
      get() {
        return this.Operator.Second;
      },
      set(val) {
        this.$emit('update:operator', { ...this.Operator, Second: val });
      },
    },
    inpContent: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-table-item-axis-prop-data-number-type-panel-wrap {
  > li {
    &.operator {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      > span {
        font-size: 12px;
        color: #585858;
        &.label {
          color: #888E99;
          font-size: 14px;
          margin-right: 6px;
        }
      }
      .el-select {
        width: 100px;
        margin: 0 10px;
        input {
          line-height: 30px;
          height: 30px;
          font-size: 14px;
        }
      }
    }
    &.input {
      margin-bottom: 24px;
    }
    &.tip {
      .tips-box {
        width: 600px;
        height: 75px;
        display: flex;
        > span {
          white-space: nowrap;
          line-height: 24px;
          margin-right: 2px;
        }
        > p {
          display: flex;
          flex-direction: column;
          line-height: 24px;
          > span {
            letter-spacing: 1px;
          }
        }
      }
    }
    &.intro {
      padding-top: 23px;
      font-size: 12px;
      color: #999;
      > div {
        padding-top: 15px;
        line-height: 22px;
      }
    }
  }
  padding-bottom: 25px;
}
</style>
