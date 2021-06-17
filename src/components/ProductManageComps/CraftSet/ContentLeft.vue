<template>
  <section>
    <header>
      <span class="mp-common-title-wrap">单选工艺</span>
      <span class="blue-span">+ 添加</span>
    </header>
    <main>
      <SingleSelectCraftSetDialog />
    </main>
  </section>
</template>

<script>
import SingleSelectCraftSetDialog from './SingleSelectCraftSetDialog.vue';

export default {
  props: {
    curProduct: {
      type: Object,
      default: null,
    },
    curPart: {
      type: Object,
      default: null,
    },
  },
  components: {
    SingleSelectCraftSetDialog,
  },
};
</script>
<style lang='scss'>
</style>
