<template>
  <section class="freight-write-off-order-details-comp">
    <header class="title is-bold">订单详情</header>
    <div class="box main" v-if="OrderDetail">
      <ul>
        <li class="title is-bold">
          产品信息
        </li>
        <li>
          <span class="label is-bold">生产工厂：</span><span class="value">{{ProductShowData.FactoryName}}</span>
        </li>
        <li class="product-info">
          <OrderDetailDisplayItem :ShowData='ProductShowData' :hiddenFactory="true" />
          <OrderDetailDisplayItem v-for="it in PartShowDataList" :ShowData='it' :key="it.Name" />
        </li>
        <!-- <li>
          <span class="label is-bold">原价：</span><span class="value">{{OrderDetail.OriginalPrice}}元</span>
        </li>
        <li>
          <span class="label is-bold">成交价：</span><span class="value is-pink is-bold">{{OrderDetail.FinalPrice}}元</span>
        </li> -->
        <li>
          <span class="label is-bold">已付：</span><span class="value">{{OrderDetail.Funds.HavePaid}}元</span>
        </li>
        <li>
          <span class="label is-bold">未付：</span><span class="value">{{OrderDetail.Funds.Unpaid}}元</span>
        </li>
        <li>
          <span class="label is-bold">退款：</span><span class="value">{{OrderDetail.Funds.Refund}}元</span>
        </li>
        <li>
          <span class="label is-bold">优惠券：</span><span class="value is-pink">{{OrderDetail.Funds.CouponAmount}}元</span>
        </li>
        <li>
          <span class="label is-bold">运费：</span><span class="value">{{OrderDetail.Funds.Freight}}元</span>
        </li>
        <li>
          <span class="label is-bold">已退运费：</span><span class="value">{{OrderDetail.Funds.RefundFreightAmount}}元</span>
        </li>
      </ul>
      <div class="box">
        <ul>
          <li class="title is-bold">
            客户信息
          </li>
          <li>
            <span class="label is-bold">客户编号：</span><span class="value">{{OrderDetail.Customer.CustomerSN}}</span>
          </li>
          <li>
            <span class="label is-bold">客户名称：</span><span class="value">{{OrderDetail.Customer.CustomerName}}</span>
          </li>
          <li>
            <span class="label is-bold">类型等级：</span><span class="value">{{OrderDetail.Customer.Grade.Second}} {{OrderDetail.Customer.Type.Second}}</span>
          </li>
          <li>
            <span class="label is-bold">销售区域：</span><span class="value">
              {{OrderDetail.Customer.SellArea.RegionalName}}
              {{OrderDetail.Customer.SellArea.CityName}}
              {{OrderDetail.Customer.SellArea.CountyName}}
            </span>
          </li>
          <li>
            <span class="label is-bold">配送方式：</span><span class="value">{{OrderDetail.Address.ExpressText}}</span>
          </li>
          <li>
            <span class="label is-bold">收件人：</span><span class="value">
              {{OrderDetail.Address.Address.Consignee}}
              {{OrderDetail.Address.Address.Mobile}}
            </span>
          </li>
          <li>
            <span class="label is-bold">收件地址：</span><span class="value">
              {{OrderDetail.Address.Address.ExpressArea.RegionalName}}
              {{OrderDetail.Address.Address.ExpressArea.CityName}}
              {{OrderDetail.Address.Address.ExpressArea.CountyName}}
              {{OrderDetail.Address.Address.AddressDetail}}
            </span>
          </li>
        </ul>
        <ul style="margin-top: 30px;">
          <li class="title is-bold">
            订单信息
          </li>
          <li>
            <span class="label is-bold">订单号：</span><span class="value">{{OrderDetail.OrderID}}</span>
          </li>
          <li>
            <span class="label is-bold">订单状态：</span><span class="value">
              <p> {{OrderDetail.Status | formatStatus}}</p>
            </span>
          </li>
          <li v-if="OrderDetail.Weight">
            <span class="label is-bold">理论重量：</span><span class="value">
              <i>{{OrderDetail.Weight}} 千克</i>
            </span>
          </li>
          <li>
            <span class="label is-bold">下单方式：</span><span class="value">
              <i>{{OrderDetail.OrderType | formatOrderTypeToText}}</i>
              <i class="is-gray" v-if="OrderDetail.TakerName">（ {{OrderDetail.TakerName}} ）</i>
            </span>
          </li>
          <li>
            <span class="label is-bold">下单时间：</span><span class="value">
              <span class="text is-gray">{{getDayDate(OrderDetail.CreateTime)}} </span>
              <span class="text is-gray">{{getMiDate(OrderDetail.CreateTime)}}</span>
            </span>
          </li>
          <li>
            <span class="label is-bold">付款时间：</span><span class="value">
              <span class="text is-gray">{{getDayDate(OrderDetail.PayTime)}} </span>
              <span class="text is-gray">{{getMiDate(OrderDetail.PayTime)}}</span>
            </span>
          </li>
          <li v-if="[254, 255].indexOf(OrderDetail.Status) === -1
          && OrderDetail.ProducePeriod && OrderDetail.ProducePeriod.TotalTime">
            <span class="label is-bold">{{OrderDetail.ProducePeriod.IncludeDiliveryTime ? '预计送达：' : '预计发货：'}}</span><span class="value">
              <span class="text is-gray">{{getDayDate(OrderDetail.ProducePeriod.TotalTime)}}</span>
            </span>
          </li>
          <li v-if="OrderDetail.Reduced">
            <span class="label is-bold">减尾款：</span><span class="value">{{OrderDetail.Reduced}}元</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import mixin from '@/assets/js/mixins/OrderList&FeedbackCommonDialogMixins/index';
