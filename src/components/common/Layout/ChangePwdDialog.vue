<template>
  <CommonDialogComp
      width="500px"
      top="18vh"
      title="修改密码"
      :visible.sync="localVisible"
      @submit="submitForm"
      @cancle="localVisible = false"
      @closed="onClosed"
      class="mp-erp-common-comps-change-password-comp-dialog-comp-wrap"
    >
      <!-- 内容区 -->
      <el-form
        :model="ruleForm"
        hide-required-asterisk
        @submit.native.prevent
        status-icon ref="ruleForm"
        label-width="155px"
        class="demo-ruleForm">
        <el-form-item
          size="small"
          label="旧密码："
          prop="OldPassword"
          :rules="[
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度应在6-16位之间', trigger: 'blur' },
          ]"
        >
          <el-input
           v-banAutoComplete
           maxlength="16"
           type="password"
           @click.native="onFocusClick"
           @blur="onBlur"
           v-model.trim="ruleForm.OldPassword"
           autocomplete="off" />
        </el-form-item>
        <el-form-item
          size="small"
          label="新密码："
          prop="Password1"
          :rules="[
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在应6-16位之间', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' },
          ]"
        >
          <el-input
           v-banAutoComplete
           maxlength="16"
           type="password"
           @click.native="onFocusClick"
           @blur="onBlur"
           v-model.trim="ruleForm.Password1"
           autocomplete="off" />
        </el-form-item>
        <el-form-item
          size="small"
          label="重复新密码："
          prop="Password2"
          :rules="[
            { required: true, message: '请再次输入新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度应在6-16位之间', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' },
          ]"
        >
          <el-input
           v-banAutoComplete
           maxlength="16"
           type="password"
           @click.native="onFocusClick"
           @blur="onBlur"
           v-model.trim="ruleForm.Password2"
           autocomplete="off" />
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
        OldPassword: '',
        Password1: '',
        Password2: '',
      },
      readonly: true,
    };
  },
  methods: {
    onClosed() {
      this.$refs.ruleForm.resetFields();
    },
    onFocusClick() {
      this.readonly = false;
    },
    onBlur() {
      this.readonly = true;
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.Password2 !== '') {
          this.$refs.ruleForm.validateField('Password2');
        }
        callback();
      }
    },
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.Password1) {
        callback(new Error('两次输入密码不一致!'));
      } else if (value === this.ruleForm.OldPassword) {
        callback(new Error('新密码和旧密码输入重复!'));
      } else {
        callback();
      }
    },
    async submitForm() {
      const bool = await this.$refs.ruleForm.validate().catch(() => false);
      if (!bool) return;
      const { OldPassword, Password1 } = this.ruleForm;
      const temp = {
        OldPassword,
        Password: Password1,
      };
      const resp = await this.api.getStaffChangePassword(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.localVisible = false;
        };
        this.messageBox.successSingle('修改成功', cb, cb);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-change-password-comp-dialog-comp-wrap {
  .el-dialog__body {
    padding-top: 40px;
    padding-bottom: 50px;
    .demo-ruleForm {
      padding-right: 70px;
      .el-form-item {
        input {
          border-radius: 3px;
          height: 32px;
        }
        &:first-of-type {
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>
