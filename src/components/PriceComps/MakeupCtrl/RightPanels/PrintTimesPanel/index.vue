<template>
  <section class="mp-erp-price-module-makeup-ctrl-page-print-times-panel-wrap">
    <header>
      <span>印刷次数为：</span>
      <el-radio-group v-model="radio">
        <el-radio :label="it.ID" v-for="it in PrintTimesRuleList" :key="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
    </header>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    initData: {
      type: Object,
      default: null,
    },
  },
  computed: mapState('priceManage', ['PrintTimesRuleList']),
  data() {
    return {
      radio: 1,
    };
  },
  methods: {
    getSubmitInfo() {
      const temp = {
        PrintTimes: this.radio,
      };
      return temp;
    },
    initEditData() {
      if (this.initData) {
        this.radio = (this.initData.PrintTimes || this.initData.PrintTimes === 0) ? this.initData.PrintTimes : 1;
      }
    },
  },
  mounted() {
    this.initEditData();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-ctrl-page-print-times-panel-wrap {
  > header {
    padding-top: 5px;
    > span {
      font-size: 14px;
      color: #888E99;
      margin-right: 6px;
    }
    .el-radio {
      margin-right: 40px;
      .el-radio__label {
        font-size: 12px;
        color: #444;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
}
</style>
