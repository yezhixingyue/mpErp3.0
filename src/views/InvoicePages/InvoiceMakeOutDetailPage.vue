<template>
  <section class="mp-erp-invoice-make-out-detail-page-wrap">
    <ApplyDetailContent v-if="detailData" :detailData="detailData" @through="onThroughClick" ref="oDetailContentDom" />
    <!-- <InvoiceMailFormComp v-if="pendingMail" ref="oMailWrap" @submit="submitMail" /> -->
    <InvoiceRejectDialog v-if="pendingCheck||isMakingUp" :visible.sync="rejectVisible" :rejectType="rejectType" :invoiceID="invoiceID" @submit="submitReject" />
    <footer v-if="detailData">
      <el-button v-if="pendingCheck" type="primary" @click="onThroughClick">审核通过</el-button>
      <el-button v-if="pendingCheck" class="cancel-blue-btn" @click="onRejectClick('reject')">驳回</el-button>
      <el-button v-if="isMakingUp" type="primary" @click="onMakeoutlick">开票完成</el-button>
      <el-button v-if="isMakingUp" class="cancel-blue-btn" @click="onRejectClick('cancel')">取消</el-button>
      <!-- <el-button v-if="pendingMail" type="primary" @click="$refs.oMailWrap.submitForm()">提交</el-button> -->
      <el-button class="cancel-blue-btn" @click="goback">返回</el-button>
    </footer>
  </section>
</template>

<script>
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import ApplyDetailContent from '../../packages/InvoiceComps/ApplyDetailContent/index.vue';
import InvoiceHandlerClass from '../../store/invoice/InvoiceHandlerClass';
import { InvoiceStatusEnums, InvoiceTypeEnums } from '../../packages/InvoiceComps/enums';
// import InvoiceMailFormComp from '../../components/InvoiceComps/Detail/InvoiceMailFormComp';
import InvoiceRejectDialog from '../../components/InvoiceComps/Detail/InvoiceRejectDialog.vue';

export default {
  name: 'InvoiceMakeOutDetailPage',
  mixins: [recordScrollPositionMixin('main.page-wrap')],
  components: {
    ApplyDetailContent,
    // InvoiceMailFormComp,
    InvoiceRejectDialog,
  },
  data() {
    return {
      invoiceID: '',
      detailData: null, // 会对订单详情进行修改，主要修改的内容如上
      invoiceHandler: null,
      rejectVisible: false,
      rejectType: '', // 类型： reject|cancel 驳回或者取消
    };
  },
  computed: {
    pendingCheck() { // 审核中  显示 审核通过和驳回 按钮
      if (this.detailData) {
        return this.detailData.InvoiceStatus === InvoiceStatusEnums.pendingCheck.ID;
      }
      return false;
    },
    isMakingUp() { // 开票中 可以点击开票完成
      if (this.detailData) {
        return this.detailData.InvoiceStatus === InvoiceStatusEnums.makingUp.ID;
      }
      return false;
    },
    pendingMail() { // 等待邮寄中 可以填写邮寄信息并提交
      if (this.detailData) {
        return this.detailData.InvoiceStatus === InvoiceStatusEnums.haveMaked.ID && this.detailData.InvoiceType === InvoiceTypeEnums.special.ID;
      }
      return false;
    },
  },
  methods: {
    async getDetailData() {
      if (!this.invoiceID && this.invoiceID !== 0) return;
      const resp = await this.api.getInvoiceManageHandleDetail(this.invoiceID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.detailData = resp.data.Data;
        // this.detailData = { ...resp.data.Data, InvoiceStatus: 0 };
        this.invoiceHandler = new InvoiceHandlerClass(this.detailData);
        // this.invoiceHandler.syncForStore(); // 根据详情数据对列表项状态进行更新 -------------  是否要这样做？ 因为其可能不会是最新的状态 -- 可能会产生误导 此处不处理 仅在操作成功后改动
      }
    },
    goback() {
      this.$goback();
    },
    onRejectClick(type) { // 驳回 或 取消
      this.rejectType = type;
      this.rejectVisible = true;
    },
    onMakeoutlick() { // 开票完成
      this.messageBox.warnCancelNullMsg('确定开票完成吗', () => {
        this.invoiceHandler.makeout();
      });
    },
    onThroughClick() { // 通过审核
      this.messageBox.warnCancelNullMsg('确定通过审核吗', () => {
        this.invoiceHandler.auditPass();
      });
    },
    submitReject(e) { // 驳回
      if (!e) return;
      switch (this.rejectType) {
        case 'reject':
          this.invoiceHandler.reject(e);
          break;
        case 'cancel':
          this.invoiceHandler.cancel(e);
          break;
        default:
          break;
      }
    },
    submitMail(e) { // 邮寄
      this.messageBox.warnCancelNullMsg('确定邮寄该发票吗', () => {
        this.invoiceHandler.mail(e);
      });
    },
  },
  created() {
    this.invoiceID = this.$route.params.invoiceID;
  },
  mounted() {
    this.getDetailData();
  },
};
</script>
<style lang='scss'>
.mp-erp-invoice-make-out-detail-page-wrap {
  padding: 20px;
  padding-left: 25px;
  padding-bottom: 30px;
  width: 960px;
  font-size: 14px;
  > .mail-info {
    margin-top: 10px;
    margin-bottom: 20px;
    > p.blue-v-line {
      margin-bottom: 20px;
    }
    > .mail-form-inline {
      display: flex;
      justify-content: space-between;
      .el-form-item {
        margin-right: 0;
        .el-form-item__label {
          font-size: 14px;
          font-weight: 700;
        }
        .el-form-item__content {
          .el-input {
            width: 280px;
            input {
              height: 30px;
              border-radius: 3px;
            }
          }
        }
      }
    }
  }
  > footer {
    > button {
      width: 120px;
      height: 30px;
      padding: 0;
      border-radius: 3px;
      & + .el-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
