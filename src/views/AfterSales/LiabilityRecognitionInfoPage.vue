<template>
  <section class="mp-feedback-page-main-wrap">
    尺寸尺寸错错错错
    <el-button @click="onGoBackClick">返回</el-button>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'LiabilityRecognitionPage',
  components: {
  },
  data() {
    return {
      nowDate: null,
    };
  },
  computed: {
    ...mapState('common', ['Permission', 'ServerApplyTypeList']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionAfterSalesApply?.Obj) {
        return this.Permission.PermissionList.PermissionAfterSalesApply.Obj;
      }
      return {};
    },
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
  },
  mounted() {
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";

</style>
