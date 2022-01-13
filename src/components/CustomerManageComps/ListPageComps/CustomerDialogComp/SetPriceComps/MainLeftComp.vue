<template>
  <section class="mp-erp-comps-customer-detail-display-dialog-comp-set-price-index-main-left-comp-wrap" v-if="customer">
    <header class="is-pink is-font-size-12">除所选择产品外，其它产品价格参照其它区域价格出售</header>
    <main>
      <p>
        <span class="f item">产品</span>
        <span class="s item">等级</span>
        <span class="t item">操作</span>
      </p>
      <ul>
        <li v-if="PolicyList[0]">
          <CascadeSelector :tree-data="twoLevelsProductClassify4Customer" :cascadeList='cascadeList' v-model="PolicyList[0]" auto />
        </li>
      </ul>
    </main>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import CascadeSelector from '@/components/common/SelectorComps/CascadeSelector';
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
  },
  computed: {
    ...mapGetters('common', ['twoLevelsProductClassify4Customer']),
  },
  data() {
    return {
      PolicyList: [],
      cascadeList: [
        {
          keys: ['ProductClass', 'First'],
          parentKey: 'ParentID',
          defaultProps: {
            label: 'ClassName',
            value: 'ID',
          },
          initParentID: -1,
          label: '',
        },
      ],
    };
  },
  mounted() {
    console.log(new ItemClass(), this.twoLevelsProductClassify4Customer);
    this.PolicyList.push(new ItemClass());
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-customer-detail-display-dialog-comp-set-price-index-main-left-comp-wrap {
  width: 542px;
  margin-right: 20px;
  > header {
    line-height: 20px;
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
    .item { // 表体宽度设置
      flex: none;
      &.f {
        width: 240px;
      }
      &.s {
        width: 140px;
      }
      &.t {
        width: 160px;
      }
    }
  }
}
</style>
