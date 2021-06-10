<template>
  <article class="mp-erp-product-manage-table-comp-wrap">
    <div class="content">
      <p class="list-header">
        <span class="name">内部名称</span>
        <span class="show-name">显示名称</span>
        <span class="classify">所属分类</span>
        <span class="order-ctrl">下单方式</span>
        <span class="setup">设置</span>
        <span class="operate">操作</span>
      </p>
      <div v-if="!isTableDataLoading && listData.length === 0" class="empty-box">
        <img src="@/assets/images/null.png" alt="">
        <p class="is-font-size-12 is-gray">暂无产品</p>
      </div>
      <ProductTableItemComp v-for="item in listData" :key="item.ProductID" :itemData='item' />
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import ProductTableItemComp from './ProductTableItemComp.vue';

export default {
  props: {
    listData: {
      type: Array,
      default: () => ([]),
    },
  },
  components: {
    ProductTableItemComp,
  },
  computed: {
    ...mapState('productManage', ['isTableDataLoading']),
  },
};
</script>
<style lang='scss'>
.mp-erp-product-manage-table-comp-wrap {
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
  margin-top: 10px;
  .empty-box {
    width: 1500px;
    height: 400px;
    box-sizing: border-box;
    padding-top: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    > img {
      width: 59px;
      height: 48px;
    }
    > p {
      margin-top: 10px;
    }
  }
  > .content {
    // width: 100%;
    width: 1720px;
    height: 100%;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    > .list-header {
      height: 36px;
      background-color: #f5f5f5;
      line-height: 36px;
      font-size: 14px;
      font-weight: 700;
      color: #444;
      text-align: center;
      border-bottom: 1px solid #e6e6e6;
      > span {
        display: inline-block;
        &.name {
          width: 125px;
        }
        &.show-name {
          width: 175px;
        }
        &.classify {
          width: 200px;
        }
        &.order-ctrl {
          width: 245px;
        }
        &.setup {
          width:650px;
        }
        &.operate {
          width: 323px;
          padding-right: 70px;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
