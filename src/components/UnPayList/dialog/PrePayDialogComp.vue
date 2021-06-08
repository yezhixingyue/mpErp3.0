<template>
  <el-dialog
    :visible.sync="isShowPreDialog"
    width="800px"
    custom-class="dialog-to-detail-box"
    :close-on-click-modal='false'
    title="提交订单"
    top="10vh"
    center
    :modal='false'
    v-dialogDrag
    :before-close="handleClose"
  >
    <template v-if="!isLoading && curPayListData">
      <section>
        <PrePayDiaTable :tableData='curPayListData' />
        <p class="order-count-wrap">
          <span>
            总共<i class="is-pink"> {{curPayListData.PackageList.length}}</i> 个订单（
            <span class="remark-box">
              产品总金额：<i class="is-primary">{{curPayListData.ProductPrice}}元</i>，
            总运费：<i class="is-primary">{{curPayListData.Freight}}元</i>
            </span>
            ）
          </span>
        </p>
        <div class="pay-info-wrap top-line">
          <ul>
            <li class="pay-box">
              <span>在线支付：</span>
              <span class="is-pink">
                <span>¥</span>
                <span>{{numToFixed(payNumOnline, 2)}}</span>
                <i>元</i>
              </span>
            </li>
            <li>
              <span>货到付款：</span><span>
                ¥{{numToFixed(PayOnDelivery, 2)}}元
              </span>
            </li>
            <li>
              <span>当前可用余额：</span><span>
                ¥{{numToFixed(curPayListData.FundBalance, 2)}}元
              </span>
            </li>
            <li v-if="curPayListData.MinimumCost !== curPayListData.FullPayout">
              <span>支付全款：</span><span>
                <el-checkbox v-model="checked"></el-checkbox>
                支付全款
              </span>
            </li>
          </ul>
        </div>
      </section>
      <span slot="footer" class="dialog-footer">
        <div class="pay-info-footer">
            <normalBtn class="close-btn" title="取消" @click.native="setIsShowPreDialog(false)" />
            <!-- <el-tooltip  content="可用余额充足时将会直接使用余额进行扣款" placement="top-end"> -->
              <normalBtnFull
                title="提交订单"
                class="state-btn"
                @click.native="jump2Pay" />
            <!-- </el-tooltip> -->
          </div>
      </span>
    </template>
    <template v-else>
      <LoadingComp />
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import normalBtn from '@/components/common/normalBtn.vue';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import PrePayDiaTable from '@/components/UnPayList/dialog/PrePayDiaTable.vue';
import LoadingComp from '@/components/common/LoadingComp.vue';

export default {
  data() {
    return {
      isFullPayout: false,
    };
  },
  components: {
    normalBtn,
    normalBtnFull,
    PrePayDiaTable,
    LoadingComp,
  },
  computed: {
    ...mapState('paymentModule', ['PayDetailOrderList', 'PayDetailData']),
    ...mapState('unpaylist', ['isShowPreDialog', 'curPayListData', 'curToPayList']),
    ...mapState('common', ['PayStatusList', 'isLoading']),
    payNumOnline() {
      if (this.isFullPayout) return this.curPayListData.FullPayout;
      return this.curPayListData.MinimumCost;
    },
    PayOnDelivery() {
      if (this.isFullPayout) return 0;
      return this.curPayListData.PayOnDelivery;
    },
    checked: {
      get() {
        return this.isFullPayout;
      },
      set(key) {
        this.isFullPayout = key;
      },
    },
  },
  methods: {
    ...mapMutations('unpaylist', ['setIsShowPreDialog', 'setIsShow2PayDialog']),
    ...mapMutations('common', ['setCurTime']),
    ...mapActions('unpaylist', ['createPaymentOrder']),
    handleClose() {
      this.setIsShowPreDialog(false);
    },
    getPayFundInfo(row) {
      const { Name } = row.Customer;
      const {
        PayQRCode, PayOnlineAmount, BalanceAmount, PayOnDelivery, FullPayout, // 应付、余额、货到付款、总金额
      } = row;
      this.setPayAmount({
        PayOnlineAmount, BalanceAmount, PayOnDelivery, FullPayout, Name,
      });
      this.setPayImgSrc(PayQRCode);
    },
    jump2Pay() {
      if (!this.isShowPreDialog) return;
      this.setIsShow2PayDialog(true);
      this.createPaymentOrder(this.isFullPayout).catch((error) => {
        this.messageBox.handleLoadingError(
          error,
          this.setIsShow2PayDialog(false),
          this.setIsShow2PayDialog(false),
        );
      });
    },
    numToFixed(num, count) {
      if (!num && num !== 0) return '';
      return num.toFixed(count);
    },
    // onCheckChange(key) {
    //   this.isFullPayout = key;
    // },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.dialog-to-detail-box {
  height: 700px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
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
        background: url(../../../assets/images/submiticon.png) no-repeat center;
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
    width: 780px;
    margin: 0 auto;
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
            .el-checkbox {
              position: relative;
              top: 1px;
              margin-right: 4px;
              .el-checkbox__input.is-checked .el-checkbox__inner {
                background-color: #fff;
                border-color: #26bcf9;
                &::after{
                  border-color: #26bcf9;
                }
              }
            }
          }
          padding-top: 5px;
        }
      }
    }
    .el-table__body tbody tr td .cell {
      padding: 0 3px;
    }
  }
  .el-dialog__footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    .dialog-footer {
    > div.pay-info-footer{
        text-align: right;
        > button.close-btn {
          width: 60px;
          height: 25px;
          margin: 0;
          line-height: 22px;
          border-color: $--color-blue-1;
          border: none;
          color: $--color-blue-1;
          font-size: 14px;
        }
        > button.state-btn {
          height: 35px;
          width: 120px;
          margin-left: 35px;
          border-radius: 5px;
          background-color: $--color-pink;
          border: none;
          &:hover{
            box-shadow: 0 1px 0 $--color-pink, 0 1px 1px rgba(0, 0, 0, 0.2);
            transform: scale(1.005);
          }
          user-select: none;
        }
      }
    }
  }
}
</style>
