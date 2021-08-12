<template>
  <ul class="mp-erp-common-comps-on-element-select-dialog-material-type-show-item-comp-wrap">
    <template v-if="useType === 'formula'">
      <li v-for="it in formulaMaterialList" :key="it.MaterialType.ID" class="formula-type">
        <label>{{it.MaterialType.Name}}：</label>
        <span class="is-element" v-for="el in it.List" :class="{'is-disabled': el.StoredContent&&selectedElementIDs.includes(el.StoredContent)}"
         :key="el.Element ? el.Element.ID : el.StoredContent" @click="onItemClick(el)">{{getName(el)}}</span>
      </li>
    </template>
    <template v-else>
      <!-- <li v-for="el in dataList" :key="el.StoredContent || el.ID">
        <span
          v-if="!isMultiple || !el.StoredContent"
          :class="{'has-child': el.FixedTypeList, disabled: !el.StoredContent, 'is-disabled': el.StoredContent&&selectedElementIDs.includes(el.StoredContent)}"
          class="is-element" @click="onItemClick(el)">{{getName(el)}}</span>
        <el-checkbox v-else :value='MultipleCheckedIDList.includes(el.StoredContent)' @change="onCheckedItemChange($event, el)">{{getName(el)}}</el-checkbox>
        <div v-if="el.FixedTypeList">
          （<span v-for="item in el.FixedTypeList" class="blue-span" :class="selectedElementIDs.includes(item.StoredContent)?'is-disabled':''"
          @click="onItemClick(item)" :key="item.StoredContent">{{getName(item)}}</span>）
        </div>
      </li> -->
      <li v-for="it in formulaMaterialList" :key="it.MaterialType.ID" class="condtion-list">
        <label>{{it.MaterialType.Name}}：</label>
        <ul>
          <li  v-for="el in it.List" :key="el.Element ? el.Element.ID : el.StoredContent" >
            <span
              v-if="!isMultiple || !el.StoredContent"
              :class="{
                'has-child': el.FixedTypeList, disabled: !el.StoredContent,
                'is-disabled': el.StoredContent&&selectedElementIDs.includes(el.StoredContent)
              }"
              class="is-element" @click="onItemClick(el)">{{getName(el)}}</span>
            <el-checkbox v-else :value='MultipleCheckedIDList.includes(el.StoredContent)' @change="onCheckedItemChange($event, el)"
              >{{getName(el)}}</el-checkbox>
            <div v-if="el.FixedTypeList">
              （<span v-for="item in el.FixedTypeList" class="blue-span" :class="selectedElementIDs.includes(item.StoredContent)?'is-disabled':''"
              @click="onItemClick(item)" :key="item.StoredContent">{{getName(item)}}</span>）
            </div>
          </li>
        </ul>
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
    formulaMaterialList() {
      if (!this.dataList || this.dataList.length === 0) return [];
      const list = [];
      this.dataList.forEach(it => {
        let { MaterialType } = it;
        if (!MaterialType) {
          MaterialType = {
            ID: it.StoredContent,
            Name: it.DisplayContent.replace(/\[|\]/g, ''),
          };
        }
        const _item = list.find(_it => _it.MaterialType?.ID === MaterialType?.ID);
        if (_item) _item.List.push(it);
        else list.push({ MaterialType, List: [it] });
      });
      return list;
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
.mp-erp-common-comps-on-element-select-dialog-material-type-show-item-comp-wrap {
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
    &.condtion-list {
      > label {
        flex: none;
        // min-width: 5em;
        // text-align: right;
      }
    }
    > ul {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
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
