<template>
  <CommonDialogComp
    width="650px"
    top="18vh"
    title="添加物流快递"
    :visible.sync="localVisible"
    smallBtn
    @submit="submitForm"
    @cancle="localVisible = false"
    @open="onOpen"
    @closed="onClosed"
    class="mp-erp-logistic-item-save-dialog-comp-wrap"
  >
    <!-- 内容区 -->
    <el-form v-if="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" @submit.native.prevent>
      <el-form-item label="名称:" prop="Name">
        <el-input v-model="ruleForm.Name" maxlength="12" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="分类:" prop="Classify">
        <el-radio-group v-model="ruleForm.Classify">
          <el-radio label="自建"></el-radio>
          <el-radio label="物流"></el-radio>
          <el-radio label="快递"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否启用:" prop="Enable">
        <el-switch v-model="ruleForm.Enable"></el-switch>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import LogisticItem from '@/assets/js/TypeClass/logistic/LogisticItem';
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      ruleForm: null,
      rules: {
        Name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' },
          // 名称不能重复校验， 后面补充
        ],
        Classify: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
      },
    };
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
  methods: {
    onOpen() {
      this.ruleForm = new LogisticItem(this.editData);
    },
    onClosed() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm = null;
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // console.log('验证通过,可以保存', this.ruleForm);
        }
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-logistic-item-save-dialog-comp-wrap {
  .el-dialog__body {
    padding-bottom: 48px;
    padding-top: 40px;
    padding-left: 55px;
    .el-form-item {
      height: 30px;
      .el-form-item__label {
        height: 30px;
        line-height: 30px;
        color: #888E99;
        padding-right: 15px;
      }
      .el-form-item__content {
        height: 30px;
        line-height: 30px;
        color: #585858;
        .el-input {
          height: 30px;
          line-height: 30px;
          width: 270px;
          .el-input__inner {
            height: 30px;
            line-height: 28px;
            font-size: 13px;
          }
          .el-input__suffix {
            top: 2px;
          }
        }
        .el-radio-group {
          .el-radio__label {
            color: #585858;
          }
        }
      }
    }
  }
  .el-dialog__footer {
    text-align: center;
    padding-bottom: 40px;
    button {
      width: 120px;
      height: 30px;
      padding: 0;
      & + button {
        margin-left: 30px;
      }
    }
  }
}
</style>
