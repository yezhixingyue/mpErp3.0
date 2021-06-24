<template>
  <ul class="mp-erp-common-comps-on-element-select-dialog-group-type-show-item-comp-wrap">
    <li v-for="el in dataList" :key="el.StoredContent || el.ID">
      <span
        :class="{'has-child': el.FixedTypeList, disabled: !el.StoredContent, 'is-disabled': el.StoredContent&&selectedElementIDs.includes(el.StoredContent)}"
        class="is-element" @click="onItemClick(el)">{{getName(el)}}</span>
      <div v-if="el.FixedTypeList">
        （<span v-for="item in el.FixedTypeList" class="blue-span" :class="selectedElementIDs.includes(item.StoredContent)?'is-disabled':''"
        @click="onItemClick(item)" :key="item.StoredContent">{{getName(item)}}</span>）
      </div>
    </li>
  </ul>
</template>

<script>
// 物料类型
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';

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
    // groupList() {
    //   if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
    //   const _temp = [];
    //   const _list = JSON.parse(JSON.stringify(this.dataList));
    //  _list.forEach(it => {
    //     const isPropertyFixedType = it.FixedType || it.FixedType === 0; // 是否常量
    //     const t = _temp.find(_it => _it.Group.ID === it.Group.ID && _it.Group.Name === it.Group.Name);
    //     if (t) {
    //       if (it.Element) {
    //         const item = isPropertyFixedType ? { ...it.Element, Group: it.Group } : it;
    //         if (isPropertyFixedType) {
    //           const _t = t.List.find(el => {
    //             let bool = false;
    //             if (el.Element) bool = el.Element.ID === item.ID;
    //             if (!el.Element && el.FixedTypeList) bool = el.ID === item.ID;
    //             return bool;
    //           });
    //           if (_t) {
    //             if (!_t.FixedTypeList) _t.FixedTypeList = [];
    //             _t.FixedTypeList.push(it);
    //           } else {
    //             t.List.push({ ...item, FixedTypeList: [it] });
    //           }
    //         } else {
    //           t.List.push(it);
    //         }
    //       } else {
    //         if (!t.GroupProps) t.GroupProps = [];
    //         t.GroupProps.push(it);
    //       }
    //     } else if (it.Element) {
    //       const item = isPropertyFixedType ? { ...it.Element, Group: it.Group } : it;
    //       const _item = isPropertyFixedType ? { ...item, FixedTypeList: [it] } : it;
    //       _temp.push({ Group: it.Group, List: [_item] });
    //     } else {
    //       _temp.push({ Group: { ...it.Group, GroupProps: [it] }, List: [] });
    //     }
    //   });
    //   return _temp;
    // },
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
      > li {
        display: flex;
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
