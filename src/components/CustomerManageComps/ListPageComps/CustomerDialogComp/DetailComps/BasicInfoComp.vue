<template>
  <li class="mp-erp-customer-detail-dialog-basic-info-comp-wrap">
    <p class="title">
      <img src="@/assets/images/c-b.png" alt="">
      <span>基本信息</span>
    </p>
    <ul class="content">
      <li>
        <div style="width: 165px">
          <label>编号：</label>
          <span>{{customer.CustomerSN}}</span>
        </div>
        <div>
          <label>名称：</label>
          <span class="is-bold" :title="customer.CustomerName">{{customer.CustomerName}}</span>
        </div>
      </li>
      <li>
        <div style="width: 165px">
          <label>手机号：</label>
          <span>{{customer.Mobile}}</span>
        </div>
        <div>
          <label>QQ号：</label>
          <span>{{customer.QQ || '--'}}</span>
        </div>
      </li>
      <li>
        <label>审核人：</label>
        <template v-if="customer.AuthenInfo.CheckUser.StaffName">
          <span>
            <template>{{customer.AuthenInfo.CheckUser.StaffName}}</template>
            <i v-if="customer.AuthenInfo.CheckTime" class="is-gray"> ( {{customer.AuthenInfo.CheckTime | format2LangTypeDate}}审核 )</i>
          </span>
        </template>
        <template v-else>
          <span class="">--</span>
        </template>
      </li>
      <li>
        <label>最后登录：</label>
        <template v-if="customer.LastLoginTime">
          <span>
            <template>{{customer.LastLoginTime | format2LangTypeDate}}</template>
            <template v-if="customer.LastLoginIP"> ( IP：{{customer.LastLoginIP}} )</template>
          </span>
        </template>
        <span v-else>--</span>
      </li>
      <li>
        <label>状态：</label>
        <span :class="{
          'is-success': customer.Status === CustomerStatusEnum.Nomal.ID,
          'is-pink': customer.Status === CustomerStatusEnum.Freezed.ID || customer.Status === CustomerStatusEnum.FullPayment.ID,
        }">{{customer.Status | formatStatus}}
          <i v-if="customer.Status === CustomerStatusEnum.Freezed.ID">
            （{{customer.CustomerFreezeInfo.FreezeName }} {{ customer.CustomerFreezeInfo.FreezeTime | format2LangTypeDate }}）
          </i>
          <i v-if="customer.Status === CustomerStatusEnum.FullPayment.ID">
            （{{customer.CustomerFreezeInfo.FreezeName }} {{ customer.CustomerFreezeInfo.FreezeTime | format2LangTypeDate }}）
          </i>
        </span>
      </li>
      <li style="margin: -10px 0; ">
        <label></label>
        <span style="display: flex;">
          <!-- {{customer.CustomerFreezeInfo.FreezeDescribe }} -->
          <el-tooltip effect="dark" :content="customer.CustomerFreezeInfo.FreezeDescribe" placement="top">
            <span>
              {{customer.CustomerFreezeInfo.FreezeDescribe }}
            </span>
          </el-tooltip>
        </span>
      </li>
    </ul>
    <div class="footer">
      <el-button
       :type="isFullPayment ? 'danger' : 'primary'"
       size="small" @click="onChangeStatusClick('FullPayment')"
       v-if="!disabled"
       :disabled="customer.Status === CustomerStatusEnum.Freezed.ID || disabled">
        {{isFullPayment ? '解除支付全款' : '支付全款'}}
      </el-button>
      <el-button
       :type="isFreezed ? 'danger' : 'primary'"
       size="small" @click="onChangeStatusClick('Freezed')"
       v-if="!disabled"
       :disabled="disabled">
        {{isFreezed ? '解除冻结' : '冻结'}}
      </el-button>
      <CommonDialogComp
        width="500px"
        top='30vh'
        title="冻结用户"
        :visible="freezeVisible"
        @cancle="onCancle"
        @submit="onSubmit"
        class="freeze-dialog"
      >
        <p><img src="@/assets/images/warn.png" alt="">
          {{ StatusType === 'FullPayment' ? '确定要修改为支付全款吗？' : '确定要冻结用户吗？' }}
        </p>
        <div class="form">
          <div class="form-item">
            <i>客户姓名:</i><span style="font-weight: 400;">{{this.customer.CustomerName}}（{{this.customer.CustomerSN}}）</span>
          </div>
          <div class="form-item required">
            <i>{{ StatusType === 'FullPayment' ? '全款' : '冻结' }}原因:</i><el-input v-model.trim="CheckDescribe"
            :rows="6" type="textarea" :placeholder="`请在此输入客户${ StatusType === 'FullPayment' ? '全款' : '冻结' }原因...`" maxlength="100" show-word-limit></el-input>
          </div>
        </div>
      </CommonDialogComp>
    </div>
  </li>
</template>

