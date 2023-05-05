<template>
  <div class="order-list-dialog-wrap">
    <!-- 弹窗窗体 -->
    <el-dialog
      :top="dialogTop"
      :visible="orderListDialogData.orderListDialogShow"
      width="850px"
      custom-class="orders-list-dialog-box"
      :before-close='beforeClose'
      :modal='false'
      @open="open"
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
        <el-tab-pane v-if="true" label="查看进度" name="third">
          <OrderProgress  v-if="!isLoading" :orderProgress='orderProgress' />
          <LoadingComp v-else />
        </el-tab-pane>
        <el-tab-pane v-if="true" label="订单详情" name="first">
          <OrderDetail v-if="!isLoading" :detailData="detailData" showDownload/>
          <LoadingComp v-else />
        </el-tab-pane>
        <el-tab-pane  v-if="canShowExpressList" label="包裹列表" name="second">
          <PackageList v-if="!isLoading" :dialogPackageData='packageListData'/>
          <LoadingComp v-else />
        </el-tab-pane>
      </el-tabs>

      <!-- 关闭按钮 -->
      <span slot="footer" class="dialog-footer">
        <normalBtn @click.native="OrderListDialogHide" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import OrderDetail from '@/components/order/DialogContent/OrderDetail.vue';
import PackageList from '@/components/Feedback/DialogContent/PackageList.vue';
import OrderProgress from '@/components/order/DialogContent/OrderProgress.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import LoadingComp from '@/components/common/LoadingComp.vue';

export default {
  props: {
    orderListDialogData: {
      type: Object,
    },
  },
  data() {
    return {
      activeName: 'first',
      dialogTop: '0px',

      orderProgress: [],
      detailData: null,
      packageListData: [],
    };
  },
  components: {
    OrderDetail,
    PackageList,
    normalBtn,
    OrderProgress,
    LoadingComp,
  },
  computed: {
    ...mapState('common', ['isLoading']),
    canShowExpressList() { // 该数据用于决定是否展示包裹列表弹窗
      return true;
    },
  },
  watch: {
    dialogTop(val) {
      const oDoms = document.getElementsByClassName(
        'orders-list-dialog-box',
      );
      if (oDoms && oDoms.length > 0) oDoms[0].style.marginTop = `${val}px`;
    },
  },
  methods: {
    ...mapMutations('orderModule', ['setOrderListDialogHide', 'setOrderListDialogShowText']),
    ...mapMutations('common', ['setIsLoading']),
    handleCatchError(error) { // 处理tab弹窗点击与切换catch错误信息
      this.messageBox.handleLoadingError(
        error,
        () => { this.OrderListDialogHide(); this.setIsLoading(false); },
        () => { this.OrderListDialogHide(); this.setIsLoading(false); },
      );
    },
    OrderListDialogHide() {
      this.$emit('DialogHide');
    },
    async open() {
      this.handleClick();
      this.setIsLoading(true);
      // await this.api.getOrderDetail(this.orderListDialogData.OrderID).then(res => {
      //   if (res.data.Status === 1000) {
      //     this.detailData = res.data.Data;
      //     this.setIsLoading(false);
      //   }
      // }).catch((error) => {
      //   this.handleCatchError(error);
      // });
    },
    async handleClick() {
      // const { name } = tab;
      const name = this.activeName;
      const { OrderID } = this.orderListDialogData;
      let key = true;
      this.setIsLoading(true);
      switch (name) {
        case 'third': // 订单进度
          await this.api.selectOrderProgress(OrderID).then(res => {
            if (res.data.Status === 1000) {
              this.orderProgress = res.data.Data.reverse();
            }
          }).catch((error) => {
            key = false;
            this.handleCatchError(error);
          });
          break;
        case 'first': // 订单详情
          await this.api.getOrderDetail(OrderID).then(res => {
            if (res.data.Status === 1000) {
              this.detailData = res.data.Data;
            }
          }).catch((error) => {
            key = false;
            this.handleCatchError(error);
          });
          break;
        case 'second': // 包裹列表 - 双页
          await this.api.getPackageListByOrderID(OrderID).then(res => {
            if (res.data.Status === 1000) {
              this.packageListData = res.data.Data;
            }
          }).catch((error) => {
            key = false;
            this.handleCatchError(error);
          });
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
      this.OrderListDialogHide();
    },
  },
  mounted() {
    this.$nextTick(this.getDialogTop());
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
  .orders-list-dialog-box {
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
    .el-dialog__header {
      height: 25px;
      padding: 0;
      > button {
        top: 10px;
      }
    }
    .el-dialog__body {
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
        .order-list-dialog-orderdetail-wrap{
          .bottom-line{
            padding: 0 12px;
          }
        }
      }
    }
    .el-dialog__footer{
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
