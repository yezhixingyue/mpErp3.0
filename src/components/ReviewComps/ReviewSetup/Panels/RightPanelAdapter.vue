<!-- 流程设置、输出文件（部件时没有）、尺寸数量、文件页数 -->
<template v-if="curPanel && localPanelData">
  <!-- 流程设置 -->
  <WorkFlowPanel v-if="curPanel.ID === PanelTypeEnums.flow.ID" :value="localPanelData" @input="onWorkFlowPanelInput" />
  <!-- 输出文件 -->
  <OutputFilePanel v-else-if="curPanel.ID === PanelTypeEnums.outFile.ID" v-model="localPanelData" />
  <!-- 文件尺寸数量 -->
  <SizeNumberPanel ref="oPanel" v-else-if="curPanel.ID === PanelTypeEnums.sizeAndNumber.ID" v-model="localPanelData" />
  <PageNumberPanel ref="oPanel" v-else-if="curPanel.ID === PanelTypeEnums.filePageNumber.ID" v-model="localPanelData" />
</template>

<script>

import { PanelTypeEnums } from '../../../../store/review/reviewEnums';
import ReviewFlowPanelClass from '../../../../store/review/TypeClass/PanelClass/ReviewFlowPanelClass';
import OutputFilePanelClass from '../../../../store/review/TypeClass/PanelClass/OutputFilePanelClass';
import SizeNumberPanelClass from '../../../../store/review/TypeClass/PanelClass/SizeNumberPanelClass';
import PageNumberPanelClass from '../../../../store/review/TypeClass/PanelClass/PageNumberPanelClass';
import WorkFlowPanel from './WorkFlowPanel.vue';
import OutputFilePanel from './OutputFilePanel.vue';
import SizeNumberPanel from './SizeNumberPanel/SizeNumberPanel.vue';
import PageNumberPanel from './PageNumberPanel/PageNumberPanel.vue';

export default {
  props: {
    curPanel: {
      type: Object,
      default: () => ({}),
    },
    curEditData: {
      type: Object,
      default: null,
    },
  },
  components: {
    WorkFlowPanel,
    OutputFilePanel,
    SizeNumberPanel,
    PageNumberPanel,
  },
  data() {
    return {
      PanelTypeEnums,
      localPanelData: null,
    };
  },
  methods: {
    initLocalPanelData() { // 初始化面板数据
      if (!this.curPanel) return;
      switch (this.curPanel.ID) {
        case PanelTypeEnums.flow.ID:
          // 流程设置
          this.localPanelData = new ReviewFlowPanelClass(this.curEditData?.DealFileProcess || null);
          break;

        case PanelTypeEnums.outFile.ID:
          // 输出文件
          this.localPanelData = new OutputFilePanelClass(this.curEditData);
          break;

        case PanelTypeEnums.sizeAndNumber.ID:
          // 文件尺寸数量
          this.localPanelData = new SizeNumberPanelClass(this.curEditData);
          break;

        case PanelTypeEnums.filePageNumber.ID:
          // 文件页数检查
          this.localPanelData = new PageNumberPanelClass(this.curEditData);
          break;
        default:
          break;
      }
    },
    add(e) {
      if (this.$refs.oPanel?.onSaveClick) this.$refs.oPanel.onSaveClick(e);
    },
    onWorkFlowPanelInput(e) {
      this.localPanelData = new ReviewFlowPanelClass(e);
    },
    getInfo() {
      if (this.localPanelData && this.localPanelData.getInfo) {
        return this.localPanelData.getInfo();
      }
      return null;
    },
  },
  mounted() {
    this.initLocalPanelData();
  },
};
</script>
<style lang='scss'>
</style>
