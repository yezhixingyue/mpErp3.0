<template>
  <div class="apply-after-sales">
    <div v-if="productInfo">
      <p class="apply-after-sales-title">订单编号:{{productInfo.OrderID}} </p>
      <el-table el-table stripe border
        :data="[productInfo]" style="width: 100%" class="ft-14-table">
        <el-table-column prop="ProductName" label="商品名称" min-width="156" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ProductName" label="物料" min-width="168" show-overflow-tooltip>
          <span slot-scope="scope">{{scope.row.MaterialList | formatListItemMaterial}}</span>
        </el-table-column>
        <el-table-column label="尺寸" show-overflow-tooltip min-width="148">
          <span slot-scope="scope" v-if="scope.row.SizeList.length">{{ scope.row.SizeList | formatListItemSize }}</span>
        </el-table-column>
        <el-table-column label="数量" min-width="68" show-overflow-tooltip>
          <span slot-scope="scope">{{ scope.row.ProductAmount }}{{ scope.row.Unit }}</span>
        </el-table-column>
        <el-table-column label="款数" min-width="48" show-overflow-tooltip>
          <span slot-scope="scope">{{ scope.row.KindCount }}款</span>
        </el-table-column>
        <el-table-column label="工艺" show-overflow-tooltip min-width="64">
          <span slot-scope="scope" v-if="scope.row.CraftList && scope.row.CraftList.length">{{ scope.row.CraftList | formatListItemSize }}</span>
        </el-table-column>
        <el-table-column prop="Content" label="文件内容" min-width="146" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinalPrice" label="成交价" min-width="85" show-overflow-tooltip>
          <span slot-scope="scope">{{scope.row.FinalPrice ? `${scope.row.FinalPrice}元` : ''}}</span>
        </el-table-column>
        <el-table-column prop="OrderID" label="运费" min-width="58" show-overflow-tooltip>
          <span slot-scope="scope">{{scope.row.Freight}}元</span>
        </el-table-column>
        <el-table-column prop="OrderID" label="总计" min-width="88" show-overflow-tooltip>
          <span slot-scope="scope">
            <b class="is-pink">
              {{scope.row.Freight + scope.row.FinalPrice}}元
            </b>
          </span>
        </el-table-column>
        <el-table-column prop="OrderID" label="已售后(含运费)" min-width="110" show-overflow-tooltip>
          <span slot-scope="scope">{{scope.row.AfterSaleAmount || 0}}元</span>
        </el-table-column>
      </el-table>
      <div class="apply-after-sales-main">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
          <el-form-item label="诉求意向：" prop="AppealType">
            <div class="intention">
              <span :class="ruleForm.AppealType===7 ? 'action' : ''" @click="ruleForm.AppealType = 7">补印</span>
              <span :class="ruleForm.AppealType===2 ? 'action' : ''" @click="ruleForm.AppealType = 2">退款2</span>
              <span :class="ruleForm.AppealType===3 ? 'action' : ''" @click="ruleForm.AppealType = 3">退款3</span>
              <span :class="ruleForm.AppealType===255 ? 'action' : ''" @click="ruleForm.AppealType = 255">其它</span>
            </div>
          </el-form-item>

          <template>
            <el-form-item class="QuestionTypeList" label="问题类型：" prop="QuestionTypeList" style="margin-bottom:0">
              <ul class="check-button">
                <li v-for="(item, index) in ApplyQuestionList"
                  :key="index">
                  <div class="box" :class="isAction(item.ID)?'action':''"
                  @click="onCheck(item.ID)">{{item.Title}}</div>
                  <span @click.stop="onSeeQuestion(item)"><i class="iconfont icon-zhushi"></i></span>
                </li>
              </ul>
            </el-form-item>

            <!--  -->

            <el-form-item label="问题描述：" prop="QuestionRemark" class="QuestionRemark">
              <el-input type="textarea" v-model="ruleForm.QuestionRemark"
              :row="8"
              maxlength="300" autosize show-word-limit placeholder="请输入具体问题描述"></el-input>
            </el-form-item>

            <el-form-item label="上传图片：" prop="QuestionPicList" class="QuestionPicList" :required='isUpImg'>
              <el-upload
                :action="'/Api/Upload/Image?type=3'"
                list-type="picture-card"
                ref="upload"
                drag
                accept='.png,.jpeg,.jpg,.bmp,.gif'
                :multiple='true'
                :limit='9'
                :on-success='handllePictureUploaded'
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :before-upload='beforeUpload'
                :class="{'uploadDisabled':uploadDisabled}"
                >
                <!-- :on-success='handllePictureUploaded'
                :on-remove="handleRemove" -->
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" top="8vh" title="查看图片" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <!-- <p v-if="!canEdit && fileList.length === 0">未上传照片</p> -->
              <p class="is-font-12 gray upload-Remark">1、拍照时请将成品10份以上呈平铺或扇形展开，并对产品的包装、标签、整体、问题局部特写等多角度拍摄，为您带来麻烦，深表歉意！</p>
              <p class="is-font-12 gray upload-Remark">2、照片支持bmp、gif、png、jpg、jpeg，最多可上传9张图片，每张图片大小不超过15M。</p>
              <p class="is-font-12 gray upload-Remark">3、上传凭证说明:为快速为您解决售后问题，请上传“问题细节、问题多张、产品整体”等至少三张照片。</p>
              <p class="is-font-12 gray upload-Remark">4、若服务方式为第三方“快递或快运”类订单需补充“快递面单、货物标签、第三方交易详情”等相关凭证;</p>
            </el-form-item>
          </template>
        </el-form>
        <div class="line"></div>
        <div class="contact-information">
          <el-form
            label-position="left" :model="ruleForm"
            :rules="rules" ref="ruleForm2" label-width="94px" class="demo-ruleForm">
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
          </el-form>
        </div>
        <div class="btn-box">
          <el-button type="primary" class="is-blue-button" @click="submitForm()" >立即提交</el-button>
          <el-button  @click="handleCancel">
            <em style="margin-left: 6px">返回</em>
          </el-button>
        </div>
      </div>
      <CommonDialogComp
        width="500px"
        top='30vh'
        :title="SeeQuestionData?.Title || ''"
        :visible="SeeQuestionShow"
        cancelText='关闭'
        :showSubmit="false"
        @cancle="SeeQuestionShow = false"
        class="mp-see-questionShow-comp-wrap"
      >
        <template>
          {{SeeQuestionData?.Title}}
        </template>
      </CommonDialogComp>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import CommonDialogComp from '@/packages/CommonDialogComp';
