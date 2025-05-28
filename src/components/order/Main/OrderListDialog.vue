<template>
  <div class="order-list-dialog-wrap">
    <!-- 弹窗窗体 -->
    <el-dialog
      :top="dialogTop"
      :visible="orderListDialogShow"
      width="850px"
      custom-class="order-list-dialog-box"
      :before-close='beforeClose'
      :modal='false'
      center
      v-dialogDrag
    >
      <!-- 选项卡 -->
      <el-tabs
        v-model="activeName"
        class="order-list-tabs-box"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane v-if="showService" label="查看进度" name="third">
          <OrderProgress  v-if="!isLoading" :orderProgress='orderProgress' />
          <LoadingComp v-else />
        </el-tab-pane>
        <el-tab-pane v-if="showDetail" label="订单详情" name="first">
          <OrderDetail v-if="!isLoading" showDownload @prodProgress="onProdProgressClick" @anewUpload="onAnewUploadClick" :CertificateList="CertificateList" />
          <LoadingComp v-else />
        </el-tab-pane>
        <el-tab-pane  v-if="canShowExpressList" label="包裹列表" name="second">
          <PackageList v-if="!isLoading" />
          <LoadingComp v-else />
        </el-tab-pane>
        <el-tab-pane v-if="!showService" label="配送进度" name="express">
          <ExpressProgress  v-if="!isLoading" />
          <LoadingComp v-else />
        </el-tab-pane>
      </el-tabs>

      <!-- 关闭按钮 -->
      <span slot="footer" class="dialog-footer">
        <normalBtn @click.native="setOrderListDialogHide" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import OrderDetail from '@/components/order/DialogContent/OrderDetail.vue';
import PackageList from '@/components/order/DialogContent/PackageList.vue';
import OrderProgress from '@/components/order/DialogContent/OrderProgress.vue';
import ExpressProgress from '@/components/order/DialogContent/ExpressProgress.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import LoadingComp from '@/components/common/LoadingComp.vue';

