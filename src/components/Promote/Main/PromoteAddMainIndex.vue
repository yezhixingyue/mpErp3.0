<template>
  <div class="promote-add-edit-detail-main-wrap">
    <promote-add-main-left :isDisabled='isDisabled' />
    <promote-add-main-right :isDisabled='isDisabled' />
  </div>
</template>

<script>
import PromoteAddMainLeft from '../Comps/PromoteAddMainLeft.vue';
import PromoteAddMainRight from '../Comps/PromoteAddMainRight.vue';

export default {
  components: {
    PromoteAddMainLeft,
    PromoteAddMainRight,
  },
  data() {
    return {
      type: '',
    };
  },
  computed: {
    isDisabled() {
      return this.type === 'detail';
    },
  },
  mounted() {
    this.type = this.$route.params.type;
  },
};
</script>

<style lang='scss'>
 .promote-add-edit-detail-main-wrap {
   background-color: #fff;
   display: flex;
   width: 100%;
   position: relative;
 }
</style>
