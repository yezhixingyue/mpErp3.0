<template>
    <main class="feed-tables">
      <header>
        <p class="mp-common-title-wrap">商品信息</p>
      </header>
      <!-- 商品信息 -->
      <table class="product-info">
        <tr>
          <td>商品名称</td>
          <td>文件内容</td>
          <td>数量</td>
          <td>尺寸</td>
          <td>可选工艺</td>
          <td>价格合计</td>
        </tr>
        <tr>
          <td>b4</td>
          <td>b5</td>
          <td>b5</td>
          <td>b6</td>
          <td>b5</td>
          <td>b6</td>
        </tr>
      </table>

      <header>
        <p class="mp-common-title-wrap">订单信息</p>
      </header>
      <!-- 订单信息 -->
      <table class="order info-common">
        <tr>
          <td>订单编号</td>
          <td>a</td>
          <td>下单时间</td>
          <td>a</td>
        </tr>
        <tr>
          <td>订单状态</td>
          <td>b5</td>
          <td>配送方式</td>
          <td>b5</td>
        </tr>
        <tr>
          <td>收件人</td>
          <td>b5</td>
          <td>收件地址</td>
          <td>b5</td>
        </tr>
        <tr>
          <td>客户编号</td>
          <td>b5</td>
          <td>客户名称</td>
          <td>b5</td>
        </tr>
        <tr>
          <td>联系方式</td>
          <td>b5</td>
          <td>QQ号</td>
          <td>b5</td>
        </tr>
        <tr>
          <td>总金额</td>
          <td>b5</td>
          <td>已付</td>
          <td>b5</td>
        </tr>
        <tr>
          <td>运费</td>
          <td>b5</td>
          <td>订单退款</td>
          <td>b5</td>
        </tr>
        <tr>
          <td>运费退款</td>
          <td>b5</td>
          <td>售后优惠</td>
          <td>b5</td>
        </tr>
        <tr>
          <td>订单文件</td>
          <td>b5</td>
          <td>订单备注</td>
          <td>b5</td>
        </tr>
      </table>

      <header>
        <p class="mp-common-title-wrap">服务单信息</p>
      </header>
      <!-- 服务单信息 -->
      <table class="serve info-common">
        <tr>
          <td>服务单号</td>
          <td>a</td>
          <td>处理进度</td>
          <td>a</td>
        </tr>
        <tr>
          <td>申请时间</td>
          <td>b5</td>
          <td>联系人名称</td>
          <td>b5</td>
        </tr>
        <tr>
          <td>联系电话</td>
          <td>b5</td>
          <td>QQ号</td>
          <td>b5</td>
        </tr>
        <tr>
          <td>问题类型</td>
          <td>b5</td>
          <td>问题描述</td>
          <td>b5</td>
        </tr>
        <tr>
          <td>诉求意向</td>
          <td>b5</td>
          <td>退款金额</td>
          <td>b5</td>
        </tr>
        <tr>
          <td>上传照片</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>

      <header>
        <p class="mp-common-title-wrap"> 转交记录</p>
      </header>
      <!--  转交记录 -->

      <header>
        <p class="mp-common-title-wrap"> 挂起记录</p>
      </header>
      <!--  挂起记录 -->
    </main>
</template>

<script>

export default {
  name: 'tables',


};
</script>
<style lang='scss'>
  .feed-tables {
    flex: 1;
    box-sizing: border-box;
    padding: 0 20px;
    header{
      padding: 20px 0;
    }
    table{
      width: 1000px;
      border: 1px solid #e6e6e6;
      color: #444;
      font-size: 14px;
      td{
        border: 1px solid #e6e6e6;
        box-sizing: border-box;
        padding: 0 10px;
        line-height: 3em;
      }
    }
    .product-info{
      tr:nth-child(1){
        background-color: #f5f5f5;
      }
      td{
        text-align: center;
      }
    }
    .info-common{
      text-align: left;
      >tr{
        td:nth-child(1),td:nth-child(3){
          background-color: #f5f5f5;
          width: 160px;
          text-align: center;
        }
      }
    }
  }
</style>
