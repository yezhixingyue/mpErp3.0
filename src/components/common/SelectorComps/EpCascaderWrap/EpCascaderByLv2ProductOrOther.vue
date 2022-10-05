<template>
  <!-- v-bind="$attrs" v-on="$listeners" -->
  <EpCascader
    :showLine="showLine"
    :list="ProductClassifyList"
    :fiexdWidth="fiexdWidth"
    :title="title"
    :withEmpty="withEmpty"
    :onlyLastValid="onlyLastValid"
    :level="2"
    v-model="EpCascaderProductValue"
   />
</template>

<script>
import { mapGetters } from 'vuex';
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
      default: 180,
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
    typeList: {
      type: Array,
      default: () => [['ProductClass', 'First'], ['ProductClass', 'Second']],
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
    withEmpty: { // 下拉列表中不包含不限选项 -- 使用时会初始选中下拉参数
      type: Boolean,
      default: true,
    },
    initValue: { // 是否初始选中数据 并 执行getList方法 通常和withEmpty连用
      type: Boolean,
      default: false,
    },
    autoComplete: { // 如果选中的是父级选项时 自动选中其第一个子选项
      type: Boolean,
      default: false,
    },
    onlyLastValid: {
      type: Boolean,
      default: false,
    },
    ClassifyList: {
      type: Array,
      default: null,
    },
  },
  components: {
    // EpCascader,
    EpCascader: lib.EpCascader,
  },
  computed: {
    ...mapGetters('common', ['twoLevelsProductClassify', 'twoLevelsProductClassify4Customer']),
    ProductClassifyList() {
      if (Array.isArray(this.ClassifyList)) return this.ClassifyList;
      return this.useCustomer ? this.twoLevelsProductClassify4Customer : this.twoLevelsProductClassify;
    },
    EpCascaderProductValue: {
      get() {
        const list = [
          this.First,
          this.Second,
        ];
        return list.filter(it => it || it === 0);
      },
      set(ids) {
        const [_First, _Second] = ids;
        const First = _First || _First === 0 ? _First : '';
        let Second = _Second || _Second === 0 ? _Second : '';
        if (First !== '' && Second === '' && this.autoComplete) {
          const t = this.ProductClassifyList.find(it => it.ID === First);
          if (t && t.children && t.children.length > 0) {
            Second = t.children[0].ID;
          }
        }
        this.setCondition([this.typeList[0], First]);
        this.setCondition([this.typeList[1], Second]);
        this.getList();
      },
    },
  },
  watch: {
    ProductClassifyList: {
      handler(newVal, oldVal) {
        if (this.initValue && Array.isArray(newVal) && newVal.length > 0 && (!oldVal || oldVal.length === 0) && !this.First && this.First !== 0) {
          if (this.initValue) {
            const ids = [newVal[0].ID];
            if (Array.isArray(newVal[0].children) && newVal[0].children.length > 0) {
              ids.push(newVal[0].children[0].ID);
            }
            this.EpCascaderProductValue = ids;
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    const key = this.useCustomer ? 2 : 6;
    this.$store.dispatch('common/getProductClassifyData', { key });
  },
};
</script>
<style lang='scss'>
</style>
