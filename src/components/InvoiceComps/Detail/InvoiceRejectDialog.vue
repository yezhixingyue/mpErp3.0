<template>
  <CommonDialogComp
      width="625px"
      top="24vh"
      title="驳回申请"
      :visible.sync="localVisible"
      @closed="onClosed"
      @open="onOpen"
      @cancel="localVisible = false"
      submitText="确定"
      :showCancel="false"
      :showSubmit="false"
      class="mp-erp-invoice-item-reject-comp-dialog-comp-wrap"
    >
      <!-- 内容区 -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="88px" class="demo-ruleForm" @submit.native.prevent>
        <el-form-item label="驳回原因:" prop="Opinion">
          <el-input type="textarea" v-model="ruleForm.Opinion" :rows="6"></el-input>
        </el-form-item>
        <el-form-item class="btn-box">
          <el-button type="danger" @click="submitForm">提交</el-button>
          <el-button class="cancel-pink-btn" @click="localVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    invoiceID: {
      type: Number,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
  },
  data() {
    const checkOpinion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入驳回原因'));
      } else {
        if (value.length < 3 || value.length > 300) {
          const str = value.length > 300 ? `长度在 3 到 300 个字符，当前输入长度：${value.length}` : '长度在 3 到 300 个字符';
          callback(new Error(str));
        }
        callback();
      }
    };
    return {
      ruleForm: {
        InvoiceID: this.invoiceID,
        Opinion: '',
      },
      rules: {
        Opinion: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' },
          { validator: checkOpinion, trigger: 'change' },
          { validator: checkOpinion, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    onOpen() {
      this.Opinion = '';
    },
    onClosed() {
      this.$refs.ruleForm.resetFields();
    },
    submitForm() {
      if (!this.visible) return;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.ruleForm);
        }
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-invoice-item-reject-comp-dialog-comp-wrap {
  .el-dialog__body {
    padding-left: 25px;
    padding-right: 35px;
    padding-bottom: 15px;
    .btn-box {
      padding-top: 6px;
      .el-button {
        width: 100px;
        height: 30px;
        padding: 0;
        border-radius: 3px;
        & + .el-button {
          margin-left: 25px;
        }
      }
    }
  }
  .el-dialog__footer {
    display: none;
  }
  &.mp-erp-common-dialog-comp-wrap .el-dialog__header > span::before {
    background-color: #ff3769;
  }
}
</style>
