<template>
  <ul class="mp-erp-common-comps-on-element-select-dialog-group-type-show-item-comp-wrap">
    <li v-for="it in groupList" :key="it.Group ? it.Group.ID : it.ID">
      <label v-if="it.Group">
        <el-checkbox :value='MultipleCheckedIDList.includes(it.StoredContent)'
         v-if="isMultiple&&it.StoredContent" @change="onCheckedItemChange($event, it)">{{it.Group.Name}}</el-checkbox>
        <span class="is-element" @click="onItemClick(it)" v-else-if="it.StoredContent">{{it.Group.Name}}</span>
        <span v-else>{{it.Group.Name}}</span>
        <!-- <template v-if="it.Group.GroupProps && it.Group.GroupProps.length > 0">
          （<span :class="selectedElementIDs.includes(gProp.StoredContent)?'is-disabled':''"
             class="blue-span" @click="onItemClick(gProp)" v-for="gProp in it.Group.GroupProps" :key="gProp.StoredContent">{{getName(gProp)}}</span>）
        </template> -->
        <template v-if="it._FixedTypeList && it._FixedTypeList.length > 0">
          （<span :class="selectedElementIDs.includes(gProp.StoredContent)?'is-disabled':''"
             class="blue-span" @click="onItemClick(gProp)" v-for="gProp in it._FixedTypeList" :key="gProp.StoredContent">{{getName(gProp)}}</span>）
        </template >
        <template v-if="it.List.length > 0">：</template>
      </label>
      <label v-if="!it.Group && it.Name">{{it.Name}}
        <template v-if="it._FixedTypeList && it._FixedTypeList.length > 0">
          （<span :class="selectedElementIDs.includes(gProp.StoredContent)?'is-disabled':''"
             class="blue-span" @click="onItemClick(gProp)" v-for="gProp in it._FixedTypeList" :key="gProp.StoredContent">{{getName(gProp)}}</span>）
        </template >
        <template v-if="it.List.length > 0">：</template>
      </label>
      <ElementTypeShowComp
      :ElementList='it.List' :selectedElementIDs='selectedElementIDs' @submit="onItemClick"
      :isMultiple='isMultiple' @checked='onCheckedItemChange' :checkedList='checkedList' />
    </li>
  </ul>
</template>

<script>
// 元素组类型
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import ElementTypeShowComp from './ElementTypeShowComp';

export default {
  props: {
    dataList: {
      type: Array,
      default: null,
    },
    selectedElementIDs: {
      type: Array,
      default: () => [],
    },
    ElementGroupList: {
      type: Array,
      default: null,
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
  },
  computed: {
    groupList() {
      if (this.ElementGroupList) return this.ElementGroupList;
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      const _temp = [];
      const _unjoinedList = [];
      const _list = JSON.parse(JSON.stringify(this.dataList));
      _list.forEach(it => {
        const { Group, FixedType, Element, Formula } = it;
        const ElementItem = Element || Formula;
        if (!ElementItem && Group && !(FixedType || FixedType === 0)) { // 元素组
          const i = _temp.findIndex(_it => (_it.Group ? _it.Group.ID : _it.ID) === Group.ID);
          if (i > -1) {
            if (!_temp[i].StoredContent && it.StoredContent) {
              let { List, _FixedTypeList } = _temp[i];
              List = List || [];
              _FixedTypeList = _FixedTypeList || [];
              const _item = { ...it, List, _FixedTypeList };
              _temp.splice(i, 1, _item);
            }
          } else {
            _temp.push({ ...it, _FixedTypeList: [], List: [] });
          }
        }
        if (Element && Group && !(FixedType || FixedType === 0) && !Formula) { // 组元素
          const t = _temp.find(_it => (_it.Group ? _it.Group.ID : _it.ID) === Group.ID);
          if (t) {
            if (!t.List) t.List = [];
            const i = t.List.findIndex(el => (el.Element ? el.Element.ID : el.ID) === Element.ID);
            if (i > -1) {
              if (!t.List[i].StoredContent && it.StoredContent) {
                const { _FixedTypeList } = t.List[i];
                const _newItem = { ...it, _FixedTypeList };
                t.List.splice(i, 1, _newItem);
              }
            } else {
              t.List.push(it);
            }
          } else {
            _temp.push({ ...Group, List: [it] });
          }
        }
        if (!Element && Group && (FixedType || FixedType === 0) && !Formula) { // 元素组组常量
          const _group = _temp.find(_it => (_it.Group ? _it.Group.ID : _it.ID) === Group.ID);
          if (_group) {
            if (!_group._FixedTypeList) _group._FixedTypeList = [];
            _group._FixedTypeList.push(it);
          } else {
            const _item = { ...Group, List: [], _FixedTypeList: [it] };
            _temp.push(_item);
          }
          _unjoinedList.push(it);
        }
        if (ElementItem && Group && (FixedType || FixedType === 0)) { // 元素组中元素常量
          const _group = _temp.find(_it => (_it.Group ? _it.Group.ID : _it.ID) === Group.ID);
          if (_group) {
            const _ele = _group.List.find(_it => (_it.Element ? _it.Element.ID : _it.ID) === ElementItem.ID);
            if (_ele) {
              if (!_ele._FixedTypeList) _ele._FixedTypeList = [];
              _ele._FixedTypeList.push(it);
            } else {
              // 此处处理不可选择的元素类型
              const _item = { ...ElementItem, _FixedTypeList: [it] };
              _group.List.push(_item);
            }
          } else {
            _temp.push({ ...Group, _FixedTypeList: [it], List: [] });
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
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-on-element-select-dialog-group-type-show-item-comp-wrap {
  > li {
    display: flex;
    line-height: 30px;
    flex: none;
    flex-wrap: wrap;
    > span {
      white-space: nowrap;
    }
    > label {
      color: #585858;
      font-size: 14px;
      white-space: nowrap;
      margin-right: 6px;
      .blue-span {
        font-size: 12px;
        margin: 0 12px;
      }
    }
    > ul {
      display: flex;
      flex-wrap: wrap;
      > li {
        display: flex;
        flex: none;
        flex-wrap: wrap;
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
          color: #999;
          margin-right: 20px;
          > span {
            flex: none;
            white-space: nowrap;
            margin: 0 12px;
            font-size: 12px;
          }
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
}
</style>
