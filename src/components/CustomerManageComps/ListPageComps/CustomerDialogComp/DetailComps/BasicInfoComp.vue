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
          'is-pink': customer.Status === CustomerStatusEnum.Freezed.ID,
          'is-gray': customer.Status === CustomerStatusEnum.Deleted.ID,
        }">{{customer.Status | formatStatus}}</span>
      </li>
    </ul>
    <div class="footer">
      <el-button :type="isFreezed ? 'danger' : 'primary'" size="small" @click="onFreezedClick" :disabled="customer.Status === CustomerStatusEnum.Deleted.ID">
        {{isFreezed ? '解除冻结' : '冻结'}}
      </el-button>
    </div>
  </li>
</template>

<script>
import { getNameFromListByIDs } from '@/assets/js/utils/util';
import { CustomerStatusEnum, CustomerStatusEnumList } from '../../../../../store/customerManage/Enums';

export default {
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
  },
  filters: {
    formatStatus(status) {
      return getNameFromListByIDs(status, CustomerStatusEnumList) || '--';
    },
  },
  data() {
    return {
      CustomerStatusEnum,
    };
  },
  computed: {
    isFreezed() { // 是否为冻结状态
      return this.customer && this.customer.Status === CustomerStatusEnum.Freezed.ID;
    },
  },
  methods: {
    onFreezedClick() { // 点击操作按钮
      if (!this.customer) return;
      let title = '';
      let msg = '';
      if (this.customer.Status === CustomerStatusEnum.Nomal.ID) { // 冻结用户
        title = '确定要冻结用户吗？';
        msg = `冻结用户：${this.customer.CustomerName}`;
      } else if (this.isFreezed) { // 解冻
        title = '确定要解除冻结用户吗？';
        msg = `解除冻结用户：${this.customer.CustomerName}`;
      }
      if (title && msg) {
        this.messageBox.warnCancelBox(title, msg, () => {
          const Status = this.isFreezed ? CustomerStatusEnum.Nomal.ID : CustomerStatusEnum.Freezed.ID;
          this.handleFreezedOrNot(Status);
        }, null);
      }
    },
    async handleFreezedOrNot(Status) { // 冻结与解冻操作
      if (!this.customer || !this.customer.CustomerID || (!Status && Status !== 0)) return;
      const temp = { CustomerID: this.customer.CustomerID, Status };
      const resp = await this.api.getCustomerChangeStatus(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const title = this.isFreezed ? '解冻成功' : '冻结成功';
        const cb = () => {
          this.$emit('changeStatus', Status);
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
}
</style>
