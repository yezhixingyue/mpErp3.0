<template>
  <div>
    <!-- 弹窗窗体 -->
    <el-dialog
      top="3vh"
      :visible="visible"
      title='申请售后'
      width="850px"
      custom-class="dialog-box"
      :modal='false'
      @close='close'
      center
      v-dialogDrag
    >
      <p slot="title" class="after-sales-title">申请售后 </p>
      <div class="dialog">
        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
          <el-form-item label="诉求意向：" prop="AppealType">
            <div class="intention">
              <span :class="ruleForm.AppealType===0 ? 'action' : ''" @click="ruleForm.AppealType = 0">退款</span>
              <span :class="ruleForm.AppealType===1 ? 'action' : ''" @click="ruleForm.AppealType = 1">补印</span>
              <span :class="ruleForm.AppealType===255 ? 'action' : ''" @click="ruleForm.AppealType = 255">其它</span>
            </div>
          </el-form-item>

          <template v-if="ruleForm.AppealType!==null">
          <!--  -->

          <el-form-item v-if="ruleForm.AppealType===1" style="margin:0" key="AppealType===1">
            <div class="make-up-for">
              <div class="item">款数：
                <el-form-item prop="KindCount" style="margin:0">
                  <el-input-number size="small"
                  :controls="false" v-model="ruleForm.KindCount"
                  :min="1" :max="1000" label="款数">
                  </el-input-number>
                </el-form-item>
                款
              </div>
              <div class="item">
                补印数量：
                <el-form-item prop="Number" style="margin:0">
                  <el-input-number size="small" :controls="false"
                    v-model="ruleForm.Number" :min="1"
                     label="描述文字">
                  </el-input-number>
                </el-form-item>
                /款
                <span>您最多可提交数量为<span>{{ServiceAfterSales.ProductAmount}}</span></span>
                </div>
            </div>
          </el-form-item>

          <!--  -->

          <el-form-item v-if="ruleForm.AppealType===0" style="margin:0" key="AppealType===0">
            <div class="make-up-for">
              退款金额：
              <div class="item">
                <el-form-item prop="RefundAmount" style="margin:0">
                  <el-input-number
                    size="small" :controls="false"
                    v-model="ruleForm.RefundAmount"
                    :min="0" :max="1000" label="描述文字">
                  </el-input-number>元
                </el-form-item>
              </div>
            </div>
          </el-form-item>

          <!--  -->

          <el-form-item class="QuestionTypeList" label="问题类型：" prop="QuestionTypeList" style="margin-bottom:0">
          <ul class="check-button">
            <li v-for="(item, index) in ApplyQuestionList"
            :key="index"
            :class="isAction(item.ID)?'action':''"
            @click="onCheck(item.ID)">{{item.Title}}</li>
          </ul>
          </el-form-item>

          <!--  -->

          <el-form-item label="问题描述：" prop="QuestionRemark">
            <el-input type="textarea" v-model="ruleForm.QuestionRemark"
            :autosize="{ minRows: 2}"
            size="mini"
             maxlength="600" show-word-limit placeholder="请输入具体问题描述"></el-input>
          </el-form-item>

          <el-form-item label="上传图片：">
            <el-upload
              :action="'/Api/Upload/Image?type=3'"
              list-type="picture-card"
              ref="upload"
              drag
              accept='.png,.jpeg,.jpg,.bmp'
              :multiple='true'
              :limit='4'
              :on-success='handllePictureUploaded'
              :on-preview="handlePictureCardPreview"
              >
              <!-- :on-success='handllePictureUploaded'
              :on-remove="handleRemove" -->
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" top="8vh" title="查看图片" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <!-- <p v-if="!canEdit && fileList.length === 0">未上传照片</p> -->
            <p class="is-font-12 gray upload-Remark">最多可上传9张图片，每张图片打小不超过5M,支持bmp、gif、png、jpeg</p>
          </el-form-item>
          </template>
        </el-form>
        <div v-if="ruleForm.AppealType!==null" class="line"></div>
        <el-form v-if="ruleForm.AppealType!==null"
          label-position="left" :model="ruleForm"
          :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
          <div class="linkman">
            <el-form-item label="联系人：" prop="ContactName">
              <el-input v-model="ruleForm.ContactName" maxlength="11"
                show-word-limit placeholder="请输入联系人"></el-input>
            </el-form-item>

            <el-form-item label="联系电话：" prop="Mobile">
              <el-input v-model="ruleForm.Mobile" maxlength="11"
                show-word-limit placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="QQ号码：" prop="QQ">
              <el-input v-model="ruleForm.QQ" maxlength="11"
                show-word-limit placeholder="请输入QQ号码"></el-input>
            </el-form-item>
          </div>

        </el-form>
        <div class="btn-box" v-if="ruleForm.AppealType!==null">
          <el-button type="primary" class="is-blue-button" @click="submitForm()" >立即提交</el-button>
          <!-- <span class="blue-span is-font-12" style="margin: 0 60px 0 30px" @click="resetForm('ruleForm')" v-if='canEdit'>重置</span> -->
          <el-button  @click="handleCancel">
            <!-- <i class="el-icon-d-arrow-left is-font-15"></i> -->
            <em style="margin-left: 6px">取消</em>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui';

