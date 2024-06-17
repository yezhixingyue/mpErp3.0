<template>
  <li class="mp-erp-customer-detail-dialog-authen-info-comp-wrap" v-if="customer">
    <p class="title">
      <img src="@/assets/images/c-a.png" alt="">
      <span>认证信息</span>
    </p>
    <ul class="content">
      <!-- <li>
        <label>企业名称：</label>
        <span>{{customer.AuthenInfo.CompanyName}}</span>
      </li> -->
      <li>
        <label>企业全称：</label>
        <span style="display: flex;">
          <el-tooltip :disabled="customer.CompanyAuthenticationInfo.CompanyName.length < 30"
           :content="customer.CompanyAuthenticationInfo.CompanyName" placement="top">
            <span>{{customer.CompanyAuthenticationInfo.CompanyName}}</span>
          </el-tooltip>
        </span>
      </li>
      <li>
        <label>经营地址：</label>
        <span style="display: flex;">
          <el-tooltip :disabled="sellAddress.length < 30" :content="sellAddress" placement="top">
            <span>{{sellAddress}}</span>
          </el-tooltip>
        </span>
      </li>

      <li>
        <label>证件照：</label>
        <span class="image-box">
          <el-image
          v-for="it in customer.CompanyAuthenticationInfo.CreditPath"
            :key="it"
            :src="it"
            :preview-src-list="customer.CompanyAuthenticationInfo.CreditPath">
          </el-image>
        </span>
      </li>
      <li>
        <label>证件号：</label>
        <span>{{customer.CompanyAuthenticationInfo.CreditCode}}</span>
      </li>
      <li>
        <label>认证状态：</label>
        <span :class="getStates(customer.CompanyAuthenticationInfo.Status).class">
          {{ getStates(customer.CompanyAuthenticationInfo.Status).msg }}
          <span v-if="customer.CompanyAuthenticationInfo.Status === 2 || customer.CompanyAuthenticationInfo.Status === 3">
            （ {{customer.CompanyAuthenticationInfo.CheckUser.Name}} {{customer.CompanyAuthenticationInfo.CheckTime | format2LangTypeDate}} 审核）
          </span>
        </span>
      </li>
      <li v-if="customer.CompanyAuthenticationInfo.Status ===3">
        <label>未通过原因：</label>
        <span class="tooltip-box">
          <el-tooltip class="item" effect="dark"
          :disabled="customer.CompanyAuthenticationInfo.Remark.length<30"
          :content="customer.CompanyAuthenticationInfo.Remark" placement="top">
            <span>{{customer.CompanyAuthenticationInfo.Remark}}</span>
          </el-tooltip>
        </span>
      </li>
      <!-- 待审核 -->
      <li class="btn" v-if="customer.CompanyAuthenticationInfo.Status === 1">
       <el-button size="small" type="primary" @click="passClick">审核通过</el-button>
       <el-button size="small" type="danger" @click="noPassClick">审核不通过</el-button>
      </li>
      <!-- 非待审核-->
      <li class="btn" v-if="customer.CompanyAuthenticationInfo.Status !== 1">
       <el-button @click="changeAuthenticationClick" size="small" type="primary">
        {{ customer.CompanyAuthenticationInfo.Status === 0 ? '添加认证信息': '修改认证信息' }}
      </el-button>
      </li>
    </ul>
    <ImgDisplayDIalog :visible.sync='imgVisible' :url="customer.AuthenInfo.LicensePath" />
    <CommonDialogComp
     width="400px"
     top='30vh'
     title="审核不通过原因"
     :visible.sync="visible"
     cancelText="取消"
     submitText="保存"
     @cancle="visible = false"
     @submit="NoPass"
     @open="NoPassOpen"
   >
     <el-input v-model="NoPassRemark" placeholder="请如实填写不通过原因，填写内容将展示给用户查看。"
      maxlength="100"
      show-word-limit
      :rows="4"
      ref="NoPassRemarkImp"
      type="textarea"></el-input>
   </CommonDialogComp>
    <CommonDialogComp
     width="800px"
     top='10vh'
     title="修改认证信息"
     :visible.sync="changeAuthenticationInfoDialog"
     cancelText="取消"
     submitText="确定"
     @cancle="changeAuthenticationInfoDialog = false"
     @submit="changeAuthenticationSubmit"
     @closed='onClosed'
     class="upload-img"
   >
    <section>
      <el-form label-width="120px">
        <el-form-item label="客户编号：">
          {{customer.CustomerSN}}
        </el-form-item>
        <el-form-item label="客户名称：">
          {{customer.CustomerName}}
        </el-form-item>
        <el-form-item label="认证状态：">
          <span :class="getStates(customer.CompanyAuthenticationInfo.Status).class">
            {{ getStates(customer.CompanyAuthenticationInfo.Status).msg }}
            <span v-if="customer.CompanyAuthenticationInfo.Status === 2 || customer.CompanyAuthenticationInfo.Status === 3">
              （ {{customer.CompanyAuthenticationInfo.CheckUser.Name}} {{customer.CompanyAuthenticationInfo.CheckTime | format2LangTypeDate}} 审核）
            </span>
          </span>
          <!-- {{getStates(customer.CompanyAuthenticationInfo.Status).msg}} -->
        </el-form-item>
        <el-form-item label="未通过原因：" v-if="customer.CompanyAuthenticationInfo.Status === 3">
          {{customer.CompanyAuthenticationInfo.Remark}}
        </el-form-item>
        <el-form-item label="企业全称：" class="is-required">
          <el-input size="small" v-model.trim="submitData.CompanyName"
            placeholder="请输入企业或店铺名称" />
        </el-form-item>
        <el-form-item label="证件号：" class="is-required">
          <el-input size="small" v-model.trim="submitData.CreditCode"
            placeholder="请输入统一社会信用代码或电商店铺编号" />
        </el-form-item>
        <el-form-item label="证件上传：" class="is-required">
          <el-upload
            :action="'/Api/Upload/Image?type=1'"
            list-type="picture-card"
            ref="upload"
            drag
            accept='.png,.jpeg,.jpg,.bmp'
            :multiple='true'
            :limit='2'
            :on-success='handllePictureUploaded'
            :on-preview="handlePictureCardPreview"
            :before-upload='beforeUpload'
            class="upload"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-image-viewer
            style="z-index: 3050;"
             v-if="showViewer"
             :on-close="() => showViewer = false"
             :url-list="PreviewSrc"
          />
          <p>①请上传清晰彩色完整的原件照片，证件各项信息清晰可见容易识别。 <el-button type="text" @click="samplingDialog = true">正确示范</el-button></p>
          <p>②照片支持上传png、jpg、jpeg、bmg格式。</p>
          <p>③最多上传2张照片，单张照片大小不超过20M。</p>
          <el-dialog :visible.sync="samplingDialog" top="1vh" title="正确示范"
          width="1200px" append-to-body
          custom-class="mp-sampling-dialog-comp-wrap">
            <p>
              <span>
                <p>店铺营业执照示例图</p>
                <el-image
                  :src="require('@/assets/images/5392129ed11e5759cc5e0dfca34d664e.png')">
                </el-image>
              </span>
              <span>
                <p>电商经营许可证示例图</p>
                <el-image
                  :src="require('@/assets/images/2cdb6ac4a0b5ac1703b64f7ee7773990.png')">
                </el-image>
              </span>
            </p>
            <span slot="footer" class="dialog-footer">
              <el-button @click="samplingDialog = false">关 闭</el-button>
            </span>
          </el-dialog>
        </el-form-item>
      </el-form>
    </section>
   </CommonDialogComp>
  </li>
