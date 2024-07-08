<template>
  <section class="mp-erp-audit-certificate-page-containner">
    <div class="container" v-if="CertificateUnCheck">
      <div class="certificate-pics">
        <p class="title">证书详情</p>
        <div class="image-box">
          <el-image :preview-src-list="CertificateUnCheck.CertificatePics"
            v-for="item in CertificateUnCheck.CertificatePics" :key="item" :src="item" fit="contain" ></el-image>
        </div>
      </div>
      <div class="certificate-info">
        <p class="title">证书内容</p>
        <ul>
          <li> {{ CertificateType.find(it => it.value === CertificateUnCheck.CertificateType).label }}：<span>{{CertificateUnCheck.CertificateName}}</span></li>
          <li>有效期至：{{CertificateUnCheck.Expire.split('T')[0]}}</li>
          <li>{{CertificateUnCheck.Customer.CustomerName}}（{{CertificateUnCheck.Customer.CustomerSN}}）</li>
        </ul>
        <div class="check-btns">
          <el-button size="small" @click="passTheAuditVisible = true">审核通过</el-button>
          <el-button size="small" @click="AuditFailureVisible = true">审核不通过</el-button>
        </div>
      </div>
    </div>
    <div class="empty" v-else>
      <p>暂时没有需要审核的证书</p>
      <el-button type="text" @click="getCertificateUnCheck"> 刷新 </el-button>
    </div>
    <CommonDialogComp
      width="400px"
      top="calc(50vh - 175px)"
      submitText='确定'
      :visible.sync="passTheAuditVisible"
      @submit="passTheAudit"
      @cancle="passTheAuditVisible = false"
      class="pass-the-audit"
    >
      <main>
        <img width="67px" height="67px" src="@/assets/images/过期.png" alt="">
        <p>审核确认提醒</p>
        <span>审核通过后不能更改，确定审核通过吗？</span>
      </main>
    </CommonDialogComp>
    <CommonDialogComp
      width="530px"
      top="calc(50vh - 175px)"
      title="审核不通过原因："
      submitText='确定'
      :visible.sync="AuditFailureVisible"
      @submit="AuditFailure"
      @cancle="onCancle"
      class="audit-failure-dialog"
    >
      <main>
        <el-form label-width="107px">
          <el-form-item label="原因模板：" size="small">
            <el-select v-model="CauseTemplate" @change="CauseTemplateChange" placeholder="请选择" size="small">
              <el-option
                v-for="item in CertificateNoPassReason"
                :key="item.ReasonID"
                :label="item.Reason"
                :value="item.ReasonID">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="不通过原因：" size="small">
            <el-input v-model="CheckRemark" maxlength="20" show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <div class="tip-box">
          <span><img src="@/assets/images/warn.png" alt="">注：保存后不能更改，请谨慎操作！</span>
        </div>
      </main>
    </CommonDialogComp>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  name: 'AuditCertificatePage',
  computed: {
    ...mapState('common', ['CertificateType']),
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      CauseTemplate: '',
      CertificateUnCheck: null,
      CertificateNoPassReason: null,
      passTheAuditVisible: false,
      AuditFailureVisible: false,
      CheckRemark: '',
    };
  },
  methods: {
    // 不通过原因模板
    getCertificateNoPassReason() {
      this.api.getCustomerCertificateNoPassReason().then(res => {
        if (res.data.Status === 1000) {
          if (res.data.Data) {
            this.CertificateNoPassReason = res.data.Data;
          }
        }
      });
    },
    getCertificateUnCheck() {
      this.api.getCustomerCertificateUnCheck().then(res => {
        if (res.data.Status === 1000) {
          if (res.data.Data) {
            this.CertificateUnCheck = res.data.Data;
          } else {
            this.CertificateUnCheck = null;
          }
        }
      });
    },
    CertificateCheck(Status, Remark) {
      const temp = {
        CertificateID: this.CertificateUnCheck.CertificateID,
        CheckStatus: Status,
        CheckRemark: Remark,
        CertificateName: this.CertificateUnCheck.CertificateName,
        CertificatePics: this.CertificateUnCheck.CertificatePics,
        Expire: this.CertificateUnCheck.Expire,
      };
      this.api.getCustomerCertificateCheck(temp).then(() => {
        // if (res.data.Status === 1000) {
        // 审核成功
        this.passTheAuditVisible = false;
        this.AuditFailureVisible = false;
        this.getCertificateUnCheck();
        // }
      });
    },
    // 审核通过
    passTheAudit() {
      this.CertificateCheck(1, '');
    },
    // 审核不通过
    AuditFailure() {
      if (this.CheckRemark) {
        this.CertificateCheck(2, this.CheckRemark);
      } else {
        this.messageBox.failSingleError('保存失败', '请输入不通过原因');
      }
    },
    onCancle() {
      this.AuditFailureVisible = false;
      this.CheckRemark = '';
      this.CauseTemplate = '';
    },
    CauseTemplateChange() {
      const temp = this.CertificateNoPassReason.find(it => it.ReasonID === this.CauseTemplate);
      if (temp) {
        this.CheckRemark = temp.Reason;
      }
    },
  },
  mounted() {
    this.getCertificateUnCheck();
    this.getCertificateNoPassReason();
  },
};
</script>
<style lang='scss'>
.mp-erp-audit-certificate-page-containner {
  background-color: #f5f5f5;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 1200px;
  overflow-x: auto;
  .container{
    background-color: #fff;
    padding-left: 50px;
    height: 100%;
    font-size: 14px;
    font-weight: 700;
    >div{
      padding-top: 25px;
      >.title{
        border-left: 3px solid #26BCF9;
        line-height: 18px;
        padding-left: 5px;
        color: #444444;
      }
    }
    .certificate-pics{
      .image-box{
        margin-top: 10px;
        .el-image{
          width: 360px;
          height: 480px;
          background-color: #F5F7FA;
          cursor: pointer;
          & + .el-image{
            margin-left: 20px;
          }
        }
      }
    }
    .certificate-info{
      >ul{
        display: flex;
        margin-top: 10px;
        li{
          line-height: 22px;
          display: flex;
          align-items: center;
          span{
            font-size: 22px;
          }
          & + li{
            margin-left: 60px;
          }
        }
      }
      .check-btns{
        padding-left: 422px;
        margin-top: 43px;
        .el-button{
          width: 120px;
          height: 35px;
          padding: 0;
          color: #fff;
          background: linear-gradient(to right, #26BCF9, #34DEF9);
          border: none;
          & + .el-button{
            background: #FF3E6A;
            margin-left: 30px;
          }
        }
      }
    }
  }
  .empty{
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    background-color: #fff;
    font-size: 30px;
    color: #444;
    >p{
      padding-top: 200px;
    }
    .el-button{
      margin-top: 200px;
      padding: 15px;
    }
  }
  .pass-the-audit{
    .el-dialog__header{
      display: none;
    }
    .el-dialog__body{
      padding-top: 50px;
      padding-bottom: 40px;
      >main{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        >p{
          font-size: 30px;
          font-weight: 700;
          color: #F4A307;
          margin-top: 14px;
          margin-bottom: 11px;
        }
        >span{
          color: #444;
        }
      }
    }
    .el-dialog__footer, .dialog-footer{
      padding-top: 0;
    }
  }
  .audit-failure-dialog{
    .el-dialog__body{
      padding-top: 15px;
      padding-right: 45px;
      >main{
        .el-form{
          .el-form-item{
            margin-bottom: 15px;
            .el-form-item__label{
              padding: 0;
            }
          }
        }
        .tip-box{
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
          >span{
            background-color: #FFFBF6;
            color: #F4A307;
            font-size: 12px;
            padding: 0 17px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            line-height: 30px;
            >img{
              width: 13px;
              height: 13px;
              margin-right: 5px;
            }
          }
        }
      }
    }
    .el-dialog__footer, .dialog-footer{
      padding-top: 0;
    }
  }
}
</style>
