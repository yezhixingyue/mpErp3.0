<template>
  <section>费用表设置页面  工艺费与价格表 通用</section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CraftPriceTableItemSet',
  computed: {
    ...mapState('priceManage', ['curSolutionItem', 'curEditPriceItemData']),
  },
};
</script>
<style lang='scss'>
</style>
