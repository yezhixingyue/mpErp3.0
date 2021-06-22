<template>
  <ul class="mp-erp-common-comps-on-element-select-dialog-group-type-show-item-comp-wrap">
    <li v-for="it in groupList" :key="it.Group.ID">
      <label>{{it.Group.Name}}<span class="is-element"></span>：</label>
      <ul>
        <li v-for="el in it.List" :key="el.StoredContent || el.ID">
          <span :class="{'has-child': el.FixedTypeList, disabled: !el.StoredContent}" class="is-element">{{getName(el)}}</span>
          <div v-if="el.FixedTypeList">
           （<span v-for="item in el.FixedTypeList" class="blue-span" :key="item.StoredContent">{{getName(item)}}</span>）
          </div>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
// 元素组类型
import { PropertyFixedType } from '@/assets/js/TypeClass/PropertyClass';

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
  },
  computed: {
    groupList() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      const _temp = [];
      this.dataList.forEach(it => {
        const isPropertyFixedType = it.FixedType || it.FixedType === 0;
        const item = isPropertyFixedType ? { ...it.Element, Group: it.Group } : it;
        const t = _temp.find(_it => _it.Group.ID === item.Group.ID && _it.Group.Name === item.Group.Name);
        if (t) {
          if (isPropertyFixedType) {
            const _t = t.List.find(el => {
              // console.log(el, item);
              let bool = false;
              if (el.Element) bool = el.Element.ID === item.ID;
              if (!el.Element && el.FixedTypeList) bool = el.ID === item.ID;
              return bool;
            });
            if (_t) {
              _t.FixedTypeList.push(it);
            } else {
              t.List.push({ ...item, FixedTypeList: [it] });
            }
          } else {
            t.List.push(it);
          }
        } else {
          const _item = isPropertyFixedType ? { ...item, FixedTypeList: [it] } : it;
          _temp.push({ Group: it.Group, List: [_item] });
        }
      });
      return _temp;
    },
  },
  methods: {
    getName(item) {
      const { FixedType, Element, Name } = item;
      if (FixedType || FixedType === 0) {
        const t = PropertyFixedType.find(it => it.ID === FixedType);
        if (t) return t.Name;
        return '';
      }
      if (Element && Element.Name) return Element.Name;
      if (Name && !Element) return Name;
      return '';
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
    }
    > ul {
      display: flex;
      > li {
        display: flex;
        > span {
          flex: none;
          margin-right: 35px;
          &.has-child {
            margin: 0;
          }
          &.disabled {
            user-select: none;
            color: #585858 !important;
            pointer-events: none;
          }
        }
        > div {
          display: flex;
          flex-wrap: wrap;
          color: #999;
          > span {
            flex: none;
            white-space: nowrap;
            margin: 0 16px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
