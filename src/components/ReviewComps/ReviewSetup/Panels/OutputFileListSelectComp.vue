<template>
  <p
    v-if="OutputFileList.length === 0 && !loading"
    class="em output-file-list-select-comp"
  >
    暂无数据
  </p>
  <el-checkbox-group
    v-else
    v-model="checkList"
    class="output-file-list-select-comp"
  >
    <el-checkbox
      v-for="it in localOutputFileList"
      :key="it.ID"
      :label="it.ID"
      :title="it.displayContent"
      :disabled="disabledIds.includes(it.ID)"
      >{{ it.displayContent }}</el-checkbox
    >
  </el-checkbox-group>
</template>

<script>
export default {
  props: {
    OutputFileList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
    onlyPDF: {
      type: Boolean,
      default: false,
    },
    disabledIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    localOutputFileList() {
      return this.OutputFileList.filter((it) => (this.onlyPDF ? it.IsPDF : true)).map((it) => ({
        ...it,
        displayContent: it.IsPDF ? `${it.Name} (PDF)` : it.Name,
      }));
    },
    checkList: {
      get() {
        return Array.isArray(this.value) ? this.value.map((it) => it.ID) : [];
      },
      set(ids) {
        const FileList = ids
          .map((id) => this.OutputFileList.find((it) => it.ID === id))
          .filter((it) => it);
        this.$emit('input', FileList);
      },
    },
  },
  watch: {
    OutputFileList: {
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
.output-file-list-select-comp {
  &.el-checkbox-group {
    min-height: 88px;
    > .el-checkbox {
      margin-right: 12px;
      margin-bottom: 15px;
      > .el-checkbox__label {
        color: #585858;
        font-size: 12px;
        width: 12em;
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
