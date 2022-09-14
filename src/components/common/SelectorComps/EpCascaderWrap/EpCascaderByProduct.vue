<template>
  <!-- v-bind="$attrs" v-on="$listeners" -->
  <EpCascader
    :showLine="showLine"
    :list="localProductList"
    :fiexdWidth="fiexdWidth"
    :title="title"
    v-model="EpCascaderProductValue"
   />
</template>

<script>
import { mapGetters } from 'vuex';
import EpCascader from '../../../../packages/EpCascader/index.vue';

export default {
  props: {
    showLine: {
      type: Boolean,
      default: true,
    },
    fiexdWidth: {
      type: Number,
      default: 240,
    },
    title: {
      type: String,
      default: '产品',
    },
    First: {
      default: '',
    },
    Second: {
      default: '',
    },
    ProductID: {
      default: '',
    },
    typeList: {
      type: Array,
      default: () => [['ProductClass', 'First'], ['ProductClass', 'Second'], ['ProductID', '']],
    },
    setCondition: {
      type: Function,
      default: () => {},
    },
    getList: {
      type: Function,
      default: () => {},
    },
    useCustomer: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    EpCascader,
  },
  computed: {
    ...mapGetters('common', ['allProductClassifyWithEmpty', 'allProductClassify4CustomerWithEmpty']),
    localProductList() {
      return !this.useCustomer ? this.allProductClassifyWithEmpty : this.allProductClassify4CustomerWithEmpty;
    },
    EpCascaderProductValue: {
      get() {
        const list = [
          this.First,
          this.Second,
          this.ProductID,
        ];
        return list.filter(it => it || it === 0);
      },
      set(ids) {
        const [_First, _Second, _ProductID] = ids;
        const First = _First || _First === 0 ? _First : '';
        const Second = _Second || _Second === 0 ? _Second : '';
        const ProductID = _ProductID || _ProductID === 0 ? _ProductID : '';
        this.setCondition([this.typeList[0], First]);
        this.setCondition([this.typeList[1], Second]);
        this.setCondition([this.typeList[2], ProductID]);
        this.getList();
      },
    },
  },
  mounted() {
    const key = this.useCustomer ? 2 : 6;
    this.$store.dispatch('common/getProductClassifyData', { key });
    this.$store.dispatch('common/getAllProductNames');
  },
};
</script>
<style lang='scss'>
</style>
