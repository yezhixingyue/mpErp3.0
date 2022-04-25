<template>
  <div class="mp-erp-back-cash-setup-page-right-item-product-range-item-comp-wrap">
    <TableItemShowComp :list='content'  class="products" title='产品' />
    <div class="condition">
      <el-tooltip v-if="conditionObj" effect="light" popper-class='common-property-condition-text-tips-box' placement="bottom-start" :visible-arrow='false'>
        <div slot="content">
          <p class="if-box"><span class="is-origin">当</span> {{conditionObj.FilterTypeText}}：</p>
          <template v-if="Array.isArray(conditionObj.conditionText)">
            <p v-for="(it, i) in conditionObj.conditionText" :key="it.name + 'tips' + i">
              <span v-if="i > 0" class="type">{{conditionObj.Constraint.FilterType === 1 ? '且' : '或'}}</span>
              <span class="name">{{it.name}}</span>
              <span class="is-origin">{{it.operator}}</span>
              <span class="val">{{it.val}}</span>
              <span v-if="i === conditionObj.conditionText.length - 1" style="margin-left:2px"> 。</span>
              <span v-else style="margin-left:2px">；</span>
            </p>
          </template>
          <p v-else>{{conditionObj.conditionText}}</p>
          <p class="if-box" style="margin-right:5px">
            <span class="is-origin">时 生效。</span>
          </p>
        </div>
        <div class="common-property-condition-text-content-box">
          <p class="if-box"><span class="is-origin">当</span> {{conditionObj.FilterTypeText}}</p>
          <template v-if="Array.isArray(conditionObj.conditionText)">
            <p v-for="(it, i) in conditionObj.conditionText" :key="it.name + 'content' + i">
              <span v-if="i > 0" class="type">{{conditionObj.Constraint.FilterType === 1 ? '且' : '或'}}</span>
              <span>{{it.name}}</span>
              <span>{{it.operator}}</span>
              <span>{{it.val}}</span>
            </p>
          </template>
          <p v-else>{{conditionObj.conditionText}}</p>
          <p class="if-box" style="margin-left:10px;margin-right:5px">
            <span class="is-origin">时 生效。</span>
          </p>
        </div>
      </el-tooltip>
    </div>
    <div class="menus">
      <span class="blue-span" @click="filter" :class="{disabled: isStarted}">筛选条件</span>
      <span class="blue-span" @click="edit" :class="{disabled: isStarted}">编辑产品</span>
      <span class="red-span" @click="remove" :class="{disabled: isStarted}">删除</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import TableItemShowComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/TableItemShowComp';
import { getSelectedContentBySelectedDataAndAllData } from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/utils';

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    isStarted: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TableItemShowComp,
  },
  computed: {
    ...mapState('cashback', ['curItemData']),
    ...mapGetters('common', ['allProductClassify']),
    content() {
      const temp = { List: this.item.ProductClassList, IsIncludeIncreased: this.item.IsIncludeIncreasedProduct };
      const content = getSelectedContentBySelectedDataAndAllData(temp, this.allProductClassify, '产品');
      return content;
    },
    localProductID() {
      let id = '';
      const { ProductClassList, IsIncludeIncreasedProduct } = this.item;
      if (!IsIncludeIncreasedProduct && ProductClassList.length === 1) {
        const [{ IsIncludeIncreased, List }] = ProductClassList;
        if (!IsIncludeIncreased && List.length === 1) {
          if (!List[0].IsIncludeIncreased && List[0].List.length === 1) {
            id = List[0].List[0].ID;
          }
        }
      }
      return id;
    },
    localAllPropertyList() {
      return this.curItemData._allPropertyList;
    },
    localPropertyList() {
      const t = this.localAllPropertyList.find(it => it.id === this.localProductID);
      return t ? t.PropertyList : [];
    },
    conditionObj() {
      if (!this.item.Constraint) return null;
      const [Constraint, conditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(this.item.Constraint, this.localPropertyList);
      return { ...this.item, Constraint, conditionText, FilterTypeText: this.item.Constraint && this.item.Constraint.FilterType === 1 ? '满足所有' : '满足任一' };
    },
  },
  methods: {
    filter() {
      this.$emit('filter');
    },
    edit() {
      this.$emit('edit');
    },
    remove() {
      this.messageBox.warnCancelNullMsg('确定删除该条产品设置吗', () => {
        this.$emit('remove');
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-back-cash-setup-page-right-item-product-range-item-comp-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  padding-right: 11px;
  > div {
    white-space: nowrap;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: none;
    &.products {
      color: #444;
      font-weight: 700;
      width: 300px;
    }
    &.condition {
      flex: 1;
      color: #989898;
      margin-right: 10px;
      font-size: 12px;
    }
    &.menus {
      font-size: 12px;
      > span + span {
        margin-left: 20px;
      }
    }
  }
}
</style>
