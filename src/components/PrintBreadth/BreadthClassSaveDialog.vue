<template>
  <CommonDialogComp
    width="700px"
    top='18vh'
    :title="title"
    :visible="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-print-breadth-classify-manage-dialog-comp-wrap"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="168px"
      class="file-ruleForm"
      @submit.native.prevent
      size='small'
      v-if="ruleForm"
    >
      <el-form-item label="分类名称：" prop="Name" key="FileName">
        <el-input style="width:350px" v-model.trim="ruleForm.Name" placeholder="请输入分类名称" maxlength="10" show-word-limit></el-input>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      title: '添加分类',
      ruleForm: null,
      rules: {
        Name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      const validateBool = await this.$refs.ruleForm.validate().catch(() => {});
      if (validateBool) {
        this.$emit('submit', this.ruleForm);
      }
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.ruleForm = null;
    },
    initEditData() { // 数据初始化方法
      this.title = this.curData ? '编辑分类' : '添加分类';
      this.ruleForm = { Name: '', ID: '' };
      if (this.curData) {
        const { Name, ID } = this.curData;
        this.ruleForm = { Name, ID };
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-print-breadth-classify-manage-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 55px;
    padding-top:62px;
    padding-bottom: 90px;
  }

  // 公共部分
  &.mp-erp-common-dialog-comp-wrap .el-dialog__footer > .dialog-footer {
    padding-bottom: 20px;
    > button {
      height: 35px;
      border-radius: 3px;
      &.el-button--default {
        border-color: #26bcf9;
        color: #26bcf9;
        &:active {
          border-color: #428dfa;
          color: #428dfa;
        }
      }
      &.el-button--primary {
        background: linear-gradient(to right, #26bcf9, #35dff9);
        border: none;
        &:hover {
          opacity: 0.88;
        }
        &:active {
          background: linear-gradient(to right, #428dfa, #26bcf9);
        }
      }
    }
  }
  .el-form-item__label {
    color: #888E99;
    &::before {
      display: none;
    }
  }
  input {
    border-radius: 3px;
  }
}
</style>
