<template>
  <div class="product-item">
    <div class="product-item-header">
      <div class="product-item-header-left">
            <span>
                产品金额：<i class="is-pink">
                  {{data.ProductPrice}}元</i>
            </span>
            <span class="product-item-header-freight-box">
                运费：<i>{{data.Freight}}元</i>
            </span>
            <span class="is-primary">
              {{getItemInfo([ data.OrderList[0].OrderID, 'Express'])}}
            </span>
            <span>
                配送地址：<i class="is-primary">{{getAddress(data.Address)}}</i>
            </span>
        </div>
        <div class="product-item-header-right" @click="handleCollapse">
          <div :class="isActive ? 'active' : ''"></div>
        </div>
    </div>
      <TransitionGroupCollapse tag='ul' className="has-transition">
            <li
            class="product-item-content has-transition"
            v-for="item in data.OrderList"
            v-show="isActive"
            :key='item.OrderID'
           >
              <span :style="widthStyleObj[0]">{{getItemInfo([ item.OrderID, 'ProductName'])}}</span>
              <span :style="widthStyleObj[1]">
                <i>{{getItemInfo([ item.OrderID, 'ProductAmount'])}}</i>
                <i>{{getItemInfo([ item.OrderID, 'Unit']) || '个'}}</i>
                <i>{{getItemInfo([ item.OrderID, 'KindCount']) || 1}}款</i>
              </span>
              <span :style="widthStyleObj[2]">{{item.FinalPrice}}元</span>
              <span :style="widthStyleObj[3]">{{item.PrePaidAmount}}元</span>
              <span class="product-item-ontent-text-box" :style="widthStyleObj[4]">
                <i>{{getItemInfo([ item.OrderID, 'Content'])}}</i>
              </span>
          </li>
      </TransitionGroupCollapse>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TransitionGroupCollapse from '@/components/common/TransitionGroupCollapse.vue';

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
  },
  components: {
    TransitionGroupCollapse,
  },
  computed: {
    ...mapState('unpaylist', ['curToPayList']),
    widthStyleObj() {
      return Object.values(this.widthObj).map((item) => `width: ${item}px`);
    },
  },
  data() {
    return {
      isActive: true,
    };
  },
  methods: {
    handleCollapse() {
      this.isActive = !this.isActive;
    },
    getAddress(Address) {
      if (!Address || !Address.Address) return '';
      const {
        ExpressArea, AddressDetail, Consignee, Mobile,
      } = Address.Address;
      const { RegionalName, CityName, CountyName } = ExpressArea;
      return `${RegionalName}${CityName}${CountyName}${AddressDetail}  ${Consignee}（${Mobile}）`;
    },
    getItemInfo([OrderID, type]) {
      const tempObj = this.curToPayList.find((item) => item.OrderID === OrderID);
      if (!tempObj) return '';
      if (!tempObj[type]) return '';
      return tempObj[type];
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.product-item{
  margin-top: 10px;
  font-size: 12px;
  border: 1px solid $--border-color-light;
  border-bottom: none;
  box-sizing: border-box;

  .product-item-header{
    background-color: $--bg-color-base;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid $--border-color-light;
    .product-item-header-left{
        height: 29px;
        line-height: 28px;
        font-size: 12px;
        padding-left: 10px;
        display: flex;
        overflow: hidden;
        width: calc(100% - 32px);
        > span {
          color: $--color-gray-1;
          text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          > .is-pink{
              font-size: 14px;
          }
          &.product-item-header-freight-box{
              // margin-left: 26px;
              // margin-right: 52px;
              width: 80px;
          }
          &.is-primary{
              width: 86px;
          }
          &:first-of-type{
            width: 140px;
            text-align: left;
          }
          &:last-of-type{
            padding-left: 15px;
          }
        }
    }
    .product-item-header-right{
      height: 29px;
      width: 25px;
      margin-right: 11px;
      position: relative;
      flex: none;
      cursor: pointer;
      > div {
        height: 12px;
        width: 7px;
        position: absolute;
        top: 50%;
        left: 50%;
        transition: .1s linear !important;
        transform: translate(-50%, -50%) rotate(90deg);
        background: url('../../../assets/images/right-arrow.png') center no-repeat;
        background-size: 100% 100%;
        &.active {
          transform: translate(-50%, -50%) rotate(-90deg);
        }
      }
    }
  }
  .product-item-content{
    height: 44px;
    line-height: 44px;
    white-space: nowrap;
    display: flex;
    // opacity: 0;
    // transition: .1s linear !important;
    border-bottom: none;
    > span {
        white-space: nowrap;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        padding-right: 6px;
        box-sizing: border-box;
        flex: none;
        color: $--color-primary-1;
        &.product-item-ontent-text-box{
          color: $--color-gray-1;
          display: flex;
          justify-content: center;
          align-items: center;
          white-space: normal;
          line-height: 14px;
        }
    }
    &.active{
      height: 44px;
      opacity: 1;
      border-bottom: 1px solid $--border-color-light;
    }
    opacity: 1;
    border-bottom: 1px solid $--border-color-light;
    &:hover{
      background-color: $--color-text-table-hover;
      border-color: $--color-text-table-hover;
      box-shadow: 0px -1px 0px $--color-text-table-hover
    }
  }
  // > ul {
  //   transition: 3s;
  // }
  // .produce-item-enter, .produce-item-leave-to {
  //   opacity: 0;
  //   height: 0;
  //   // transform: translateY(-100%);
  // }
  // .produce-item-enter-active, .produce-item-leave-active {
  //   transition: all .3s;
  //   // z-index: -999;
  // }
  // .produce-item-enter-to, .produce-item-leave {
  //   opacity: 1;
  //   height: 30px;
  //   // transform: translateY(0px);
  // }
}
</style>
