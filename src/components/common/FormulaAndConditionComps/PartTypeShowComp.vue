<template>
  <div v-if="localListData" class="mp-erp-common-comps-on-element-select-dialog-part-type-show-item-comp-wrap">
    <div class="element">
      <template v-if="!isMultiple">
        <TipsSpanButton
          v-for="item in localListData.Element"
          :key="item.StoredContent"
          @click.native="onSubmit(item)"
          :disabled='selectedElementIDs.includes(item.StoredContent)'
          :text='getTextName(item) || item.DisplayContent || "未知名称"' />
      </template>
      <template v-else>
        <el-checkbox
          v-for="item in localListData.Element" :key="item.StoredContent"
          :value='MultipleCheckedIDList.includes(item.StoredContent)'
          @change="onCheckedItemChange($event, item)">{{getTextName(item) || item.DisplayContent || "未知名称"}}</el-checkbox>
      </template>
    </div>
    <p class="title mp-common-title-wrap" v-if="localListData.Formula.length > 0">公式</p>
    <ElementTypeShowComp
     :dataList='localListData.Formula' :selectedElementIDs='selectedElementIDs' @submit="onSubmit"
     :isMultiple='isMultiple' @checked='onCheckedItemChange' :checkedList='checkedList' />

    <p class="title mp-common-title-wrap" v-if="localListData.Constraint.length > 0">子条件</p>
    <ElementTypeShowComp
     class="sub-condition"
     :dataList='localListData.Constraint' :selectedElementIDs='selectedElementIDs' @submit="onSubmit"
     :isMultiple='isMultiple' @checked='onCheckedItemChange' :checkedList='checkedList' />

    <p class="title mp-common-title-wrap" v-if="localListData.OtherList.length > 0">其它</p>
    <div class="element">
      <template v-if="!isMultiple">
        <TipsSpanButton
          v-for="item in localListData.OtherList"
          :key="item.StoredContent"
          @click.native="onSubmit(item)"
          :disabled='selectedElementIDs.includes(item.StoredContent)'
          :text='getTextName(item) || item.DisplayContent || "未知名称"' />
      </template>
      <template v-else>
        <el-checkbox
          v-for="item in localListData.OtherList" :key="item.StoredContent"
          :value='MultipleCheckedIDList.includes(item.StoredContent)'
          @change="onCheckedItemChange($event, item)">{{getTextName(item) || item.DisplayContent || "未知名称"}}</el-checkbox>
      </template>
    </div>
    <div class="is-font-size-12 is-gray" v-if="localListData.OtherList.length > 0">
      <span>注：</span>
      <div>原始物料数量、原始物料尺寸指没有进行二次加工前的物料数量、尺寸，比如纸张，指没有分切前的纸张数量、尺寸，可能是大度、正度，也可能是特规纸，数量指的是这些纸张使用了多少张，并且加上损耗。</div>
    </div>
  </div>
</template>

<script>
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';
import ElementTypeShowComp from './ElementTypeShowComp';

export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    ElementList: {
      type: Array,
      default: null,
    },
    selectedElementIDs: {
      type: Array,
      default: () => [],
    },
    isMultiple: { // 多选模式
      type: Boolean,
      default: false,
    },
    checkedList: { // 多选时已选中的属性列表
      type: Array,
      default: () => [],
    },
  },
  components: {
    ElementTypeShowComp,
    TipsSpanButton,
  },
  computed: {
    localListData() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return null;
      const obj = {
        Element: [], // 元素
        Formula: [], // 公式子公式
        Constraint: [], // 子条件
        OtherList: [],
      };
      this.dataList.forEach(prop => {
        const { Formula, Constraint, FixedType } = prop;
        if (Formula && !Constraint) { // 公式
          obj.Formula.push(prop);
        } else if (!Formula && Constraint) { // 子条件
          obj.Constraint.push(prop);
        } else if ((FixedType || FixedType === 0) && FixedType <= 10) { // 其它 --- 平铺
          obj.Element.push(prop);
        } else {
          obj.OtherList.push(prop);
        }
      });

      return obj;
    },
    MultipleCheckedIDList() {
      if (!Array.isArray(this.checkedList)) return [];
      return this.checkedList.map(it => it.StoredContent);
    },
  },
  methods: {
    onSubmit(e) {
      this.$emit('submit', e);
    },
    onCheckedItemChange(e, el) {
      this.$emit('checked', e, el);
    },
    getTextName(item) {
      return PropertyClass.getProperyName(item);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-on-element-select-dialog-part-type-show-item-comp-wrap {
  flex-direction: column;
  > p.title {
    display: block;
    color: #444;
    margin-top: 12px;
    margin-bottom: 8px;
  }
  > div.element {
    padding: 10px 0;
    padding-bottom: 4px;
    display: flex;
    flex-wrap: wrap;
    .mp-common-title-wrap {
      width: 100%;
      margin-bottom: 15px;
    }
    > span {
      margin-right: 28px;
      margin-bottom: 12px;
      white-space: nowrap;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  > .is-font-size-12 {
    display: flex;
    line-height: 18px;
  }
  > ul {
    margin-bottom: 12px;
  }
}
</style>
