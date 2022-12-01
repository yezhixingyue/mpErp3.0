<template>
  <section class="mp-erp-comps-customer-detail-display-dialog-comp-set-price-index-main-left-comp-wrap" v-if="customer">
    <header class="is-pink is-font-size-12">除所选择产品外，其它产品价格参照其它区域价格出售</header>
    <main>
      <p>
        <span class="f item">产品</span>
        <span class="s item">等级</span>
        <span class="t item">操作</span>
      </p>
      <ul class="mp-scroll-wrap" ref="oUl">
        <li v-for="(it, i) in PolicyList" :key="it.key">
          <CascadeSelector :tree-data="twoLevelsProductClassify4Customer" :cascadeList='cascadeList' :index='i' auto class="item f" />
          <OrderChannelSelector
            class="s item"
           :options='userVipListNoneEmpty'
           :changePropsFunc='([keys, val]) => it.Category.CategoryID = val'
           :typeList='[["CategoryID"]]'
           :showLabel='false'
           :value='it.Category.CategoryID'
           initSelect
           :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
           />
          <CtrlMenus
           :showList="['add', 'del']"
           :canRemove='PolicyList.length > 1'
           @remove="() => PolicyList.splice(i, 1)"
           @add="onAddClick"
            class="t item"
            addText='添加' />
        </li>
      </ul>
    </main>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import CascadeSelector from '@/components/common/SelectorComps/CascadeSelector';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus/index.vue';
import ItemClass from '../../../../../store/customerManage/PriceProductItemClass';

export default {
  props: {
    customer: {
      type: Object,
      default: null,
    },
  },
  components: {
    CascadeSelector,
    OrderChannelSelector,
    CtrlMenus,
  },
  computed: {
    ...mapState('common', ['userVipListNoneEmpty']),
    ...mapGetters('common', ['twoLevelsProductClassify4Customer']),
  },
  data() {
    return {
      PolicyList: [],
      cascadeList: [
        {
          parentKey: 'ParentID',
          defaultProps: { label: 'ClassName', value: 'ID' },
          initParentID: -1,
          label: '',
          getValue: i => (this.PolicyList[i] ? this.PolicyList[i].ProductClass.First : ''),
          changeFunc: (val, i) => {
            if (this.PolicyList[i]) this.PolicyList[i].ProductClass.First = val;
          },
        },
        {
          parentKey: 'ParentID',
          defaultProps: { label: 'ClassName', value: 'ID' },
          initParentID: -1,
          label: '',
          getValue: i => (this.PolicyList[i] ? this.PolicyList[i].ProductClass.Second : ''),
          changeFunc: (val, i) => {
            if (this.PolicyList[i]) this.PolicyList[i].ProductClass.Second = val;
          },
        },
      ],
    };
  },
  methods: {
    onAddClick() {
      this.PolicyList.push(new ItemClass());
      setTimeout(() => {
        this.$refs.oUl.scrollTop = 10000;
      }, 0);
    },
    checker() {
      return ItemClass.checker(this.PolicyList);
    },
  },
  mounted() {
    if (Array.isArray(this.customer.PolicyList) && this.customer.PolicyList.length > 0) {
      this.PolicyList = this.customer.PolicyList.map(it => new ItemClass(it));
    } else {
      this.PolicyList.push(new ItemClass());
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-customer-detail-display-dialog-comp-set-price-index-main-left-comp-wrap {
  width: 542px;
  margin-right: 20px;
  > header {
    line-height: 20px;
    text-indent: 2px;
    margin-bottom: 10px;
  }
  > main {
    > p {
      height: 30px;
      line-height: 30px;
      color: #444;
      font-size: 14px;
      text-align: center;
      display: flex;
      font-weight: 700;
      background-color: #f5f5f5;
    }
    > ul {
      max-height: 465px;
      overflow-y: auto;
      overflow-x: hidden;
      > li {
        height: 44px;
        display: flex;
        align-items: flex-end;
        > div.mp-erp-common-comps-cascade-selector-comp-wrap {
          align-items: center;
          display: flex;
          justify-content: center;
        }
        .mp-common-select-comp-wrap {
          .el-input::after {
            transform: scale(0.93);
            right: 3px;
          }
          .el-input__inner {
            font-size: 12px;
            width: 94px;
            color: #585858;
          }
        }
      }
    }
    .item { // 表体宽度设置
      flex: none;
      display: flex;
      justify-content: center;
      &.f {
        width: 240px;
      }
      &.s {
        width: 140px;
        &.ml-15 {
          margin-left: 0px;
        }
        .el-input__inner {
          width: 102px;
        }
      }
      &.t {
        width: 160px;
        &.ctrl-menus-container {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          position: relative;
          top: -4px;
          > span {
            margin: 0 10px;
            &:first-of-type {
              position: relative;
              top: -1px;
            }
          }
        }
      }
    }
  }
}
</style>
