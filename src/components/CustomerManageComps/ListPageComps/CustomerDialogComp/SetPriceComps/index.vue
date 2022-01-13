<template>
  <section class="mp-erp-comps-customer-setup-module-customer-detail-display-dialog-comp-set-price-index-comp-wrap" v-if="customer">
    <HeaderComp :customer="customer" @jump='onJumpClick' />
    <main>
      <MainLeftComp :customer="customer" />
      <MainRightComp :customer="customer" />
    </main>
  </section>
</template>

<script>
import HeaderComp from './HeaderComp.vue';
import MainLeftComp from './MainLeftComp.vue';
import MainRightComp from './MainRightComp.vue';

export default {
  props: {
    customer: {
      type: Object,
      default: null,
    },
  },
  components: {
    HeaderComp,
    MainLeftComp,
    MainRightComp,
  },
  methods: {
    onJumpClick() { // 跳转客户详情
      this.$emit('jump');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-customer-setup-module-customer-detail-display-dialog-comp-set-price-index-comp-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    padding-bottom: 25px;
    flex: none;
    > ul {
      margin-top: 26px;
      display: flex;
      align-items: center;
      background: #49B9E7;
      height: 46px;
      color: #fff;
      > li {
        padding-left: 22px;
        padding-right: 8px;
        height: 32px;
        line-height: 32px;
        display: flex;
        flex: none;
        > label {
          font-weight: bold;
          flex: none;
        }
        > button {
          height: 30px;
          padding: 0;
          width: 120px;
          font-size: 14px;
          border-color: #fff !important;
          background-color: #fff !important;
          border-radius: 2px;
          position: relative;
          top: 1px;
          margin-right: 12px;
          color: #49B9E7;
          transition: 0.1s ease-in-out;
          &:hover {
            color: #26bcf9;
            background-color: #f8f8f8 !important;
          }
          &:active {
            color: #1e54a5;
            box-shadow: 0 0 1px 1px rgba($color: #000, $alpha: 0.3);
          }
        }
        &.m {
          border-left: 1px solid #fff;
        }
        &.n {
          flex: 1;
          overflow: hidden;
          > span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        > span.qq {
          min-width: 80px;
        }
      }
    }
  }
  > main {
    flex: 1;
    display: flex;
    > section {
      flex: none;
    }
  }
}
</style>
