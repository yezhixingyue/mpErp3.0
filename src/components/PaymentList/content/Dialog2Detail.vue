<template>
  <el-dialog
    :visible.sync="isShow2DetailDialog"
    width="960px"
    custom-class="mp-dialog-to-detail-box"
    :close-on-click-modal='false'
    title="详情"
    top="9vh"
    center
    :modal='false'
    :before-close="handleClose"
    v-dialogDrag
  >
    <template v-if="!isLoading">
      <section>
        <Table2DialogDetail :tableData='PayDetailOrderList' :expressList='expressList' />
        <p class="order-count-wrap">
          <span>
            总共<i class="is-pink"> {{this.PayDetailOrderList.OrderCount}}</i> 个订单（
            <span class="remark-box">
              产品总金额：<i class="is-primary">{{this.PayDetailData.ProductPrice}}元</i>，
            总运费：<i class="is-primary">{{this.PayDetailData.Freight}}元</i>
            </span>
            ）
          </span>
        </p>
        <div class="pay-info-wrap top-line">
          <ul>
            <li>
              <span>货到付款：</span><span>
                ¥{{numToFixed(PayDetailData.PayOnDelivery, 2)}}元
              </span>
            </li>
            <li>
              <span>已扣余额：</span><span>
                ¥{{numToFixed(PayDetailData.BalanceAmount, 2)}}元
              </span>
            </li>
            <li>
              <span>已扣印豆：</span><span>
                {{PayDetailData.PaidBeanNumber}}个
              </span>
            </li>
            <li class="pay-box">
              <span>扫码支付：</span>
              <span class="is-pink">
                ¥{{numToFixed(PayDetailData.PayOnlineAmount, 2)}}<i>元</i>
              </span>
            </li>
          </ul>
          <p class="order-id-box">
            <template  v-if="PayDetailData.Status===2 && PayDetailData.PayChannel">
              <span>支付方式：{{PayDetailData.PayChannel.Channel}}</span>
              <span class="out-trade-wrap">
                支付单号：{{PayDetailData.PayChannel.OutTradeSN}}
              </span>
            </template>
            <template v-if="PayTimeout&&PayTimeout !== '已超时'">
              <span class="on-time-going">
                请在倒计时结束前支付订单
                 <i class="is-pedding">{{PayTimeout}}</i>
              </span>
            </template>
          </p>
          <div class="pay-info-footer" :class="PayDetailData.Status === 1 ? 'active' : ''">
            <normalBtn class="close-btn" @click.native="setIsShow2DetailDialog(false)" />
            <template v-if="PayDetailData.Status !== 1 || !localPermission.Pay"> <!-- 已付款或取消时显示 -->
              <span class="pay-info-footer-line"></span>
              <span class="pay-info-pay-status-box">
                状态：
                <i :class="{
                  'is-pedding': PayDetailData.Status === 1,
                  'is-completed': PayDetailData.Status === 2,
                  'is-pink': PayDetailData.Status === 255,
                }" class="status-box">
                  {{$utils.getPaymentStatus(PayDetailData.Status, PayStatusList)}}
                </i>
              </span>
            </template>
            <template v-else>
              <normalBtnFull
                title="支付"
                class="state-btn"
                v-if="PayTimeout !== '已超时' && localPermission.Pay"
                @click.native="jump2Pay" />
              <normalBtnFull title="已过期" class="state-btn is-timeout" v-if="PayTimeout === '已超时'" />
            </template>
          </div>
        </div>
      </section>
      <span slot="footer" class="dialog-footer">
      </span>
    </template>
    <template v-else>
      <LoadingComp />
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import normalBtn from '@/components/common/normalBtn.vue';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import Table2DialogDetail from '@/components/PaymentList/content/Table2DialogDetail.vue';
import LoadingComp from '@/components/common/LoadingComp.vue';

