<template>
  <section class="order-service-detail-box" v-if="orderData">
    <main>
      <ul class="left right-line">
        <li>
          <span class="title">订单号：</span>
          <span class="text-content">{{orderData.Order.OrderID}}</span>
          <span class="title setPadding">客户编号：</span>
          <span class="text-content">{{orderData.Order.CustomerNo}}</span>
          <span class="title customer">客户：</span>
          <span class="text-content CustomerName">{{orderData.Order.CustomerName}}</span>
        </li>
        <li>
          <div class="title">联系信息：</div>
          <div class="text-content">
            <span class="address">
              {{orderData.CustomerContact | combineCustomerAdd}}
            </span>
            <span class="phone">{{orderData.CustomerContact.Mobile}}</span>
            <span v-if="orderData.CustomerContact.QQ">QQ:{{orderData.CustomerContact.QQ}}</span>
          </div>
        </li>
        <li> <!-- 产品信息部分，该部分使用数据curProductInfoStringify渲染 ； 其它部分使用orderData渲染 -->
          <div class="title">产品信息：</div>
          <div class="text-content product-info">
              <i :title="curProductInfoStringify">{{curProductInfoStringify}}</i>
          </div>
        </li>
      </ul>
      <!-- 金额部分 -->
      <DetailInfoHeader class="right" :Funds="orderData.Order.Funds" :PayPackageData='PayPackageData' />
    </main>
    <footer>
      <div class="title">配送信息：</div>
      <div class="text-content">
        <span class="address">{{this.orderDetailData.Address.Address | combineAdd}}</span>
        <span class="phone">{{orderDetailData.Address.Address.Mobile}}</span>
        <span>（ 配送: {{orderDetailData.Address.ExpressText}} ）</span>
      </div>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import DetailInfoHeader from './DetailInfoHeader.vue';

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
    },
    /**
     * 订单详情，用于获取地址等信息
     */
    orderDetailData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    DetailInfoHeader,
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  computed: {
    ...mapState('service', ['PayPackageData']),
  },
  filters: {
    combineAdd(value) {
      if (!value) return '';
      const { RegionalName, CityName, CountyName } = value.ExpressArea;
      const { AddressDetail } = value;
      return RegionalName + CityName + CountyName + AddressDetail;
    },
    combineCustomerAdd(value) {
      if (!value) return '';
      const {
        Province, City, County, AddressDetail,
      } = value;
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
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
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
        max-width: 360px;
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
      width: 680px;
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
      > div {
        .title {
          flex: none;
        }
        .text-content {
          line-height: 14px;
          font-size: 13px;
          // white-space: nowrap;
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
  .el-dialog__header > span::before {
    background: url(../../../assets/images/detail.png) no-repeat center;
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
