<template>
  <CommonDialogComp
    :title="`定损${Disabled ? '查看' : '确认'}`"
    :visible="visible"
    @cancle="cancle"
    @open='onOpen'
    @closed='closed'
    submitText='保存'
    :showSubmit="!Disabled"
    cancelText="关闭"
    @submit='submit'
    width='630px'
    top='13vh'
    class="loss-assessment-dialog"
    >
    <div class="loss-assessment" v-if="this.AfterSaleData">
      <template>
        <div class="result" v-if="AfterSaleData.SolutionTypes.find(item => item === 7)">
          <h3>
            <span>补印</span>
          </h3>
          <p>
            <span>款数：{{this.AfterSaleData.SuccessKindCount}} 款</span>
            <span>数量：{{this.AfterSaleData.SuccessNumber}} {{this.AfterSaleData.SuccessUnit}}</span>
          </p>
          <p>文件：{{this.AfterSaleData.FileName}}</p>
        </div>
        <div class="result"  v-if="AfterSaleData.SolutionTypes.find(item => item === 2)">
          <h3>
            <span>退款</span>
          </h3>
          <p>
            <span style="margin-right: 16px;">退到余额：{{this.AfterSaleData.RefundAmount}}元</span>
            <span>含运费：{{this.AfterSaleData.RefundFreightAmount}}元</span>
          </p>
        </div>
        <div class="result"  v-if="AfterSaleData.SolutionTypes.find(item => item === 8)">
          <h3>
            <span>优惠券</span>
          </h3>
          <p>
            {{AfterSaleData.CouponList.map(it => `满${it.MinPayAmount}减${it.Amount}券${it.Number}张`).join('、')}}
          </p>
        </div>
      </template>
      <div v-if="AfterSaleData.SolutionTypes.find(item => item === 255)">
        <h3>
          <span>其他费用</span>
        </h3>
        <p>
          <el-input
            :disabled="Disabled"
            v-model="fromData.OtherSolutionRemark"
            type="textarea"
            :rows="3"
            placeholder="若产生其他费用，请在此处说明"
            maxlength="100"
            show-word-limit
            >
          </el-input>
        </p>
      </div>
      <div class="loss">
        <h3>
          <span>损失金额</span>
        </h3>
        <p >
          <el-input :disabled="Disabled" size="small" v-model.number="fromData.LossAmount" placeholder="请输入损失金额"></el-input>
          <span>元</span>
        </p>
      </div>
      <div>
        <h3>
          <span>说明</span>
          <i class="is-pink">若解决方案损失发生变化需说明原因并上传相关照片信息</i>
        </h3>
        <p>
          <el-input
            v-model="fromData.LossConfirmRemark"
            type="textarea"
            :rows="3"
            placeholder="若费用产生变化，需要在此说明原因和理由"
            maxlength="100"
            show-word-limit
            :disabled="Disabled"
            >
          </el-input>
        </p>
        <div class="QuestionPicList" :class="{'upload-disabled':Disabled}">
          <div style="height: 90px;">
            <el-upload
              v-if="!Disabled"
              :action="'/Api/Upload/Image?type=3'"
              list-type="picture-card"
              ref="upload"
              drag
              accept='.png,.jpeg,.jpg,.bmp,'
              :multiple='true'
              :limit='5'
              :on-success='handllePictureUploaded'
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :before-upload='beforeUpload'
              :class="{'uploadDisabled':uploadDisabled}"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="image-list" v-else>
              <el-image v-for="it in fromData.LossConfirmPics" :key="it"
                :src="it"
                :preview-src-list="fromData.LossConfirmPics">
              </el-image>
            </div>
          </div>
          <el-dialog :visible.sync="dialogVisible" top="8vh" title="查看图片" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <div class="upload-Remark" v-if="!Disabled">
            <p class="is-font-12 gray">上传说明：</p>
            <p class="is-font-12 gray">1.支持上传jpeg、png、jpg、bpm格式的照片</p>
            <p class="is-font-12 gray">2.最多可上传5张照片，单张照片大小不超过15M</p>
          </div>
        </div>
      </div>
    </div>
  </CommonDialogComp>

 </template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
// import CtrlMenus from '@/components/common/NewComps/CtrlMenus/index.vue';
import { Message } from 'element-ui';

