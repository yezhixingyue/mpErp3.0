<template>
  <div class="right-from-box">
    <div>
      <ul class="left">
        <li>
          <span class="label">订单成交价:</span>
          <span class="value">125.00元</span>
        </li>
        <li>
          <span class="label">已付金额:</span>
          <span class="value">125.00元</span>
        </li>
        <li>
          <span class="label">已退款:</span>
          <span class="value">125.00元</span>
        </li>
        <li>
          <span class="label">客户账户余额:</span>
          <span class="value">125.00元</span>
        </li>
      </ul>
      <div class="line"></div>
      <ul class="right">
        <li>
          <span class="label">扣除损失金额:</span>
          <span class="value">
            <el-input size="small" placeholder="请输入损失金额"></el-input>
            元
          </span>
        </li>
        <li>
          <span class="label">订单已付款不足时:</span>
          <span class="value">
            <el-radio-group>
              <el-radio :label="3">优先扣除账户余额，不足部分扫码支付</el-radio>
              <el-radio :label="6">使用扫码支付</el-radio>
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
  methods: {
    refresh() {
      this.$emit('refresh');
    },
  },
};
</script>

<style lang='scss'>
.right-from-box{
  color: #444444;
  margin-top: -10px;
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
