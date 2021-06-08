<template>
  <article class="mp-erp-product-manage-table-comp-wrap">
    <div v-if="!isTableDataLoading && listData.length === 0" class="empty-box">
      <img src="@/assets/images/null.png" alt="">
      <p class="is-font-size-12 is-gray">暂无数据</p>
    </div>
    <ProductTableItemComp v-for="item in listData" :key="item.ProductID" :itemData='item' />
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
  > .empty-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 200px;
    padding-right: 60px;
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
}
</style>
