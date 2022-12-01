<template>
  <p
    v-if="list.length === 0"
    class="em review-group-list-select-comp"
  >
    暂无数据
  </p>
  <el-checkbox-group
    v-else
    v-model="checkList"
    class="review-group-list-select-comp"
  >
    <el-checkbox
      v-for="it in list"
      :key="it.ID"
      :label="it.ID"
      :title="it.Name"
      :disabled="disabledIds.includes(it.ID)"
      >{{ it.Name }}</el-checkbox
    >
  </el-checkbox-group>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
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
  computed: {
    checkList: {
      get() {
        return Array.isArray(this.value) ? this.value.map((it) => it.ID) : [];
      },
      set(ids) {
        const list = ids
          .map((id) => this.list.find((it) => it.ID === id))
          .filter((it) => it);
        this.$emit('input', list);
      },
    },
  },
  watch: {
    list: {
      handler(val) {
        if (val && val.length > 0 && this.value && this.value.length > 0) {
          this.checkList = [...this.checkList];
        }
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
.review-group-list-select-comp {
  &.el-checkbox-group {
    min-height: 102px;
    > .el-checkbox {
      margin-right: 12px;
      margin-bottom: 15px;
      > .el-checkbox__label {
        color: #585858;
        font-size: 12px;
        width: 10em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }
  }
  &.em {
    font-size: 12px;
    color: #989898;
    padding-top: 20px;
    padding-bottom: 70px;
  }
}
</style>
