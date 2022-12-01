<template>
  <li v-if="item">
    <div class="title">
      <div class="check">
        <el-checkbox v-model="checkedAll" :indeterminate="isIndeterminate" :disabled="disabledAll">{{item.ClassName}}</el-checkbox>
      </div>
      <span @click="visible = !visible" class="menu">
        {{visible ? '收起' : '展开'}}
        <i :class="visible ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
      </span>
    </div>
    <el-checkbox-group v-model="checkList" v-show="visible">
      <el-checkbox :disabled="disabledIds.includes(it.ID)" v-for="it in item.children || []" :key="it.ID" :label="it.ID">{{it.ClassName}}</el-checkbox>
    </el-checkbox-group>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Array,
      default: () => [],
    },
    disabledIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    allIds() {
      return this.item ? this.item.children.map(it => it.ID) : [];
    },
    allCanSelectIds() {
      return this.allIds.filter(id => !this.disabledIds.includes(id));
    },
    checkList: {
      get() {
        return this.value.filter(it => this.allIds.includes(it.ID)).map(it => it.ID);
      },
      set(ids) {
        this.handleSelect(ids);
      },
    },
    checkedAll: {
      get() {
        return this.checkList.length > 0 && this.checkList.length === this.item.children.length;
      },
      set(val) {
        const ids = val ? this.allCanSelectIds : [];
        this.handleSelect(ids);
      },
    },
    isIndeterminate() {
      return this.checkList.length > 0 && !this.checkedAll;
    },
    disabledAll() {
      return this.allCanSelectIds.length === 0;
    },
  },
  methods: {
    handleSelect(ids) {
      const list = ids.map(id => this.item.children.find(it => it.ID === id)).filter(it => it);
      const _otherList = this.value.filter(it => it.ParentID !== this.item.ID);
      this.$emit('input', [..._otherList, ...list]);
    },
  },
  mounted() {
    // 初始化  对原有数据中进行筛除  筛除掉已不在当前列表中的元素项
    if (!this.item) return;
    const list = this.value.filter(it => it.ParentID !== this.item.ID || this.allIds.includes(it.ID));
    this.$emit('input', list);
  },
};
</script>
<style lang='scss'>
</style>