</template>

<script>
/* eslint-disable */
import api from '@/api';
import { getNameFromListByIDs } from '@/assets/js/utils/util';
import CommonDialogComp from '@/packages/CommonDialogComp';
import { Message } from 'element-ui';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { CompanyTypeEnumList, CompanyScaleEnumList, CompanyPlaceEnumList } from '../../../../../store/customerManage/Enums';
import ImgDisplayDIalog from './ImgDisplayDIalog.vue';

export default {
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
    getCustomerData: {
      type: Function,
      default: () => null,
    },
    isGetList: {
      type: Function,
      default: () => null,
    },
  },
  components: {
    ImgDisplayDIalog,
    CommonDialogComp,
    ElImageViewer,
  },
  filters: {
    formatType(Type) {
      return getNameFromListByIDs(Type, CompanyTypeEnumList.filter(it => it.ID)) || '--';
    },
    formatPlace(Place) {
      return getNameFromListByIDs(Place, CompanyPlaceEnumList.filter(it => it.ID)) || '--';
    },
    formatScale(Scale) {
      return getNameFromListByIDs(Scale, CompanyScaleEnumList.filter(it => it.ID)) || '--';
    },
  },
  data() {
    return {
      visible: false,
      samplingDialog: false,
      imgVisible: false,
      NoPassRemark: '',

      changeAuthenticationInfoDialog: false,

      showViewer: false,
      PreviewSrc: null,

      submitData: {
        CustomerID: '',
        CompanyName: '',
        CreditCode: '',
        CreditPath: [],
        ChangeWay: 2,
        ensure: false,
      },
    };
  },
  computed: {
    sellAddress() {
      if (this.customer?.AuthenInfo) {
        const { SellArea, DetailAddress } = this.customer.AuthenInfo;
        if (SellArea) {
          const { RegionalName, CityName, CountyName } = SellArea;
          return `${RegionalName || ''}${CityName || ''}${CountyName || ''}${DetailAddress || ''}`;
        }
      }
      return '';
    },
  },
  methods: {
    getStates(status) {
      const _obj = {};
      switch (status) {
        case 1:
          _obj.msg = '待审核';
          _obj.class = 'unreviewed';
          break;
        case 2:
          _obj.msg = '已通过';
          _obj.class = 'verified';
          break;
        case 3:
          _obj.msg = '已拒绝';
          _obj.class = 'not-pass';
          break;

        default:
          _obj.msg = '未认证';
          _obj.class = '';
          break;
      }
      return _obj;
    },
    noPassClick() {
      this.NoPassRemark = '';
      this.visible = true;
    },
    NoPassOpen() {
      setTimeout(() => {
        this.$refs.NoPassRemarkImp.focus();
      }, 50);
    },
    NoPass() {
      if (!this.NoPassRemark) {
        this.messageBox.failSingleError('保存失败', '请输入不通过原因', () => null);
      } else {
        api.getChangeAuthStatus({
          CustomerID: this.customer.CustomerID,
          AuthStatus: 3,
          Remark: this.NoPassRemark,
        }).then(res => {
          if (res.data.Status === 1000) {
            this.visible = false;
            this.getCustomerData();
            this.isGetList(true);
            // this.customer.CompanyAuthenticationInfo.Status = 3;
            // this.customer.CompanyAuthenticationInfo.Remark = this.NoPassRemark;
            // this.$store.commit('customerManage/setCustomerItemSave', [{ ...this.customer, AuthStatus: 3 }, true]);
          }
        });
      }
    },
    onClosed() {
      this.$refs.upload.uploadFiles = [];
    },
    // 修改认证信息点击
    changeAuthenticationClick() {
      this.changeAuthenticationInfoDialog = true;
      const info = this.customer.CompanyAuthenticationInfo;
      if (!info.CustomerID) {
        info.CustomerID = this.customer.CustomerID;
      }
      this.submitData.CustomerID = info.CustomerID;
      this.submitData.CompanyName = info.CompanyName;
      this.submitData.CreditCode = info.CreditCode;
      if (this.submitData.CompanyName) {
        this.submitData.ChangeWay = 1;
      } else {
        this.submitData.ChangeWay = 0;
      }
      setTimeout(() => {
        if (
          info.CreditPath
          && info.CreditPath.length
        ) {
          this.$refs.upload.uploadFiles = info.CreditPath.map((res, i) => ({
            response: {
              Status: 1000, Message: '返回成功', DataNumber: 1, VersionCode: 0, Data: { Url: res },
            },
            size: 0,
            status: 'success',
            uid: new Date().getTime() + i,
            url: `${res}`,
          }));
        }
      }, 50);
    },
    // 提交修改认证信息
    changeAuthenticationSubmit() {
      this.submitData.CreditPath = this.$refs.upload.uploadFiles.map((res) => (res.response.Data.Url));
      if (!this.submitData.CompanyName) {
        this.messageBox.failSingleError('保存失败', '请输入企业或店铺名称');
      } else if (this.submitData.CompanyName.length < 2) {
        this.messageBox.failSingleError('保存失败', '企业全称不能少于2个字');
      } else if (this.submitData.CompanyName.length > 60) {
        this.messageBox.failSingleError('保存失败', '企业全称不能超过60个字');
      } else if (!this.submitData.CreditCode) {
        this.messageBox.failSingleError('保存失败', '请输入统一社会信用代码或电商店铺编号');
      } else if (this.submitData.CompanyName.length > 60) {
        this.messageBox.failSingleError('保存失败', '证件号不能少于2个字');
      } else if (!this.submitData.CreditPath.filter(it => it).length) {
        this.messageBox.failSingleError('保存失败', '请上传证件照');
      } else {
        api.getAuthenticationEdit(this.submitData).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              this.getCustomerData();
              this.isGetList(true);
              this.changeAuthenticationInfoDialog = false;
              // this.$store.commit('customerManage/setCustomerItemSave', [{ ...this.customer, AuthStatus: 2 }, true]);
            };
            this.messageBox.successSingle('保存成功', cb, cb);
          } else if(res.data.Status === 1100){
            const cb = () => {
              this.getCustomerData();
              this.isGetList(true);
            }
            this.messageBox.successSingle('审核成功', cb, cb, '', '', true, `[ ${res.data.Message} ]`,);
          } else {
            this.messageBox.failSingleError('操作失败', `[ ${res.data.Message} ]`);
          }
        });
      }
    },
    passClick() {
      api.getChangeAuthStatus({
        CustomerID: this.customer.CustomerID,
        AuthStatus: 2,
        Remark: '',
      }).then(res => {
        if (res.data.Status === 1000) {
          const cb = () => {
            this.visible = false;
            this.getCustomerData();
            this.isGetList(true);
          };
          this.messageBox.successSingle('审核成功', cb, cb);
        } else if(res.data.Status === 1100){
          const cb = () => {
            this.getCustomerData();
            this.isGetList(true);
          }
          this.messageBox.successSingle('审核成功', cb, cb, '', '', true, `[ ${res.data.Message} ]`,);
        } else {
          this.messageBox.failSingleError('操作失败', `[ ${res.data.Message} ]`);
        }
      });
    },

    handllePictureUploaded(response) {
      if (response.Status !== 1000) {
        Message({
          showClose: true,
          message: response.Message,
          type: 'error',
        });
        this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(it => it.status === 'success' && it.response && it.response.Status === 1000);
      }
    },
    handlePictureCardPreview(file) {
      const tempList = this.$refs.upload.uploadFiles.map(it => it.url);
      const index = tempList.findIndex(it => it === file.url);
      this.PreviewSrc = [...tempList.slice(index), ...tempList.slice(0, index)];
      this.showViewer = true;
    },
    beforeUpload(file) {
      const isLt15M = file.size / 1024 / 1024 < 20;
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
  },
  mounted() {
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-detail-dialog-authen-info-comp-wrap {
  width: 488px;
  height: 330px;
  margin-top: 20px;
  .unreviewed{
    border-color: #f4a307;
    color: #f4a307;
  }
  .verified{
    border-color: #52c41a;
    color: #52c41a;
  }
  .not-pass{
    border-color: #ff3769;
    color: #ff3769;
  }
  > ul {
    padding-left: 25px;
    > li {
      label {
        min-width: 5em !important;
      }
      > div {
        flex: none !important;
      }
      &.btn{
        justify-content: center;
      }
      .el-button{
        width: 120px;
      }
      .el-button+.el-button{
        margin-left: 30px;
      }
      .el-image{
        width: 50px;
        height: 40px;
        margin-right: 10px;
      }
      .image-box{
        display: flex;
        align-items: center;
        .el-image:last-of-type{
          margin-right: 0;
        }
      }
      .tooltip-box{
        height: 25px;
      }
      .el-tooltip{
        display: inline-block;
        width: 100%;
      }
    }
  }
  >.upload-img{
    .el-form-item{
      margin-bottom: 10px;
      .upload{
        width: 320px;
        height: 150px;
        overflow: hidden;
        .el-upload-list__item-status-label{
          display: none;
        }
        .el-upload-dragger{
          width: 100%;
          height: 100%;
          border: none;
        }
      }

      p{
        font-size: 12px;
        font-family: Microsoft YaHei UI-Regular, Microsoft YaHei UI;
        font-weight: 400;
        color: #B7B7B7;
        line-height: 24px;
        &:first-of-type{
          margin-top: 10px;
        }
        .el-button{
          padding: 2px 0;
        }
      }
    }
  }
}
.mp-sampling-dialog-comp-wrap{
  .el-dialog__header{
    position: relative;
    span{
      border-left: 3px solid #4694FF;
      line-height: 19px;
      padding-left: 12px;
    }
    &::after{
      content: '';
      width: calc(100% - 22px);
      height: 1px;
      background-color: #E5E5E5;
      position: absolute;
      display: inline-block;
      left: 11px;
      bottom: 0;
    }
  }
  .el-dialog__body{
    text-align: center;
    padding: 0;
    p{
      display: flex;
      justify-content: space-around;
      margin: 10px;
    }
  }
  .el-dialog__footer{
    padding-top: 0;
  }
  .el-dialog__footer{
    padding-top: 20px;
    text-align: center;
    .el-button{
      border-color: #428DFA;
      color: #428DFA;
      width: 130px;
    }
  }
}
</style>
