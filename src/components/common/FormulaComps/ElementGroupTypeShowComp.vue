<template>
  <ul class="mp-erp-common-comps-on-element-select-dialog-group-type-show-item-comp-wrap">
    <li v-for="it in groupList" :key="it.Group ? it.Group.ID : it.ID">
      <label v-if="it.Group">{{it.Group.Name}}
        <template v-if="it.Group.GroupProps && it.Group.GroupProps.length > 0">
          （<span :class="selectedElementIDs.includes(gProp.StoredContent)?'is-disabled':''"
             class="blue-span" @click="onItemClick(gProp)" v-for="gProp in it.Group.GroupProps" :key="gProp.StoredContent">{{getName(gProp)}}</span>）
        </template>：</label>
      <label v-if="!it.Group && it.Name">{{it.Name}}
        <template v-if="it._FixedTypeList && it._FixedTypeList.length > 0">
          （<span :class="selectedElementIDs.includes(gProp.StoredContent)?'is-disabled':''"
             class="blue-span" @click="onItemClick(gProp)" v-for="gProp in it._FixedTypeList" :key="gProp.StoredContent">{{getName(gProp)}}</span>）
        </template>：</label>
      <ul>
        <li v-for="el in it.List" :key="el.StoredContent || el.ID">
          <span
           :class="{'has-child': el._FixedTypeList && el._FixedTypeList.length>0, disabled: !el.StoredContent,
           'is-disabled': el.StoredContent&&selectedElementIDs.includes(el.StoredContent)}"
           class="is-element" @click="onItemClick(el)">{{getName(el)}}</span>
          <div v-if="el._FixedTypeList && el._FixedTypeList.length>0">
           （<span v-for="item in el._FixedTypeList" class="blue-span" :class="selectedElementIDs.includes(item.StoredContent)?'is-disabled':''"
            @click="onItemClick(item)" :key="item.StoredContent">{{getName(item)}}</span>）
          </div>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
// 元素组类型
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';

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
  },
  computed: {
    groupList() {
      if (this.ElementGroupList) return this.ElementGroupList;
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      const _temp = [];
      const _unjoinedList = [];
      const _list = JSON.parse(JSON.stringify(this.dataList));
      _list.forEach(it => {
        const { Group, FixedType, Element } = it;
        if (Element && Group && !(FixedType || FixedType === 0)) { // 组元素
          const t = _temp.find(_it => _it.ID === Group.ID);
          if (t) {
            if (!t.List) t.List = [];
            t.List.push(it);
          } else {
            _temp.push({ ...Group, List: [it] });
          }
        }
        if (!Element && Group && (FixedType || FixedType === 0)) { // 元素组组常量
          const _group = _temp.find(_it => _it.ID === Group.ID);
          if (_group) {
            if (!_group._FixedTypeList) _group._FixedTypeList = [];
            _group._FixedTypeList.push(it);
          } else {
            const _item = { ...Group, List: [], _FixedTypeList: [it] };
            _temp.push(_item);
          }
          _unjoinedList.push(it);
        }
        if (Element && Group && (FixedType || FixedType === 0)) { // 元素组中元素常量
          const _group = _temp.find(_it => _it.ID === Group.ID);
          if (_group) {
            const _ele = _group.List.find(_it => (_it.Element ? _it.Element.ID : _it.ID) === Element.ID);
            if (_ele) {
              if (!_ele._FixedTypeList) _ele._FixedTypeList = [];
              _ele._FixedTypeList.push(it);
            } else {
              // 此处处理不可选择的元素类型
              const _item = { ...Element, _FixedTypeList: [it] };
              _group.List.push(_item);
            }
          }
          _unjoinedList.push(it);
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
.mp-erp-common-comps-on-element-select-dialog-group-type-show-item-comp-wrap {
  > li {
    display: flex;
    line-height: 30px;
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
