<template>
  <el-dialog
    top="calc(50vh - 273px)"
    :visible="visible"
    width="550px"
    :modal='false'
    @close='close'
    @open='open'
    center
    v-dialogDrag
    :close-on-click-modal='false'
    class="pay-code-dialog"
  >
    <div class="dialog-box" v-if="PayCodeData">
      <div class="code-img">
        <img :src="PayCodeData.PayWay.AllinPay" alt="">
        <span>[请使用微信/支付宝扫一扫，扫描二维码支付]</span>
      </div>
      <div class="count-down">
        <span>付款倒计时</span>
        <p><i>00</i>:<i>0{{fen}}</i>:<i>{{miao}}</i></p>
      </div>
      <div class="unpaid">
        <p>扫码支付：<span>￥ <i>{{PayCodeData.Amount}}</i> 元</span></p>
      </div>
      <div class="notice">
        注意：支付成功后，订单才能取消成功。
      </div>
      <div class="tip">
        如果此页面停留时间太久，生产损失将进一步扩大，请工作人员敦促客户尽快付款。
      </div>
      <div class="btns">
        <el-button @click="close">取消支付</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    visible: {
      type: Boolean,
    },
    PayCodeData: {
      type: Object,
    },
    OrderID: {
      type: Number,
    },
  },
  data() {
    return {
      timeRemaining: 300,
      rollPoling: false,
      key: true,
    };
  },
  computed: {
    ...mapState('orderModule', ['objForOrderList']),
    fen() {
      return Math.floor(this.timeRemaining / 60);
    },
    miao() {
      const num = this.timeRemaining % 60;
      return num < 10 ? `0${num}` : num;
    },
  },
  methods: {
    ...mapActions('orderModule', ['getOrderTableData']),
    openTimer() {
      const tiemr = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining -= 1;
        } else {
          clearInterval(tiemr);
          this.close();
        }
      }, 1000);
    },
    async openRollPoling() {
      // 轮询付款状态
      // this.rollPoling = false;
      const res = await this.api.getPayResultExtend(this.PayCodeData.PayCode, this.OrderID);
      if (res.data.Status !== 9015) {
        if (res.data.Status === 1000) {
          this.rollPoling = true;
        } else if (res.data.Status === 1100) {
          const cb = () => {
            this.close();
            this.$emit('closeSuperiors');
            this.getOrderTableData({ page: this.objForOrderList.Page, type: 'get' });
          };
          this.messageBox.failSingleError('操作失败', `[ ${res.data.Message} ]`, cb, cb);
          return;
        } else {
          return;
        }
      }

      if (this.rollPoling) {
        this.$emit('seccess');
      } else {
        setTimeout(() => {
          if (this.visible) {
            this.openRollPoling();
          }
        }, 2000);
      }
    },
    CanclePay() {
      if (this.key) {
        this.api.getOrderProductionStopCancelPay(this.OrderID, this.PayCodeData.PayCode);
        this.key = false;
      }
    },
    close() {
      this.CanclePay();
      this.$emit('close');
      this.timeRemaining = 0;
      // 关闭轮询
    },
    open() {
      this.rollPoling = false;
      this.timeRemaining = 299;
      this.openTimer(); // 定时器
      this.openRollPoling(); // 轮询
      this.key = true;
    },
  },
  unmounted() {
    this.CanclePay();
  },
};
</script>

<style lang='scss'>
.pay-code-dialog{
  >.el-dialog--center{
    >.el-dialog__header{
      display: none;
    }
    >.el-dialog__body{
      height: 546px;
      box-sizing: border-box;
      padding: 0;
      >.dialog-box{
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0;
        text-align: center;
        >.code-img{
          margin-top: 40px;
          display: flex;
          align-items: center;
          flex-direction: column;
          >img{
            width: 228px;
            height: 228px;
          }
          >span{
            font-size: 12px;
            margin-top: 10px;
            color: #888888;
          }
        }
        >.count-down{
          margin-top: 10px;
          >span{
            font-size: 12px;
            color: #444444;
            margin-top: 10px;
            font-weight: 700;
          }
          >p{
            margin-top: 10px;
            font-size: 22px;
            color: #FF003A;
            line-height: 28px;
            >i{
              padding: 0 2px;
              border-radius: 5px;
              background-color: #FFE5EB;
            }
          }
        }
        >.unpaid{
          color: #444444;
          margin-top: 10px;
          >p{
            line-height: 18px;
            >span{
              font-size: 16px;
              color: #FF003A;
            }
          }
        }
        >.notice{
          font-size: 14px;
          color: #444;
          margin-top: 20px;
          font-weight: 700;
        }
        >.tip{
          margin: 0 38px;
          margin-top: 10px;
          background-color: #FFF6E5;
          color: #FF9100;
          font-size: 12px;
          line-height: 27px;
        }
        >.btns{
          margin-top: 20px;
          >.el-button{
            width: 120px;
            height: 35px;
            padding: 0;
            line-height: 35px;
            border-color: #26BCF9;
            color: #26BCF9;
            &.el-button+.el-button{
              margin-left: 30px;
            }
          }
        }
      }
    }
  }
}
</style>