export default {
  props: {
    visible: {
      type: Boolean,
    },
    ServiceAfterSales: {
      type: Object,
    },
  },
  data() {
    const validateQuestionTypeList = (rule, value, callback) => {
      if (value?.length === 0) {
        callback(new Error('请选择问题类型'));
      } else {
        callback();
      }
    };
    const validateRefundAmount = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('退款金额不能为0'));
      } else if (value === undefined) {
        callback(new Error('请输入退款金额'));
      } else {
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      if (value > this.ServiceAfterSales.ProductAmount) {
        callback(new Error(`不能大于'${this.ServiceAfterSales.ProductAmount}'`));
      } else if (!value) {
        callback(new Error('不能为空'));
      } else {
        callback();
      }
    };
    const validateKindCount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'));
      } else {
        callback();
      }
    };
    return {
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      ruleForm: {
        OrderID: 0, // 订单号
        Source: 1, // 下单类型
        AppealType: null, // 诉求意向
        QuestionTypeList: [], // 问题类型数组
        QuestionRemark: '', // 问题描述
        QuestionPicList: [], // 问题图片
        KindCount: 0, // 款数
        Number: 0, // 数量
        RefundAmount: 0, // 退款金额
        ContactName: '', // 联系人
        QQ: '', // QQ号码
        Mobile: '', // 电话

      },
      rules: {
        QuestionTypeList: [
          // { required: true, message: '请选择售后原因', trigger: 'change' },
          { validator: validateQuestionTypeList, trigger: 'blur' },
        ],
        QuestionRemark: [
          { required: true, message: '请输入具体问题描述', trigger: 'change' },
          {
            min: 3, max: 599, message: '长度在 3 到 600 个字符', trigger: 'change',
          },
        ],
        RefundAmount: [
          { validator: validateRefundAmount, trigger: 'blur' },
        ],
        Number: [
          { validator: validateNumber, trigger: 'blur' },
        ],
        KindCount: [
          { validator: validateKindCount, trigger: 'blur' },
        ],
        AppealType: [
          { required: true, message: '请选择诉求意向', trigger: 'blur' },
        ],
        ContactName: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
        ],
        Mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' },
        ],
      },
      ApplyQuestionList: null,
    };
  },
  components: {
  },
  computed: {
    isAction() {
      return (key) => this.ruleForm.QuestionTypeList.findIndex((it) => it === key) + 1;
    },
  },

  methods: {
    checkAction() {},
    onCheck(key) {
      const checkKey = this.ruleForm.QuestionTypeList;
      if (checkKey.findIndex((it) => it === key) === -1) {
        checkKey.push(key);
      } else {
        checkKey.splice(checkKey.findIndex((it) => it === key), 1);
      }
    },
    close() {
      this.$emit('close');
      this.resetForm();
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handllePictureUploaded(response) {
      if (response.Status !== 1000) {
        Message({
          showClose: true,
          message: response.Message,
          type: 'error',
        });
        // eslint-disable-next-line max-len
        this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(it => it.response && it.response.Status === 1000);
      }
    },
    resetForm() {
      this.$refs.ruleForm1.resetFields();
      this.$refs.ruleForm2.resetFields();
    },
    async submitForm() {
      this.$refs.ruleForm1.validate();
      this.$refs.ruleForm2.validate();
      const MobileReg = /^1[3456789]\d{9}$/;
      if (this.ruleForm.AppealType === 0 && !this.ruleForm.RefundAmount) {
        // 弹窗提示 退款金额：
        this.messageBox.failSingleError('提交失败', '请输入退款金额');
      } else if (this.ruleForm.AppealType === 1 && !this.ruleForm.KindCount) {
        this.messageBox.failSingleError('提交失败', '请输入补印款数');
      } else if (this.ruleForm.AppealType === 1 && !this.ruleForm.Number) {
        this.messageBox.failSingleError('提交失败', '请输入补印数量');
      } else if (this.ruleForm.QuestionTypeList.length === 0) {
        this.messageBox.failSingleError('提交失败', '请选择问题类型');
      } else if (this.ruleForm.QuestionRemark === '') {
        this.messageBox.failSingleError('提交失败', '请输入问题描述');
      } else if (this.ruleForm.ContactName === '') {
        this.messageBox.failSingleError('提交失败', '请输入联系人');
      } else if (this.ruleForm.Mobile === '') {
        this.messageBox.failSingleError('提交失败', '请输入联系电话');
      } else if (!MobileReg.test(this.ruleForm.Mobile)) {
        this.messageBox.failSingleError('提交失败', '请输入正确的联系电话');
      } else {
        const _list = this.$refs.upload.uploadFiles.map(it => {
          if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
          return '';
        }).filter(it => it);
        this.ruleForm.QuestionPicList = _list || [];
        // this.ruleForm.QuestionPicList = ['string'];
        this.ruleForm.OrderID = this.ServiceAfterSales.OrderID;
        const res = await this.api.getApplyQuestionApply(this.ruleForm);
        if (res.data.Status === 1000) {
          this.messageBox.successSingle('提交成功',
            () => {
              this.$emit('success');
            });
        }
      }
    },
    ApplyQuestionCheckChange(keys) {
      this.ruleForm.QuestionTypeList = keys;
      this.$refs.ruleForm1.validateField('QuestionTypeList');
    },
    handleCancel() {
      this.close();
    },
  },
  mounted() {
    this.api.getApplyQuestionList().then(res => {
      if (res.data.Status === 1000) {
        this.ApplyQuestionList = res.data.Data;
      }
    });
  },
};
</script>

