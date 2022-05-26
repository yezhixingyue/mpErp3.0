<template>
  <div class="unpay-list-item-wrap">
    <div class="product-item-header">
      <div class="product-item-header-left">  <!-- 标题部分 -->
        <!-- <span class="check-item"> -->
          <!-- 标题总复选框 -->
          <!-- <el-checkbox
           :disabled="isDisabled"
           :indeterminate="isIndeterminate"
           v-model="checkAll"
          ></el-checkbox> -->
        <!-- </span> -->
        <span class="product-item-header-freight-box">{{data.CustomerName}}</span>
        <span class="customer-sn">客户编号：{{data.CustomerNo}}</span>
      </div>
      <div class="product-item-header-right" @click="handleCollapse">
          <div :class="isActive ? 'active' : ''"></div>
        </div>
    </div>
    <TransitionGroupCollapse tag="ul" class="has-transition"> <!-- 子列表部分 -->
      <li
        class="product-item-content has-transition"
        v-for="item in data.subList"
        v-show="isActive"
        :key="item.OrderID"
      >
        <div :style="wStyles[0]" class="check-item">
          <!-- 子项复选框 -->
          <!-- <el-checkbox
           @change="onItemCheck(item, $event)"
           :value="getSingleCheckStatus(item.OrderID)"
           :disabled="isDisabled || item.Status !== 10"
          >
          </el-checkbox> -->
          {{item.ProductName}}
        </div>
        <div
          :style="wStyles[1]"
          class="is-twelve"
        >{{item.ProductAmount}}{{item.Unit?item.Unit:'个'}}{{item.KindCount?item.KindCount:1}}款</div>
        <div :style="wStyles[2]">{{item.Funds.FinalPrice}}元</div>
        <div :style="wStyles[3]">{{item.Funds.Deposit}}元</div>
        <div class="product-item-ontent-text-box is-gray" :style="wStyles[4]">
          <i>{{item.Content}}</i>
        </div>
        <div :style="wStyles[5]">{{item.Package.Address.Address.Consignee}}</div> <!-- 收货人 -->
        <div :style="wStyles[6]">{{item.Package.Address.Address.Mobile}}</div> <!-- 收货人手机 -->
        <div :style="wStyles[7]">{{item.Express}}</div> <!-- 配送方式 -->
        <div
          :style="wStyles[8]"
          :class="{'is-cancel': item.Status === 254,
                'is-red': item.Status === 10,
                'is-success': item.Status === 200}"
         >{{item.Status | formatStatus}}</div> <!-- 状态 -->
        <div :style="wStyles[9]" class="is-twelve">{{item.Taker}}</div> <!-- 接单人 -->
        <div :style="wStyles[10]" class="is-twelve is-date">
          {{item.CreateTime | formatDate}}
        </div> <!-- 下单时间 -->
        <div :style="wStyles[11]">
          {{item.FinalPrice}}
          <ul class="payment-table-handle-menu-wrap">
            <li class="handle-menu-item">
              <span @click="goToOrderDetail(item)">
                <img src="@/assets/images/detail.png" class="detail" alt />详情
              </span>
            </li>
            <!-- <li class="handle-menu-item"
             v-if="Permission.PermissionList.PermissionManageOrder.Obj.HelpSubmit">
              <span
                v-if="item.Status !== 200 && item.Status !== 254"
                @click="go2PaySingleOrder(item)"
              >
                <img src="@/assets/images/pay.png" alt />付款
              </span>
              <span v-else class="is-cancel">
                <img src="@/assets/images/unpay.png" alt />付款
              </span>
            </li> -->
            <li class="handle-menu-item"
             v-if="Permission.PermissionList.PermissionManageOrder.Obj.HelpSubmit">
              <span v-if="item.Status !== 254 && item.Status !== 200" @click="cancelOrder(item)">
                <img src="@/assets/images/cancel.png" alt />取消
              </span>
              <span v-else class="is-cancel">
                <img src="@/assets/images/cancelstop.png" alt />取消
              </span>
            </li>
          </ul>
        </div> <!-- 操作 -->
      </li>
    </TransitionGroupCollapse>
  </div>
</template>

