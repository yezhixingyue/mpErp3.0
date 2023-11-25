<template>
    <div class="loss-assessment" v-if="this.AfterSaleData">
      <div class="other-expenses" v-if="AfterSaleData.SolutionTypes.find(item => item === 255)">
        <h3>
          <span>其他费用：</span>
        </h3>
        <p v-if="!Disabled">
          <el-input
            :disabled="Disabled"
            v-model="fromData.OtherSolutionRemark"
            type="textarea"
            :rows="4"
            placeholder="若产生其他费用，请在此处说明"
            maxlength="300"
            show-word-limit
            >
          </el-input>
        </p>
        <span v-else>{{ fromData.OtherSolutionRemark }}</span>
      </div>
      <div class="loss">
        <h3>
          <span>损失金额：</span>
        </h3>
        <p>
          <el-input v-if="!Disabled" :disabled="Disabled" oninput="value=value.replace(/^([0-9-]\d*\.?\d{0,2})?.*$/,'$1')"
          size="small" v-model="fromData.LossAmount" placeholder="请输入损失金额"></el-input>
          <span style="color: #ff0000;" v-else>{{ fromData.LossAmount }}</span>
          <span :style="`${Disabled ? 'color: #ff0000;' : ''}`">元</span>
        </p>
      </div>

      <div class="remark-input" v-if="!Disabled">
        <h3>
          <span>说明：</span>
          <i>若解决方案损失发生变化需说明原因并上传相关照片信息</i>
        </h3>
        <p>
          <el-input
            v-model="fromData.LossConfirmRemark"
            type="textarea"
            :rows="4"
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
          </div>
          <el-dialog :visible.sync="dialogVisible" top="8vh" title="查看图片" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <div class="upload-Remark">
            <p class="is-font-12 gray">上传说明：</p>
            <p class="is-font-12 gray">1.支持上传jpeg、png、jpg、bpm格式的照片</p>
            <p class="is-font-12 gray">2.最多可上传5张照片，单张照片大小不超过15M</p>
          </div>
        </div>
      </div>
      <div v-else class="explain">
        <p>
          <span> <i>{{fromData.LossConfirmTime | format2LangTypeDate}}</i>
            <i>{{fromData.LossConfirmUserName}}</i>{{ fromData.LossConfirmRemark ||'确认售后定损无误' }}</span>
        </p>
        <div class="QuestionPicList" :class="{'upload-disabled':Disabled}">
          <div class="image-list">
            <el-image v-for="it in fromData.LossConfirmPics" :key="it"
              :src="it"
              :preview-src-list="fromData.LossConfirmPics">
            </el-image>
          </div>
        </div>
      </div>
      <div class="btns" v-if="!Disabled">
        <el-button @click="SaveClick" class="save-btn">保存</el-button>
        <el-dialog class="check-and-confirm" :visible.sync="SaveDialogVisible" top="50vh">
          <div class="check-and-confirm-main">
            <img width="67px" height="67px" src="@/assets/images/过期.png" alt="">
            <p class="title">复核确认提醒</p>
            <p class="msg">复核确认提交后不可修改，是否确定提交？</p>
          </div>
          <div slot="footer">
            <el-button @click="submit" type="primary" class="save-btn">确定</el-button>
            <el-button @click="SaveDialogVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
 </template>

<script>
import { Message } from 'element-ui';

export default {
  props: {
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
      SaveDialogVisible: false,
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
      if (!this.$refs.upload) return;
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
    onInit() {
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
    async submit() {
      this.SaveDialogVisible = false;
      // if (this.fromData.LossAmount === '' || this.fromData.LossAmount === null) {
      //   this.messageBox.failSingleError('提交失败', '请输入损失金额');
      // } else {
      // }
      const _list = this.$refs.upload.uploadFiles.map(it => {
        if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
        return '';
      }).filter(it => it);
      this.fromData.LossConfirmPics = _list || [];
      const res = await this.api.getOrderAfterSaleLossConfirm(this.fromData);
      if (res.data.Status === 1000) {
        this.messageBox.successSingle(
          '提交成功',
          () => {
            this.$emit('submit');
          },

          () => {
            this.$emit('submit');
          },
        );
      }
    },
    SaveClick() {
      if (this.fromData.LossAmount === '' || this.fromData.LossAmount === null) {
        this.messageBox.failSingleError('提交失败', '请输入损失金额');
      } else {
        this.SaveDialogVisible = true;
      }
    },
  },
  mounted() {
    this.onInit();
  },
};
</script>

 <style lang='scss'>
   .loss-assessment{
     color: #444444;
     >div{
      h3{
        display: flex;
        align-items: center;
        line-height: 40px;
        span{
          font-size: 14px;
          color: #444444;
          font-weight: 700;
          margin-right: 5px;
        }
        i{
          font-size: 12px;
        }
      }
      &.other-expenses{
        >p{
          margin-bottom: 15px;
          .el-textarea{
            width: 400px;
          }
        }
      }
      &.loss{
        display: flex;
        >p{
          display: flex;
          align-items: center;
          .el-input{
            width: 200px;
          }
          >span{
            margin-left: 5px;
            font-size: 12px;
          }
        }
      }
      &.remark-input{
        >h3{
          i{
            color: #F4A307;
          }
        }
        >p{
          .el-textarea{
            width: 400px;
          }
        }
      }
      &.explain{
        background-color: #F5F5F5;
        border: 1px solid #DCDFE6;
        padding-left: 10px;
        margin-top: 20px;
        font-size: 14px;
        >p{
          padding: 0;
          // margin: 10px 0;
          line-height: 30px;
          i{
            margin-right: 10px;
          }
        }
        .QuestionPicList{
          padding-left: 0;
          margin-top: 0;
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
      &.btns{
        margin-top: 10px;
        >.el-button{
          width: 120px;
          height: 35px;
          padding: 0;
          line-height: 35px;
          border-color: #26BCF9;
          color: #26BCF9;
          &.el-button+.el-button{
            margin-left: 30px;
          }
        }
        >.save-btn{
          background: linear-gradient(to right, #26bcf9, #35dff9);
          border: none;
          color: #fff;
          &:hover{
            opacity: 0.88;
          }
        }
        .check-and-confirm{
          >div{
            width: 400px;
            transform: translateY(-50%);
            .el-dialog__header{
              display: none;
            }
            .el-dialog__body{
              padding-top: 50px;
              padding-bottom: 40px;
              .check-and-confirm-main{
                display: flex;
                align-items: center;
                flex-direction: column;
                .title{
                  color: #F4A307;
                  font-size: 30px;
                  margin: 14px 0 11px 0;
                }
                .msg{
                  color: #444444;
                  font-size: 14px;
                }
              }
            }
            .el-dialog__footer{
              padding-top: 0;
              padding-bottom: 30px;
              text-align: center;
              >div{
                >.el-button{
                  width: 120px;
                  height: 35px;
                  padding: 0;
                  line-height: 35px;
                  border-color: #26BCF9;
                  color: #26BCF9;
                  &.el-button+.el-button{
                    margin-left: 30px;
                  }
                }
                >.save-btn{
                  background: linear-gradient(to right, #26bcf9, #35dff9);
                  border: none;
                  color: #fff;
                  &:hover{
                    opacity: 0.88;
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
