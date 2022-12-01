<template>
  <main v-if="curPriceTactic">
    <LRWidthDragAutoChangeComp leftWidth="280px">
      <template v-slot:left>
        <MainLeft
          class="m l"
          :list="curPriceTactic.AsideList"
          :CustomerGradeID="curPriceTactic.CustomerGradeID"
          :loading='loading'
          @switch='onSwitch'
          @fill='onFill'
        />
      </template>
      <template v-slot:right>
        <MainRight class="m r" :tableList='curPriceTactic.PolicyTableList' :loading='loading' @input="onInput" />
      </template>
    </LRWidthDragAutoChangeComp>
  </main>
</template>

<script>
import { LRWidthDragAutoChangeComp } from '@/components/common/mpzj-sell-lib/lib';
import MainLeft from './MainLeft.vue';
import MainRight from './MainRight.vue';

export default {
  props: {
    curPriceTactic: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LRWidthDragAutoChangeComp,
    MainLeft,
    MainRight,
  },
  methods: {
    onSwitch(e) { // 切换侧边登录
      this.$emit('switch', e);
    },
    onFill(e) { // 填充当前价格
      this.$emit('fill', e);
    },
    onInput(e) { // 输入及修改价格
      this.$emit('input', e);
    },
  },
};
</script>
<style lang='scss'>
</style>
