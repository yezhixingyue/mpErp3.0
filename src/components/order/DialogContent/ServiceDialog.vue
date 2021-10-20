<template>
  <el-dialog
    title="售后处理"
    :visible.sync="isShowServiceDia"
    :modal-append-to-body='false'
    width="1000px"
    :modal='false'
    custom-class="dialog-to-order-service-box mp-img-style-header"
    top="6vh"
    center :close-on-press-escape='false'
    :before-close="handleClose" :close-on-click-modal='false'
    v-dialogDrag
  >
    <template v-if="!isLoading">
      <OrderServiceEditCord :orderData='orderDetailData' :Customer='curCustomerInfo2Service'
        :ServiceHistory='curServiceOrderHistory'
        :curProductInfoStringify='curProductInfoStringify' />
      <!-- 顶部信息 -->
      <div class="download-btn" v-if="orderDetailData && orderDetailData.FilePath">
        <normalBtn @click.native="handleDownLoad(orderDetailData)" title="下载文件" />
        <!-- <a :href="'http://192.168.3.68:8055'
         + '/File/20200613/75dce5d550e227b764e9fed669976be19bea7936.cdr'" download="w3logo">下载文件 aaaaa</a> -->
      </div>
      <section class="question-photo">
        <!-- 问题照片 -->
        <header class="right-line">
          <VTypeTitle :imgSrc="require('@/assets/images/photo.png')" title="问题照片" />
        </header>
        <main>
          <div class="submit-img-box">
            <ServiceBlueBtn multiple @click.native="onuploadclick" :func="uploadImg" />
            <span class="explain">最多上传4张照片，支持.jpg .png .bmp</span>
          </div>
          <DisplayPictrue :delFunc='delServiceImgByIndex' :imgList='serviceImgList' />
        </main>
      </section>

      <section class="service-after-sale">
        <!-- 售后处理 -->
        <header class="right-line">
          <VTypeTitle :imgSrc="require('@/assets/images/service2.png')" title="售后处理" />
        </header>
        <main>
          <div class="left-table">
            <EditDiaLeftTable :tableData='OrderPackageListTableData' />
          </div>
          <div class="right-submit-wrap">
            <EditDiaRightSubmit :status='orderDetailData && orderDetailData.Status' />
          </div>
        </main>
      </section>
      <span slot="footer" class="dialog-footer">
        <div class="loss-box">
          <span class="title">损失金额：</span>
          <input :class="lossesFund.err ? 'is-warn' : ''"
            v-model="lossesNum" @input="onLossInput" type="text" placeholder="请输入损失金额">
          <span>元</span>
        </div>
        <div class="err-wrap" v-if="serviceErrInfo">{{serviceErrInfo}}</div>
        <div class="btns">
          <normalBtn @click.native="handleClose" title="取消" />
          <normalBtnFull @click.native="submitServiceOrder" title="提交" />
        </div>
        <div v-if="percentage" class="mask"></div>
        <el-progress v-if="percentage" :class="percentage > 95 ? 'will-over' : ''"
          :format='formatElementPercentage'
          :show-text='true' text-inside :percentage="+percentage" :stroke-width=3></el-progress>
      </span>
    </template>
    <div v-else>
      <LoadingComp class="loading-box" />
    </div>
  </el-dialog>
</template>

<script>
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';
import OrderServiceEditCord from '@/components/ServiceAfterSale/EditDialog/OrderServiceEditCord.vue';
import VTypeTitle from '@/components/ServiceAfterSale/EditDialog/VTypeTitle.vue';
import EditDiaLeftTable from '@/components/ServiceAfterSale/EditDialog/EditDiaLeftTable.vue';
import EditDiaRightSubmit from '@/components/ServiceAfterSale/EditDialog/EditDiaRightSubmit.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import ServiceBlueBtn from '@/components/ServiceAfterSale/EditDialog/ServiceBlueBtn.vue';
import DisplayPictrue from '@/components/ServiceAfterSale/EditDialog/DisplayPictrue.vue';
import LoadingComp from '@/components/common/LoadingComp.vue';


