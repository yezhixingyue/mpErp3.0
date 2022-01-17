<template>
  <div>
    <LicensePathPhotoComp v-model="LicensePath" :AllowEdit='AllowEdit' />
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
    AllowEdit: {
      type: Boolean,
      default: true,
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
