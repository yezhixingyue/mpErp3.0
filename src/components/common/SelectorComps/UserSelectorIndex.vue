<template>
  <ul class="mp-order-user-select-wrap">
    <li class="text">用户：</li>
    <li class="first-select-box">
      <select-comp
        :title="first"
        :options='filterUserTypeList'
        :defaultProps='{label: "CategoryName",value: "CategoryID"}'
        @handleChange="handleSwitch1" />
    </li>
    <li>
      <select-comp
        :title="second"
        :options='userRankList'
        :defaultProps='{label: "CategoryName",value: "CategoryID"}'
        @handleChange="handleSwitch2" />
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import SelectComp from '../SelectComp.vue';

export default {
  components: {
    SelectComp,
  },
  props: {
    userType: {
      default: '',
      required: true,
    },
    userRank: {
      default: '',
      required: true,
    },
    changePropsFunc: {
      type: Function,
      default: () => {},
    },
    /**
     * 每个值对应的修改时的路径类型列表
     */
    typeList: {
      type: Array,
      default: () => [],
    },
    requestFunc: {
      type: Function,
      default: () => {},
    },
    /**
     * 客户类型value值是否为1， 即是否包含电商类客户，为true不包含， 默认为包含
     */
    isValueEq1: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('common', ['userTypeList', 'userRankList']),
    first: {
      get() {
        return this.userType;
      },
      set(newVal) {
        this.changePropsFunc([this.typeList[0], newVal]);
        this.requestFunc();
      },
    },
    second: {
      get() {
        return this.userRank;
      },
      set(newVal) {
        this.changePropsFunc([this.typeList[1], newVal]);
        this.requestFunc();
      },
    },
    filterUserTypeList() {
      if (!this.isValueEq1) {
        return this.userTypeList;
      }
      return this.userTypeList.filter(item => item.Value === 1 || !item.Value);
    },
  },
  methods: {
    ...mapActions('common', ['getUserClassify']),
    handleSwitch1(e) {
      this.first = e;
    },
    handleSwitch2(e) {
      this.second = e;
    },
  },
  mounted() {
    this.getUserClassify();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
  .mp-order-user-select-wrap{
    display: flex;
    > li {
      margin-right: 15px;
      &.text {
        font-size: 14px;
        color: $--color-text-primary;
        font-weight: 600;
        line-height: 25px;
        width: 5em;
        text-align: right;
      }
      > .el-select.mp-common-select-comp-wrap {
        > .el-input > input {
          color: $--color-text-primary;
          font-size: 13px;
        }
      }
      .el-input__inner {
        width: 110px;
      }
      &.first-select-box .el-input__inner{
        width: 94px;
      }
    }
  }
</style>
