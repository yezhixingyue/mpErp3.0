<template>
  <section class="login-wrap">
    <section>
      <header>
        <img src="../assets/images/logo-big.png" alt="">
      </header>
      <main>
        <div class="box">
          <div class="left">
            <div class="mask">
              <div class="line"></div>
              <h2>名片之家</h2>
              <p>500万广告设计机构印刷服务商</p>
              <p>Five Million AD Design Agencies Printing Services</p>
            </div>
          </div>
          <div class="right">
            <el-form
              :model="ruleForm"
              @submit.native.prevent
              hide-required-asterisk
              ref="ruleForm" label-width="0px" class="demo-ruleForm">
              <el-form-item prop="Mobile" :rules="[
                { required: true, message: '请输入账号(手机号码)', trigger: 'blur' },
                { pattern: /1[3456789]\d{9}/, message: '手机号码格式不正确', trigger: 'blur' },
              ]">
                  <el-input v-model.trim="ruleForm.Mobile" placeholder="请输入账号" maxlength="11">
                    <i slot="prefix">
                      <img src="../assets/images/login1.png" alt="">
                    </i>
                  </el-input>
              </el-form-item>
              <el-form-item prop="Password" :rules="[
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 16, message: '密码长度应在6-16位之间', trigger: 'blur' },
              ]">
                  <el-input type="password" v-model.trim="ruleForm.Password" @keyup.enter.native="submitForm" placeholder="请输入密码" maxlength="16">
                    <i slot="prefix">
                      <img src="../assets/images/login2.png" alt="">
                    </i>
                  </el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="info" @click="submitForm" size="medium">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </main>
    </section>
  </section>
</template>

<script>
import { Base64 } from 'js-base64';
import TokenClass from '@/assets/js/utils/tokenManage';

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
      const bool = await this.$refs.ruleForm.validate().catch(() => false);
      if (!bool) return;
      this.ruleForm.Password = Base64.encode(this.ruleForm.Password);
      const res = await this.api.getLogin(this.ruleForm);
      if (res.data.Status === 1000 && res.data.Data) {
        TokenClass.setToken(res.data.Data);
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
section.login-wrap {
  width: 100%;
  height: 100%;
  background-color: rgb(52, 73, 100);
  > section {
    min-height: 100%;
    width: 100%;
    // background-color: #bbd5fa;
    box-sizing: border-box;
    background: url(../assets/images/login-bg.png) no-repeat center center/cover;
    > header {
      padding-top: 40px;
      padding-left: 40px;
      height: 91px;
      box-sizing: border-box;
      > img {
        width: 236px;
      }
    }
    > main {
      padding-top: 150px;
      padding-bottom: 50px;
      position: relative;
      > .box {
        height: 494px;
        width: 880px;
        border-radius: 6px;
        margin: 0 auto;
        overflow: hidden;
        > .left {
          display: inline-block;
          vertical-align: top;
          width: 423px;
          height: 100%;
          // background-color: rgba($color: #000000, $alpha: 0.5);
          background: url(../assets/images/login-bg-sm.png) no-repeat center center/cover;
          position: relative;
          .mask {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba($color: #030303, $alpha: 0.6);
            color: #fff;
            padding-left: 93px;
            padding-top: 135px;
            padding-right: 40px;
            > div.line {
              width: 43px;
              height: 2px;
              background-color: #c4c4c4;
            }
            > h2 {
              padding: 40px 0;
              font-weight: 700;
              font-size: 25px;
              line-height: 30px;
            }
            > p {
              line-height: 26px;
              margin-bottom: 10px;
              font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            }
          }
        }
        > .right {
          width: 457px;
          background-color: rgba($color: #fff, $alpha: 0.9);
          display: inline-block;
          vertical-align: top;
          height: 100%;
          box-sizing: border-box;
          padding-top: 156px;
          .demo-ruleForm {
            width: 226px;
            margin: 0 auto;
            > div > div {
              .el-input {
                input {
                  background-color: rgba($color: #000, $alpha: 0);
                  border-radius: 0;
                  border-top: none;
                  border-left: none;
                  border-right: none;
                  font-size: 15px;
                  margin-bottom: 3px;
                  padding-left: 50px;
                  &::placeholder {
                    color: #aaa;
                  }
                }
                .el-input__prefix {
                  > i {
                    width: 23px;
                    height: 23px;
                    display: inline-block;
                    vertical-align: -7px;
                    > img {
                      width: 23px;
                      height: 23px;
                    }
                  }
                  &::after {
                    content: '';
                    display: inline-block;
                    width: 1px;
                    height: 18px;
                    background-color: #aaa;
                    vertical-align: middle;
                    margin-left: 9px;
                  }
                }
              }
              button {
                margin-top: 16px;
                width: 226px;
                height: 26px;
                border-radius: 13px;
                padding: 0;
                font-size: 15px;
                background-color: #E1E3E4;
                border: none;
                color: #243142;
                &:hover {
                  background-color: #ddd;
                }
                &:active {
                  background-color: #cbcbcb;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
