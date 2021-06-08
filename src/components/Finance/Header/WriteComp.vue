<template>
  <ul class="mp-order-user-select-wrap">
    <li class="text">销账状态：</li>
    <li class="mp-finance-radio-box">
        <!-- <SingleRadio
          :list='list'
          :defaultRadio='0'
          :handleSwitch='handleSwitch'
        /> -->
        <SelectComp @handleChange="handleSwitch" :options="options" :title="title" />
    </li>
  </ul>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
// import SingleRadio from '@/components/common/SingleRadio.vue';
import SelectComp from '@/components/common/SelectComp.vue';

export default {
  components: {
    // SingleRadio,
    SelectComp,
  },
  data() {
    return {
      options: [{
        value: '0',
        label: '不限',
      }, {
        value: '1',
        label: '已销账',
      }, {
        value: '2',
        label: '未销账',
      }],
      // title: '不限',
    };
  },
  computed: {
    ...mapState('finance', ['searchCondition4Finance']),
    title() {
      if (this.searchCondition4Finance.HaveWriteOff === true) return '1';
      if (this.searchCondition4Finance.HaveWriteOff === false) return '2';
      return '0';
    },
  },
  methods: {
    ...mapMutations('finance', ['setHaveWriteOff']),
    ...mapActions('finance', ['getFinanceTableData']),
    handleSwitch(key) {
      switch (+key) {
        case 0:
          this.setHaveWriteOff(null);
          break;
        case 1:
          this.setHaveWriteOff(true);
          break;
        case 2:
          this.setHaveWriteOff(false);
          break;
        default:
          break;
      }
      this.getFinanceTableData();
    },
  },
};
</script>

<style lang='scss'>
.mp-finance-radio-box{
    line-height: 25px;
    > span > label > .el-radio__label {
        font-size: 14px;
    }
}
</style>
