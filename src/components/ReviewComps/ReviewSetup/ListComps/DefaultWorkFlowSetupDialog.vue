<template>
  <CommonDialogComp
    width="660px"
    title="设置默认流程"
    :visible.sync="localVisible"
    class="mp-erp-default-work-flow-setup-dialog-comp"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
  >
    <h2 class="is-bold is-black">当条件不匹配时，执行如下操作：</h2>
    <WorkFlowPanel v-if="ruleForm" v-model="ruleForm" />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../../packages/CommonDialogComp';
import WorkFlowPanel from '../Panels/WorkFlowPanel.vue';
// import { FileHandleModeEnums, ContentReviewModeEnums } from '../../../../store/review/reviewEnums';
import ReviewFlowPanelClass from '../../../../store/review/TypeClass/PanelClass/ReviewFlowPanelClass';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
    WorkFlowPanel,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  data() {
    return {
      ruleForm: null,
    };
  },
  methods: {
    onOpen() {
      this.ruleForm = new ReviewFlowPanelClass(this.item);
    },
    submit() {
      const data = this.ruleForm.getInfo();
      this.messageBox.warnCancelBox('确定要保存吗', '修改默认操作影响所有订单的匹配规则，请谨慎操作！！', () => {
        this.$emit('submit', data.DealFileProcess);
      });
    },
    cancel() {
      this.localVisible = false;
    },
    closed() {
      this.ruleForm = null;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-default-work-flow-setup-dialog-comp {
  .el-dialog__body {
    padding-left: 35px;
    .el-radio__input.is-disabled + span.el-radio__label {
      color: #cbcbcb;
    }
  }
  .el-dialog__footer {
    padding-bottom: 35px;
  }
}
</style>
