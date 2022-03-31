<template>
  <ul class="order-list-progress-wrap mp-scroll-wrap">
    <ProgressItem
      v-for="(item, i) in orderProgress" :key='item.Status + "-" + i'
      :status='status' :orderProgressData='orderProgress' :index='i' />
  </ul>
</template>

<script>
import ProgressItem from '@/components/common/ProgressItem.vue';

export default {
  props: {
    /**
     * 订单进度信息
     */
    orderProgress: {
      type: Array,
      default: () => [],
    },
    /**
     * 订单进度状态序号与名称对照表
     */
    OrderStatusList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      status: 0,
    };
  },
  components: {
    ProgressItem,
  },
  methods: {
    getStatus() {
      if (this.orderProgress.length === 0) return;
      this.status = this.orderProgress[this.orderProgress.length - 1].Status;
    },
  },
  mounted() {
    this.getStatus();
  },
};
</script>

<style lang='scss'>
  @import "@/assets/css/common/var.scss";
  .order-list-progress-wrap {
    height: 645px;
    padding-top: 42px;
    padding-right: 218px;
    user-select: none;
    overflow-y: auto;
  }
</style>
