<template>
  <div>
    <LicensePathPhotoComp v-model="LicensePath" />
  </div>
</template>

<script>
import LicensePathPhotoComp from './LicensePathPhotoComp.vue';

export default {
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    LicensePathPhotoComp,
  },
  data() {
    return {
      LicensePath: '',
    };
  },
  mounted() {
    if (this.customer?.AuthenInfo?.LicensePath) this.LicensePath = this.customer.AuthenInfo.LicensePath;
  },
};
</script>
<style lang='scss'>
</style>
