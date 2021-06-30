<template>
  <ul class="mp-erp-common-comps-on-element-select-dialog-element-type-show-item-comp-wrap">
    <li v-for="el in elementList" :key="el.StoredContent || el.ID">
      <span
        :class="{
          'has-child': el._FixedTypeList&&el._FixedTypeList.length > 0,
          disabled: !el.StoredContent,
          'is-disabled': el.StoredContent&&selectedElementIDs.includes(el.StoredContent)
        }"
        class="is-element"
        @click="onItemClick(el)">{{getName(el)}}</span>
      <div v-if="el._FixedTypeList && el._FixedTypeList.length > 0">
        （<span v-for="item in el._FixedTypeList" class="blue-span" :class="selectedElementIDs.includes(item.StoredContent)?'is-disabled':''"
        @click="onItemClick(item)" :key="item.StoredContent">{{getName(item)}}</span>）
      </div>
    </li>
  </ul>
</template>

<script>
// 元素类型
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';

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
  },
  computed: {
    elementList() {
      if (this.ElementList) return this.ElementList;
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      const _temp = [];
      const _list = JSON.parse(JSON.stringify(this.dataList));
      _list.forEach(it => {
        const isPropertyFixedType = it.FixedType || it.FixedType === 0; // 是否常量
        if (!isPropertyFixedType) {
          _temp.push({ ...it, _FixedTypeList: [] });
        } else {
          // 1. 由于数据返回时常量数据必定返回在其对应的元素数据之后，所以不考虑实际有t，但t在后面从而找不到数据的情况
          // 2. 由于元素只有多选时才会出现常量类型数据，且多选元素也必可点击，所以t肯定会被找着，所以不考虑t未找到的情况
          // 3. 后面根据情况可扩充该方法
          const t = _temp.find(_it => (_it.Element ? _it.Element.ID : _it.ID) === (it.Element ? it.Element.ID : it.Formula.ID));
          if (t) t._FixedTypeList.push(it);
          else {
            const item = it.Element || it.Formula;
            _temp.push({ ...item, _FixedTypeList: [it] });
          }
        }
      });
      return _temp;
    },
  },
  methods: {
    getName(item) {
      return PropertyClass.getProperyName(item);
    },
    onItemClick(it) {
      this.$emit('submit', it);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-on-element-select-dialog-element-type-show-item-comp-wrap {
  display: flex;
  flex-wrap: wrap;
  > li {
    display: flex;
    line-height: 30px;
    > span {
      flex: none;
      margin-right: 28px;
      &.has-child {
        margin: 0;
      }
    }
    > div {
      display: flex;
      flex-wrap: wrap;
      margin-right: 20px;
      color: #999;
      > span {
        flex: none;
        white-space: nowrap;
        margin: 0 12px;
        font-size: 12px;
      }
    }
  }
  .disabled {
    user-select: none;
    color: #585858 !important;
    pointer-events: none;
  }
  .is-disabled {
    user-select: none;
    color: #cbcbcb !important;
    pointer-events: none;
  }
}
</style>
