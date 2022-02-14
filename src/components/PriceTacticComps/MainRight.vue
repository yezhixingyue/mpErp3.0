<template>
  <div class="mp-price-tactic-list-page-wrap-main-right-table-comp">
    <ul>
      <li class="header">
        <div>产品大类</div>
        <div>产品二类</div>
        <div>价格设置</div>
      </li>
    </ul>
    <ul ref='oScrollWrap'>
      <li v-for="(it, i) in tableList" :key="i" :class="{active: index === i}">
        <div>{{it.FirstLevelName}}</div>
        <div>{{it.SecondLevelName}}</div>
        <div>
          <span>区域价格 X </span>
          <el-input :value="it.PercentValue" :disabled='loading' size="small" maxlength="9" @focus="onFocus(i)" @blur="onBlur" @input="onInput"></el-input>
          <span>%</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    tableList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      index: '',
    };
  },
  methods: {
    onFocus(i) {
      this.index = i;
    },
    onBlur() {
      this.index = '';
    },
    onInput(val) {
      this.$emit('input', [this.index, val]);
    },
  },
  watch: {
    tableList(newVal) {
      if (newVal && newVal.length > 0 && this.$refs.oScrollWrap) {
        this.$refs.oScrollWrap.scrollTop = 0;
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-price-tactic-list-page-wrap-main-right-table-comp {
  width: 900px;
  height: 100%;
  padding-left: 13px !important;
  > ul {
    > li {
      display: flex;
      align-items: center;
      color: #585858;
      height: 30px;
      padding: 5px 0;
      transition: 0.05s ease-in-out;
      > div {
        text-align: center;
        width: 220px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:last-of-type {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 360px;
          > span {
            white-space: nowrap;
            color: #aaa;
            font-size: 13px;
          }
          > .el-input {
            margin: 0 5px;
            width: 90px;
            > input {
              text-align: center;
              height: 30px;
            }
          }
        }
      }
      &.header {
        height: 34px;
        padding: 0;
        border: 1px solid #ddd;
        background: #eee;
        > div {
          font-weight: 700;
        }
      }
      &.active {
        background: #eee;
      }
    }
    &:last-of-type {
      overflow: auto;
      height: calc(100% - 36px);
    }
  }
}
</style>
