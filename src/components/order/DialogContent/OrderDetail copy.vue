<template>
  <div class="order-list-dialog-orderdetail-wrap">
    <template v-if="orderDetailData">
      <div class="orderdetail-left is-shadow">
        <header>
          <i>
            <img src="@/assets/images/product.png" alt />
          </i>
          <span>产品信息</span>
        </header>
        <article class="product-content">
          <section>
            <ul>
              <li>
                <span class="text-title">产品:</span>
                <span class="title">{{orderDetailData.Product.Name}}</span>
              </li>
              <li>
                <span class="text-title">数量:</span>
                <span class="text">{{orderDetailData.Product.Amount}}</span>
                <span class="text-title">款数:</span>
                <span class="text">{{orderDetailData.Product.KindCount}}款</span>
                <span class="text-title">工厂:</span>
                <span class="text">{{orderDetailData.Product.Factory.Value}}</span>
              </li>
              <li>
                <dl>
                  <dt class="text-title">必选工艺:</dt>
                  <div>
                    <dd class="text">覆哑膜</dd>
                    <dd class="text">
                      烫印
                      <i>(1处, 大于1/2, 古铜金)</i>
                    </dd>
                    <dd class="text">
                      烫印
                      <i>(1处, 大于1/2, 古铜金)</i>
                    </dd>
                  </div>
                </dl>
              </li>
              <li>
                <dl>
                  <dt class="text-title">可选工艺:</dt>
                  <div>
                    <dd class="text">覆哑膜</dd>
                    <dd class="text">
                      烫印
                      <i>(1处, 大于1/2, 古铜金)</i>
                    </dd>
                    <dd class="text">
                      烫印
                      <i>(1处, 大于1/2, 古铜金)</i>
                    </dd>
                  </div>
                </dl>
              </li>
            </ul>
          </section>
          <section class="unit">
            <ul v-for="item in orderDetailData.Product.PartList" :key="item.ID">
              <li class="unit-title">
                <span class="text-title">部件:</span>
                <span class="text">{{item.Name}}</span>
              </li>
              <li>
                <span class="text-title">数量:</span>
                <span class="text">{{item.List[0].Amount}}</span>
                <span class="text-title">物料:</span>
                <span class="text">{{item.List[0].Material.Value}}</span>
              </li>
              <li>
                <span class="text-title">尺寸:</span>
                <span class="text size">
                  <i v-for="size in item.List[0].SizeGroup" :key='size.ID'>
                    {{size.Value}}<em> ×</em>
                  </i>
                </span>
              </li>
              <li>
                <dl>
                  <dt class="text-title">必选工艺:</dt>
                  <div>
                    <dd class="text">覆哑膜</dd>
                    <dd class="text">
                      烫印
                      <i>(1处, 大于1/2, 古铜金)</i>
                    </dd>
                    <dd class="text">
                      烫印
                      <i>(1处, 大于1/2, 古铜金)</i>
                    </dd>
                  </div>
                </dl>
              </li>
              <li>
                <dl>
                  <dt class="text-title">可选工艺:</dt>
                  <div>
                    <dd class="text">覆哑膜</dd>
                    <dd class="text">
                      烫印
                      <i>(1处, 大于1/2, 古铜金)</i>
                    </dd>
                    <dd class="text">
                      烫印
                      <i>(1处, 大于1/2, 古铜金)</i>
                    </dd>
                  </div>
                </dl>
              </li>
            </ul>
          </section>
          <section>
            <ul>
              <li>
                <span class="text-title">数量:</span>
                <span class="text">{{orderDetailData.Product.Amount}}</span>
                <span class="text-title">物料:</span>
                <span class="text">
                  {{orderDetailData.Product.PropertyList.Material
                    &&orderDetailData.Product.PropertyList.Material.Value}}
                </span>
              </li>
              <li>
                <span class="text-title">颜色:</span>
                <span class="text">绿色、</span>
                <span class="text">黄色、</span>
                <span class="text">黑色</span>
              </li>
              <li>
                <span class="text-title">必选工艺:</span>
                <span class="text">覆哑膜</span>
              </li>
            </ul>
          </section>
        </article>
        <footer>
          <ul>
            <li>
              <span>原价:</span>
              <span>{{orderDetailData.Funds.OriginalPrice}}元</span>
            </li>
            <li>
              <span>优惠:</span>
              <span>
                {{orderDetailData.Funds.OriginalPrice - orderDetailData.Funds.FinalPrice}}元
              </span>
            </li>
            <li>
              <span>成交价:</span>
              <span class="is-origin">{{orderDetailData.Funds.FinalPrice}}元</span>
            </li>
          </ul>
          <ul>
            <li>
              <span>已付:</span>
              <span>{{orderDetailData.Funds.HavePaid}}元</span>
            </li>
            <li class="text-right">
              <span>未付:</span>
              <span class="is-red">{{orderDetailData.Funds.Unpaid}}元</span>
            </li>
            <li>
              <span>退款:</span>
              <span>{{orderDetailData.Funds.Refund}}元</span>
            </li>
          </ul>
        </footer>
      </div>
      <ul class="orderdetail-right">
        <li class="customer-info is-shadow">
          <header>
            <i>
              <img src="@/assets/images/customer.png" alt />
            </i>
            <span>客户信息</span>
          </header>
          <article class="customer-content">
            <section>
              <ul>
                <li>
                  <span class="text-title">客户编号:</span>
                  <span class="text md-font">{{orderDetailData.Customer.CustomerSN}}</span>
                </li>
                <li>
                  <span class="text-title">客户名称:</span>
                  <span class="text md-font">{{orderDetailData.Customer.CustomerName}}</span>
                </li>
                <li>
                  <span class="text-title">销售区域:</span>
                  <span class="text">{{orderDetailData.Customer.SellArea.RegionalName}}</span>
                </li>
              </ul>
            </section>
            <section>
              <ul>
                <li>
                  <span class="text-title">配送方式:</span>
                  <span class="text">
                    <!-- {{getExpress(orderDetailData.Address.Express.First)}} -->
                    {{orderDetailData.Address.ExpressText}}
                  </span>
                </li>
                <li>
                  <span class="text-title special-title">收件人:</span>
                  <span class="text">{{orderDetailData.Address.Address.Consignee}}</span>
                  <span class="text">{{orderDetailData.Address.Address.Mobile}}</span>
                </li>
                <li class="right-flex-wrap">
                  <span class="text-title">收件地址:</span>
                  <span class="text">
                    {{getAddress(orderDetailData.Address.Address)}}
                  </span>
                </li>
              </ul>
            </section>
          </article>
        </li>
        <li class="order-info is-shadow">
          <header>
            <i>
              <img src="@/assets/images/order.png" alt />
            </i>
            <span>订单信息</span>
          </header>
          <div class="order-content">
            <section>
              <ul>
                <li>
                  <span class="text-title">订单编号:</span>
                  <span class="text">{{orderDetailData.OrderID}}</span>
                </li>
                <li>
                  <span class="text-title">电商单号:</span>
                  <span class="text">{{orderDetailData.OutPlate.Value}}</span>
                </li>
                <li>
                  <!-- 待付款 is-red   已完成 is-completed   其它 is-origin -->
                  <span class="text-title">订单状态:</span>
                  <span class="text is-red">{{orderDetailData.Status | formatStatus}}</span>
                </li>
                <li>
                  <span class="text-title">订单备注:</span>
                  <span class="text">{{orderDetailData.Remark}}</span>
                </li>
                <li class="right-flex-wrap">
                  <span class="text-title">文件内容:</span>
                  <span class="text">{{orderDetailData.Content}}</span>
                </li>
                <li>
                  <span class="text-title special-title">接单员:</span>
                  <span class="text is-gray">{{orderDetailData.Taker.Value}}</span>
                </li>
                <li>
                  <span class="text-title">下单时间:</span>
                  <span class="text is-gray">{{getDayDate(orderDetailData.CreateTime)}}</span>
                  <span class="text is-gray">{{getMiDate(orderDetailData.CreateTime)}}</span>
                </li>
                <li>
                  <span class="text-title">预计完工:</span>
                  <span class="text is-gray">2019-03-25</span>
                </li>
              </ul>
            </section>
          </div>
        </li>
      </ul>
    </template>
    <template v-else>
      <p class="not-have-info">暂无数据</p>
    </template>
  </div>
