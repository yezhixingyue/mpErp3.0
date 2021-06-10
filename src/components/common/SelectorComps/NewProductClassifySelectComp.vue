<template>
  <ThreeLevelSelectComp
   :title='title || "产品分类"'
   v-model="classify"
   :level1Options='level1Options'
   :level2Options='level2Options'
   :level3Options='level3Options'
   :defaultProps='defaultProps'
   :lv1DefaultProps='lv1DefaultProps'
  />
</template>

<script>
import ThreeLevelSelectComp from '@/components/common/SelectorComps/ThreeLevelSelectComp.vue';
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    defaultLabelProps: {
      type: Object,
      default: () => ({ lv1PropName: 'First', lv2PropName: 'Second', lv3PropName: 'Third' }),
    },
    defaultProps: {
      type: Object,
      default: () => ({ label: 'ClassName', value: 'ID' }),
    },
    lv1DefaultProps: {
      type: Object,
      default: () => ({ label: 'Name', value: 'ID' }),
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  components: {
    ThreeLevelSelectComp,
  },
  computed: {
    ...mapState('common', ['ProductClassifyIDList', 'ProductMultipleClassifyList']),
    ...mapGetters('common', ['twoLevelsMultipleProductClassifyList4Sort']),
    classify: {
      get() {
        return {
          level1Val: this.value[this.defaultLabelProps.lv1PropName],
          level2Val: this.value[this.defaultLabelProps.lv2PropName],
          level3Val: this.value[this.defaultLabelProps.lv3PropName],
        };
      },
      set(val) {
        if (!val) return;
        const { level1Val, level2Val, level3Val } = val;
        if ((level1Val || level1Val === 0) && (!level2Val && level2Val !== 0) && (!level3Val && level3Val !== 0)) {
          // 此时改变的是第一级分类  可能该分类下尚无数据  所以这里需要请求下分类列表数据
          this.getClassifyData(level1Val);
        }
        const temp = {
          [this.defaultLabelProps.lv1PropName]: level1Val,
          [this.defaultLabelProps.lv2PropName]: level2Val,
          [this.defaultLabelProps.lv3PropName]: level3Val,
        };
        this.$emit('change', temp);
      },
    },
    level1Options() {
      const item = {
        [this.lv1DefaultProps.label]: '不限',
        [this.lv1DefaultProps.value]: '',
      };
      if (!this.ProductClassifyIDList || !Array.isArray(this.ProductClassifyIDList) || this.ProductClassifyIDList.length === 0) return [item];
      const list = this.ProductClassifyIDList.map(it => ({ ID: it.Type, Name: it.Name }));
      return [item, ...list];
    },
    level2Options() {
      const item = {
        [this.defaultProps.label]: '不限',
        [this.defaultProps.value]: '',
      };
      if (!this.classify.level1Val && this.classify.level1Val !== 0) return [item];
      const t1 = this.ProductClassifyIDList.find(it => it.Type === this.classify.level1Val);
      if (!t1) return [item];
      const t2 = this.twoLevelsMultipleProductClassifyList4Sort.find(it => it.type === t1.ID);
      return t2 && t2.List ? [item, ...t2.List] : [item];
    },
    level3Options() {
      const item = {
        [this.defaultProps.label]: '不限',
        [this.defaultProps.value]: '',
      };
      if (!this.classify.level2Val && this.classify.level2Val !== 0 && this.level2Options.length === 0) return [item];
      const t = this.level2Options.find(it => it.ID === this.classify.level2Val);
      return t && t.children ? [item, ...t.children] : [item];
    },
  },
  methods: {
    getClassifyData(type) {
      const t = this.ProductClassifyIDList.find(it => it.Type === type);
      if (t) {
        this.$store.dispatch('common/getProductClassifyData', { key: t.ID });
      }
    },
  },
  mounted() {
    if (this.classify.level1Val || this.classify.level1Val === 0) {
      this.getClassifyData(this.classify.level1Val);
    }
  },
};
</script>
<style lang='scss'>
</style>
