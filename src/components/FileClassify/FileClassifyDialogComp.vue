<template>
  <CommonDialogComp
    width="800px"
    top='13vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-file-classify-manage-dialog-comp-wrap"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="168px"
      class="file-ruleForm"
      size='small'
      v-if="ruleForm"
    >
      <el-form-item label="类目名称：" prop="Name" key="FileName">
        <el-input style="width:350px" v-model.trim="ruleForm.Name" placeholder="请输入类目名称" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="显示顺序：" prop="ShowIndex" key="ShowIndex">
        <el-input style="width:150px;margin-right:10px" v-model.trim.number="ruleForm.ShowIndex"></el-input>
        <span class="tips-box"><i class="el-icon-warning"></i> 注：数字越小显示越靠前</span>
      </el-form-item>
      <el-form-item label="文件类型：" prop="TypeList" key="TypeList">
        <el-checkbox-group v-model="ruleForm.TypeList">
          <el-checkbox :label="it.ID" :name="`${it.ID}`" v-for="(it, i) in FileTypeList" :key="`${it.ID}-${i}`">{{it.Name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="说明文字：" prop="Remark" key="Remark">
        <el-input v-model.trim="ruleForm.Remark" maxlength="25" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="未上传时提示文字：" prop="FailTips" key="FailTips">
        <el-input type="textarea" v-model="ruleForm.FailTips" maxlength="40" show-word-limit></el-input>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import FileClass from '@/assets/js/TypeClass/FileClass';

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
    FileTypeList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      title: '添加文件类目',
      ruleForm: null,
      rules: {
        Name: [
          { required: true, message: '请输入文件类目名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
        ],
        ShowIndex: [
          { required: true, message: '请设置显示顺序', trigger: 'blur' },
        ],
        TypeList: [
          { type: 'array', required: true, message: '请选择文件类型', trigger: 'change' },
        ],
        Remark: [
          { required: true, message: '请输入说明文字', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在 2 到 25 个字符', trigger: 'blur' },
        ],
        FailTips: [
          { required: true, message: '请输入未上传提示文字', trigger: 'blur' },
          { min: 2, max: 25, message: '长度在 2 到 40 个字符', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      const validateBool = await this.$refs.ruleForm.validate().catch(() => {});
      if (validateBool) {
        const _temp = FileClass.formatSubmitData(this.ruleForm, this.FileTypeList);
        this.$emit('submit', _temp);
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
      this.ruleForm = new FileClass(this.curData);
      this.title = this.curData ? '编辑文件类目' : '添加文件类目';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-file-classify-manage-dialog-comp-wrap {

  .el-dialog__body {
    padding-right: 66px;
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
  .tips-box {
    width:550px;
    background: #FFFBF6;
    border-radius: 3px;
    height: 28px;
    color:rgba(244,163,7, 0.7);
    font-size:12px;
    padding-left:16px;
    line-height: 26px;
    box-sizing: border-box;
    i {
      font-size: 14px;
      position: relative;
      top: 1px;
      margin-right: 10px;
    }
  }
  .el-form-item__label {
    color: #888E99;
    &::before {
      display: none;
    }
  }
  .el-checkbox {
    width: 99px;
    margin-right: 10px;
    > .el-checkbox__label {
      font-size: 12px;
      width: 60px;
      color: #585858;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: middle;
      .mp-common-tip-span-btn-box {
        color: #585858 !important;
      }
    }
  }
  .el-textarea {
    height: 70px;
    > textarea {
      height: 70px;
      border-radius: 3px;
    }
  }
  input {
    border-radius: 3px;
  }
}
</style>
