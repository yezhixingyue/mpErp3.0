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
    class="pay-code-freight-write-off-dialog-comp"
  >
    <div class="dialog-box" v-if="PayCodeData">
      <p class="title is-bold">收取差额</p>
      <div class="code-img">
        <img :src="PayCodeData.PayWay.AllinPay" alt="">
      </div>
      <div class="customer">
        客户名称：{{CustomerName}}
      </div>
      <div class="tip-txt">
        <span>[请使用微信/支付宝扫一扫，扫描二维码支付]</span>
      </div>
      <div class="unpaid">
        <p>扫码支付：<span>￥<i>{{Math.abs(PayCodeData.Amount)}}</i>元</span></p>
      </div>
      <div class="pay-type">
        支付类型：运费差价
      </div>
      <div class="btns">
        <el-button @click="close">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
    },
    PayCodeData: {
      type: Object,
    },
    ChangeID: {
      type: Number,
    },
    CustomerName: {
      type: String,
    },
  },
  data() {
    return {
      rollPoling: false,
    };
  },
  computed: {},
  methods: {
    async openRollPoling() {
      if (!this.visible) return;
      // 轮询付款状态
      const res = await this.api.getPayExpressPayResult(this.ChangeID);
      if (res.data.Status === 1000) {
        if (res.data.Data === 'True') {
          this.rollPoling = true;
        }
      } else {
        const cb = () => {
          this.close();
        };
        this.messageBox.failSingleError('操作失败', `[ ${res.data.Message} ]`, cb, cb);
        return;
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
    close() {
      this.$emit('close');
    },
    open() {
      this.rollPoling = false;
      this.openRollPoling(); // 轮询
    },
  },
};
</script>

<style lang='scss'>
.pay-code-freight-write-off-dialog-comp{
  >.el-dialog--center{
    >.el-dialog__header{
      .el-dialog__headerbtn{
        top: 15px;
      }
    }
    >.el-dialog__body{
      height: 470px;
      box-sizing: border-box;
      padding: 0;
      color: #444444;
      font-size: 12px;
      line-height: 15px;
      >.dialog-box{
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0;
        text-align: center;
        >.title{
          line-height: 20px;
          font-size: 16px;
          margin-bottom: 10px;
        }
        >.code-img{
          // margin-top: 40px;
          display: flex;
          align-items: center;
          flex-direction: column;
          >img{
            width: 207px;
            height: 207px;
          }
        }
        >.customer{
          margin-top: 20px;
        }
        >.tip-txt{
          margin-top: 10px;
          color: #989898;
        }
        >.unpaid{
          margin-top: 10px;
          line-height: 20px;
          >p{
            >span{
              font-size: 16px;
              color: #FF003A;
            }
          }
        }
        >.pay-type{
          margin-top: 10px;
        }
        >.btns{
          margin-top: 43px;
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
