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
import { FileHandleModeEnums, ContentReviewModeEnums } from '../../../../store/review/reviewEnums';

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
      const DealType = this.item && (this.item.DealType || this.item.DealType === 0) ? this.item.DealType : FileHandleModeEnums.manual.ID;
      const IsCheckContent = this.item && typeof this.item.IsCheckContent === 'boolean' ? this.item.IsCheckContent : ContentReviewModeEnums.review.ID;
      this.ruleForm = { // 初始化 ruleForm --- item中的key值为暂定 后续需要更改或查看
        DealType,
        IsCheckContent,
      };
    },
    submit() {
      this.messageBox.warnCancelBox('确定要保存吗', '修改默认操作影响所有订单的匹配规则，请谨慎操作！！', () => {
        this.$emit('submit', this.ruleForm);
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
