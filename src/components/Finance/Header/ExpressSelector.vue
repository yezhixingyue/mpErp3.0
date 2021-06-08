<template>
  <ul class="order-express-selector-wrap">
    <li class="text">配送方式：</li>
    <li>
      <DropDownExpress @select="setExpressType" :title="expressTitle" :list="expressList" />
    </li>
  </ul>
</template>

<script>
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';
import DropDownExpress from './DropDownExpress.vue';

export default {
  components: {
    DropDownExpress,
  },
  computed: {
    ...mapGetters('common', ['expressList']),
    ...mapState('finance', [
      'orderStatueTitle',
      'OrderStatusList',
      'expressTitle',
    ]),
  },
  methods: {
    ...mapMutations('finance', ['setOrderStatus', 'setExpressType']),
    ...mapActions('common', ['getExpressList']),
  },
  mounted() {
    this.getExpressList();
  },
};
</script>

<style lang='scss'>
.order-express-selector-wrap {
  display: flex;
  > .text {
    margin-right: 10px;
  }
}
</style>
