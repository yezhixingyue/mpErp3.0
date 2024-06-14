<template>
  <section class="responsibility-measure-info-page-wrap">
    <header>
      aaa
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

export default {
  name: 'ResponsibilityMeasurePage',
  components: {
    AfterSalesSolutionInfoComp,
    ResponsibilityDifferentiationComp,
    OrderDetailsComp,
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
.responsibility-measure-info-page-wrap{
  >main{
    display: flex;
    justify-content: flex-start;
  }
}
</style>
