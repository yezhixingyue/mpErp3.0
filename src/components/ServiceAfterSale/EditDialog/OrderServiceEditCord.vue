<template>
  <section class="order-service-detail-box" v-if="orderData">
    <main>
      <ul class="left right-line">
        <li>
          <span class="title">订单号：</span>
          <span class="text-content">{{orderData.OrderID}}</span>
          <span class="have-service">
            ( 已售后 <i class=count>{{ServiceHistory.length}}</i> 次
              <i v-if="ServiceHistory.length > 0" @click="onDetailClick" class="detail">详情</i> )
          </span>
          <span class="title setPadding">客户编号：</span>
          <span class="text-content">{{orderData.Customer.CustomerSN}}</span>
          <span class="title customer">客户：</span>
          <span class="text-content CustomerName">{{orderData.Customer.CustomerName}}</span>
        </li>
        <li>
          <div class="title">联系信息：</div>
          <div class="text-content">
            <span class="address">{{Customer | getAdd}}</span>
            <span class="phone">{{Customer.Mobile}}</span>
            <span v-if="Customer.QQ">QQ：{{Customer.QQ}}</span>
          </div>
        </li>
        <li> <!-- 产品信息部分，该部分使用数据curProductInfoStringify渲染 ； 其它部分使用orderData渲染 -->
          <div class="title">产品信息：</div>
          <div class="text-content product-info">
            <i>{{curProductInfoStringify}}</i>
          </div>
        </li>
      </ul>
      <div class="right"> <!-- 金额部分 -->
        <div>
          <span class="title">总金额：</span>
          <span class="text-content">￥{{orderData.Funds.FinalPrice}}元</span>
        </div>
        <div>
          <span class="title">已付：</span>
          <span class="text-content">￥{{orderData.Funds.HavePaid}}元</span>
        </div>
        <div v-if="PayPackageData">
          <span class="title">运费：</span>
          <span class="text-content">￥{{PayPackageData.Freight}}元<i class="is-font-size-12 is-gray">（含{{PayPackageData.OrderList.length}}个订单）</i></span>
        </div>
        <div>
          <span class="title">订单退款：</span>
          <span class="text-content">￥{{orderData.Funds.Refund}}元</span>
        </div>
        <div v-if="PayPackageData">
          <span class="title">运费退款：</span>
          <span class="text-content">￥{{PayPackageData.RefundFreight}}元</span>
        </div>
        <div>
          <span class="title">售后优惠：</span>
          <span class="text-content">￥{{orderData.Funds.Reduced}}元</span>
        </div>
      </div>
    </main>
    <footer>
      <div class="title">配送信息：</div>
      <div class="text-content">
        <span class="address">{{shippingAddress}}</span>
        <span class="phone">{{orderData.Address.Address.Mobile}}</span>
        <span>配送方式 :（ {{orderData.Address.ExpressText}} ）</span>
      </div>
    </footer>
    <el-dialog title="已售后详情" :visible.sync="dialogVisible" width="800px" append-to-body top="10vh" :modal='false'
      custom-class="mp-service-detail-cord-dia mp-img-style-header" :before-close="handleClose">
      <main>
        <el-table
         :data="ServiceHistory" max-height=487
         style="width: 100%">
          <el-table-column prop="ID" label="售后单" width="140"></el-table-column>
          <el-table-column prop="method" label="解决方案" width="240">
            <template slot-scope="scope">
              {{getSolution(scope.row.Solution)}}
            </template>
          </el-table-column>
          <el-table-column prop="date" label="处理时间" class-name='is-gray' width="180">
            <template slot-scope="scope">
              <!-- {{$utils.getDateFormat(scope.row.CreateTime)}} -->
              {{ scope.row.CreateTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="Operator.Name" label="处理人"></el-table-column>
        </el-table>
        <p>此单已售后<span class="is-origin">{{ServiceHistory.length}}</span>次</p>
      </main>
      <span slot="footer" class="dialog-footer">
        <normalBtn @click.native="handleClose" title="关闭" />
      </span>
    </el-dialog>
  </section>
</template>

<script>
import normalBtn from '@/components/common/normalBtn.vue';
import { mapState } from 'vuex';

export default {
  props: {
    /**
     * 订单详情数据，用于页面渲染，必传
     */
    orderData: {
      type: Object,
      default: () => {},
    },
    /**
     * 订单详情中的产品信息数据，用于页面产品部分渲染，必传
     */
    curProductInfoStringify: {
      type: Array,
      default: () => [],
    },
    /**
     * 物流信息对照表， 用于转换物流方式（序号转文字）,必传
     */
    expressList: {
      type: Array,
      default: () => [],
    },
    /**
     * 客户信息(非收货人)
     */
    Customer: {
      type: Object,
      default: () => {},
    },
    /**
     * 当前订单已售后历史记录
     */
    ServiceHistory: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  components: {
    normalBtn,
  },
  computed: {
    ...mapState('service', ['PayPackageData']),
    shippingAddress() { // 收货地址
      const { RegionalName, CityName, CountyName } = this.orderData.Address.Address.ExpressArea;
      const { AddressDetail } = this.orderData.Address.Address;
      return RegionalName + CityName + CountyName + AddressDetail;
    },
  },
  filters: {
    getAdd(Customer) {
      if (!Customer) return '';
      const {
        Province, City, County, AddressDetail,
      } = Customer;
      return Province.Name + City.Name + County.Name + AddressDetail;
    },
  },
  methods: {
    onDetailClick() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    getSolution(solution) {
      const arr = [];
      if (solution.Type === 2) {
        arr.push(`订单减款${solution.RefundAmount}元`);
        arr.push(`运费减款${solution.RefundFreightAmount}元`);
      } else if (solution.Type === 7) {
        arr.push('补印');
        arr.push(`${solution.KindCount}款`);
        arr.push(`${solution.Number}${this.orderData.ProductParams.Attributes.Unit}`);
      }
      return arr.join('--');
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.order-service-detail-box {
  width: 960px;
  height: 150px;
  border: 1px solid $--border-color-light;
  border-radius: 5px;
  box-shadow:inset 0px 0px 2px 0px rgba(98, 98, 98, 0.1);
  box-sizing: border-box;
  margin: 0 auto;
  margin-bottom: 20px;
  font-size: 12px;
  padding: 16px 16px 18px 16px;
  color: $--color-text-table-time;
  .title {
    width: 60px;
    display: block;
    text-align: right;
    color: $--color-text-regular;
    white-space: nowrap;
  }
  .text-content {
    .phone{
        margin: 0 18px 0 25px;
    }
    i + i {
      margin-left: 10px;
      line-height: 13px;
    }
    .address{
        max-width: 405px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        vertical-align: bottom;
        margin-top: -3px;
    }
    &.product-info {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 10px;
    }
    &.CustomerName {
      max-width: 215px;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  > main {
    height: 77px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    position: relative;
    .left {
      width: 732px;
      padding-top: 4px;
      position: relative;
      flex: none;
      > li {
        margin-bottom: 18px;
        &:first-of-type {
          color: $--color-text-regular;
          .setPadding{
              padding-left: 30px;
          }
          .customer{
              padding-left: 6px;
          }
        }
        .have-service{
          margin-left: 22px;
          margin-right: 20px;
          margin-top: -2px;
          color:  $--color-text-table-time;
          user-select: none;
          > i {
            &.count{
              font-size: 14px;
              color:  $--color-text-orgin;
            }
            &.detail{
              margin-left: 5px;
              color: $--color-primary;
              cursor: pointer;
            }
          }
          position: relative;
          &::after{
            content: '';
            position: absolute;
            right: -23px;
            top: -4px;
            height: 22px;
            width: 1px;
            background-color: $--border-color-light;
          }
        }
      }
      &.right-line::after{
        top: 24px;
        height: 81px;
      }
    }
    .right {
      width: 196px;
      // padding-top: 36px;
      color: $--color-text-regular;
      padding-left: 16px;
      flex: none;
      margin-top: -5px;
      > div {
        .title {
          // width: 50px;
          flex: none;
        }
        .text-content {
          line-height: 14px;
          font-size: 13px;
        }
        & + div {
          margin-top: 9px;
        }
        &:nth-of-type(2) {
          .text-content {
            color: $--color-text-table-pending;
            // font-size: 14px;
          }
        }
      }
    }
  }
  > footer {
    height: 40px;
    width: 100%;
    box-sizing: border-box;
    // padding-left: 20px;
    padding-top: 17px;
    line-height: 14px;
  }
  > main .left > li,
  > footer,
  > main .right > div {
    display: flex;
  }
}
.mp-service-detail-cord-dia{
  .el-dialog__header {
    > span::before {
      background: url(../../../assets/images/detail.png) no-repeat center;
    }
    border-radius: 3px;
  }
  min-height: 320px;
  .el-dialog__body{
    min-height: 230px;
    padding: 25px 20px;
    box-sizing: border-box;
    > main {
      .el-table{
        border: 1px solid $--border-color-light;
        &::before{
          display: none;
        }
        .el-table__header-wrapper{
          tr{
            th{
              padding: 3px 0;
              border: none;
              .cell{
                line-height: 24px;
              }
            }
          }
        }
        .el-table__body-wrapper{
          tr{
            td{
              padding: 5px 0;
              border-top: 1px solid $--border-color-light;
              .cell{
                line-height: 24px;
              }
            }
          }
        }
      }
      > p {
        color: $--color-text-regular;
        font-size: 12px;
        margin-top: 14px;
        > span {
          margin: 0 3px;
          font-size: 14px;
        }
      }
    }
  }
  .el-dialog__footer{
    padding-top: 0;
    .dialog-footer{
      width: 100%;
      display: inline-block;
      > button {
        margin: 0 auto;
        display: block;
      }
    }
  }
}

</style>
