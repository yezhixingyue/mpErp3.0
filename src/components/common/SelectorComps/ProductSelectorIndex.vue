<template>
  <ul class="mp-order-product-select-wrap" v-if="!useCascader">
    <li class="text" v-if="!hiddenLabel">
      <span>产品：</span>
    </li>
    <li class="first-select-box">
      <select-comp
        :title="first"
        :size='size'
        :useOrigin='useOrigin'
        :options='largeProduct'
        :disabled='disabled'
        :defaultProps='{label: "ClassName",value: "ID"}'
        @handleChange="handleSwitch1" />
    </li>
    <li>
      <select-comp
        :title="second"
        :size='size'
        :useOrigin='useOrigin'
        :options='midProduct'
        :disabled='disabled'
        :defaultProps='{label: "ClassName",value: "ID"}'
        @handleChange="handleSwitch2" />
    </li>
    <li>
      <select-comp
        :title="third"
        :size='size'
        :useOrigin='useOrigin'
        :options='productThirdList'
        :disabled='disabled'
        :defaultProps='{label: "ProductName",value: "ProductID"}'
        @handleChange="handleSwitch3" />
    </li>
  </ul>
  <EpCascader v-else :list="allProductClassifyWithEmpty" v-model="EpCascaderValue" :fiexdWidth="240" />
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import SelectComp from '../SelectComp.vue';
import EpCascader from '../../../packages/EpCascader/index.vue';

// 适配尚未完成 后续处理

export default {
  props: {
    ClassID: {
      default: '',
      required: true,
    },
    TypeID: {
      default: '',
      required: true,
    },
    ProductID: {
      // default: '',
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
    useCustomer: {
      type: Boolean,
      default: false,
    },
    hiddenLabel: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'mini',
    },
    useOrigin: {
      type: Boolean,
      default: false,
    },
    level1EmptyLabel: {
      type: String,
      default: '不限',
    },
    level2EmptyLabel: {
      type: String,
      default: '不限',
    },
    level3EmptyLabel: {
      type: String,
      default: '不限',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    useCascader: { // 此处尚未封装完成
      type: Boolean,
      default: false,
    },
  },
  components: {
    SelectComp,
    EpCascader,
  },
  computed: {
    ...mapState('common', ['productNames', 'ProductMultipleClassifyList']),
    ...mapGetters('common', ['allProductClassifyWithEmpty']),
    productClassList() {
      const type = this.useCustomer ? 2 : 6;
      const target = this.ProductMultipleClassifyList.find(it => it.ID === type);
      return target && Array.isArray(target.List) ? target.List : [];
    },
    largeProduct() {
      const arr = [{ ID: '', ClassName: this.level1EmptyLabel }];
      if (this.productClassList.length > 0) {
        const tempArr = this.productClassList.filter((item) => item.Level === 1);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    midProduct() {
      const arr = [{ ID: '', ClassName: this.level2EmptyLabel }];
      const id = this.first;
      if (id) {
        const tempArr = this.productClassList.filter((item) => item.ParentID === id);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    first: {
      get() {
        return this.ClassID;
      },
      set(newVal) {
        if (newVal === this.ClassID) return;
        this.changePropsFunc([this.typeList[0], newVal]);
        this.requestFunc();
      },
    },
    second: {
      get() {
        return this.TypeID;
      },
      set(newVal) {
        if (newVal === this.TypeID) return;
        this.changePropsFunc([this.typeList[1], newVal]);
        this.requestFunc();
      },
    },
    third: {
      get() {
        return this.ProductID;
      },
      set(newVal) {
        if (newVal === this.ProductID) return;
        this.changePropsFunc([this.typeList[2], newVal]);
        this.requestFunc();
      },
    },
    productThirdList() {
      const _arr = this.productNames.filter(it => {
        const Type = this.useCustomer ? 2 : 1;
        const t = it.ClassifyList.find(_it => _it.Type === Type);
        if (!t) return false;
        const { FirstLevel, SecondLevel } = t;
        return FirstLevel.ID === this.first && SecondLevel.ID === this.second;
      }).map(it => ({ ...it, ProductID: it.ID, ProductName: it.Name }));
      return [{ ProductID: '', ProductName: this.level3EmptyLabel }, ..._arr];
    },
  },
  methods: {
    ...mapActions('common', ['getProductClassifyData', 'getAllProductNames']),
    handleSwitch1(e) {
      if (e === this.first) return;
      this.changePropsFunc([this.typeList[1], '']);
      this.changePropsFunc([this.typeList[2], '']);
      this.first = e;
      this.products = [{ ProductID: '', ProductName: this.level3EmptyLabel }];
    },
    handleSwitch2(e) {
      if (e === this.second) return;
      this.changePropsFunc([this.typeList[2], '']);
      this.second = e;
    },
    handleSwitch3(e) {
      if (e === this.third) return;
      this.third = e;
    },
  },
  mounted() {
    this.getProductClassifyData({ key: this.useCustomer ? 2 : 6 });
    this.getAllProductNames();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
 .mp-order-product-select-wrap{
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
        > span {
          line-height: 18px;
        }
      }
      > .el-select.mp-common-select-comp-wrap {
        > .el-input > input {
          color: $--color-text-primary;
          font-size: 13px;
        }
        .el-input__inner {
          width: 110px;
        }
        &.first-select-box .el-input__inner{
          width: 94px;
        }
      }
    }
 }
</style>