import OrderDetailDisplayItem from '@/packages/OrderDetailDisplayItem';
import ShowProductDetail from '@/assets/js/TypeClass/ShowProductDetail';

export default {
  mixins: [mixin],
  props: {
    OrderDetail: {
      type: Object,
      default: () => null,
    },
  },
  components: {
    OrderDetailDisplayItem,
  },
  computed: {
    ...mapState('common', ['userTypeList']),
    ProductShowData() {
      let Name = this.OrderDetail?.ProductParams?.Attributes?.DisplayName || '产品名称';
      const FactoryName = this.OrderDetail?.ProductParams?.Attributes?.FactoryName || '';
      if (Array.isArray(this.OrderDetail?.ProductParams?.Attributes?.ClassList)) {
        const t = this.OrderDetail.ProductParams.Attributes.ClassList.find(it => it.Type === 1);
        if (t && t.SecondLevel?.Name) {
          Name = `${t.SecondLevel.Name}-${Name}`;
        }
      }
      if (this.OrderDetail?.ProductParams?.Attributes?.DisplayOrderList
      && this.OrderDetail.ProductParams.Attributes.DisplayOrderList.length > 0) {
        return {
          Name,
          FactoryName,
          ContentList: this.getPartShowList(this.OrderDetail.ProductParams.Attributes.DisplayOrderList, this.OrderDetail.ProductParams),
          Type: 'product',
        };
      }
      return {
        Name,
        FactoryName,
        ContentList: [],
        Type: 'product',
      };
    },
    PartList() {
      if (!this.OrderDetail) return [];
      if (!this.OrderDetail.ProductParams) return [];
      return this.OrderDetail.ProductParams.PartList;
    },
    PartShowDataList() {
      const arr = [];
      this.PartList.forEach(it => {
        if (Array.isArray(it.List)) {
          it.List.forEach((part, index) => {
            const ContentList = this.getPartShowList(it.Attributes.DisplayOrderList, part);
            const Name = it.List.length > 1 ? `${it.Attributes.Name}${index + 1}` : it.Attributes.Name;
            const temp = {
              Name,
              Type: 'Part',
              ContentList: ContentList || [],
            };
            arr.push(temp);
          });
        }
      });
      return arr;
    },
  },
  data() {
    return {};
  },
  methods: {
    getDayDate(time) {
      if (!time) return '';
      return time.split('.')[0].split('T')[0];
    },
    getMiDate(time) {
      if (!time) return '';
      return time.split('.')[0].split('T')[1];
    },
    getPartShowList(DisplayOrderList, ProductParams) {
      return ShowProductDetail.getDisplayContentFromPartDataByDetailData(DisplayOrderList, ProductParams);
    },
  },
  mounted() {},
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.freight-write-off-order-details-comp {
  padding-left: 10px;
  padding-right: 70px;
  box-sizing: border-box;
  width: 580px;
  // background-color: #F4FCFF;
  // padding-top: 10px;
  height: 608px;
  box-sizing: border-box;
  position: relative;
  >.title{
    font-size: 16px;
    line-height: 20px;
    position: absolute;
    margin-bottom: 20px;
    top: -30px;
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
    height: calc(100% - 40px);
    >ul{
      width: calc(50% - 20px);
      flex: 1;
      margin-right: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      position: relative;
      // max-height: calc(100% - 40px);
      .title{
        position: sticky;
        top: 0;
        padding-top: 10px;
        margin-top: 0;
        background-color: #fff;
        z-index: 2;
      }
      li{
        &.download-box{
          > button, .link {
            margin: 0;
            height: 16px;
            line-height: 13px;
            border: none;
            padding: 0;
            width: 6em;
            overflow: hidden;
            font-size: 12px;
            position: relative;
            text-align: center;
            left: 0;
            box-shadow: none;
            color: #26bcf9;
            text-decoration: none;
            cursor: pointer;
            &:hover {
              color: $--color-primary-light;
              font-size: 12px !important;
              text-decoration: underline;
            }
            & + .link {
              margin-left: 12px
            }
          }
        }
      }
    }
    >.box{
      flex: 1;
      width: 50%;
    }
  }
  .box{
    .mp-order-detail-item-comp-wrap{
      >li{
        line-height: 15px;
        >.label{
          font-size: 12px;
          color: #000;
          font-weight: 700;
        }
        >.text{
          color: #444;
          font-weight: 400;
          min-height: 15px;
          .craft-content-list{
            padding-top: 0;
            line-height: 15px
          }
        }
      }
    }
    >ul{
      >li{
        display: flex;
        font-size: 12px;
        margin-top: 10px;
        line-height: 15px;
        color: #000;
        &.product-info{
          display: block;
        }
        &.title{
          font-size: 14px;
          color: #444;
        }
        >.value{
          color: #444;
          flex: 1;
          > a {
            color: #26BCF9;
            cursor: pointer;
          }
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
