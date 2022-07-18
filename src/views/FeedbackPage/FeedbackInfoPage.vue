<template>
  <AfterTheDetails @messageChage='messageChage'></AfterTheDetails>
</template>

<script>
import AfterTheDetails from '@/components/common/AfterTheDetails.vue';

export default {
  name: 'feedbackInfoPage',
  data() {
    return {
      message: null,
    };
  },
  components: {
    AfterTheDetails,
  },
  methods: {
    messageChage(data) {
      this.message = this.$message({
        showClose: true,
        type: 'warning',
        message: data,
        duration: 0,
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.message) {
      this.message.close();
      this.message = null;
    }
    next();
  },
};
</script>
