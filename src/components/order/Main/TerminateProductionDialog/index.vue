<template>
  <el-dialog
    :top="`${OrderData?.IsOwnFactory ? 'calc(50vh - 392px)' : 'calc(50vh - 260px)'}`"
    :visible="visible"
    :width="`${OrderData?.IsOwnFactory ? '1270px' : '900px'}`"
    :modal='false'
    @close='close'
    @open='open'
    center
    v-dialogDrag
    :close-on-click-modal='false'
    class="terminate-production-dialog"
    :class="{IsOwnFactory: !OrderData?.IsOwnFactory}"
  >
    <div class="dialog-main">
      <titleComp :OrderData="OrderData"/>
      <refreshBox v-if="OrderData?.IsOwnFactory" @refresh="refresh"/>
      <formTableComp v-if="OrderData?.IsOwnFactory && ProductionInfo"
      :list="ProductionInfo.PlateList" :formValue="formValue" @changeValue="data => formValue[data.ID] = data.value"/>
      <div class="from-box" :style="'height: auto;'">
        <div class="left-tible" v-if="OrderData?.IsOwnFactory && ProductionInfo" style="width: 507px;">
          <h3>其他{{ProductionInfo?.ChunkList.length}}块已裁切，如若取消，未做工序会一并取消</h3>
          <pieceTableComp :OrderData="OrderData" :list="ProductionInfo.ChunkList" />
        </div>
        <div class="right-from" style="width: 507px;">
          <h3 v-if="OrderData?.IsOwnFactory && ProductionInfo">已生产完成{{ProductionInfo.FinishedKindCount}}款（共{{OrderData.KindCount}}款）</h3>
          <rightFromBox :orderInfo="ProductionStopQuery" :OrderData="OrderData" @AmountChange="AmountChange"
            @PaymentMethodChange="PaymentMethodChange"
            :Amount="Amount" :PaymentMethod="PaymentMethod"/>
        </div>
      </div>
      <div class="confirm-cancellation-btns">
        <el-button @click="confirm" type="primary" class="yes">提交</el-button>
        <el-button @click="close">取消</el-button>
      </div>
      <PayCodeDialog :visible="PayCodeVisible" @closeSuperiors='close' @close='PayCodeDialogClose'
        :PayCodeData="PayCodeData" :OrderID="OrderData?.OrderID" @seccess="paySeccess"/>
    </div>
    <!-- <div v-else class="no-data">
      <p>{{initLoading?'':'未获取到生产数据'}}</p>
      <el-button @click="close">关闭</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { formatListItemSize, formatListItemCraft } from '@/assets/js/filters/filters';
import titleComp from './title.vue';
import formTableComp from './formTableComp.vue';
import refreshBox from './refreshBox.vue';
import pieceTableComp from './pieceTableComp.vue';
import rightFromBox from './rightFromBox.vue';
import PayCodeDialog from '../PayCodeDialog.vue';