export default {
  props: {
    CertificateList: { // 证书列表数据
      type: Array,
      default: () => [],
    },
    IsAfterSales: { // 是否是售后
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: 'first',
      dialogTop: '0px',
      showDetail: false,
      showService: false,
      isFetchCertificateListWaiting: false, // 等待获取证书列表数据
    };
  },
  components: {
    OrderDetail,
    PackageList,
    normalBtn,
    OrderProgress,
    ExpressProgress,
    LoadingComp,
  },
  computed: {
    ...mapState('orderModule', ['orderListDialogShowText', 'orderProgress', 'curOrderStatus', 'orderDetailData', 'curOrderID', 'curExpressID',
      'lastOrderID4OrderProgressRequest', 'lastExpressID4ExpressProgressRequest', 'dialogPackageData',
      'orderProgressDateSetTime', 'packageListDateByOrderSetTime', 'packageListDateByexpressSetTime', 'expressProgressDateSetTime', 'requestDuration',
      'orderDetailDateSetTime',
    ]),
    ...mapState('common', ['isLoading']),
    orderListDialogShow: {
      get() {
        return this.$store.state.orderModule.orderListDialogShow;
      },
      set() {},
    },
    canShowExpressList() { // 该数据用于决定是否展示包裹列表弹窗
      return true;
    },
  },
  watch: {
    dialogTop(val) {
      const oDoms = document.getElementsByClassName(
        'order-list-dialog-box',
      );
      if (oDoms && oDoms.length > 0) oDoms[0].style.marginTop = `${val}px`;
    },
    orderListDialogShowText(val) {
      if (val) this.activeName = val;
    },
    orderListDialogShow(newVal, oldVal) {
      this.$emit('setCertificateList', []);
      this.isFetchCertificateListWaiting = false;

      if (newVal && !oldVal && this.showDetail && this.$route.name === 'orderManage') {
        this.isFetchCertificateListWaiting = true;
      }
    },
    orderDetailData(val) {
      if (this.isFetchCertificateListWaiting && val) {
        const { CertificateFileList, Status, Customer } = val;
        if (Status === 35 && CertificateFileList && CertificateFileList.length > 0) {
          // 看看是否有证书 如果有证书则请求证书列表数据 看对应证书是否审核不通过、找不到、已过期 -- 如果是则不允许做此选择
          // this.getCertificateList(Customer.CustomerID);
        }
      }
    },
  },
  methods: {
    ...mapMutations('orderModule', ['setOrderListDialogHide', 'setOrderListDialogShowText', 'getOrderDetail']),
    ...mapMutations('common', ['setIsLoading']),
    ...mapActions('orderModule', ['selectOrderProgress', 'getOrderDetail', 'getExpressProgress', 'getPackageListByExressID', 'getPackageListByOrderID']),
    async getCertificateList(CustomerID) {
      this.$emit('setCertificateList', []);
      const resp = await this.api.getCustomerCertificateAll(CustomerID).catch(() => null);

      if (resp && resp.data.Status === 1000) {
        this.$emit('setCertificateList', resp.data.Data || []);
      }
    },
    handleCatchError(error) { // 处理tab弹窗点击与切换catch错误信息
      this.messageBox.handleLoadingError(
        error,
        () => { this.setOrderListDialogHide(); this.setIsLoading(false); },
        () => { this.setOrderListDialogHide(); this.setIsLoading(false); },
      );
    },
    async handleClick(tab) {
      const { name } = tab;
      let key = true;
      this.setIsLoading(true);
      this.setOrderListDialogShowText(name);
      switch (name) {
        case 'third': // 订单进度
          if (!this.lastOrderID4OrderProgressRequest
            || this.lastOrderID4OrderProgressRequest !== this.curOrderID
            || new Date().getTime() - this.orderProgressDateSetTime > this.requestDuration) {
            await this.selectOrderProgress().catch((error) => {
              key = false;
              this.handleCatchError(error);
            });
          }
          break;
        case 'first': // 订单详情
          if (!this.orderDetailData
            || this.curOrderID !== this.orderDetailData.OrderID
            || new Date().getTime() - this.orderDetailDateSetTime > this.requestDuration) {
            await this.getOrderDetail().catch((error) => {
              key = false;
              this.handleCatchError(error);
            });
          }
          break;
        case 'second': // 包裹列表 - 双页
          if (this.$route.name === 'orderManage' || this.IsAfterSales) {
            if (this.dialogPackageData?.BackPackageInfos?.length === 0
              || this.dialogPackageData?.Order?.OrderID !== this.curOrderID
              || new Date().getTime() - this.packageListDateByOrderSetTime > this.requestDuration) {
              await this.getPackageListByOrderID().catch((error) => {
                key = false;
                this.handleCatchError(error);
              });
            }
          } else if (this.dialogPackageData?.BackPackageInfos?.length === 0
          //  || this.curExpressID !== this.dialogPackageData[0].Logistics.ID
           || new Date().getTime() - this.packageListDateByexpressSetTime > this.requestDuration) {
            await this.getPackageListByExressID().catch((error) => {
              key = false;
              this.handleCatchError(error);
            });
          }
          break;
        case 'express': // 物流信息 - 运单页
          if (!this.lastExpressID4ExpressProgressRequest
            || this.lastExpressID4ExpressProgressRequest !== this.curExpressID
            || new Date().getTime() - this.expressProgressDateSetTime > this.requestDuration) {
            await this.getExpressProgress().catch((error) => {
              key = false;
              this.handleCatchError(error);
            });
          }
          break;
        default:
          break;
      }
      if (key) this.setIsLoading(false);
    },
    getDialogTop() {
      const h = (document.body.clientHeight - 820) / 2;
      this.dialogTop = `${h > 0 ? h : 0}px`;
    },
    beforeClose() {
      this.setOrderListDialogHide();
    },
    onProdProgressClick() { // 查看工厂进度
      this.$emit('prodProgress');
    },
    onAnewUploadClick() { // 重新上传文件再审稿
      this.$emit('anewUpload');
    },
  },
  mounted() {
    if (this.$route.name === 'orderManage') {
      this.showDetail = true;
      this.showService = true;
    }
    if (this.IsAfterSales) {
      this.showService = true;
    }
    this.$nextTick(this.getDialogTop());
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
  .order-list-dialog-box {
    height: 820px;
    position: relative;
    &::after {
      width: 20px;
      height: 1px;
      content: "";
      position: absolute;
      background-color: $--border-color-base;
      top: 61px;
      left: 0px;
      z-index: 99;
    }
    >.el-dialog__header {
      height: 25px;
      padding: 0;
      > button {
        top: 10px;
      }
    }
    >.el-dialog__body {
      padding: 0 !important;
      .order-list-tabs-box {
        .el-tabs__header {
          margin: 0 20px;
          user-select: none;
          .el-tabs__item {
            background-color: $--bg-color-base;
            border-color: $--border-color-base;
            color: $--color-text-regular;
            height: 36px;
            line-height: 36px;
            width: 120px;
            text-align: center;
            box-sizing: border-box;
            &.is-active {
              border-bottom: none;
              background-color: $--color-white;
              color: $--color-primary;
              position: relative;
              border-radius: 0%;
              &::before {
                content: "";
                display: block;
                height: 3px;
                width: calc(100% + 2px);
                background-color: $--color-primary;
                position: absolute;
                top: -1px;
                left: -1px;
                border-radius: 1.5px;
                z-index: 99;
              }
            }
          }
        }
      }
    }
    >.el-dialog__footer{
      padding-top: 25px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
    }
    .dialog-footer {
      width: 100%;
      button {
        margin: 0;
      }
    }
  }
</style>
