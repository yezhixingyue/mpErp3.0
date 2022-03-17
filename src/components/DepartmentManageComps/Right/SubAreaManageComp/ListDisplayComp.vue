<template>
  <div class="mp-erp-sell-area-setup-page-right-content-list-display-comp-wrap" v-show="list.length > 0">
    <template v-if="type === 'text'">
      <span
        v-for="it in list"
        :key="it.ID"
        :class="{
          active: activeId === it.ID,
          selected: selectedIds.includes(it.ID),
          disabled: disabledIds.includes(it.ID),
        }"
        @click="onClick(it)"
        :title="it.Name"
        >{{it.Name}}</span>
    </template>
    <template v-if="type === 'checkbox'">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="it in list" :key="it.ID" :title="it.Name" :label="it.ID">{{it.Name}}</el-checkbox>
      </el-checkbox-group>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    activeId: {
      default: '',
    },
    // 还需要两个状态列表：1. 已选择的状态列表  2. 被禁用的状态列表
    selectedIds: {
      type: Array,
      default: () => [],
    },
    disabledIds: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    checkList: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    onClick(it) {
      if (this.disabledIds.includes(it.ID)) return;
      this.$emit('click', it);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-sell-area-setup-page-right-content-list-display-comp-wrap {
  padding: 8px 10px;
  box-shadow: 0px 0px 5px 2px rgba(98, 98, 98, 0.15);
  border-radius: 3px;
  > span, .el-checkbox .el-checkbox__label {
    display: inline-block;
    width: 5em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 30px;
    line-height: 20px;
    margin-bottom: 3px;
    cursor: pointer;
    &.active {
      color: #26dcf9;
    }
    &.selected {
      color: #f00;
    }
    &.disabled {
      color: #cbcbcb;
      cursor: not-allowed;
    }
  }
  .el-checkbox {
    margin-right: 30px;
    margin-bottom: 2px;
    .el-checkbox__label {
      font-size: 13px;
      vertical-align: middle;
      margin-right: 0px;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #26dcf9;
    }
  }
}
</style>
