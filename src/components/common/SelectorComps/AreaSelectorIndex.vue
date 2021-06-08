<template>
  <ul class="mp-common-comps-area-select-wrap">
      <li class="text">销售区域：</li>
      <li class="first-select-box">
        <select-comp
         :title="first"
         :options='largeArea'
         :defaultProps='{label: "ClassName",value: "ID"}'
         @handleChange="handleSwitch1" />
      </li>
      <li>
        <select-comp
         :title="second"
         :options='midArea'
         :defaultProps='{label: "ClassName",value: "ID"}'
         @handleChange="handleSwitch2" />
      </li>
      <li>
        <select-comp
         :title="third"
         :options='smArea'
         :defaultProps='{label: "ClassName",value: "ID"}'
         @handleChange="handleSwitch3" />
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
    /**
     * 绑定的省ID值
     */
    RegionalID: {
      default: '',
      required: true,
    },
    /**
     * 绑定的市ID值
     */
    CityID: {
      default: '',
      required: true,
    },
    /**
     * 绑定的区ID值
     */
    CountyID: {
      default: '',
      required: true,
    },
    /**
     * 修改状态值的处理函数，当变化时使用
     */
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
  },
  computed: {
    ...mapState('common', ['areaList']),
    largeArea() {
      const arr = [{ ID: '', ClassName: '不限' }];
      if (this.areaList.length > 0) {
        const tempArr = this.areaList.filter((item) => item.Level === 1);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    midArea() {
      const arr = [{ ID: '', ClassName: '不限' }];
      if (this.first) {
        const tempArr = this.areaList.filter((item) => item.ParentID === this.first);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    smArea() {
      const arr = [{ ID: '', ClassName: '不限' }];
      if (this.second) {
        const tempArr = this.areaList.filter((item) => item.ParentID === this.second);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    first: {
      get() {
        return this.RegionalID;
      },
      set(newVal) {
        if (newVal === this.RegionalID) return;
        this.changePropsFunc([this.typeList[0], newVal]);
        this.requestFunc();
      },
    },
    second: {
      get() {
        return this.CityID;
      },
      set(newVal) {
        if (newVal === this.CityID) return;
        this.changePropsFunc([this.typeList[1], newVal]);
        this.requestFunc();
      },
    },
    third: {
      get() {
        return this.CountyID;
      },
      set(newVal) {
        if (newVal === this.CountyID) return;
        this.changePropsFunc([this.typeList[2], newVal]);
        this.requestFunc();
      },
    },
  },
  methods: {
    ...mapActions('common', ['getAreaList']),
    handleSwitch1(e) {
      this.changePropsFunc([this.typeList[1], '']);
      this.changePropsFunc([this.typeList[2], '']);
      this.first = e;
    },
    handleSwitch2(e) {
      this.changePropsFunc([this.typeList[2], '']);
      this.second = e;
    },
    handleSwitch3(e) {
      this.third = e;
    },
  },
  created() {
    this.getAreaList();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
  .mp-common-comps-area-select-wrap {
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
        width: 90px;
      }
    }
  }
</style>
