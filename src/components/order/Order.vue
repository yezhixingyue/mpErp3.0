<template>
  <div class="order-manage">
    <OrderManageHeader />
    <div class="order-manage-content">
      <div class="mp-table-box">
        <OrderMainComp />
      </div>
    </div>

  </div>
</template>

<script>
import OrderMainComp from '@/views/OrderListPage.vue';
import OrderManageHeader from './OrderManageHeader.vue';

export default {
  name: 'Order',
  components: {
    OrderManageHeader,
    OrderMainComp,
  },
  data() {
    return {
      loading: true,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";
.order-manage {
  width: calc(100% - 180px);
  color: rgb(88, 88, 88);
  background-color: rgb(245, 245, 245);
  padding: 10px;
  flex: none;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  display: flex;
  padding-left: 8px;
  .order-manage-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    // border: 1px solid $--border-color-base;
    background-color: rgb(255, 255, 255);
    .mp-table-box{
        flex: 1;
        overflow: auto;
    }
  }
}
</style>
