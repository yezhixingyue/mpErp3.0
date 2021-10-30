<template>
  <div class="login-wrap">
    <el-form
        :model="ruleForm"
        status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <!-- <h3>登录</h3> -->
        <el-form-item label="账号" prop="Mobile">
            <el-input v-model.trim="ruleForm.Mobile"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="Password">
            <el-input type="password"
              v-model.trim="ruleForm.Password" @keyup.enter.native="submitForm" ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';

export default {
  data() {
    return {
      ruleForm: {
        Password: '',
        Mobile: '',
        Terminal: 1,
      },
    };
  },
  methods: {
    async submitForm() {
      this.ruleForm.Password = Base64.encode(this.ruleForm.Password);
      const res = await this.api.getLogin(this.ruleForm);
      if (res.data.Status === 1000) {
        sessionStorage.setItem('ErpToken', JSON.stringify(res.data.Data));
        document.cookie = `ErpToken=${JSON.stringify(res.data.Data)};max-age=${1 * 24 * 60 * 60 * 1000}`;
        window.location = window.location.pathname;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang='scss'>
.login-wrap {
  height: 100%;
  width: 100%;
  background-color: #bbd5fa;
  padding-top: 160px;
  box-sizing: border-box;
  .demo-ruleForm {
    margin: 0 auto;
    width: 320px;
    background-color: #fff;
    padding: 50px 78px 30px 0px;
    border-radius: 5px;
    box-shadow: 1px 1px 8px 0px rgba($color: #26bcf9, $alpha: 0.4);
    > div > div {
      button + button {
        margin-left: 20px;
      }
    }
  }
}


</style>
