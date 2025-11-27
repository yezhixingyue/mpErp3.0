<template>
  <div class="right-from-box" :class="{center:!OrderData?.IsOwnFactory}">
    <div>
      <ul class="left">
        <li>
          <span class="label">订单成交价:</span>
          <span class="value">{{ OrderData.Funds.FinalPrice }}元</span>
        </li>
        <li>
          <span class="label">运费:</span>
          <span class="value" v-if="orderInfo">{{ orderInfo.Order.Freight }}元</span>
        </li>
        <li>
          <span class="label">已付金额:</span>
          <span class="value" v-if="orderInfo">{{ orderInfo.Order.PaidAmount }}元</span>
        </li>
        <li>
          <span class="label">已退款:</span>
          <span class="value" v-if="orderInfo">{{ orderInfo.Order.RefundAmount }}元</span>
        </li>
        <li>
          <span class="label">客户账户余额:</span>
          <span class="value" v-if="orderInfo">{{ orderInfo.OrderCustomer.Amount }}元</span>
        </li>
      </ul>
      <div class="line"></div>
      <ul class="right">
        <li>
          <span class="label">扣除损失金额:</span>
          <span class="value">
            <el-input size="small" v-model="AmountValue" placeholder="请输入损失金额"></el-input>
            元
          </span>
        </li>
        <li style="margin-top: 10px;">
          <span class="label">订单已付款不足时:</span>
          <span class="value">
            <el-radio-group v-model="PaymentMethodValue">
              <el-radio :label="0">优先扣除账户余额，不足部分扫码支付</el-radio>
              <el-radio :label="1">使用扫码支付</el-radio>
            </el-radio-group>
          </span>
        </li>
      </ul>
    </div>
    <p>注意：以上信息仅供参考，此对话框如停留时间过长，相关信息可能会发生改变</p>
  </div>
</template>

<script>
export default {
  props: {
    Amount: {
      type: String,
    },
    PaymentMethod: {
      type: Number,
    },
    orderInfo: {
      type: Object,
    },
    OrderData: {
      type: Object,
    },
  },
  methods: {
    refresh() {
      this.$emit('refresh');
    },
  },
  computed: {
    AmountValue: {
      get() {
        return this.Amount;
      },
      set(val) {
        this.$emit('AmountChange', (val || '').match(/^\d*(\.?\d{0,2})/g)[0]);
      },
    },
    PaymentMethodValue: {
      get() {
        return this.PaymentMethod;
      },
      set(val) {
        this.$emit('PaymentMethodChange', val);
      },
    },
  },
};
</script>

<style lang='scss'>
.right-from-box{
  color: #444444;
  margin-top: -10px;
  &.center{
    >div{
      justify-content: center
    }
    >p{
      text-align: center;
    }
  }
  >p{
    color: #888888;
    margin-top: 3px;
  }
  >div{
    margin-bottom: 10px;
    height: 140px;
    display: flex;
    >.line{
      width: 1px;
      height: 100%;
      background-color: #E5E5E5;
    }
    >.left{
      width: 226px;
      box-sizing: border-box;
      padding-top: 26px;
      >li+li{
        margin-top: 10px;
      }
      >li{
        display: flex;
        >.label{
          width: 6.5em;
          text-align: right;
          font-weight: 700;
        }
      }
    }
    >.right{
      box-sizing: border-box;
      padding-top: 26px;
      >li{
        display: flex;
        line-height: 30px;
        >.label{
          width: 140px;
          text-align: right;
          font-weight: 700;
          margin-right: 10px;
        }
        >.value{
          display: flex;
          .el-input{
            height: 30px;
            margin-right: 10px;
            width: 150px;
            input{
              height: 30px;
            }
          }
          .el-radio-group{
            width: 230px;
            .el-radio{
              margin: 0;
              .el-radio__label{
                color: #444444;
                line-height: 30px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
