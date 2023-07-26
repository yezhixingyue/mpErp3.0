<template>
  <header class="mp-erp-factory-manual-out-source-manage-page-header-wrap">
    <div class="f">
      <EpCascader class="mt-18 mr-30" :list="allProductClassifyWithEmpty" v-model="EpCascaderProductValue" showLine :fiexdWidth="240" />
      <OrderChannelSelector
        withEmpty
        :options='factorys'
        :defaultProps="{label: 'FactoryName', value: 'FactoryID'}"
        :requestFunc='getDataList'
        :changePropsFunc='setCondition'
        :typeList="[['FactoryID', '']]"
        :value='condition.FactoryID'
        label='外协工厂'
        class="mt-18 mr-30"
      />
      <OrderChannelSelector
        withEmpty
        :options='CheckFileOrderStatusOptions'
        :defaultProps="{label: 'Name', value: 'ID'}"
        :requestFunc='getDataList'
        :changePropsFunc='setCondition'
        :typeList="[['CheckFileOrderStatus', '']]"
        :value='condition.CheckFileOrderStatus'
        label='外协状态'
        class="mt-18"
      />
    </div>
    <div class="s">
      <LineDateSelectorComp
        :changePropsFunc='setCondition'
        :requestFunc='getDataList'
        :typeList="[['DateType', ''], ['PlaceDate', 'First'], ['PlaceDate', 'Second']]"
        :dateValue='condition.DateType'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        isFull
        class="mt-18"
        label="时间筛选" />
      <SearchInputComp
        class="mt-18"
        :typeList="[['KeyWords', '']]"
        title="关键词"
        placeholder='请输入搜索关键词'
        :requestFunc='getDataList'
        :changePropsFunc='setCondition'
        :word='condition.KeyWords'
        :searchWatchKey="datas"
        @reset='() => this.clearCondition()'
      />
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import EpCascader from '../../../packages/EpCascader/index.vue';
import OrderChannelSelector from '../../common/SelectorComps/OrderChannelSelector.vue';
import { CheckFileOrderStatusEnumList } from '@/views/FactoryManage/ManualOutsourceManage/classType/EnumList';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    setCondition: {
      type: Function,
      default: () => {},
    },
    clearCondition: {
      type: Function,
      default: () => {},
    },
    datas: {
      type: Array,
      default: () => [],
    },
    factorys: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    EpCascader,
    OrderChannelSelector,
    SearchInputComp,
    LineDateSelectorComp,
  },
  data() {
    return {
      CheckFileOrderStatusOptions: CheckFileOrderStatusEnumList.filter(it => it.filter),
    };
  },
  computed: {
    ...mapGetters('common', ['allProductClassifyWithEmpty']),
    EpCascaderProductValue: {
      get() {
        const list = [
          this.condition.ProductClass.First,
          this.condition.ProductClass.Second,
          this.condition.ProductID,
        ];
        return list.filter(it => it || it === 0);
      },
      set(ids) {
        const [_First, _Second, _ProductID] = ids;
        const First = _First || _First === 0 ? _First : '';
        const Second = _Second || _Second === 0 ? _Second : '';
        const ProductID = _ProductID || _ProductID === 0 ? _ProductID : '';
        this.setCondition([['ProductClass', 'First'], First]);
        this.setCondition([['ProductClass', 'Second'], Second]);
        this.setCondition([['ProductID', ''], ProductID]);
        this.getDataList();
      },
    },
    UserDefinedTimeIsActive() {
      return this.condition.DateType === ''
       && !!this.condition.PlaceDate.First && !!this.condition.PlaceDate.Second;
    },
  },
  methods: {
    getDataList() {
      this.$emit('getList');
    },
  },
  created() {
    this.$store.dispatch('common/getProductClassifyData', { key: 6 });
    this.$store.dispatch('common/getAllProductNames');
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-manual-out-source-manage-page-header-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-bottom: 16px;
  padding-right: 20px;
  > div {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-left: 20px;
    &.s {
      justify-content: space-between;
    }

    .mp-common-comps-ep-cascader-comp-wrap > .title {
      margin-right: 15px;
    }
  }
}
</style>