<style lang='scss'>
.after-sales-title{
  line-height: 16px;
  border-left: 2px solid #26BCF9;
  text-align: left;
  padding-left: 6px;
  font-size: 14px;
  color: #444444;
  font-weight: 700;
}
.dialog {
  width: 100%;
  // margin-left: 80px;
  min-height: 745px;
  > .line{
    border-bottom: 1px dashed #EEEEEE;
    margin-top: -16px;
    margin-bottom: 30px;
  }
  .QuestionTypeList{
    .el-form-item__error{
      top: calc(100% - 15px);
    }
  }
  .el-form-item{
    color: #585858;
    margin-bottom: 10px;
    .el-form-item__content{
      color: #888888;
    }
  }
  .el-form-item__label{
    color: #585858;
    font-weight: 700;
    padding-bottom: 0;
  }
  .el-form-item__label:before {
    color: #FEB829 !important;
  }
  // 诉求意向
  .intention{
    display: flex;
    height: 40px;
    align-items: center;
    span:hover{
      cursor:pointer;
      color: #428DFA;
      background-color: #EBF0FE;
      border-color: #428dfa;
    }
    >.action{
      border-color: #428dfa;
      background-color: #428dfa;
      color: #fff;
      &:hover{
      border-color: #428dfa;
      background-color: #428dfa;
      color: #fff;
    }
    }
    span{
      width: 120px;
      line-height: 30px;
      border-radius: 5px;
      height: 30px;
      text-align: center;
      border: 1px solid #efefef;
      margin-right: 30px;
      color: #888888;
    }
  }
  // 补印
  .make-up-for{
    display: flex;
    color: #888888;
    .item{
      display: flex;
      margin-right: 120px;
      align-items: center;
      >span{
        font-size: 12px;
        margin-left: 20px;
        color: #aaa;
        >span{
          color: #FF3769;
        }
      }
      .el-input-number{
        width: 80px;
        text-align: center;
        margin-right: 10px;
      }
    }
  }
  // 问题类型
  .check-button{
    display: flex;
    flex-wrap: wrap;
    .action{
      background-color: #428dfa;
      border-color: #428dfa;
      color: #fff;
      &:hover{
        border-color: #428dfa;
        background-color: #428dfa;
        color: #fff;
      }
    }
    li{
      width: 100px;
      height: 30px;
      border-radius: 5px;
      line-height: 30px;
      border: 1px solid #E6E6E6;
      margin: 0px 15px 15px 0;
      text-align: center;
      color: #888888;
    }
    li:hover{
      cursor:pointer;
      color: #428DFA;
      border-color: #428dfa;
      background-color: #EBF0FE;
    }
  }
  // 联系人
  .linkman{
    display: flex;
    flex-wrap: wrap;
    .el-form-item{
      width: 50%;
    }
    .el-input{
      height: 30px;
      width: 134px;
      font-size: 14px;
      input{
        width: 100%;
        height: 100%;
      }
      margin-right: 140px;
    }
  }
  .btn-box {
    // padding-bottom: 60px;
    margin-top: 20px;
    line-height: 35px;
    display: flex;
    justify-content: center;
    > button {
      width: 120px;
      height: 35px;
      & + button {
        margin-left: 20px;
      }
    }
  }
  .text {
    padding-left: 13px;
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .el-upload{
    width: 71px;
    height: 71px;
  }
  .el-upload-list__item-thumbnail {
    object-fit: cover;
  }
  .el-upload-list{
    .el-upload-list__item{
      width: 71px;
      height: 71px;

    }
  }

  .el-upload-dragger {
    width: 100%;
    height: 100%;
    border: none;
    // line-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .is-disabled + .el-upload {
    display: none;
  }
  .mp-feedback-progress-box {
    padding: 20px 0;
    margin-top: 35px;
    border-radius: 4px;
    border: 1px solid #eee;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    background-color: rgb(253, 253, 253);
  }
}
</style>
