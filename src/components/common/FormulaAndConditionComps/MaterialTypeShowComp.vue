<template>
  <ul class="mp-erp-common-comps-on-element-select-dialog-group-type-show-item-comp-wrap">
    <template v-if="useType === 'formula'">
      <li v-for="it in formulaMaterialList" :key="it.MaterialType.ID" class="formula-type">
        <label>{{it.MaterialType.Name}}：</label>
        <span class="is-element" v-for="el in it.List" :class="{'is-disabled': el.StoredContent&&selectedElementIDs.includes(el.StoredContent)}"
         :key="el.Element.ID" @click="onItemClick(el)">{{getName(el)}}</span>
      </li>
    </template>
    <template v-else>
      <li v-for="el in dataList" :key="el.StoredContent || el.ID">
        <span
          :class="{'has-child': el.FixedTypeList, disabled: !el.StoredContent, 'is-disabled': el.StoredContent&&selectedElementIDs.includes(el.StoredContent)}"
          class="is-element" @click="onItemClick(el)">{{getName(el)}}</span>
        <div v-if="el.FixedTypeList">
          （<span v-for="item in el.FixedTypeList" class="blue-span" :class="selectedElementIDs.includes(item.StoredContent)?'is-disabled':''"
          @click="onItemClick(item)" :key="item.StoredContent">{{getName(item)}}</span>）
        </div>
      </li>
    </template>
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
    useType: {
      type: String,
      default: 'condition',
    },
  },
  computed: {
    formulaMaterialList() {
      if (!this.dataList || this.useType !== 'formula' || this.dataList.length === 0) return [];
      const list = [];
      this.dataList.forEach(it => {
        const { MaterialType } = it;
        const _item = list.find(_it => _it.MaterialType.ID === MaterialType.ID);
        if (_item) _item.List.push(it);
        else list.push({ MaterialType, List: [it] });
      });
      return list;
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

    &.formula-type {
      > span {
        margin-right: 28px;
        &:last-of-type {
          margin-right: 0;
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
