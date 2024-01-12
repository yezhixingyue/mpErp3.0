<template>
  <el-dialog
    top="calc(50vh - 182px)"
    :visible="visible"
    width="684px"
    :modal='false'
    @close='close'
    center
    v-dialogDrag
    :close-on-click-modal='false'
    class="confirm-cancellation-dialog"
  >
    <div class="dialog-main">
      <div class="title">
        <img src="@/assets/images/过期.png" alt="">
        <div>
          <p>此订单未开始生产</p>
          <p>取消不会产生损失，是否要取消？</p>
        </div>
      </div>
      <ul class="order-info"  v-if="OrderData">
        <li>
          <span>客户:</span>
          <p>{{OrderData.CustomerName}}（{{OrderData.CustomerNo}}）</p>
        </li>
        <li>
          <span>订单信息:</span>
          <p>
            <i>{{OrderData.OrderID}}</i>
            <i>{{OrderData.ProductName}}</i>
            <i>{{OrderData.kindCount}}款</i>
            <i>{{OrderData.ProductAmount}}{{OrderData.Unit}}</i>
            <i>{{formatCraft(OrderData.CraftList)}}</i>
            <i>{{formatSize(OrderData.SizeList)}}</i>
          </p>
        </li>
        <li>
          <span>文件内容:</span>
          <p>{{OrderData.Content}}</p>
        </li>
      </ul>
      <div class="confirm-cancellation-btns">
        <el-button @click="submit" type="primary" class="yes">是</el-button>
        <el-button @click="close">否</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { formatListItemSize, formatListItemCraft } from '@/assets/js/filters/filters';

export default {
  props: {
    visible: {
      type: Boolean,
    },
    OrderData: {
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submit() {
      this.$emit('yes');
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
.confirm-cancellation-dialog{
  .el-dialog__header{
    display: none;
  }
  .el-dialog__body{
    height: 364px;
    box-sizing: border-box;
    padding: 0;
    .dialog-main{
      display: flex;
      flex-direction: column;
      height: 100%;
      .title{
        display: flex;
        padding-top: 60px;
        img{
          width: 67px;
          height: 67px;
          margin-left: 120px;
          margin-right: 20px;
        }
        >div{
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 24px;
          color: #444;
          font-weight: 700;
        }
      }
      .order-info{
        flex: 1;
        margin-top: 27px;
        padding-right: 30px;
        >li + li{
          margin-top: 5px;
        }
        >li{
          display: flex;
          font-size: 14px;
          color: #444;
          span{
            font-weight: 700;
            margin-right: 10px;
            min-width: 204px;
            text-align: right;
          }
          p{
            line-height: 18px;
            i+i{
              margin-left: 5px;
            }
          }
        }
      }
      .confirm-cancellation-btns{
        padding-bottom: 50px;
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
  }
}
</style>
