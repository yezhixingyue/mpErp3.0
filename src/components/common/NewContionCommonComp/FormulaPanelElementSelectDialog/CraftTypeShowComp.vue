<template>
  <ul class="mp-erp-common-comps-on-element-select-dialog-craft-type-show-item-comp-wrap">
    <li v-for="it in craftTypeList" :key="it.StoredContent || it.Craft.ID">
      <label
        v-if="!isMultiple || !it.StoredContent"
        class="is-element"
        :class="{'is-disabled': it.StoredContent&&selectedElementIDs.includes(it.StoredContent), 'no-element': !it.StoredContent}"
        @click="onItemClick(it)">{{it.Craft.Name}}
        <template v-if="it._ElementList || it._ElementGroupList">：</template>
      </label>
      <el-checkbox v-else :value='MultipleCheckedIDList.includes(it.StoredContent)' @change="onCheckedItemChange($event, it)">{{it.Craft.Name}}</el-checkbox>
      <div>
        <ElementTypeShowComp :selectedElementIDs='selectedElementIDs' @submit="onItemClick" :ElementList='it._ElementList'
        :isMultiple='isMultiple' @checked='onCheckedItemChange' :checkedList='checkedList' />
        <ElementGroupTypeShowComp :selectedElementIDs='selectedElementIDs' @submit="onItemClick" :ElementGroupList='it._ElementGroupList'
        :isMultiple='isMultiple' @checked='onCheckedItemChange' :checkedList='checkedList' />
      </div>
    </li>
  </ul>
</template>

<script>
// 工艺类型
import PropertyClass from '../utils/PropertyClass';
import ElementTypeShowComp from './ElementTypeShowComp.vue';
import ElementGroupTypeShowComp from './ElementGroupTypeShowComp.vue';