</template>

<script>
// 删除必选工艺和可选工艺备份版本
import { mapState } from 'vuex';
// -----------------------------------------------------弃用
export default {
  computed: {
    ...mapState('orderModule', ['orderDetailData', 'OrderStatusList']),
  },
  methods: {
    getExpress(type) {
      if (type === 1) return '名片之家';
      if (type === 2) return '物流';
      if (type === 3) return '快递';
      return '';
    },
    getAddress(Address) {
    //  console.log(Address);
      const { RegionalName, CityName, CountyName } = Address.ExpressArea;
      const { AddressDetail } = Address;
      return `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
    },
    getDayDate(time) {
      if (!time) return '';
      return time.split('.')[0].split('T')[0];
    },
    getMiDate(time) {
      if (!time) return '';
      return time.split('.')[0].split('T')[1];
    },
  },
  mounted() {
  //  console.log('订单详情 mounted');
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.order-list-dialog-orderdetail-wrap {
  margin: 0 auto;
  width: 712px;
  height: 650px;
  box-sizing: border-box;
  margin-top: 25px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;

  .orderdetail-left {
    height: 100%;
    width: 390px;
    .product-content {
      height: 530px;
      padding: 20px;
      padding-bottom: 18px;
      box-sizing: border-box;
      overflow-y: scroll;
      .unit {
        .unit-title {
          position: relative;
          padding-left: 11px;
          &::before {
            content: "";
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: $--color-text-orgin;
            border-radius: 50%;
            top: calc(50% - 3px);
            left: 0;
          }
        }
        .size {
          > i:last-of-type{
            > em{
              display: none;
            }
          }
        }
      }

      // > section {

      //   li {
      //     margin-bottom: 10px;
      //     .text-title{
      //       color:  $--color-text-table-time;
      //       margin-right: 8px;
      //     }
      //     .text{
      //       color: $--color-text-table;
      //       font-size: 12px;
      //     }
      //     .title{
      //       color: $--color-text-table;
      //       font-weight: 600;
      //     }
      //     .text + .text-title{
      //       margin-left: 30px;
      //     }
      //     > dl {
      //       display: flex;
      //       dd{
      //         line-height: 14px;
      //         margin-bottom: 7px;
      //         > i{
      //           margin-left: 6px;
      //           color: $--color-text-table-time;
      //         }
      //       }
      //     }
      //   }

      //   &:not(:last-of-type){
      //     margin-bottom: 18px;
      //     position: relative;
      //     &::after{
      //       height: 1px;
      //       content: '';
      //       position: absolute;
      //       width: 300px;
      //       border-bottom: 1px dashed $--border-color-base;
      //       bottom: -5px;
      //     }
      //   }
      // }

      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $--border-color-base;
        border-radius: 4px;
        &:hover {
          background-color: $--color-text-secondary;
        }
      }
    }
    > footer {
      height: 80px;
      padding: 10px 20px;
      box-sizing: border-box;
      > ul {
        display: flex;
        > li {
          width: 100px;
          padding: 7px 0 8px 0;
          margin-right: 20px;
          color: $--color-text-table;
          > span:first-of-type {
            margin-right: 7px;
          }
          &:last-of-type {
            width: auto;
            margin-right: 0;
          }
          &.text-right {
            margin-right: 38px;
          }
        }
      }
    }
  }

  .orderdetail-right {
    width: 300px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > li {
      width: 100%;
      &.customer-info {
        height: 290px;
      }
      &.order-info {
        height: 340px;
      }
    }

    .customer-content {
      padding: 20px;
      height: 250px;
      box-sizing: border-box;
      section {
        &::after {
          display: none;
        }
        &:first-of-type {
          margin-bottom: 40px;
        }
      }
      li {
        margin-bottom: 15px;
        &:last-of-type {
          margin: 0;
        }
        .text + .text {
          margin-left: 25px;
        }
      }
    }

    .order-content {
      padding: 20px;
      height: 300px;
      box-sizing: border-box;
      section {
        &::after {
          display: none;
        }
        &:first-of-type {
          margin-bottom: 38px;
        }
        > ul > li {
          margin-bottom: 15px;
          .text + .text {
            margin-left: 15px;
          }
        }
      }
    }
  }

  .not-have-info{
    text-align: center;
    width: 90%;
    padding-top: 50px;
  }

  // 公用样式
  header {
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    font-size: 14px;
    font-weight: 600;
    color: $--color-text-primary;

    > i {
      display: inline-block;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(
        to right,
        $--color-primary,
        $--color-primary-light
      );
      position: relative;
      vertical-align: -20%;
      margin-right: 12px;
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .is-shadow {
    box-shadow: 0px 2px 8px #ddd;
  }
  .is-red {
    color: $--color-text-table-pending !important;
  }
  .is-origin {
    color: $--color-text-orgin !important;
  }
  .is-completed {
    color: $--color-text-table-completed !important;
  }
  .is-gray {
    color: $--color-text-table-time !important;
  }
  .md-font {
    font-size: 14px !important;
  }
  section {
    li,
    li dl > div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    li {
      margin-bottom: 10px;
      .text-title {
        color: $--color-text-table-time;
        margin-right: 8px;
        &.special-title {
          margin-right: 20px;
        }
      }
      .text {
        color: $--color-text-table;
        font-size: 12px;
      }
      .title {
        color: $--color-text-table;
        font-weight: 600;
      }
      .text + .text-title {
        margin-left: 30px;
      }
      > dl {
        display: flex;
        > div {
          // flex: none;
          // width: 100%;
          dd {
            line-height: 14px;
            margin-bottom: 7px;
            > i {
              margin-left: 6px;
              color: $--color-text-table-time;
            }
          }
        }
      }
      &.right-flex-wrap {
        display: flex;
        height: 40px;
        white-space: normal;
        .text-title {
          flex: none;
        }
        .text {
          line-height: 20px;
          margin-top: -3px;
        }
      }
    }

    &:not(:last-of-type) {
      margin-bottom: 18px;
      position: relative;
      &::after {
        height: 1px;
        content: "";
        position: absolute;
        width: 300px;
        border-bottom: 1px dashed $--border-color-base;
        bottom: -5px;
      }
    }
  }
}
</style>