import {
  mapState,
} from 'vuex';

export default {
  data() {
    const validateQuestionTypeList = (rule, value, callback) => {
      if (value?.length === 0) {
        callback(new Error('请选择问题类型'));
      } else {
        callback();
      }
    };
    const QuestionPicList = (rule, value, callback) => {
      const _list = this.$refs.upload.uploadFiles.map(it => {
        if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
        return '';
      }).filter(it => it);
      if (this.isUpImg && (_list.length === 0 || _list[0] === '')) {
        callback(new Error('请上传问题图片'));
      } else {
        callback();
      }
    };
    return {
      SeeQuestionData: null,
      SeeQuestionShow: false,
      productInfo: null,
      fileList: [],
      dialogVisible: false,
      uploadDisabled: false,
      dialogImageUrl: '',
      ruleForm: {
        OrderID: 0, // 订单号
        Source: 1, // 下单类型
        AppealType: null, // 诉求意向
        QuestionTypeList: [], // 问题类型数组
        QuestionRemark: '', // 问题描述
        QuestionPicList: [''], // 问题图片
        ContactName: '', // 联系人
        QQ: '', // QQ号码
        Mobile: '', // 电话

      },
      rules: {
        QuestionTypeList: [
          { required: true, message: '请选择售后原因', trigger: 'change' },
          { validator: validateQuestionTypeList, trigger: 'blur' },
        ],
        QuestionRemark: [
          { required: true, message: '请输入具体问题描述', trigger: 'change' },
          {
            min: 3, max: 300, message: '长度在 3 到 300 个字符', trigger: 'change',
          },
        ],
        QuestionPicList: [
          { validator: QuestionPicList, trigger: 'change' },
          { required: false, message: '请上传问题图片', trigger: 'change' },
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
        QQ: [
          { pattern: /[1-9][0-9]{4,14}/, message: 'QQ号码格式不正确', trigger: 'blur' },
        ],
      },
      ApplyQuestionList: null,
    };
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    ...mapState('orderModule', ['orderListData', 'OrderStatusList', 'expressArr', 'areaList', 'orderTotalCount', 'orderListCanLoadMore', 'orderDataLoading']),
    isAction() {
      return (key) => this.ruleForm.QuestionTypeList.findIndex((it) => it === key) + 1;
    },
    isUpImg() {
      if (!this.ApplyQuestionList) {
        return false;
      }
      const ActionQuestionList = this.ApplyQuestionList.filter(res => this.ruleForm.QuestionTypeList.find(item => item === res.ID));
      return ActionQuestionList.filter(res => res.IsUploadPic).length !== 0;
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
      this.$refs.ruleForm1.validateField('QuestionTypeList');
      this.$refs.ruleForm1.validateField('QuestionPicList');
    },
    onSeeQuestion(item) {
      console.log(item);
      this.SeeQuestionData = item;
      this.SeeQuestionShow = true;
    },
    open() {
      this.api.getCustomerInfo(this.productInfo.CustomerID).then(res => {
        if (res.data.Status === 1000) {
          this.ruleForm.QQ = res.data.Data.QQ;
          this.ruleForm.Mobile = res.data.Data.Mobile;
          this.ruleForm.ContactName = res.data.Data.CustomerName;
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    setUploadDisabled() {
      const _list = this.$refs.upload?.uploadFiles?.map(it => {
        if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
        return '';
      }).filter(it => it);
      if ((!_list) || _list.length < 9) {
        this.uploadDisabled = false;
      } else {
        this.uploadDisabled = true;
      }
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
      this.$refs.ruleForm1.validateField('QuestionPicList');
      this.setUploadDisabled();
    },
    handleRemove() {
      this.setUploadDisabled();
      this.$refs.ruleForm1.validateField('QuestionPicList');
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
    resetForm() {
      this.$refs.ruleForm1.resetFields();
      this.uploadDisabled = false;
      if (!this.$refs.ruleForm2) return;
      this.$refs.ruleForm2.resetFields();
    },
    async submitForm() {
      this.$refs.ruleForm1.validate();
      this.$refs.ruleForm2.validate();
      const MobileReg = /^1[3456789]\d{9}$/;
      const QQRege = /[1-9][0-9]{4,14}/;
      if (this.ruleForm.QuestionTypeList.length === 0) {
        this.messageBox.failSingleError('提交失败', '请选择问题类型');
      } else if (this.ruleForm.QuestionRemark === '') {
        this.messageBox.failSingleError('提交失败', '请输入问题描述');
      } else if (this.ruleForm.QuestionRemark.length < 3 || this.ruleForm.QuestionRemark.length > 300) {
        this.messageBox.failSingleError('提交失败', '请输入3到300字的问题描述');
      } else if (this.ruleForm.ContactName === '') {
        this.messageBox.failSingleError('提交失败', '请输入联系人');
      } else if (this.ruleForm.Mobile === '') {
        this.messageBox.failSingleError('提交失败', '请输入联系电话');
      } else if (!MobileReg.test(this.ruleForm.Mobile)) {
        this.messageBox.failSingleError('提交失败', '请输入正确的联系电话');
      } else if (this.ruleForm.QQ && !QQRege.test(this.ruleForm.QQ)) {
        this.messageBox.failSingleError('提交失败', 'QQ号码格式不正确');
      } else {
        const _list = this.$refs.upload.uploadFiles.map(it => {
          if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
          return '';
        }).filter(it => it);
        if (this.isUpImg && !_list.length) {
          this.messageBox.failSingleError('提交失败', '请上传问题图片');
          return;
        }
        this.ruleForm.QuestionPicList = _list || [];
        this.ruleForm.OrderID = this.productInfo.OrderID;
        const res = await this.api.getApplyQuestionApply(this.ruleForm);
        if (res.data.Status === 1000) {
          this.messageBox.successSingle(
            '提交成功',
            () => {
              console.log('ssss');
              const index = this.orderListData.findIndex(it => it.OrderID === this.ruleForm.OrderID);
              if (index !== -1) {
                this.$store.commit('orderModule/changeAllowAfterSaleOrderListData', [index, false]);
              }
              this.handleCancel();
            },
            () => null,
          );
        }
      }
    },
    ApplyQuestionCheckChange(keys) {
      this.ruleForm.QuestionTypeList = keys;
      this.$refs.ruleForm1.validateField('QuestionTypeList');
    },
    handleCancel() {
      this.resetForm();
      this.$router.replace('/orderManage');
    },
  },
  mounted() {
    this.productInfo = this.$route.params.ServiceAfterSales;
    console.log(this.productInfo);
    this.api.getApplyQuestionList().then(res => {
      if (res.data.Status === 1000) {
        this.ApplyQuestionList = res.data.Data;
        this.open();
      }
    });
  },
};
</script>

<style lang='scss'>
.apply-after-sales{
  height: 100%;
  padding: 0 8px;
  background-color: #f5f5f5;
  >div{
    background-color: #fff;
    height: 100%;
    padding: 0 20px;
  }
  .apply-after-sales-title{
    line-height: 16px;
    text-align: left;
    font-size: 14px;
    color: #444444;
    font-weight: 700;
    padding-top: 20px;
  }
  .el-table {
    margin-top: 20px;
    border-top-color: rgb(230, 230, 230);
    border-left: 1px solid rgb(230, 230, 230);
    .el-table__header-wrapper thead tr th {
      .cell {
        line-height: 36px;
        font-size: 14px;
      }
      // &.menu-column {
        // text-align: left;
        // padding-left: 120px;
      // }
    }
    .el-table__body-wrapper {
      .el-table__row {
        width: 100%;
        > td {
          > .cell {
            font-size: 12px;
            height: 30px;
            color: #585858;
          }
        }
      }
    }
  }
  .apply-after-sales-main {
    margin-top: 20px;
    // min-height: 745px;
    > .line{
      border-bottom: 1px dashed #EEEEEE;
      margin-top: -16px;
      margin-bottom: 30px;
    }
    .contact-information{
      // 联系人
      .el-form{
        display: flex;
        flex-wrap: wrap;
        padding-left: 96px;
        .el-form-item{
          width: 350px
        }
        .el-input{
          height: 30px;
          width: 180px;
          font-size: 14px;
          input{
            width: 100%;
            height: 100%;
          }
          margin-right: 140px;
        }
      }
      .el-form-item{
        .el-form-item__content{
          line-height: 32px;
        }
      }
    }
    .el-form-item{
      color: #585858;
      margin-bottom: 20px;
      .el-form-item__content{
        color: #888888;
        .el-textarea{
          .el-input__count{
            width: calc(100% - 22px);
            background: #fff;
            height: 12px;
            line-height: 12px;
            bottom: 1px;
            text-align: right;
            right: 20px;
            padding-bottom: 3px;
          }
        }
      }
      .el-form-item__error{
        top: calc(100% - 5px);
      }
    }
    .el-form-item__label{
      color: #585858;
      font-weight: 700;
      padding-bottom: 0;
      line-height: 32px;
    }
    .el-form-item__label:before {
      color: #FEB829 !important;
    }
    // 诉求意向
    .intention{
      display: flex;
      height: 32px;
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
        line-height: 30px;
        margin: 0px 35px 15px 0;
        text-align: center;
        color: #888888;
        position: relative;
        >span{
          position: absolute;
          right: -25px;
          top: 0;
          cursor:pointer;
          &:hover{
            color: #428DFA;
          }
        }
        >div{
          border-radius: 5px;
          border: 1px solid #E6E6E6;
        }
        >div:hover{
          cursor:pointer;
          color: #428DFA;
          border-color: #428dfa;
          background-color: #EBF0FE;
        }
      }
    }

    .QuestionTypeList{
      .el-form-item__error{
        top: calc(100% - 15px);
      }
    }
    .QuestionRemark{
      .el-form-item__error{
        top: calc(100%);
      }
      .el-textarea{
        max-width: 1243px;
        textarea{
          min-height: 160px !important;
        }
      }
    }
    .make-up-for{
      .el-form-item__error{
        top: calc(100% - 2px);
      }
    }
    .QuestionPicList{
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
        top: calc(100% - 95px);
      }
      .upload-Remark{
        margin-top: -10px;
        line-height: 2em;
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
}
</style>
