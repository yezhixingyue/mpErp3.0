<template>
  <CommonDialogComp
    width="800px"
    top='15vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-craft-manage-save-dialog-comp-wrap"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="168px"
      class="ruleForm"
      size='small'
      v-if="ruleForm"
    >
      <el-form-item label="内部名称：" prop="Name">
        <el-input style='width:350px' v-model.trim="ruleForm.Name" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="显示名称：" prop="ShowName">
        <el-input style='width:350px' v-model.trim="ruleForm.ShowName" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="工艺分类：" prop="Classify">
        <TwoLevelSelectComp
         v-model="ClassifyComputed"
         :level1Options='level1Options'
         :level2Options='level2Options'
         :defaultProps="{label: 'ClassName', value: 'ID'}" />
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import TwoLevelSelectComp from '@/components/common/SelectorComps/TwoLevelSelectComp.vue';

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
    classifyData: {
      type: Array,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
    TwoLevelSelectComp,
  },
  computed: {
    level1Options() {
      if (!this.classifyData || !Array.isArray(this.classifyData) || this.classifyData.length === 0) return [];
      return this.classifyData;
    },
    level2Options() {
      if ((!this.ClassifyComputed.level1Val && this.ClassifyComputed.level1Val !== 0) || this.level1Options.length === 0) return [];
      const t = this.level1Options.find(it => it.ID === this.ClassifyComputed.level1Val);
      if (t) return t.children;
      return [];
    },
    ClassifyComputed: {
      get() {
        return {
          level1Val: this.ruleForm.Classify.FirstLevel.ID,
          level2Val: this.ruleForm.Classify.SecondLevel.ID,
        };
      },
      set({ level1Val, level2Val }) {
        this.ruleForm.Classify.FirstLevel.ID = level1Val;
        this.ruleForm.Classify.SecondLevel.ID = level2Val;
      },
    },
  },
  data() {
    return {
      title: '添加工艺',
      ruleForm: null,
      rules: {
        Name: [
          { required: true, message: '请输入内部名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
        ],
        ShowName: [
          { required: true, message: '请输入显示名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
        ],
        Classify: [
          { validator: this.classifyValidator, trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      const validateBool = await this.$refs.ruleForm.validate().catch(() => {});
      if (validateBool) {
        const isEdit = !!this.curData;
        this.ruleForm.Classify.FirstLevel.Name = this.getLevelName(this.ruleForm.Classify.FirstLevel.ID, this.level1Options);
        this.ruleForm.Classify.SecondLevel.Name = this.getLevelName(this.ruleForm.Classify.SecondLevel.ID, this.level2Options);
        const resp = await this.api.getCraftSave(this.ruleForm).catch(() => {});
        if (resp && resp.status === 200 && resp.data.Status === 1000) {
          const title = isEdit ? '编辑工艺成功' : '添加工艺成功';
          const cb = () => {
            this.handleSaveSuccess(isEdit, { ...this.ruleForm, ID: resp.data.Data });
          };
          this.messageBox.successSingle(title, cb, cb);
        }
      }
    },
    getLevelName(ID, list) {
      const t = list.find(it => it.ID === ID);
      return t ? t.ClassName : '';
    },
    handleSaveSuccess(isEdit, data) {
      this.$emit('submitSuccess', isEdit, data);
      this.onCancle();
    },
    classifyValidator(rule, value, callback) { // 校验工艺类别输入
      const { FirstLevel, SecondLevel } = value;
      const checkFirstTrue = FirstLevel.ID || FirstLevel.ID === 0;
      const checkSecondTrue = SecondLevel.ID || SecondLevel.ID === 0;
      if (!checkFirstTrue) callback(new Error('请选择工艺分类'));
      else if (!checkSecondTrue) callback(new Error('请选择二级工艺分类'));
      else callback();
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.ruleForm = null;
      this.$emit('close');
    },
    initEditData() { // 数据初始化
      if (this.curData) {
        // 还原值
        this.ruleForm = JSON.parse(JSON.stringify(this.curData));
      } else {
        this.ruleForm = {
          ID: '',
          Name: '',
          ShowName: '',
          Classify: {
            Type: 0,
            FirstLevel: {
              ID: '',
              Name: '',
            },
            SecondLevel: {
              ID: '',
              Name: '',
            },
          },
          ElementList: [],
          GroupList: [],
        };
      }
      this.title = this.curData ? '编辑工艺' : '添加工艺';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-craft-manage-save-dialog-comp-wrap {

  .el-dialog__body {
    .tips-box {
      margin-top: 6px;
      width: 500px;
    }
    .size-content {
      padding-bottom: 10px;
      span.text {
        margin: 0 10px;
        color: #A2A2A2;
      }
      input {
        text-align: center;
      }
    }
    .mp-erp-new-common-select-comp-wrap .el-input {
      width: 130px;
       > input {
        font-size: 12px;
        width: 130px;
      }
    }
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
  .el-form-item__content {
    font-size: 12px;
    color: #585858;
  }
  input {
    border-radius: 3px;
    font-size: 12px;
    height: 30px !important;
    line-height: 30px !important;
  }
  .el-checkbox__label {
    font-size: 12px;
  }
  .el-col {
    height: 34px;
  }
  .el-radio__label {
    font-size: 12px;
  }
}
</style>
