<template>
  <ul class="order-list-progress-wrap mp-scroll-wrap">
    <ProgressItem
      v-for="(item, i) in orderProgress" :key='item.Status + "-" + i'
      :orderProgressData='orderProgress' :index='i'
      :showFundGone="localShowFundGone"
      @showFundGone="onFundGoneClick"
      />
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
    showFundGone: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ProgressItem,
  },
  computed: {
    localShowFundGone() { // 是否展示钱款去向
      if (!this.showFundGone || this.orderProgress.length < 2) return false;

      const [last, secondLast] = this.orderProgress.filter(it => it.FinishPercent === 100);

      return last && secondLast && [254, 253].includes(last.Status) && secondLast.Status !== 10;
    },
  },
  methods: {
    onFundGoneClick() {
      this.$emit('showFundGone');
    },
  },
  mounted() {
  },
};
</script>

<style lang='scss'>
  @import "@/assets/css/var.scss";
  .order-list-progress-wrap {
    height: 645px;
    padding-top: 42px;
    padding-right: 218px;
    user-select: none;
    overflow-y: auto;
  }
</style>
