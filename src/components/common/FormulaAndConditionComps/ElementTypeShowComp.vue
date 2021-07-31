<template>
  <ul class="mp-erp-common-comps-on-element-select-dialog-element-type-show-item-comp-wrap">
    <li v-for="el in elementList" :key="el.StoredContent || el.ID">
      <span
        v-if="!isMultiple || !el.StoredContent"
        :class="{
          'has-child': el._FixedTypeList&&el._FixedTypeList.length > 0,
          'disabled': !el.StoredContent,
          'is-disabled': el.StoredContent&&selectedElementIDs.includes(el.StoredContent),
          'is-element': true
        }"
        @click="onItemClick(el)"
        >{{getName(el)}}</span>
      <el-checkbox :value='MultipleCheckedIDList.includes(el.StoredContent)' @change="onCheckedItemChange($event, el)" v-else>{{getName(el)}}</el-checkbox>
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
    isMultiple: { // 多选模式
      type: Boolean,
      default: false,
    },
    checkedList: { // 多选时已选中的属性列表
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
          const i = _temp.findIndex(el => this.getResultFor2PropsIsSame(el, it));
          if (i > -1) {
            if (!_temp[i].StoredContent && it.StoredContent) {
              const { _FixedTypeList } = _temp[i];
              const _newItem = { ...it, _FixedTypeList };
              _temp.splice(i, 1, _newItem);
            }
          } else {
            _temp.push({ ...it, _FixedTypeList: [] });
          }
        } else {
          // 1. 由于数据返回时常量数据必定返回在其对应的元素数据之后，所以不考虑实际有t，但t在后面从而找不到数据的情况
          // 2. 由于元素只有多选时才会出现常量类型数据，且多选元素也必可点击，所以t肯定会被找着，所以不考虑t未找到的情况
          // 3. 后面根据情况可扩充该方法
          const t = _temp.find(_it => {
            let ID = '';
            if (it.Element) ID = it.Element.ID;
            else if (it.Formula) ID = it.Formula.ID;
            else if (it.Constraint) ID = it.Constraint.ID;
            return (_it.Element ? _it.Element.ID : _it.ID) === ID;
          });
          if (t) t._FixedTypeList.push(it);
          else {
            const item = it.Element || it.Formula || it.Constraint;
            _temp.push({ ...item, _FixedTypeList: [it] });
          }
        }
      });
      return _temp;
    },
    MultipleCheckedIDList() {
      if (!Array.isArray(this.checkedList)) return [];
      return this.checkedList.map(it => it.StoredContent);
    },
  },
  methods: {
    getName(item) {
      return PropertyClass.getProperyName(item);
    },
    onItemClick(it) {
      this.$emit('submit', it);
    },
    onCheckedItemChange(e, el) {
      this.$emit('checked', e, el);
    },
    getResultFor2PropsIsSame(el, it) { // 判断2个元素属性是否相同 目前可判断范围为元素和公式
      if (el.Element) return el.Element.ID === it.Element && it.Element.ID;
      if (el.Formula) return el.Formula.ID === it.Formula && it.Formula.ID;
      if (el.ID && it.Element) return el.ID === it.Element.ID;
      if (el.ID && it.Formula) return el.ID === it.Formula.ID;
      return false;
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
    .el-checkbox {
      .el-checkbox__label {
        font-size: 13px;
      }
      margin-right: 12px;
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