<script>
import { getNameFromListByIDs } from '@/assets/js/utils/util';
import { CustomerStatusEnum, CustomerStatusEnumList } from '../../../../../store/customerManage/Enums';
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    formatStatus(status) {
      return getNameFromListByIDs(status, CustomerStatusEnumList) || '--';
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      CustomerStatusEnum,
      CheckDescribe: '',
      freezeVisible: false,
      StatusType: false,
    };
  },
  computed: {
    isFreezed() { // 是否为冻结状态
      return this.customer && this.customer.Status === CustomerStatusEnum.Freezed.ID;
    },
    isFullPayment() { // 是否为支付全款状态
      return this.customer && this.customer.Status === CustomerStatusEnum.FullPayment.ID;
    },
  },
  methods: {
    onChangeStatusClick(StatusType) { // 点击操作按钮
      // StatusType = 'FullPayment' || 'Freezed'
      this.StatusType = StatusType;
      if (!this.customer) return;
      let title = '';
      let msg = '';
      if (StatusType === 'FullPayment') { // 支付全款
        if (this.customer.Status === CustomerStatusEnum.Nomal.ID) { // 冻结用户
          this.CheckDescribe = '';
          this.freezeVisible = true;
        } else if (this.isFullPayment) { // 解冻
          title = '确定要解除支付全款吗？';
          msg = `解除支付全款用户：${this.customer.CustomerName}`;
          if (title && msg) {
            this.messageBox.warnCancelBox(title, msg, () => {
              const Status = this.isFullPayment ? CustomerStatusEnum.Nomal.ID : CustomerStatusEnum.FullPayment.ID;
              this.handleFreezedOrNot(Status);
            }, null);
          }
        }
      } else if (this.customer.Status === CustomerStatusEnum.Nomal.ID || this.customer.Status === CustomerStatusEnum.FullPayment.ID) { // 冻结用户
        title = '确定要冻结用户吗？';
        msg = `冻结用户：${this.customer.CustomerName}`;
        this.CheckDescribe = '';
        this.freezeVisible = true;
      } else if (this.isFreezed) { // 解冻
        title = '确定要解除冻结用户吗？';
        msg = `解除冻结用户：${this.customer.CustomerName}`;
        if (title && msg) {
          this.messageBox.warnCancelBox(title, msg, () => {
            const Status = this.isFreezed ? CustomerStatusEnum.Nomal.ID : CustomerStatusEnum.Freezed.ID;
            this.handleFreezedOrNot(Status);
          }, null);
        }
      }
    },
    onCancle() { // 冻结取消
      this.freezeVisible = false;
    },
    onSubmit() { // 冻结确定
      if (!this.CheckDescribe) {
        this.messageBox.failSingleError('保存失败', '请输入冻结原因');
        return;
      }
      this.freezeVisible = false;
      let Status;
      if (this.StatusType === 'FullPayment') {
        Status = this.isFreezed ? CustomerStatusEnum.Nomal.ID : CustomerStatusEnum.FullPayment.ID;
      } else {
        Status = this.isFreezed ? CustomerStatusEnum.Nomal.ID : CustomerStatusEnum.Freezed.ID;
      }
      this.handleFreezedOrNot(Status, this.CheckDescribe);
    },

    async handleFreezedOrNot(Status, CheckDescribe = '') { // 冻结与解冻操作
      if (!this.customer || !this.customer.CustomerID || (!Status && Status !== 0)) return;
      const temp = { CustomerID: this.customer.CustomerID, Status, CheckDescribe };
      const resp = await this.api.getCustomerChangeStatus(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        let title;
        if (this.StatusType === 'FullPayment') {
          title = this.isFullPayment ? '解除支付全款成功' : '支付全款成功';
        } else {
          title = this.isFreezed ? '解冻成功' : '冻结成功';
        }
        const cb = () => {
          this.$emit('changeStatus');
        };
        this.messageBox.successSingle(title, cb, cb);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-detail-dialog-basic-info-comp-wrap {
  width: 322px;
  height: 270px;
  > ul {
    > li {
      label {
        min-width: 5em !important;
      }
    }
  }
  .freeze-dialog{
    .el-dialog__header{
      height: 20px;
      padding: 0;
      .el-dialog__title{
        display: none;
      }
      &::after{
        width: 0;
      }
    }
    .el-dialog__body{
      padding: 0 84px;
      color: #444444;
      font-weight: 700;
      >p{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        img{
          width: 45px;
          height: 45px;
          margin-right: 10px;
        }
      }
      >.form{
        .form-item{
          display: flex;
          margin-top: 20px;
          i{
            min-width: 68px;
            text-align: right;
            margin-right: 4px;
          }
          .el-input__count{
            font-weight: 400;
          }
          &.required{
            i{
              margin-top: 6px;
              &::before{
                content: '*';
                color: red;
              }
            }
          }
        }
      }
    }
  }
}
</style>