export default {
  props: {
    visible: {
      type: Boolean,
    },
    OrderData: {
      type: Object,
    },
  },
  components: {
    titleComp,
    formTableComp,
    refreshBox,
    pieceTableComp,
    rightFromBox,
    PayCodeDialog,
  },
  data() {
    return {
      initLoading: false,
      dialogVisible: false,
      tableList: [],
      formValue: {},
      Amount: null,
      PaymentMethod: 0,
      PayCodeVisible: false,
      PayCodeData: null,

      ProductionStopQuery: null,
      ProductionInfo: null,
      isOverTime: false,
      timer: null,
    };
  },
  computed: {
    ...mapState('orderModule', ['OrderStatusList']),
    // 终止生产的状态
    canStopProductionStatuses() {
      return this.OrderStatusList.filter(it => it.canStopProduction === true).map(it => it.ID);
    },
  },
  methods: {
    AmountChange(Amount) {
      this.Amount = Amount;
    },
    PaymentMethodChange(PaymentMethod) {
      this.PaymentMethod = PaymentMethod;
    },
    paySeccess() {
      // this.submit();
      this.PayCodeDialogClose();
      this.$emit('yes');
    },
    PayCodeDialogClose() {
      this.PayCodeVisible = false;
      this.PayCodeData = null;
    },
    refreshTime() {
      clearInterval(this.timer);
      this.isOverTime = false;
      const num = 1000 * 60 * 5;
      this.timer = setTimeout(() => {
        this.isOverTime = true;
      }, num);
    },
    close() {
      this.Amount = null;
      this.ProductionInfo = null;
      this.PaymentMethod = 0;
      this.$emit('close');
      this.formValue = {};
    },
    submit() {
      const _temp = {
        ID: this.ProductionInfo?.ID || '',
        OrderID: this.OrderData.OrderID,
        PayCode: this.PayCodeData?.PayCode || '',
        StopLossAmount: this.Amount,
        PayType: this.PaymentMethod,
        PlateList: [],
      };
      if (this.OrderData?.IsOwnFactory && this.ProductionInfo) {
        _temp.PlateList = this.ProductionInfo.PlateList.map(it => ({ ...it, IsWholePlate: this.formValue[it.ID] === 2 }));
      }
      // 请求取消接口
      this.api.getOrderProductionStopSave(_temp).then(res => {
        if (res.data.Status === 1000) {
          // 后台规定：返回值Status不是1000并且Data有值（后台保证其他Status情况下Data为空）的情况下为需要扫二维码进行支付
          this.$emit('yes');
        } else if (res.data.Data) {
          // 弹框二维码框进行支付
          this.PayCodeData = res.data.Data;
          this.PayCodeVisible = true;
        } else {
          // 取消失败 （其他任何失败（Status非1000））
          this.messageBox.failSingleError('操作失败', `[ ${res.data.Message} ]`);
        }
      });
    },
    confirm() {
      const reg = /(^\d*[0-9]\d*(\.\d{1,2})?$)|0\.(\d?[0-9]|[0-9]\d?)$/;
      const temp = Object.keys(this.formValue).filter(res => !this.formValue[res]);
      if (temp.length) {
        this.messageBox.failSingleError('提交失败', '请选择大版取消方式');
        return;
      }
      if (this.Amount === '' || this.Amount === null) {
        this.messageBox.failSingleError('提交失败', '请输入扣除损失金额');
        return;
      }
      if (Number(this.Amount) > 999999) {
        this.messageBox.failSingleError('提交失败', '请输入小于一百万的扣除损失金额');
        return;
      }
      if (Number(this.Amount) === 0 && this.OrderData.IsOwnFactory
      && (!this.ProductionInfo || this.ProductionInfo.PlateList.length + this.ProductionInfo.ChunkList.length + this.ProductionInfo.FinishedKindCount)) {
        this.messageBox.failSingleError('提交失败', '工厂已产生损失，请正确输入扣除损失金额');
        return;
      }
      if (!reg.test(this.Amount)) {
        this.messageBox.failSingleError('提交失败', '请正确输入扣除损失金额');
        return;
      }
      const cb = () => {
        this.refreshTime();
        this.initData();
      };
      if (this.isOverTime) {
        this.messageBox.warnSingleError('此对话框如停留时间过长，相关信息可能会发生改变，请刷新信息后提交', cb, cb, '注意', '刷新');
      } else {
        this.submit();
      }
    },
    open() {
      // this.api.getOrderProductionStopCancelPay(this.OrderData.OrderID);
      this.refreshTime();
      this.initData();
    },
    getOrderProductionStopQuery() {
      this.api.getOrderProductionStopQuery({ OrderID: this.OrderData.OrderID, SearchType: 1 }).then((ProductionStopQueryRes) => {
        this.initLoading = false;
        if (ProductionStopQueryRes.data.Status === 1000) {
          this.ProductionStopQuery = ProductionStopQueryRes.data.Data;
        }
      }).catch((err) => {
        this.initLoading = false;
        throw new Error(err);
      });
    },
    initData() {
      this.initLoading = true;
      if (this.OrderData.IsOwnFactory) {
        const PromiseList = [
          this.api.getOrderProductionStopQuery({ OrderID: this.OrderData.OrderID, SearchType: 1 }).catch(() => {}),
        ];
        if (this.canStopProductionStatuses.includes(this.OrderData.Status)) {
          PromiseList.push(
            this.api.getOrderProductionInfo(this.OrderData.OrderID).catch(() => {}),
          );
          Promise.all(PromiseList).then(([ProductionStopQueryRes, ProductionInfoRes]) => {
            this.initLoading = false;
            if (ProductionStopQueryRes.data.Status === 1000 && ProductionInfoRes.data.Status === 1000) {
              this.ProductionStopQuery = ProductionStopQueryRes.data.Data;
              this.ProductionInfo = ProductionInfoRes.data.Data;
            }
            if (ProductionInfoRes.data.Status !== 1000) {
              const cb = () => { this.close(); }; // 生产拼板中不能取消 （取消订单时弹框提示 点确定时关闭取消生产弹框）
              this.messageBox.failSingleError('操作失败', `[ ${ProductionInfoRes.data.Message} ]`, cb, cb);
            }
            const tempValue = {};
            if (this.ProductionInfo) {
              this.ProductionInfo.PlateList.forEach(element => {
                tempValue[element.ID] = this.formValue[element.ID] || 0;
              });
              this.formValue = { ...tempValue };
            }
          }).catch((err) => {
            this.initLoading = false;
            throw new Error(err);
          });
        } else {
          this.getOrderProductionStopQuery();
        }
      } else {
        this.getOrderProductionStopQuery();
      }
    },
    refresh() {
      this.open();
    },

    formatCraft(list) {
      return formatListItemCraft(list);
    },
    formatSize(list) {
      return formatListItemSize(list);
    },
  },
};
</script>

<style lang='scss'>
.terminate-production-dialog{
  &.IsOwnFactory{
    >.el-dialog--center{
      >.el-dialog__body{
        min-height: 510px;
      }
    }
  }
  >.el-dialog--center{
    >.el-dialog__header{
      display: none;
    }
    >.el-dialog__body{
      //height: 784px;
      box-sizing: border-box;
      padding: 0;
      .dialog-main{
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0 30px;
        padding-bottom: 30px;
        .from-box{
          display: flex;
          margin-top: 30px;
          height: 193px;
          h3{
            font-size: 16px;
            color: #444;
            font-weight: 700;
            line-height: 36px;
          }
          >.right-from{
            padding-left: 65px;
            display: flex;
            flex-direction: column;
            flex: 1;
            h3{
              color: #FF003A;
            }
          }
        }
        .confirm-cancellation-btns{
          // padding-bottom: 50px;
          margin-top: 65px;
          text-align: center;
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
          >.yes{
            background: linear-gradient(to right, #26bcf9, #35dff9);
            border: none;
            color: #fff;
            &:hover{
              opacity: 0.88;
            }
          }
        }
      }
      .no-data{
        text-align: center;
        >p{
          font-size: 20px;
          padding: 300px 0 300px 0;
        }
        .el-button{
          width: 120px;
        }
      }
    }
  }
}
</style>
