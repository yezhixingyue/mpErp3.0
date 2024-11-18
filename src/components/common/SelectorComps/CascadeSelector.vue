<template>
  <div v-if="treeData && Array.isArray(cascadeList)" class="mp-erp-common-comps-cascade-selector-comp-wrap">
    <OrderChannelSelector
      v-for="(it, i) in cascadeList"
      :key="i"
      :options='OptionLists[i] || []'
      :requestFunc='requestFunc'
      :changePropsFunc='([keys, val]) => handleValueChange(it, val, i)'
      :typeList="[]"
      :value='it.getValue(index)'
      :label='it.label||""'
      :showLabel='!!it.label'
      :initSelect='i === 0'
      :withEmpty='withEmpty'
      :disabled='disabled'
      :defaultProps="it.defaultProps || defaultProps"
      />
  </div>
</template>

<script>
import OrderChannelSelector from './OrderChannelSelector.vue';

export default {
  props: {
    treeData: {
      type: Array,
      default: null,
    },
    auto: { // 开启该项时应关闭withEmpty属性
      type: Boolean,
      default: false,
    },
    cascadeList: {
      type: Array,
      default: () => [],
    },
    defaultProps: {
      type: Object,
      default: () => ({ label: 'ClassName', value: 'ID' }),
    },
    index: {
      type: Number,
      required: true,
    },
    withEmpty: { // 是否包含不限选项
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    OrderChannelSelector,
  },
  computed: {
    OptionLists() {
      if (Array.isArray(this.treeData)) {
        const list = [];
        this.cascadeList.forEach((it, i) => {
          let itemList;
          if (i === 0) {
            itemList = this.treeData.filter(lv1 => lv1[it.parentKey] === it.initParentID);
          } else {
            const lastLevelValue = this.cascadeList[i - 1].getValue(this.index);
            const t = list[i - 1].find(_it => _it[this.defaultProps.value] === lastLevelValue);
            itemList = t && t.children ? t.children : [];
          }
          // itemList = itemList.filter(_it => _it[this.defaultProps.value] !== '');
          // if (this.withEmpty) {
          //   itemList.unshift({ [this.defaultProps.value]: '', [this.defaultProps.label]: '不限' });
          // }
          list.push(itemList);
        });
        return list; // 后面动态填充
      }
      return [];
    },
  },
  data() {
    return {
    };
  },
  methods: {
    requestFunc() {
    },
    handleValueChange(it, val, i) {
      it.changeFunc(val, this.index);
      this.cascadeList.forEach((_it, _i) => {
        if (_i > i) {
          const _val = this.auto && !this.withEmpty && this.OptionLists[_i] && this.OptionLists[_i].length > 0
            ? (this.OptionLists[_i][0][_it.defaultProps.value] || '')
            : '';
          this.cascadeList[_i].changeFunc(_val, this.index);
        }
      });
      this.$emit('change');
    },
  },
  // mounted() {
  //   if (this.OptionLists[0] && this.OptionLists[0].length > 0 && this.auto && this.cascadeList.length > 0 && this.cascadeList[0].getValue(this.index)==='') {
  //     this.handleValueChange(this.cascadeList[0], this.OptionLists[0][0][this.cascadeList[0].defaultProps.value], 0);
  //   }
  // },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-cascade-selector-comp-wrap {
  > section {
    display: inline-block;
  }
}
</style>
