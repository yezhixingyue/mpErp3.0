<template>
  <ul class="mp-erp-common-min-max-Num-comp-wrap">
    <li class="text" v-if="title">
      <span>{{title}}：</span>
    </li>
    <li :style='`width:${width}`'>
      <el-input v-model="num1"  size="small" @keyup.enter.native="keyup(num1)" placeholder="请输入小值"></el-input>
      <i>-</i>
      <el-input v-model="num2"  size="small" @keyup.enter.native="keyup(num2)" placeholder="请输入大值"></el-input>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    width: {
      type: String,
      default: '100',
    },
    title: {
      type: String,
      default: '成交价',
    },
    First: {
      default: '',
    },
    Second: {
      default: '',
    },

    typeList: {
      type: Array,
      default: () => [['Amount', 'First'], ['Amount', 'Second']],
    },
    setCondition: {
      type: Function,
      default: () => {},
    },
    getList: {
      type: Function,
      default: () => {},
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  computed: {
    num1: {
      get() {
        return this.First;
      },
      set(num) {
        this.setCondition([this.typeList[0], num]);
        // this.getList();
      },
    },
    num2: {
      get() {
        return this.Second;
      },
      set(num) {
        this.setCondition([this.typeList[1], num]);
        // this.getList();
      },
    },
  },
  methods: {
    keyup(num) {
      if (Number.isNaN(Number(num))) {
        this.$message.error('请输入阿拉伯数字!');
        return;
      }
      this.getList();
    },
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-common-min-max-Num-comp-wrap{
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
    >i{
      margin: 0 10px;
    }
    .el-input{
      width: 100px;
      .el-input{
        input{
          text-align: left;
        }
      }
    }
  }
}
</style>
