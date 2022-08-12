<template>
  <CommonDialogComp
      width="560px"
      top="24vh"
      title="设置默认开票类别"
      :visible.sync="localVisible"
      @closed="onClosed"
      @open="onOpen"
      @submit="submitForm"
      @cancel="localVisible = false"
      class="mp-erp-invoice-default-classify-info-setup-comp-dialog-wrap"
    >
      <!-- 内容区 -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px" class="demo-ruleForm" @submit.native.prevent size="small">
        <el-form-item label="开票类别名称:" prop="CategoryName">
          <el-input v-model="ruleForm.CategoryName" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="类别单位:" prop="Unit">
          <el-input v-model="ruleForm.Unit" maxlength="6"></el-input>
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
    defaultItemInfo: {
      type: Object,
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
    return {
      ruleForm: {
        CategoryName: '',
        IsDefault: true,
        Unit: '',
        InvoiceCategoryID: '',
      },
      rules: {
        CategoryName: [
          { required: true, message: '请输入开票类别名称', trigger: 'blur' },
        ],
        Unit: [
          { required: true, message: '请输入类别单位', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    onOpen() {
      if (this.defaultItemInfo) {
        const { CategoryName, Unit, InvoiceCategoryID } = this.defaultItemInfo;
        this.ruleForm.CategoryName = CategoryName || '';
        this.ruleForm.Unit = Unit || '';
        this.ruleForm.InvoiceCategoryID = InvoiceCategoryID || InvoiceCategoryID === 0 ? InvoiceCategoryID : '';
      }
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
.mp-erp-invoice-default-classify-info-setup-comp-dialog-wrap {
  .el-dialog__body {
    padding-left: 55px;
    padding-right: 35px;
    padding-bottom: 30px;
    .el-input {
      width: 280px;
    }
  }
}
</style>