<script>
import TransitionGroupCollapse from '@/components/common/TransitionGroupCollapse.vue';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  props: {
    /**
     * 需要传入的宽度对象，用以告诉组件内每个自动伸缩宽度元素的宽度值
     */
    widthObj: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 需要渲染的数据信息
     */
    data: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 是否需要禁用复选框
     */
    isDisabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 当前项对应的客户编码
     */
    CustomerNo: {
      type: String,
    },
  },
  components: {
    // Test,
    TransitionGroupCollapse,
  },
  computed: {
    ...mapState('unpaylist', ['curSelectedList']),
    ...mapState('common', ['Permission']),
    wStyles() {
      return Object.values(this.widthObj).map((item) => `width: ${item}px`);
    },
    isIndeterminate() {
      return this.curSelectedList.length > 0
        && this.curSelectedList.length < this.data.subList.length
        && this.curSelectedList[0].CustomerNo === this.CustomerNo;
    },
    checkAll: {
      get() {
        if (this.curSelectedList.length === 0) return false;
        const bool1 = this.curSelectedList.length === this.data.subList.length;
        const bool2 = this.curSelectedList[0].CustomerNo === this.CustomerNo;
        return bool1 && bool2;
      },
      set(val) {
        if (val) {
          this.setCurSelectedList(this.data.subList.filter((item) => (
            item.Status === 10
          )));
        } else {
          this.setCurSelectedList([]);
        }
      },
    },
  },
  data() {
    return {
      isActive: true,
    };
  },
  methods: {
    ...mapMutations('unpaylist', ['setCurOrderID', 'setIsShowDia', 'setIsShowPreDialog', 'addCurSelectedList', 'setCurSelectedList', 'setSingleSelectedOrder']),
    ...mapActions('unpaylist', ['delTargetOrder', 'getOrderDetail', 'getPrePayData']),
    ...mapMutations('common', ['setIsLoading']),
    handleCollapse() {
      this.isActive = !this.isActive;
    },
    onItemCheck(item, key) {
      if (key) this.addCurSelectedList(item);
      else this.setCurSelectedList(this.curSelectedList.filter((it) => it !== item));
    },
    cancelOrder(row) { // 取消订单弹窗
      this.setCurOrderID(row.OrderID);
      this.messageBox.warnCancelBox('确定取消此订单吗 ?', `客户名称： ${row.CustomerName}`, () => this.delTargetOrder(), null);
    },
    goToOrderDetail(row) {
      this.setCurOrderID(row.OrderID);
      this.$utils.handleLoadingHOF(
        () => this.getOrderDetail(), () => this.setIsShowDia(true), () => this.setIsShowDia(false),
      );
    },
    go2PaySingleOrder(row) {
      // this.setIsLoading(true);
      this.setSingleSelectedOrder(row);
      this.$utils.handleLoadingHOF(
        () => this.getPrePayData({ type: 'single' }),
        () => this.setIsShowPreDialog(true),
        () => this.setIsShowPreDialog(false),
      );
    },
    getSingleCheckStatus(OrderID) {
      return this.curSelectedList.some((item) => item.OrderID === OrderID && item.Status === 10);
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.unpay-list-item-wrap {
  margin-top: 10px;
  font-size: 12px;
  border: 1px solid $--border-color-light;
  border-bottom: none;
  box-sizing: border-box;

  .product-item-header {
    background-color: $--bg-color-base;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid $--border-color-light;
    .product-item-header-left {
      height: 36px;
      line-height: 35px;
      display: flex;
      overflow: hidden;
      width: calc(100% - 32px);
      > span {
        color: $--color-gray-1;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        > .is-pink {
          font-size: 14px;
        }
        &.product-item-header-freight-box {
          margin-right: 26px;
          color: $--color-text-primary;
          font-size: 14px;
          font-weight: 600;
          min-width: 100px;
          padding-left: 32px;
          text-align: center;
        }
        &.customer-sn {
          //   width: 186px;
          color: $--color-text-table-time;
        }
      }
    }
    .product-item-header-right {
      height: 29px;
      width: 25px;
      margin-right: 22px;
      position: relative;
      flex: none;
      cursor: pointer;
      > div {
        height: 12px;
        width: 7px;
        position: absolute;
        top: 50%;
        left: 50%;
        transition: 0.1s linear !important;
        transform: translate(-50%, -50%) rotate(90deg);
        background: url("../../../assets/images/right-arrow.png") center
          no-repeat;
        background-size: 100% 100%;
        &.active {
          transform: translate(-50%, -50%) rotate(-90deg);
        }
      }
    }
  }
  .product-item-content {
    height: 44px;
    line-height: 44px;
    white-space: nowrap;
    display: flex;
    border-bottom: none;
    > div {
      white-space: nowrap;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      padding-right: 6px;
      box-sizing: border-box;
      flex: none;
      font-size: 14px;
      color: $--color-text-primary;
      &.is-twelve {
        font-size: 12px;
      }
      &.is-date {
        color: $--color-text-table-time;
      }
      &.product-item-ontent-text-box {
        font-size: 12px;
        white-space: nowrap;
        line-height: 44px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }
      .payment-table-handle-menu-wrap {
        display: flex;
        // padding: 0 35px 0 50px;
        justify-content: space-between;
        &:before,
        &:after {
          content: '';
          display: block;
        }
        user-select: none;
        font-size: 12px;
        color: $--color-text-primary;
        .handle-menu-item {
          cursor: pointer;
          position: relative;
          height: 44px;
          flex: none;
          padding: 0 6px;
          span {
            // position: absolute;
            // height: 28px;
            // line-height: 28px;
            // top: 50%;
            // transform: translateY(-50%);
            img {
              margin-right: 5px;
              position: relative;
              top: 3px;
              &.detail {
                width: 15px;
                height: 15px;
              }
            }
          }
          &:hover {
            color: $--color-text-regular;
          }
        }
      }
      &.check-item {
        text-align: center;
        .el-checkbox__input.is-checked .el-checkbox__inner {
          background-color: #fff;
          border-color: #26bcf9;
          &::after{
            border-color: #26bcf9;
          }
        }
      }
    }
    &.active {
      height: 44px;
      opacity: 1;
      border-bottom: 1px solid $--border-color-light;
    }
    opacity: 1;
    border-bottom: 1px solid $--border-color-light;
    &:hover {
      background-color: $--color-text-table-hover;
      border-color: $--color-text-table-hover;
      box-shadow: 0px -1px 0px $--color-text-table-hover
    }
  }
  .product-item-content > div.check-item .el-checkbox,
  div.product-item-header-left .check-item {
    .el-checkbox {
      text-align: left;
      padding: 0 18px 0 20px;
    }
    padding: 0 18px 0 20px;
  }
}
</style>
