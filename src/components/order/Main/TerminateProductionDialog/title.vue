<template>
  <div class="terminate-production-top">
    <div class="title">
      <img src="@/assets/images/danger.png" alt="">
      <div>
        <template v-if="OrderData?.IsOwnFactory">
          自主工厂订单生产中，取消将产生损失，如若取消，请完善相关信息后提交
        </template>
        <template v-else>
          外购工厂订单生产中，取消将产生损失，如若取消，请与外购工厂沟通确认
        </template>
      </div>
    </div>
    <ul class="order-info"  v-if="OrderData">
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
        <span>客户:</span>
        <p>{{OrderData.CustomerName}}（{{OrderData.CustomerNo}}）</p>
      </li>
      <li>
        <span>物料:</span>
        <p>{{OrderData.MaterialList.join('、')}}</p>
      </li>
      <li>
        <span>文件内容:</span>
        <p>{{OrderData.Content}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { formatListItemSize, formatListItemCraft } from '@/assets/js/filters/filters';

export default {
  props: {
    OrderData: {
      type: Object,
    },
  },
  methods: {
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
.terminate-production-top{
  .title{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 45px;
    img{
      width: 46px;
      height: 36px;
      margin-right: 10px;
    }
    >div{
      font-size: 20px;
      color: #FF003A;
      font-weight: 700;
    }
  }
  .order-info{
    display: flex;
    margin-top: 27px;
    flex-wrap: wrap;
    background-color: #F5F5F5;
    border-radius: 4px;
    font-size: 14px;
    padding: 5px 0px;
    margin-top: 30px;
    >li{
      display: flex;
      color: #444;
      width: 50%;
      max-width: 50%;
      margin: 0;
      line-height: 24px;
      span{
        font-weight: 700;
        margin-right: 10px;
        min-width: 110px;
        text-align: right;
      }
      p{
        i+i{
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
