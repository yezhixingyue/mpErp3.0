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
            <span class="is-primary">{{data.Address?data.Address.ExpressText:''}}</span>
            <span>配送地址：
              <el-tooltip class="item" effect="dark" :content="getAddress(data.Address)" placement="top-start">
                <i class="is-primary">{{getAddress(data.Address)}}</i>
              </el-tooltip>
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
              <span :style="widthStyleObj[0]">
                <el-tooltip  class="item" effect="dark" :content="`${item.OrderID || ''}`" placement="top-start">
                  <i>{{item.OrderID}}</i>
                </el-tooltip>
              </span>
              <span :style="widthStyleObj[1]">
                <el-tooltip  class="item" effect="dark" :content="item | getFullName" placement="top-start">
                  <i>{{item | getFullName}}</i>
                </el-tooltip>
              </span>
              <span :style="widthStyleObj[2]">
                <el-tooltip  class="item" effect="dark" :content="item.SizeList | formatListItemSize" placement="top-start">
                  <i>{{item.SizeList | formatListItemSize }}</i>
                </el-tooltip>
              </span>
              <span :style="widthStyleObj[3]">
                <el-tooltip  class="item" effect="dark" :content="item.MaterialList | formatListItemMaterial" placement="top-start">
                  <i>{{item.MaterialList | formatListItemMaterial }}</i>
                </el-tooltip>
              </span>
              <span :style="widthStyleObj[4]">
                <el-tooltip  class="item" effect="dark" :content="item.CraftList | formatListItemCraft" placement="top-start">
                  <i>{{item.CraftList | formatListItemCraft }}</i>
                </el-tooltip>
              </span>
              <span :style="widthStyleObj[5]">
                <el-tooltip  class="item" effect="dark" :content="item | formarProductAmount" placement="top-start">
                  <i>{{item | formarProductAmount }}</i>
                </el-tooltip>
              </span>
              <span :style="widthStyleObj[6]">
                <el-tooltip  class="item" effect="dark" :content="`${item.Funds.FinalPrice}元`" placement="top-start">
                  <i>{{item.Funds.FinalPrice}}元</i>
                </el-tooltip>
              </span>
              <span :style="widthStyleObj[7]">
                <el-tooltip  class="item" effect="dark" :content="`${item.Funds.Deposit}元`" placement="top-start">
                  <i>{{item.Funds.Deposit}}元</i>
                </el-tooltip>
              </span>
              <span class="product-item-ontent-text-box" :style="widthStyleObj[8]">
                <el-tooltip v-if="item.Content" class="item" effect="dark" :content="item.Content" placement="top-start">
                  <i>{{item.Content}}</i>
                </el-tooltip>
                <i v-else>无</i>
              </span>
          </li>
      </TransitionGroupCollapse>
  </div>
</template>

<script>
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
    // Test,
    TransitionGroupCollapse,
  },
  computed: {
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
      const { ExpressArea, AddressDetail } = Address.Address;
      const { RegionalName, CityName, CountyName } = ExpressArea;
      return `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
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
          // display: flex;
          // justify-content: center;
          // align-items: center;
          // white-space: normal;
          // line-height: 14px;
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