export default {
  components: {
    normalBtn,
    normalBtnFull,
    OrderServiceEditCord,
    VTypeTitle,
    EditDiaLeftTable,
    EditDiaRightSubmit,
    ServiceBlueBtn,
    DisplayPictrue,
    LoadingComp,
  },
  props: {
    className: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      imgInfo: [],
      imgSrc: null,
      imgRules: [
        { strategy: 'maxLength:3', errorMsg: '最多上传4张照片' },
        // 要求为不能大于4张，但在此处设置的规则为最大为3，原因为在通过该项规则后系统还会向列表继续添加，还会产生变动，所以提前减一
      ],
      lossesNum: null,
      fileList: [],
    };
  },
  computed: {
    // eslint-disable-next-line max-len
    ...mapState('orderModule', ['isShowServiceDia', 'orderDetailData', 'curOrderID', 'curCustomerInfo2Service', 'curServiceOrderHistory']),
    ...mapGetters('orderModule', ['curProductInfoStringify']),
    ...mapGetters('common', ['expressList']),
    // eslint-disable-next-line max-len
    ...mapState('service', ['serviceImgList', 'serviceImgList2Upload', 'serviceErrInfo', 'SolutionType', 'replenish', 'refund', 'refundFreight', 'PayPackageData',
      'replenishFile', 'percentage', 'OrderPackageListTableData', 'submitQuestionList', 'lossesFund', 'CouponList']),
    ...mapState('common', ['isLoading']),
  },
  methods: {
    ...mapMutations('orderModule', ['setIsShowServiceDiaFail']),
    // eslint-disable-next-line max-len
    ...mapMutations('service', ['delServiceImgByIndex', 'setServiceImgList', 'setOptionsErrInfo', 'clearServiceFormInfo', 'setLossesFund', 'clearAllServiceErrInfo', 'setServiceErrInfo', 'handleSubmitError']),
    ...mapActions('service', ['submitServiceForm']),
    handleClose() { // 弹窗关闭图标功能
      // this.messageBox.warnCancelBox('注意', '关闭当前窗口会导致已填信息丢失，确定关闭吗', () => {
      this.clearServiceFormInfo();
      this.setIsShowServiceDiaFail();
      this.$router.push({ query: {} });
      // });
    },
    handleDownLoad(orderDetailData) {
      // eslint-disable-next-line max-len
      this.messageBox.warnCancelNullMsg('确定下载订单文件吗?', () => this.$store.dispatch('service/downLoadOrderFile', orderDetailData));
    },
    onuploadclick(e) {
      let bool = false;
      if (!this.check(this.serviceImgList, this.imgRules, (msg) => {
        this.messageBox.failSingle(msg);
      })) bool = true;
      if (e && e.preventDefault && bool) {
        e.preventDefault();
      }
    },
    addSingleImg(data) {
      const inputFile = data;
      const { name, size } = inputFile;
      const lastModifiedDate = inputFile.lastModifiedDate.toLocaleString(84);
      this.imgInfo.push({
        name,
        size,
        lastModifiedDate,
      });
      const reader = new FileReader();
      reader.readAsDataURL(inputFile);
      reader.onloadend = () => {
        const strBase64 = reader.result.substring(0);
        this.setServiceImgList([strBase64, inputFile]); // 添加到数据仓库图片列表中
        return strBase64;
      };
    },
    onLossInput(v) {
      this.lossesNum = this.$utils.filterNumber(v.target.value);
      this.setLossesFund(this.lossesNum);
    },
    writeErrInfo(optionErr, errText) {
      if (optionErr) this.setOptionsErrInfo(optionErr);
      if (errText) this.setServiceErrInfo(errText);
    },
    checkSubmitInfo() {
      this.clearAllServiceErrInfo();
      this.submitQuestionList.forEach((it, i) => { // 校验问题列表是否都有填写
        if (!it.ID) this.writeErrInfo(['IDErr', i], '请选择问题类型、责任部门并输入备注信息!');
        if (!it.Remark) this.writeErrInfo(['RemarkErr', i], '请选择问题类型、责任部门并输入备注信息!');
        if (it.Remark.length > 200) this.writeErrInfo(['RemarkErr', i], '备注信息不能超过200个字符!');
        if (!it.Department && it.Department !== 0) this.writeErrInfo(['DepartmentErr', i], '请选择问题类型、责任部门并输入备注信息!');
      });
      if (this.serviceErrInfo) {
        this.handleSubmitError();
        return false;
      }
      if (this.SolutionType === 'replenish') { // 补印
        const { KindCount, Amount } = this.replenish;
        const data = this.replenishFile;
        if (!KindCount) {
          this.writeErrInfo(['KindCountErr'], '请输入补印款数!');
          this.handleSubmitError();
          return false;
        }
        if (!Amount) {
          this.writeErrInfo(['AmountErr'], '请输入补印数量!');
          this.handleSubmitError();
          return false;
        }
        // console.log(this.orderDetailData);
        if (+KindCount > +this.orderDetailData.ProductParams.KindCount) {
          this.setServiceErrInfo(`当前补印款数不能大于该订单总款数：${this.orderDetailData.ProductParams.KindCount} !`);
          this.handleSubmitError();
          return false;
        }
        if (!data) {
          this.setServiceErrInfo('请上传补印文件!');
          this.handleSubmitError();
          return false;
        }
      } else if (this.SolutionType === 'refund') {
        if (!this.refund.refund) {
          this.writeErrInfo(['refund'], '请填写订单减款金额!');
          this.handleSubmitError();
          return false;
        }
        if (this.refund.refund < 0) {
          this.writeErrInfo(['refund'], '订单减款金额不能小于0!');
          this.handleSubmitError();
          return false;
        }
        const maxRefund = (this.orderDetailData.Funds.FinalPrice - this.orderDetailData.Funds.Refund - this.orderDetailData.Funds.Reduced).toFixed(2);
        if (+this.refund.refund > +maxRefund) {
          this.writeErrInfo(['refund'], `订单减款金额不能大于${maxRefund}!`);
          this.handleSubmitError();
          return false;
        }
        if (!this.refundFreight.refundFreight && this.refundFreight.refundFreight !== 0) {
          this.writeErrInfo(['refundFreight'], '请填写运费减款金额!');
          this.handleSubmitError();
          return false;
        }
        if (this.refundFreight.refundFreight < 0) {
          this.writeErrInfo(['refundFreight'], '运费减款金额不能小于0!');
          this.handleSubmitError();
          return false;
        }
        const maxRefundFreight = (this.PayPackageData.Freight - this.PayPackageData.RefundFreight).toFixed(2);
        if (+this.refundFreight.refundFreight > +maxRefundFreight) {
          this.writeErrInfo(['refundFreight'], `运费减款金额不能大于${maxRefundFreight}!`);
          this.handleSubmitError();
          return false;
        }
        // if (+this.refund.refund === 0 && +this.refundFreight.refundFreight === 0) {
        //   this.writeErrInfo(['refund'], '订单减款和运费减款不能同时等于0!');
        //   this.writeErrInfo(['refundFreight'], '订单减款和运费减款不能同时等于0!');
        //   this.handleSubmitError();
        //   return false;
        // }
      }
      if (this.SolutionType === 'giveCoupons') {
        if (this.CouponList.length === 0) {
          this.writeErrInfo(['CouponList'], '请选择优惠券!');
          this.handleSubmitError();
          return false;
        }
      }
      if (!this.lossesFund.lossesFund) {
        this.writeErrInfo(['lossesFund'], '请输入损失金额!');
        this.handleSubmitError();
        return false;
      }
      if (this.lossesFund.lossesFund < 0) {
        this.writeErrInfo(['lossesFund'], '损失金额不能小于0!');
        this.handleSubmitError();
        return false;
      }
      return true;
    },
    formatElementPercentage(percentage) {
      return `${percentage.toFixed(2)}%`;
    },
    async uploadImg(data) {
      if (!data || data.length < 1) return;
      const files = [];
      const imgExpectType = ['image/jpeg', 'image/png', 'image/bmp'];
      data.forEach((file) => {
        if (imgExpectType.includes(file.type)) files.push(file);
      });
      const len = 4 - this.serviceImgList.length || 0;
      // 获取到目前还可以添加的照片数量
      let list;
      if (files.length <= len) list = files;
      else list = files.slice(0, len);
      await Promise.all(list.map(async (imgData) => {
        // 耗时操作
        await this.addSingleImg(imgData);
      }));
    },
    async submitServiceOrder() {
      if (!this.isShowServiceDia || !this.checkSubmitInfo()) return;
      const { AppyCode } = this.$route.query;
      const callback = this.$route.name !== 'feedback' ? null : () => {
        this.$emit('handleItemStatusChange', 2);
      };
      this.messageBox.warnCancelMsgSM('售后单提交之后立即执行无法更改，请谨慎操作!', () => {
        this.submitServiceForm([this.curOrderID, AppyCode, callback]);
        this.closeGLoading();
      });
    },
  },
  watch: {
    lossesFund(newVal) {
      if (!newVal.lossesFund) this.lossesNum = '';
    },
  },
  mounted() {
  //  console.log('售后组件已挂载');
  },
  beforeDestroy() {
    this.$router.push({ query: {} });
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.dialog-to-order-service-box {
  height: 800px;
  position: relative;
  .el-dialog--center .el-dialog__body{
    text-align: left;
  }

  .el-dialog__header > span::before {
    background: url(../../../assets/images/service.png) no-repeat center;
  }

  .el-dialog__body {
    box-sizing: border-box;
    height: 695px;
    padding: 0%;
    padding-top: 20px;
    > section {
      margin-left: 20px;
      width: 960px;
      box-sizing: border-box;
      &.question-photo {
        display: flex;
        height: 90px;
        align-items: center;
        box-shadow: 0px 3px 10px 0px rgba(98, 98, 98, 0.2);
        border-radius: 5px;
        border: solid 1px $--border-color-light;
        > header {
          text-align: left;
          height: 100%;
          width: 85px;
          padding-top: 16px;
          box-sizing: border-box;
          > div {
            margin: 0 auto;
          }
        }
        > main {
          padding-top: 8px;
          margin-bottom: 20px;
          padding-left: 20px;
          display: flex;
          .submit-img-box{
            display: flex;
            flex-direction: column;
            margin-right: 52px;
            .upload-btn{
              margin: 14px 0 16px 0;
            }
            .explain {
              font-size: 12px;
              color: $--color-text-table-time;
            }
          }
        }
      }
      &.service-after-sale {
        height: 395px;
        display: flex;
        margin-top: 20px;
        box-shadow: 0px 3px 10px 0px rgba(98, 98, 98, 0.2);
        border-radius: 5px;
        border: solid 1px $--border-color-light;
        > header {
          height: 100%;
          width: 85px;
          flex: none;
          > div {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        > main {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          margin-top: 20px;
          .left-table {
            width: 835px;
          }
          // .right-submit-wrap {
          //   // width: 410px;
          // }
        }
      }
    }
    > .download-btn {
      height: 24px;
      width: 80px;
      position: absolute;
      top: 170px;
      left: 676px;
      > button {
        margin: 0;
        height: 24px;
        width: 80px;
        line-height: 20px;
        color: #fff;
        background-color: #26bcf9;
        font-size: 12px;
        border-radius: 2px;
      }
    }
    .order-service-detail-box .text-content .address {
      max-width: 328px;
    }
  }

  .el-dialog__footer {
    padding: 15px 20px 14px 20px;
    .dialog-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .loss-box {
        margin-left: 112px;
        font-size: 12px;
        > .title{
          font-weight: 600;
        }
        > input{
            width: 130px;
            height: 24px;
            box-sizing: border-box;
            border:1px solid $--border-color-base;
            margin-right: 8px;
            outline: none;
            padding:0 5px;
            &::-webkit-input-placeholder{
              color: $--color-text-secondary;
              font-size: 12px;
              text-align: left;
            }
        }
        > span:last-of-type{
          color: $--color-text-table-time;
        }
      }
      .err-wrap{
        color: $--color-text-table-pending;
        font-size: 12px;
        position: relative;
        top:  5px;
        right: -30px;
        height: 30px;
        line-height: 30px;
        width: 260px;
        text-align: right;
      }
      .btns{
        position: relative;
        top: 5px;
        button {
          width: 120px;
          height: 29px;
          border-radius: 2px;
          &:first-of-type {
            margin-left: 30px;
          }
          & + button {
            margin-left: 30px;
            background: linear-gradient(
              to right,
              $--color-primary,
              $--color-primary-light
            );
            border: none;
            position: relative;
            top: 0px;
          }
        }
      }
      .el-progress{
        position: absolute;
        width: 1000px;
        left: 0;
        bottom: 0;
        height: 3px;
        .el-progress-bar__outer {
          overflow: visible;
          top: -6px;
          .el-progress-bar__inner{
            background: linear-gradient(
              to right,
              $--color-primary,
              $--color-primary-light
            );
            transition: width .3s linear;
            top: 0;
          }
          .el-progress-bar__innerText{
            position: relative;
            top: -17px;
            font-size: 12px;
            color: #f4a307;
            z-index: 999;
            left: 47px;
          }
        }
        &.will-over{
          .el-progress-bar__outer .el-progress-bar__inner .el-progress-bar__innerText{
            left: 0;
          }
        }
      }
      .mask{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

}
</style>
