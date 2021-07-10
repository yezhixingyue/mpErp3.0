<template>
  <article class="mp-erp-price-manage-table-comp-wrap">
    <div class="content">
      <div v-if="!isPriceDataLoading && listData.length === 0" class="empty-box">
        <img src="@/assets/images/null.png" alt="">
        <p class="is-font-size-12 is-gray">暂无产品</p>
      </div>
      <PriceTableItemComp v-for="item in listData" :key="item.ProductID" :itemData='item' />
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import PriceTableItemComp from './PriceTableItemComp.vue';

export default {
  props: {
    listData: {
      type: Array,
      default: () => ([]),
    },
  },
  components: {
    PriceTableItemComp,
  },
  computed: {
    ...mapState('priceManage', ['isPriceDataLoading']),
  },
};
</script>
<style lang='scss'>
.mp-erp-price-manage-table-comp-wrap {
  height: 100%;
  overflow-y: overlay;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  border-top: none;
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
    width: 100%;
    min-width: 1720px;
    height: 100%;
    box-sizing: border-box;
    border-top: 1px solid #e6e6e6;
    > .mp-erp-price-manage-table-item-comp-wrap {
      &:last-of-type {
        padding-bottom: 0;
      }
    }
  }
}
</style>
