<template v-if="value">
  <div class="mp-erp-review-setting-panels-output-file-panel-comp-wrap">
    <h2>必须包含以下文件:</h2>
    <OutputFileListSelectComp :loading="loading" :OutputFileList="OutputFileList" v-model="checkList" />
    <p class="tips-box">
      <label for="">说明：</label>
      <span>提交审稿时，会严格按照此处设置的文件进行文件名称包含规则进行对比，缺少文件将无法提交处理结果</span>
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import OutputFilePanelClass from '../../../../store/review/TypeClass/PanelClass/OutputFilePanelClass';
import OutputFileListSelectComp from './OutputFileListSelectComp.vue';

export default {
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
  components: {
    OutputFileListSelectComp,
  },
  computed: {
    ...mapState('review', ['OutputFileList', 'loading']),
    checkList: {
      get() {
        return this.value?.FileList || [];
      },
      set(FileList) {
        this.$emit('input', new OutputFilePanelClass({ ...this.value, FileList }));
      },
    },
  },
  mounted() {
    if (this.OutputFileList.length === 0) {
      this.$store.dispatch('review/getOutputFileList');
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-review-setting-panels-output-file-panel-comp-wrap {
  color: #585858;
  // padding-left: 16px;
  > h2 {
    font-weight: 700;
    padding-bottom: 30px;
  }
  > .el-checkbox-group {
    width: 725px;
  }
  > .tips-box {
    width: auto;
    letter-spacing: 0.5px;
    display: inline-block;
    padding-right: 10px;
    background: #fff;
    padding-left: 0;
    padding-top: 20px;
  }
}
</style>
