<template>
  <section class="mp-erp-price-module-breadth-select-check-item-container">
    <header>
      <el-checkbox class="item-title" v-model="checkItemAll" :indeterminate="isIndeterminate">{{itemData.Name}}</el-checkbox>
      <span class="collapse" :class="{open: isOpen}" @click="isOpen=!isOpen">{{ isOpen ? '收起' : '展开' }} <i class="el-icon-arrow-down"></i> </span>
    </header>
    <main v-show="isOpen">
      <div v-for="it in itemData.list" :key="it.ID">
        <span class="label" @click='obLabelClick(it.ID)'>{{it.Name}}</span>
        <!-- <el-checkbox-group :value='getItemValueList(it.ID)' @change="onItemChange($event, it.ID)"> -->
          <el-checkbox
           v-for="item in getModeList(it.ModeList)"
           :value='getItemValueList(it.ID).includes(item.ID)'
           :label="item.ID"
           @change="onItemChange($event, it.ID, item.ID)"
           :key="item.ID">{{item.Name}}</el-checkbox>
        <!-- </el-checkbox-group> -->
      </div>
    </main>
  </section>
</template>

<script>
import { MakeupMode } from '@/assets/js/TypeClass/PrintBreadth';

export default {
  model: {
    prop: 'checkedList',
    event: 'change',
  },
  props: {
    itemData: {
      type: Object,
      default: () => ({}),
    },
    checkedList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isOpen: true,
      checkList: [],
    };
  },
  computed: {
    checkItemAllList() {
      if (!this.itemData || !Array.isArray(this.itemData.list) || this.itemData.list.length === 0) return [];
      return this.itemData.list.map(_it => ({ First: { ID: _it.ID }, Second: _it.ModeList.map(sub => sub.Mode) }));
    },
    checkItemAllListModeList() {
      if (this.checkItemAllList.length === 0) return [];
      return this.checkItemAllList.map(it => it.Second).reduce((prev, next) => [...prev, ...next]);
    },
    curCheckedItemlist() {
      if (this.checkedList.length === 0 || this.checkItemAllList.length === 0) return [];
      const ids = this.itemData.list.map(it => it.ID);
      return this.checkedList.filter(it => ids.includes(it.First.ID));
    },
    checkedItemListModeList() { // 已选择的幅面包含的
      if (this.curCheckedItemlist.length === 0) return [];
      return this.curCheckedItemlist.map(it => it.Second).reduce((prev, next) => [...prev, ...next]);
    },
    checkItemAll: {
      get() {
        return (this.checkedItemListModeList.length > 0 && this.checkedItemListModeList.length === this.checkItemAllListModeList.length);
      },
      set(val) {
        const list = this.getUnCheckedList(this.itemData.list);
        const _list = val ? [...list, ...this.checkItemAllList] : [...list];
        this.$emit('change', _list);
      },
    },
    isIndeterminate() {
      return (this.checkedItemListModeList.length > 0 && this.checkedItemListModeList.length < this.checkItemAllListModeList.length);
    },
  },
  methods: {
    getModeList(ModeList) {
      const ids = ModeList.map(it => it.Mode);
      return MakeupMode.filter(it => ids.includes(it.ID));
    },
    getUnCheckedList(list) {
      const ids = list.map(it => it.ID);
      const _list = this.checkedList.filter(it => !ids.includes(it.First.ID));
      return _list;
    },
    onItemChange(val, ID, Mode) {
      const list = this.itemData.list.filter(it => it.ID === ID);
      const _list = this.getUnCheckedList(list);

      const t = this.curCheckedItemlist.find(it => it.First.ID === ID);
      if (t) {
        let temp = [...t.Second];
        if (val) temp.push(Mode);
        else temp = temp.filter(it => it !== Mode);
        if (temp.length === 0) this.$emit('change', _list);
        else this.$emit('change', [..._list, { First: { ID }, Second: temp }]);
      } else if (val) {
        this.$emit('change', [..._list, { First: { ID }, Second: [Mode] }]);
      }
    },
    getItemValueList(ID) {
      const t = this.curCheckedItemlist.find(it => it.First.ID === ID);
      return t ? t.Second : [];
    },
    obLabelClick(ID) {
      const t1 = this.curCheckedItemlist.find(it => it.First.ID === ID);
      const t2 = this.checkItemAllList.find(it => it.First.ID === ID);
      if (!t2) return;
      const list = this.itemData.list.filter(it => it.ID === ID);
      const _list = this.getUnCheckedList(list);
      if (t1 && t1.Second.length === t2.Second.length) {
        // 取消选择
        this.$emit('change', _list);
      } else {
        this.$emit('change', [..._list, { First: { ID }, Second: [...t2.Second] }]);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-breadth-select-check-item-container {
  > header {
    .el-checkbox__label {
      min-width: 10em;
    }
  }
  > main {
    display: flex;
    flex-wrap: wrap;
    > div {
      display: flex;
      min-width: 50%;
      max-width: 100%;
      align-items: center;
      margin-bottom: 10px;
      > span.label {
        color: #888E99;
        font-size: 12px;
        line-height: 18px;
        margin-right: 10px;
        width: 10em;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      > .el-checkbox {
        margin: 0;
        margin-bottom: 0 !important;
        .el-checkbox__label {
          line-height: 18px;
          font-size: 12px;
          margin-right: 10px;
          color: #585858;
        }
      }
    }
  }
}
</style>
