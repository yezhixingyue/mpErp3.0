<template>
  <ul class="mp-order-product-select-wrap">
    <li class="text">
      <span>{{title}}：</span>
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
    title: {
      type: String,
      default: '产品',
    },
    useCustomer: {
      type: Boolean,
      default: false,
    },
    haveNotEmpty: { // 下拉列表中不包含不限选项 -- 使用时会初始选中下拉参数
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('common', ['ProductMultipleClassifyList']),
    productClassList() {
      const type = this.useCustomer ? 2 : 6;
      const target = this.ProductMultipleClassifyList.find(it => it.ID === type);
      return target && Array.isArray(target.List) ? target.List : [];
    },
    largeProduct() {
      const arr = this.haveNotEmpty ? [] : [{ ID: '', ClassName: '不限' }];
      if (this.productClassList.length > 0) {
        let tempArr = this.productClassList.filter((item) => item.Level === 1);
        if (this.haveNotEmpty) {
          tempArr = tempArr.filter(it => {
            const _list = this.productClassList.filter((item) => item.ParentID === it.ID);
            return _list.length > 0;
          });
        }
        return [...arr, ...tempArr];
      }
      return arr;
    },
    midProduct() {
      const arr = this.haveNotEmpty ? [] : [{ ID: '', ClassName: '不限' }];
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
        if (!this.haveNotEmpty) this.requestFunc();
        else {
          this.$nextTick(() => {
            if (this.midProduct.length > 0) {
              this.second = this.midProduct[0].ID;
            }
          });
        }
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
  },
  methods: {
    ...mapActions('common', ['getProductClassifyData']),
    handleSwitch1(e) {
      if (e === this.first) return;
      this.changePropsFunc([this.typeList[1], '']);
      this.first = e;
      this.products = this.haveNotEmpty ? [] : [{ ProductID: '', ProductName: '不限' }];
    },
    handleSwitch2(e) {
      if (e === this.second) return;
      this.second = e;
    },
  },
  watch: {
    ProductMultipleClassifyList: { // 当下拉选项中不包含不限时，在初始获取到数据后，进行初始值设置
      handler(val) {
        if (!val || !this.haveNotEmpty || this.largeProduct.length === 0) return;
        this.first = this.largeProduct[0].ID;
      },
      immediate: true,
    },
  },
  mounted() {
    const key = this.useCustomer ? 2 : 6;
    this.getProductClassifyData({ key });
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
