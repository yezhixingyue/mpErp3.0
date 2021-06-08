<template>
  <ul class="mp-order-product-select-wrap">
          <li class="text">
            <span>产品：</span>
          </li>
          <li class="first-select-box">
            <select-comp
             :title="first"
             :options='largeProduct'
             :defaultProps='{label: "ClassName",value: "ID"}'
             @handleChange="handleSwitch1" />
          </li>
          <li>
            <select-comp
             :title="second"
             :options='midProduct'
             :defaultProps='{label: "ClassName",value: "ID"}'
             @handleChange="handleSwitch2" />
          </li>
          <li>
            <select-comp
             :title="third"
             :options='productThirdList'
             :defaultProps='{label: "ProductName",value: "ProductID"}'
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
  },
  computed: {
    ...mapState('common', ['productList', 'productNames']),
    largeProduct() {
      const arr = [{ ID: '', ClassName: '不限' }];
      if (this.productList.length > 0) {
        const tempArr = this.productList.filter((item) => item.Level === 1);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    midProduct() {
      const arr = [{ ID: '', ClassName: '不限' }];
      const id = this.first;
      if (id) {
        const tempArr = this.productList.filter((item) => item.ParentID === id);
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
        const { First, Second } = it.ProductClass;
        return First === this.first && Second === this.second;
      });
      return [{ ProductID: '', ProductName: '不限' }, ..._arr];
    },
  },
  methods: {
    ...mapActions('common', ['getProductList', 'getProductThird', 'getAllProductNames']),
    // onMidSelect(arr) {
    //   this.setProductClass2(arr);
    //   if (arr[0]) this.getProductThird();
    // },
    handleSwitch1(e) {
      if (e === this.first) return;
      this.changePropsFunc([this.typeList[1], '']);
      this.changePropsFunc([this.typeList[2], '']);
      this.first = e;
      this.products = [{ ProductID: '', ProductName: '不限' }];
    },
    handleSwitch2(e) {
      if (e === this.second) return;
      this.changePropsFunc([this.typeList[2], '']);
      this.second = e;
      // this.getProductThird();
    },
    handleSwitch3(e) {
      if (e === this.third) return;
      this.third = e;
    },
    // async getProductThird() {
    //   // 获取产品列表数据
    //   const _obj = {};
    //   _obj.ProductClass = {
    //     First: this.first,
    //     Second: this.second,
    //   };
    //   _obj.FieldType = 1;
    //   const res = await this.api.getProductLists(_obj);
    //   if (res.data.Status === 1000)
    //     this.products = [{ ProductID: '', ProductName: '不限' }, ...res.data.Data];
    // },
  },
  mounted() {
    this.getProductList();
    this.getAllProductNames();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
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
