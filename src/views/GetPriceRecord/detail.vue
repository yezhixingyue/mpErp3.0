<template>
  <TraceClientInfo></TraceClientInfo>
</template>

<script>
import TraceClientInfo from '@/components/common/TraceClientInfoComp/TraceClientInfo.vue';

export default {
  name: 'GetPriceRecordDetailPage',
  data() {
    return {
      message: null,
    };
  },
  components: {
    TraceClientInfo,
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
};
</script>
