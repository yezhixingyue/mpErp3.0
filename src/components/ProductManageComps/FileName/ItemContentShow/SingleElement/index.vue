<template>
  <section class="mp-erp-product-module-filename-item-content-show-single-element-comp-wrap" v-if="ElementData">
    <header>
      <span
        class="title"
       :title="`${ElementData.Name}${ElementData.Unit?'单位（'+ElementData.Unit+'）':''}`"
       >{{ElementData.Name}}<i v-if="ElementData.Unit">：</i> </span>
      <span
        class="unit"
       :title="`${ElementData.Name}${ElementData.Unit?'单位（'+ElementData.Unit+'）':''}`" v-if='ElementData.Unit'
       >单位（{{ElementData.Unit}}）</span>
    </header>
    <main>
      <!-- 名称通假字:  三种类型元素均有 -->
      <SingleElementItem key="every" v-model="ElementDataFalseWords" />
      <!-- 单位通假字:  数值类型可能有 -->
      <SingleElementItem key="number-unit" v-model="ElementDataFalseWords" type="Unit" v-if="ElementData.Unit && ElementData.Type === 1" />
      <!-- 选项类型 -->
      <template v-if="ElementData.Type && ElementData.Type === 2 && ElementData.OptionAttribute.OptionList">
        <SingleElementItem
         :key="it.ID"
         :optionTitle="`选项通假字(${it.Name})`"
         :value="it.FalseWords"
         @change="onElementOptionChange($event, it.ID)"
         v-for="it in ElementData.OptionAttribute.OptionList" />
      </template>
      <!-- 尺寸组类型 -->
      <template v-if="isSizeGroup">
        <SingleElementItem key="size-join" type='SizeJoin' optionTitle='尺寸连接符' v-model="ElementDataFalseWords" />
        <SingleElementItem key="size-unit-position" type='SizeUnitPosition' optionTitle='单位显示' v-model="ElementDataFalseWords" />
      </template>
    </main>
  </section>
</template>

<script>
import SingleElementItem from './SingleElementItem';

export default {
  props: {
    ElementData: {
      type: Object,
      default: null,
    },
    isSizeGroup: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    SingleElementItem,
  },
  computed: {
    ElementDataFalseWords: {
      get() {
        return this.ElementData.FalseWords;
      },
      set(val) {
        this.$emit('change', { ElementID: this.ElementData.ID, FalseWords: val });
      },
    },
  },
  methods: {
    onElementOptionChange(e, OptionID) {
      this.$emit('change', { ElementID: this.ElementData.ID, FalseWords: e, OptionID });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-filename-item-content-show-single-element-comp-wrap {
  > header {
    font-size: 14px;
    color: #444;
    margin-bottom: 10px;
    margin-top: 14px;
    line-height: 20px;
    max-width: 190px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    > .title {
      font-weight: 700;
    }
  }
  > main {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