export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
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
    ElementGroupTypeShowComp,
  },
  computed: {
    craftTypeList() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      const _temp = [];
      const _list = JSON.parse(JSON.stringify(this.dataList));
      const getOneNewCraft = (Craft) => ({ Craft, _ElementList: [], _ElementGroupList: [] });
      const addOneNewCraftToList = (Craft) => {
        const t = _temp.find(_it => Craft.ID === _it.Craft.ID);
        if (!t) _temp.push(Craft);
        else if (!t.StoredContent && Craft.StoredContent) {
          const { _ElementList, _ElementGroupList } = t;
          const _craft = { ...Craft, _ElementList, _ElementGroupList };
          const i = _temp.findIndex(_it => Craft.ID === _it.Craft.ID);
          _temp.splice(i, 1, _craft);
        }
      };
      _list.forEach(it => {
        const {
          Craft, Element, Group, FixedType, Formula,
        } = it;
        const ElementItem = Element || Formula;
        if (Craft && !Element && !Group && !(FixedType || FixedType === 0) && !Formula) { // 工艺
          addOneNewCraftToList(it);
        }
        if (Craft && Element && !Group && !(FixedType || FixedType === 0) && !Formula) { // 工艺上元素
          const t = _temp.find(_it => Craft.ID === _it.Craft.ID);
          if (t) {
            if (!t._ElementList) t._ElementList = [];
            const i = t._ElementList.findIndex(el => (el.Element ? el.Element.ID : el.ID) === Element.ID);
            if (i > -1) {
              if (!t._ElementList[i].StoredContent && it.StoredContent) {
                const { _FixedTypeList } = t._ElementList[i];
                const _newItem = { ...it, _FixedTypeList };
                t._ElementList.splice(i, 1, _newItem);
              }
            } else {
              t._ElementList.push(it);
            }
          } else {
            const _craft = getOneNewCraft(Craft);
            _craft._ElementList.push(it);
            addOneNewCraftToList(_craft);
          }
        }
        if (Craft && Element && !Group && (FixedType || FixedType === 0) && !Formula) { // 工艺上元素常量
          const t = _temp.find(_it => Craft.ID === _it.Craft.ID);
          if (t) {
            if (!t._ElementList) t._ElementList = [];
            const _ele = t._ElementList.find(_it => (_it.Element ? _it.Element.ID : _it.ID) === Element.ID);
            if (_ele) {
              if (!_ele._FixedTypeList) _ele._FixedTypeList = [];
              _ele._FixedTypeList.push(it);
            } else {
              // 此处处理不可选择的元素类型
              const _item = { ...Element, _FixedTypeList: [it] };
              t._ElementList.push(_item);
            }
          } else {
            const _craft = getOneNewCraft(Craft);
            const _item = { ...Element, _FixedTypeList: [it] };
            _craft._ElementList.push(_item);
            addOneNewCraftToList(_craft);
          }
        }
        if (Craft && !Element && Group && !(FixedType || FixedType === 0) && !Formula) { // 工艺上元素组
          const t = _temp.find(_it => Craft.ID === _it.Craft.ID);
          if (t) {
            const _item = { ...it, List: [] };
            if (!t._ElementGroupList) t._ElementGroupList = [];
            const i = t._ElementGroupList.findIndex(_it => (_it.Group ? _it.Group.ID : _it.ID) === Group.ID);
            if (i > -1) {
              if (!t._ElementGroupList[i].StoredContent && it.StoredContent) {
                const { List } = t._ElementGroupList[i];
                const _newItem = { ...it, List };
                t._ElementGroupList.splice(i, 1, _newItem);
              }
            } else t._ElementGroupList.push(_item);
          } else {
            const _craft = getOneNewCraft(Craft);
            const _item = { ...it, List: [] };
            _craft._ElementGroupList.push(_item);
            addOneNewCraftToList(_craft);
          }
        }
        if (Craft && Element && Group && !(FixedType || FixedType === 0) && !Formula) { // 工艺上元素组元素
          const t = _temp.find(_it => Craft.ID === _it.Craft.ID);
          if (t) {
            const _item = { ...Group, List: [it] };
            if (!t._ElementGroupList) t._ElementGroupList = [];
            const _group = t._ElementGroupList.find(_it => (_it.Group ? _it.Group.ID : _it.ID) === Group.ID);
            if (_group) {
              const i = _group.List.findIndex(_it => _it.ID === Element.ID);
              if (i > -1) {
                if (!_group.List[i].StoredContent && it.StoredContent) {
                  const { _FixedTypeList } = _group.List[i];
                  const _newItem = { ...it, _FixedTypeList };
                  _group.List.splice(i, 1, _newItem);
                }
              } else {
                _group.List.push(it);
              }
            } else t._ElementGroupList.push(_item);
          } else {
            const _craft = getOneNewCraft(Craft);
            const _item = { ...Group, List: [it] };
            _craft._ElementGroupList.push(_item);
            addOneNewCraftToList(_craft);
          }
        }
        if (Craft && !ElementItem && Group && (FixedType || FixedType === 0)) { // 工艺上元素组常量
          const t = _temp.find(_it => Craft.ID === _it.Craft.ID);
          if (t) {
            const _item = { ...Group, List: [], _FixedTypeList: [it] };
            if (!t._ElementGroupList) t._ElementGroupList = [];
            const _group = t._ElementGroupList.find(_it => (_it.Group ? _it.Group.ID : _it.ID) === Group.ID);
            if (_group) {
              if (!_group._FixedTypeList) _group._FixedTypeList = [];
              _group._FixedTypeList.push(it);
            } else {
              t._ElementGroupList.push(_item);
            }
          } else {
            const _craft = getOneNewCraft(Craft);
            const _item = { ...Group, List: [], _FixedTypeList: [it] };
            _craft._ElementGroupList.push(_item);
            addOneNewCraftToList(_craft);
          }
        }
        if (Craft && ElementItem && Group && (FixedType || FixedType === 0)) { // 工艺元素组中元素常量 及 子公式
          const t = _temp.find(_it => Craft.ID === _it.Craft.ID);
          if (t) {
            if (!t._ElementGroupList) t._ElementGroupList = [];
            const _group = t._ElementGroupList.find(_it => (_it.Group ? _it.Group.ID : _it.ID) === Group.ID);
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
              const _item = { ...Group, List: [{ ...ElementItem, _FixedTypeList: [it] }], _FixedTypeList: [] };
              t._ElementGroupList.push(_item);
            }
          } else {
            const _craft = getOneNewCraft(Craft);
            const _item = { ...Group, List: [{ ...ElementItem, _FixedTypeList: [it] }], _FixedTypeList: [] };
            _craft._ElementGroupList.push(_item);
            addOneNewCraftToList(_craft);
          }
        }
        // 还需2种情况判断： 1. 工艺元素常量 2. 工艺元素组上常量 --- 已补充
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
      if (!it.StoredContent) return;
      this.$emit('submit', it);
    },
    onCheckedItemChange(e, el) {
      this.$emit('checked', e, el);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-on-element-select-dialog-craft-type-show-item-comp-wrap {
  > li {
    display: flex;
    line-height: 30px;
    > label {
      color: #585858;
      font-size: 14px;
      white-space: nowrap;
      margin-right: 6px;
      min-width: 5em;
      flex: none;
      .blue-span {
        font-size: 12px;
        margin: 0 12px;
      }
      &.el-checkbox {
        margin-right: 10px;
        .el-checkbox__label {
          color: #428dfa;
        }
      }
    }
    > div {
      flex: 1;
    }
    > ul {
      display: flex;
      flex: none;
      flex-wrap: wrap;
    }
    .disabled {
      user-select: none;
      color: #585858 !important;
      pointer-events: none;
    }
    .is-disabled, .no-element {
      user-select: none;
      color: #cbcbcb !important;
      pointer-events: none;
    }
    .no-element {
      color: #585858 !important;
    }
  }
}
</style>