export default {
  components: {
    CommonDialogComp,
    // CtrlMenus,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    AfterSaleData: {
      type: Object,
    },
  },

  data() {
    return {
      dialogVisible: false,
      uploadDisabled: false,
      dialogImageUrl: '',

      Disabled: false,
      fromData: {
        AfterSaleCode: 0,
        OtherSolutionRemark: '',
        LossAmount: null,
        LossConfirmPics: [],
        LossConfirmRemark: '',
      },
    };
  },
  methods: {
    setUploadDisabled() {
      const _list = this.$refs.upload?.uploadFiles?.map(it => {
        if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
        return '';
      }).filter(it => it);
      if ((!_list) || _list.length < 5) {
        this.uploadDisabled = false;
      } else {
        this.uploadDisabled = true;
      }
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
      this.setUploadDisabled();
    },
    handleRemove() {
      this.setUploadDisabled();
    },
    beforeUpload(file) {
      const isLt15M = file.size / 1024 / 1024 < 15;
      if (!isLt15M) {
        // 文件过大上传失败
        Message({
          showClose: true,
          message: '文件过大，上传失败',
          type: 'error',
        });
      }
      return isLt15M;
    },
    initPicList() {
      this.$refs.upload.uploadFiles = this.fromData.LossConfirmPics.map((path, i) => ({
        name: '（…）',
        percentage: 100,
        raw: {},
        response: {
          Status: 1000,
          Message: '返回成功',
          DataNumber: 1,
          VersionCode: 0,
          Data: {
            Height: 1080,
            Name: '',
            Suffix: '.jpeg',
            Url: path,
            Width: 1920,
          },
        },
        size: 1000,
        status: 'success',
        uid: new Date().getTime() + i,
        url: `${path}`,
      }));
      this.setUploadDisabled();
    },
    onOpen() {
      console.log(this.AfterSaleData);
      if (this.AfterSaleData.LossConfirmStatus) {
        this.Disabled = true;
        this.api.getOrderAfterSaleLossConfirmInfo(this.AfterSaleData.AfterSaleCode).then(res => {
          if (res.data.Status === 1000) {
            this.fromData = res.data.Data;
            this.initPicList();
          }
        });
      } else {
        this.Disabled = false;
        this.fromData.AfterSaleCode = this.AfterSaleData.AfterSaleCode;
        this.fromData.OtherSolutionRemark = this.AfterSaleData.OtherSolutionRemark;
        this.fromData.LossAmount = this.AfterSaleData.LossAmount;
      }
    },
    cancle() {
      this.$emit('closed');
      this.closed();
    },
    closed() {
      this.fromData = {
        AfterSaleCode: 0,
        OtherSolutionRemark: '',
        LossAmount: null,
        LossConfirmPics: [],
        LossConfirmRemark: '',
      };
      this.initPicList();
    },
    async submit() {
      if (this.fromData.LossAmount === '' || this.fromData.LossAmount === null) {
        this.messageBox.failSingleError('提交失败', '请输入损失金额');
      } else {
        const _list = this.$refs.upload.uploadFiles.map(it => {
          if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
          return '';
        }).filter(it => it);
        // if (!_list.length) {
        //   this.messageBox.failSingleError('提交失败', '请上传问题图片');
        //   return;
        // }
        this.fromData.LossConfirmPics = _list || [];
        const res = await this.api.getOrderAfterSaleLossConfirm(this.fromData);
        if (res.data.Status === 1000) {
          this.messageBox.successSingle(
            '提交成功',
            () => {
              // this.$emit('success');
              this.$emit('submit');
            },

            () => {
              // this.$emit('success');
              this.$emit('submit');
            },
          );
        }
      }
    },
  },
};
</script>

 <style lang='scss'>
 .loss-assessment-dialog{
   .el-dialog__header{
     padding-left: 30px;
     padding-right: 30px;
   }
   .el-dialog__header::after{
     width: calc(100% - 60px);
     left: 30px;
   }
   .el-dialog__body{
     padding: 5px 30px 0px 38px;
   }
   .el-dialog__footer{
    padding-top: 16px;
    padding-bottom: 50px;
    position: relative;
    .dialog-footer{
      padding: 0;
    }
    &::after{
      content:"此处保存成功后，售后单费用将不能再修改，请谨慎操作。";
      color: #FF0000;
      position: absolute;
      bottom: 30px;
      left: 50%;
      font-size: 12px;
      transform: translateX(-50%);
    }
   }
   .loss-assessment{
     min-height: calc(300px);
     color: #444444;
     >div{
      h3{
        display: flex;
        align-items: center;
        line-height: 40px;
        span{
          font-size: 16px;
          color: #444444;
          font-weight: 700;
          width: 4em;
          text-align: right;
          margin-right: 15px;
        }
        i{
          font-size: 12px;
        }
      }
      >p, >ul, .QuestionPicList{
        padding-left: 32px;
      }
      &.result{
        >p{
          font-size: 12px;
          margin-bottom: 15px;
        }
        p:last-child{
          margin-bottom: 10px;
        }
      }
      >ul{
        li{
          display: flex;
          align-items: center;
          .describe{
            flex: 1;
          }
          .number{
            width: 130px;
            margin-left: 10px;
          }
          >span{
            width: 1em;
            margin-left: 5px;
            font-size: 12px;
          }
          .ctrl-menus-container{
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            >span{
              margin-left: 15px;
            }
          }
        }
      }
      &.loss{
        >p{
          display: flex;
          align-items: center;
          .el-input{
            width: 150px;
          }
          >span{
            width: 1em;
            margin-left: 5px;
            font-size: 12px;
          }
        }
      }
      .QuestionPicList{
        &.upload-disabled{
          .el-upload-dragger{
            cursor: not-allowed;
            background-color: #F5F7FA;
          }
        }
        margin-top: 10px;
        .uploadDisabled{
          >.el-upload--picture-card{
            display:none
          }
        }
        .el-icon-close-tip{
          display: none;
          width: 0;
          height: 0;
          overflow: hidden;
        }
        .el-form-item__error{
          top: calc(100% - 52px);
        }
        .upload-Remark{
          margin-top: -10px;
          font-size: 12px;
          line-height: 1.3em;
        }
        .el-upload{
          width: 71px;
          height: 71px;
          margin-bottom: 23px;
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

        .image-list{
          .el-image{
            width: 71px;
            height: 71px;
            margin: 0 8px 8px 0;
          }
        }
      }
     }
   }
 }
 </style>
