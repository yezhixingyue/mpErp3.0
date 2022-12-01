<template>
  <ResultFormulaTableComp
    hiddenTip
    usePropList
    v-if="getDisplayContent"
    :FormulaList='panelList'
    :PropertyList='PropertyList'
    :isLoading='loading'
    :showHeader="false"
    :getDisplayContent="getDisplayContent"
    :rightText="rightText"
    :operationTitle="curPanel.Name"
    :allAdAreaTreeList="allAdAreaTreeList"
    :allProductClassify="allProductClassify"
    :allAreaTreeList="allAreaTreeList"
    @setup='edit' @remove="remove"
    />
</template>

<script>
import { mapGetters } from 'vuex';
import { ResultFormulaTableComp } from '@/components/common/mpzj-sell-lib/lib';
import { PanelTypeEnums } from '../../../../store/review/reviewEnums';
import ReviewFlowPanelClass from '../../../../store/review/TypeClass/PanelClass/ReviewFlowPanelClass';
import OutputFilePanelClass from '../../../../store/review/TypeClass/PanelClass/OutputFilePanelClass';
import SizeNumberPanelClass from '../../../../store/review/TypeClass/PanelClass/SizeNumberPanelClass';
import PageNumberPanelClass from '../../../../store/review/TypeClass/PanelClass/PageNumberPanelClass';

export default {
  props: {
    panelList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    PropertyList: {
      type: Array,
      default: () => [],
    },
    curPanel: {
      type: Object,
      default: null,
    },
  },
  components: {
    ResultFormulaTableComp,
  },
  computed: {
    ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allAreaTreeList']),
  },
  data() {
    return {
      getDisplayContent: null,
      rightText: '则',
    };
  },
  methods: {
    getTableItemDisplayContent() {
      if (!this.curPanel) return null;
      let func = null;
      this.rightText = '则';
      switch (this.curPanel.ID) {
        case PanelTypeEnums.flow.ID:
          // 流程设置
          func = ReviewFlowPanelClass.getTableItemDisplayContent;
          break;

        case PanelTypeEnums.outFile.ID:
          // 输出文件
          func = OutputFilePanelClass.getTableItemDisplayContent;
          this.rightText = '则必须包含';
          break;

        case PanelTypeEnums.sizeAndNumber.ID:
          // 文件尺寸数量
          func = SizeNumberPanelClass.getTableItemDisplayContent;
          this.rightText = '则检查如下文件尺寸';
          break;

        case PanelTypeEnums.filePageNumber.ID:
          // 文件页数检查
          func = PageNumberPanelClass.getTableItemDisplayContent;
          this.rightText = '则检查如下文件页数';
          break;
        default:
          break;
      }

      return func;
    },
    edit(e) {
      this.$emit('edit', e);
    },
    remove(e) {
      this.$emit('remove', e);
    },
  },
  mounted() {
    this.getDisplayContent = this.getTableItemDisplayContent();
  },
};
</script>
<style lang='scss'>
</style>
