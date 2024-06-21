<template>
  <section class="responsibility-measure-info-page-wrap">
    <header>
      <BreadcrumbNav backLabel="划分责任" label="查看详情"></BreadcrumbNav>
    </header>
    <main>
      <div class="top">
        <AfterSalesSolutionInfoComp/>
        <ResponsibilityDifferentiationComp/>
        <OrderDetailsComp/>
      </div>
      <ScheduleComp/>
    </main>
    <footer>
      <el-button @click="onGoBackClick" class="linear-bg-color">返回</el-button>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AfterSalesSolutionInfoComp from '@/components/AfterSalesComps/AfterSalesSolutionInfoComp.vue';
import ResponsibilityDifferentiationComp from '@/components/AfterSalesComps/ResponsibilityDifferentiationComp.vue';
import OrderDetailsComp from '@/components/AfterSalesComps/OrderDetailsComp.vue';
import BreadcrumbNav from '@/components/AfterSalesComps/BreadcrumbNav.vue';
import ScheduleComp from '@/components/AfterSalesComps/ScheduleComp.vue';

export default {
  name: 'ResponsibilityMeasurePage',
  components: {
    AfterSalesSolutionInfoComp,
    ResponsibilityDifferentiationComp,
    OrderDetailsComp,
    BreadcrumbNav,
    ScheduleComp,
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
  padding-left: 20px;
  >header{
    margin-top: 20px;
    margin-bottom: 5px;
    font-size: 12px;
  }
  >main{
    >.top{
      display: flex;
      justify-content: flex-start;
    }
    >.schedule-wrap{
      width: 960px
    }
  }
  >footer{
    padding: 60px 0 20px 0;
    text-align: center;
    .el-button{
      width: 120px;
      height: 35px;
      padding: 0;
      color: #fff;
      background: linear-gradient( 226deg, #34DEF9 0%, #26BCF9 100%);
      border: none;
      & + .el-button{
        background: #fff;
        margin-left: 30px;
        color: #26BCF9;
        border: 1px solid #26BCF9;
      }
    }
  }
}
</style>
