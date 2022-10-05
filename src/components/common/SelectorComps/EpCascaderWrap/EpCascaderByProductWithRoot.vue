<template>
  <!-- v-bind="$attrs" v-on="$listeners" -->
  <EpCascader
    :showLine="showLine"
    :list="list"
    :fiexdWidth="fiexdWidth"
    :title="title"
    :level="3"
    v-model="EpCascaderProductValue"
   />
</template>

<script>
import { mapGetters, mapState } from 'vuex';
// import EpCascader from '../../../../packages/EpCascader/index.vue';
import lib from 'mpzj-sell-lib';

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
      default: '产品分类',
    },
    ClassType: {
      default: '',
    },
    First: {
      default: '',
    },
    Second: {
      default: '',
    },
    typeList: {
      type: Array,
      default: () => [['ClassType', ''], ['ProductClass', 'First'], ['ProductClass', 'Second']],
    },
    setCondition: {
      type: Function,
      default: () => {},
    },
    getList: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    // EpCascader,
    EpCascader: lib.EpCascader,
  },
  computed: {
    ...mapState('common', ['ProductClassifyIDList']),
    ...mapGetters('common', ['allProductClassify', 'allProductClassify4Customer']),
    list() {
      return this.ProductClassifyIDList.map(it => {
        let children = this.allProductClassify;
        if (it.ID === 2) {
          children = this.allProductClassify4Customer;
        }
        return { ...it, children, ID: `${it.Type}` };
      });
    },
    EpCascaderProductValue: {
      get() {
        const list = [
          this.ClassType,
          this.First,
          this.Second,
        ];
        return list.filter(it => it || it === 0);
      },
      set(ids) {
        const [_First, _Second, _ProductID] = ids;
        const ClassType = _First || _First === 0 ? _First : '';
        const First = _Second || _Second === 0 ? _Second : '';
        const Second = _ProductID || _ProductID === 0 ? _ProductID : '';
        this.setCondition([this.typeList[0], ClassType]);
        this.setCondition([this.typeList[1], First]);
        this.setCondition([this.typeList[2], Second]);
        this.getList();
      },
    },
  },
  mounted() {
    this.$store.dispatch('common/getProductClassifyData', { key: 6 });
    this.$store.dispatch('common/getProductClassifyData', { key: 2 });
    this.$store.dispatch('common/getAllProductNames');
  },
};
</script>
<style lang='scss'>
</style>
