<template>
  <ul class="mp-common-comps-area-select-wrap">
      <li class="text">{{title}}：</li>
      <li class="first-select-box">
        <select-comp
         :title="first"
         :options='largeArea'
         :defaultProps='localSelectCompDefaultProps'
         @handleChange="handleSwitch1" />
      </li>
      <li>
        <select-comp
         :title="second"
         :options='midArea'
         :defaultProps='localSelectCompDefaultProps'
         @handleChange="handleSwitch2" />
      </li>
      <li>
        <select-comp
         :title="third"
         :options='smArea'
         :defaultProps='localSelectCompDefaultProps'
         @handleChange="handleSwitch3" />
      </li>
    </ul>
</template>

<script>
// 可用作3级筛选组件 （数据格式符合规范的话）
import { mapState } from 'vuex';
import SelectComp from '../SelectComp.vue';

export default {
  props: {
    title: {
      type: String,
      default: '销售区域',
    },
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
    useADArea: {
      type: Boolean,
      default: false,
    },
    useLabel: {
      type: Boolean,
      default: false,
    },
    defaultProps: {
      type: Object,
      default: null,
    },
    propList: {
      type: Array,
      default: null,
    },
    hasNullOption: {
      type: Boolean,
      default: false,
    },
    NullOptionValue: {
      default: -666,
    },
  },
  components: {
    SelectComp,
  },
  computed: {
    ...mapState('common', ['areaList', 'adAreaList']),
    localDefaultProps() {
      if (this.defaultProps) return this.defaultProps;
      if (!this.useADArea) return { label: 'ClassName', value: 'ID' };
      return { label: 'Name', value: 'ID' };
    },
    localSelectCompDefaultProps() {
      if (this.useLabel) {
        return {
          label: this.localDefaultProps.label,
          value: this.localDefaultProps.label,
        };
      }
      return this.localDefaultProps;
    },
    localAreaList() {
      if (Array.isArray(this.propList)) return this.propList;
      if (!this.useADArea) return this.areaList;
      return this.adAreaList;
    },
    largeArea() {
      const arr = [{ [this.localDefaultProps.value]: '', [this.localDefaultProps.label]: '不限' }];
      if (this.hasNullOption) arr.push({ [this.localDefaultProps.value]: this.NullOptionValue, [this.localDefaultProps.label]: '无' });
      if (this.localAreaList.length > 0) {
        const tempArr = this.localAreaList.filter((item) => item.Level === 1);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    midArea() {
      const arr = [{ [this.localDefaultProps.value]: '', [this.localDefaultProps.label]: '不限' }];
      if (!this.first && this.first !== 0) {
        return arr;
      }
      if (this.first === this.NullOptionValue) {
        return [{ [this.localDefaultProps.value]: this.NullOptionValue, [this.localDefaultProps.label]: '无' }];
      }
      if (this.hasNullOption) arr.push({ [this.localDefaultProps.value]: this.NullOptionValue, [this.localDefaultProps.label]: '无' });
      if (this.first) {
        let temp = this.first;
        if (this.useLabel) {
          const t = this.largeArea.find(it => it[this.localDefaultProps.label] === this.first);
          if (t) temp = t[this.localDefaultProps.value];
        }
        const tempArr = this.localAreaList.filter((item) => item.ParentID === temp);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    smArea() {
      const arr = [{ [this.localDefaultProps.value]: '', [this.localDefaultProps.label]: '不限' }];
      if (!this.first && this.first !== 0) {
        return arr;
      }
      if (this.second === this.NullOptionValue) {
        return [{ [this.localDefaultProps.value]: this.NullOptionValue, [this.localDefaultProps.label]: '无' }];
      }
      if (this.hasNullOption) arr.push({ [this.localDefaultProps.value]: this.NullOptionValue, [this.localDefaultProps.label]: '无' });
      if (this.second) {
        let temp = this.second;
        if (this.useLabel) {
          const t = this.midArea.find(it => it[this.localDefaultProps.label] === this.second);
          if (t) temp = t[this.localDefaultProps.value];
        }
        const tempArr = this.localAreaList.filter((item) => item.ParentID === temp);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    first: {
      get() {
        if (this.useLabel && this.RegionalID === '') return '不限';
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
        if (this.useLabel && this.CityID === '') return '不限';
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
        if (this.useLabel && this.CountyID === '') return '不限';
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
    handleSwitch1(e) {
      const val = this.hasNullOption && e === this.NullOptionValue ? this.NullOptionValue : '';
      this.changePropsFunc([this.typeList[1], val]);
      this.changePropsFunc([this.typeList[2], val]);
      let temp = e;
      if (this.useLabel && e === '不限') temp = '';
      this.first = temp;
    },
    handleSwitch2(e) {
      const val = this.hasNullOption && e === this.NullOptionValue ? this.NullOptionValue : '';
      this.changePropsFunc([this.typeList[2], val]);
      let temp = e;
      if (this.useLabel && e === '不限') temp = '';
      this.second = temp;
    },
    handleSwitch3(e) {
      let temp = e;
      if (this.useLabel && e === '不限') temp = '';
      this.third = temp;
    },
  },
  created() {
    if (Array.isArray(this.propList)) return;
    if (!this.useADArea) this.$store.dispatch('common/getAreaList');
    else this.$store.dispatch('common/fetchAdAreaList');
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
