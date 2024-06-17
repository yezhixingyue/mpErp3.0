<template>
  <section class="liability-recognition-info-page-wrap">
    <header class="is-bold">
      <BreadcrumbNav backLabel="责任确认" label="确认责任"></BreadcrumbNav>
    </header>
    <main>
      <AfterSalesSolutionInfoComp/>
      <ResponsibilityDifferentiationComp/>
      <OrderDetailsComp/>
    </main>
    <el-button @click="onGoBackClick">返回</el-button>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AfterSalesSolutionInfoComp from '@/components/AfterSalesComps/AfterSalesSolutionInfoComp.vue';
import ResponsibilityDifferentiationComp from '@/components/AfterSalesComps/ResponsibilityDifferentiationComp.vue';
import OrderDetailsComp from '@/components/AfterSalesComps/OrderDetailsComp.vue';
import BreadcrumbNav from '@/components/AfterSalesComps/BreadcrumbNav.vue';

export default {
  name: 'LiabilityRecognitionPage',
  components: {
    AfterSalesSolutionInfoComp,
    ResponsibilityDifferentiationComp,
    OrderDetailsComp,
    BreadcrumbNav,
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
.liability-recognition-info-page-wrap{
  padding-left: 20px;
  >header{
    margin-top: 20px;
    margin-bottom: 5px;
    font-size: 12px;
  }
  >main{
    display: flex;
    justify-content: flex-start;
  }
}
</style>
