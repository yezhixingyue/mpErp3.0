<template>
  <section class="order-details-comp">
    <header class="title is-bold">订单详情</header>
    <div class="box main">
      <ul>
        <li class="title is-bold">
          订单信息
        </li>
        <li>
          <span class="label is-bold">售后次数：</span><span class="value">0次（点击查看详情）</span>
        </li>
        <li>
          <span class="label is-bold">订单号：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">售后单号：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">产品：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">工厂：</span><span class="value">订单详情</span>
        </li>
        <li></li>
        <li>
          <span class="label is-bold">物料：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">数量：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">款数：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">尺寸：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">印面：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">印色：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">是否带R标：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">其他工艺：</span><span class="value">订单详情</span>
        </li>
        <li></li>
        <li>
          <span class="label is-bold">下单方式：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">下单时间：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">付款时间：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">付款时间：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">当前状态：</span><span class="value">订单详情</span>
        </li>
      </ul>
      <div class="box">
        <ul>
          <li class="title is-bold">
            价格
          </li>
          <li>
            <span class="label is-bold">原价：</span><span class="value">湿货、生产质量问题、材料质量问题、晚货</span>
          </li>
          <li>
            <span class="label is-bold">成交价：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">已付：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">未付：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">退款：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">优惠券：</span><span class="value">sasss</span>
          </li>
          <li>
            <span class="label is-bold">运费：</span><span class="value">bbbb</span>
          </li>
        </ul>
        <ul style="margin-top: 30px;">
          <li class="title is-bold">
            客户
          </li>
          <li>
            <span class="label is-bold">售后次数：</span><span class="value">湿货、生产质量问题、材料质量问题、晚货</span>
          </li>
          <li>
            <span class="label is-bold">客户编号：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">客户名称：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">类型等级：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">销售区域：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">配送方式：</span><span class="value">aaaaaa</span>
          </li>
          <li>
            <span class="label is-bold">收件人：</span><span class="value">bbbbbbbb</span>
          </li>
          <li>
            <span class="label is-bold">收件地址：</span><span class="value">bbbbbbbb</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    dataList: {
      type: Array,
      default: () => ([]),
    },
  },

  components: {
  },
  computed: {
    ...mapState('common', ['userTypeList']),
  },
  data() {
    return {

    };
  },
  methods: {

  },
  mounted() {

  },
};
</script>

<style lang='scss'>
.order-details-comp {
  padding-left: 38px;
  padding-right: 20px;
  box-sizing: border-box;
  width: 520px;
  background-color: #F4FCFF;
  padding-top: 10px;
  height: 608px;
  box-sizing: border-box;
  >.title{
    font-size: 16px;
    line-height: 20px;
    position: relative;
    margin-bottom: 20px;
    &::before{
      content: "";
      display: inline-block;
      height: 14px;
      width: 3px;
      position: absolute;
      left: -8px;
      top: 3px;
      background: linear-gradient( 180deg, #32DAF9 0%, #28C1F9 100%);
    }
  }
  >.main{
    display: flex;
    >ul{
      width: 50%;
      flex: 1;
      padding-right: 20px;
      box-sizing: border-box;
    }
    >.box{
      flex: 1;
      width: 50%;
    }
  }
  .box{
    >ul{
      li{
        display: flex;
        font-size: 12px;
        margin-top: 10px;
        line-height: 15px;
        color: #000;
        &.title{
          font-size: 14px;
          color: #444;
        }
        >.value{
          color: #444;
          flex: 1;
        }
        .image-list{
          display: flex;
          flex-wrap: wrap;
          img{
            width: 107px;
            height: 75px;
            border-radius: 4px;
            margin-right: 10px;
            margin-bottom: 10px;
            &:nth-child(3n){
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
</style>