export default {
  data() {
    return {
      dialogVisible: false,
      timer: null,
    };
  },
  components: {
    normalBtn,
    normalBtnFull,
    Table2DialogDetail,
    LoadingComp,
  },
  computed: {
    ...mapState('paymentModule', ['isShow2DetailDialog', 'PayDetailOrderList', 'PayDetailData']),
    ...mapState('common', ['PayStatusList', 'isLoading', 'Permission']),
    ...mapGetters('common', ['PayTimeout', 'expressList']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionPayment?.Obj) {
        return this.Permission.PermissionList.PermissionPayment.Obj;
      }
      return {};
    },
    totalSum() { // 计算总产品价格
      let totalSum = 0;
      this.PayDetailOrderList.forEach((item) => {
        totalSum += item.Funds.FinalPrice;
      });
      return totalSum;
    },
    list() { // 根据row中PackageList数据获取到共用运费的情况列表，传递到表格中供其进行运费表格划分
      if (!this.PayDetailData.PackageList) return '';
      const arr1 = [];
      const arr2 = JSON.parse(JSON.stringify(this.PayDetailOrderList));
      this.PayDetailData.PackageList.forEach((item, index) => {
        arr1.push(item.OrderList.length);
        item.OrderList.forEach((it, i) => {
          if (i > 0) arr1.push(0);
        });
        if (arr2[index]) arr2[index].webFreight = item.Freight;
      });
      return { arr1, arr2 };
    },
  },
  methods: {
    ...mapMutations('paymentModule', [
      'setIsShow2DetailDialog', 'setIsShow2PayDialog', 'setPayImgSrc', 'setPayAmount',
    ]),
    ...mapMutations('common', ['setCurTime']),
    handleClose() {
      this.setIsShow2DetailDialog(false);
    },
    getPayFundInfo(row) {
      const { Name } = row.Customer;
      const {
        PayQRCode, PayOnlineAmount, BalanceAmount, PaidBeanNumber, PayOnDelivery, FullPayout, // 应付、余额、货到付款、总金额
      } = row;
      this.setPayAmount({
        PayOnlineAmount, BalanceAmount, PaidBeanNumber, PayOnDelivery, FullPayout, Name,
      });
      this.setPayImgSrc(PayQRCode);
    },
    jump2Pay() {
      this.getPayFundInfo(this.PayDetailData);
      this.setIsShow2PayDialog(true);
    },
    numToFixed(num, count) {
      if (!num && num !== 0) return '';
      return num.toFixed(count);
    },
  },
  mounted() {
    this.$store.dispatch('common/getExpressList');
    this.timer = setInterval(() => { // 开启定时器，用于定时刷新订单剩余支付时间
      this.setCurTime(new Date().getTime());
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) { // 组件卸载时销毁定时器
      clearInterval(this.timer);
    }
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-dialog-to-detail-box {
  height: 725px;
  border-radius: 5px;
  overflow: hidden;
  .el-dialog__header {
    height: 20px;
    padding: 10px 20px;
    background-color: $--bg-color-base;
    text-align: left;
    > span {
      line-height: 20px;
      font-size: 14px;
      color: $--color-text-regular;
      &::before {
        content: "";
        display: inline-block;
        height: 16px;
        width: 16px;
        background: url(../../../assets/images/detail.png) no-repeat center;
        vertical-align: -15%;
        margin-right: 10px;
      }
    }
    .el-dialog__headerbtn {
      top: 10px;
      font-size: 18px;
      .el-dialog__close {
        color: $--color-text-table-time;
      }
    }
  }
  .el-dialog__body {
    // width: 780px;
    margin: 0 10px;
    padding-bottom: 15px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 20px;
    height: 565px;
    section {
      position: relative;
      height: 100%;
      p.order-count-wrap{
        padding: 17px 0 25px 0;
        > span {
          color: $--color-text-table-time;
          // padding-left: 10px;
          & + span {
            font-size: 12px;
            color: $--color-text-primary;
            margin-left: 18px;
          }
          > .remark-box{
            font-size: 12px;
            line-height: 12px;
          }
        }
      }
      .pay-info-wrap{
        height: 176px;
        width: 100%;
        padding: 0 10px;
        position: absolute;
        box-sizing: border-box;
        user-select: none;
        &::after{
          width: calc(100% + 20px);
          left: -10px;
        }
        bottom: -53px;
        left: 0;
        > ul {
          & > li {
            text-align: right;
            font-size: 12px;
            color: $--color-text-primary;
            > span + span {
              width: 120px;
              padding-right: 2px;
              display: inline-block;
              padding-top: 15px;
            }
            > span:first-of-type{
              color: $--color-text-table-time;
            }
            &.pay-box{
              > span:first-of-type{
                color: $--color-text-primary;
                margin-right: -1px;
              }
              font-size: 14px;
              > span + span {
                font-weight: 600;
                font-size: 17px;
                white-space: nowrap;
                > i{
                  font-size: 12px;
                }
              }
            }
          }
          padding-top: 5px;
        }
        p.order-id-box {
          padding-top: 34px;
          margin-left: -6px;
          text-align: right;
          padding-bottom: 14px;
          height: 14px;
          span {
            font-size: 12px;
            color: $--color-text-table-time;
            &.out-trade-wrap{
              margin-left: 18px;
            }
          }
          > .on-time-going{
            position: relative;
            top: -8px;
          }
        }
        > div.pay-info-footer{
          text-align: right;
          &.active{
            margin-top: -3px;
          }
          > button.close-btn {
            width: 60px;
            height: 25px;
            margin: 0;
            line-height: 22px;
            border-color: $--color-blue-1;
            border-radius: 5px;
            color: $--color-blue-1;
            font-size: 14px;
            // vertical-align: top;
          }
          > span.pay-info-footer-line{
            height: 20px;
            width: 1px;
            background-color: $--border-color-base;
            display: inline-block;
            margin: 0 20px 0 21px;
            position: relative;
            top: 4px;
          }
          > span.pay-info-pay-status-box {
            vertical-align: text-top;
            > i {
              font-size: 16px;
              font-weight: 600;
            }
          }
          > button.state-btn {
            height: 35px;
            width: 120px;
            margin-left: 35px;
            position: relative;
            top: -6px;
            border-radius: 5px;
            background-color: $--color-pink;
            border: none;
            &:hover{
              box-shadow: 0 1px 0 $--color-pink, 0 1px 1px rgba(0, 0, 0, 0.2);
              transform: scale(1.005);
            }
            &:active{
              color: #eee;
            }
            &.is-timeout{
              cursor: auto;
              opacity: 0.3;
              &:hover{
                transform: none;
                box-shadow: none;
              }
              &:active{
                color: #fff;
              }
            }
            user-select: none;
          }
        }
        // > div + div {
        //   width: 325px;
        //   right: 0;
        //   text-align: right;
        //   > button{
        //     height: 30px;
        //     width: 100px;
        //     background-image: linear-gradient(90deg, $--color-primary ,$--color-primary-light );
        //     border-radius: 2px;
        //     border: none;
        //     margin-left: 15px;
        //     &.is-timeout{
        //       background-image:
        //        linear-gradient(90deg, $--color-text-secondary ,$--color-text-secondary );
        //       cursor: auto;
        //       &:hover{
        //         transform: none;
        //         box-shadow: none;
        //       }
        //       &:active{
        //         color: #fff;
        //       }
        //     }
        //   }
        //   > span {
        //     color: $--color-text-table-time;
        //     font-size: 12px;
        //     > i {
        //       font-size: 14px;
        //       margin-left: 6px;
        //     }
        //   }
        // }
      }
    }
    .el-table__body tbody tr td .cell {
      padding: 0 3px;
    }
  }
  .el-dialog__footer {
    padding: 0;
    > span {
      width: 100%;
      button {
        margin: 0 auto;
        width: 100px;
        line-height: 24px;
        height: 30px;
        border-radius: 2px;
        margin-right: 15px;
      }
    }
  }
  .is-completed {
    color: $--color-text-table-completed;
  }
  .is-pedding {
    color: $--color-text-table-pending;
  }
  // .is-order-cancel {
  //   color: $--color-text-table-cancel;
  // }
  .is-red-btn {
    color: $--color-text-table-pending;
    border: 1px solid $--color-text-table-pending;
    padding: 0 8px;
    margin-left: 3px;
    cursor: pointer;
    &:hover {
      background-color: mix(
        $--color-text-table-pending,
        $--color-white,
        5%
      );
    }
  }
}
</style>
