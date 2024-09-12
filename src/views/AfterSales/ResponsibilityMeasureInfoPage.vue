<template>
  <section class="responsibility-measure-info-page-wrap">
    <header>
      <BreadcrumbNav backLabel="划分责任" :label="`${[0, 1].findIndex(it => it === queryData?.Status) !== -1 ? '划分责任' : '查看详情'}`"></BreadcrumbNav>
    </header>
    <main>
      <div class="top">
        <AfterSalesSolutionInfoComp :showImg="true" v-if="ResponsibilityDivideDetail" :appealData="ResponsibilityDivideDetail"/>
        <div class="line"></div>
        <ResponsibilityDifferentiationComp ref="DifferentiationComp" :AfterSaleCode="queryData?.AfterSaleCode"
        :ResponsibilityDivideDetail="ResponsibilityDivideDetail" v-if="ResponsibilityDivideDetail" :Status="queryData?.Status"/>
        <OrderDetailsComp :OrderDetail="OrderDetail" :AfterSaleCode="queryData?.AfterSaleCode"/>
      </div>
      <ScheduleComp v-if="ResponsibilityDivideDetail" :Progresses="ResponsibilityDivideDetail.DivideProgresses.map(it => ({
        ConfirmType: it.ConfirmType,
        CreateTime: it.CreateTime,
        DivideName: `${it.OperaterUserName||''}${it.DivideName}`,
      }))" title="定责进度" :defaultKey="{
        Time: 'CreateTime',
        Content: 'DivideName',
      }"/>
    </main>
    <footer>
      <el-button v-if="ResponsibilityDivideDetail?.ResponsibilityIsAllowDivide" @click="onSubmitClick" class="linear-bg-color">保存</el-button>
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
      queryData: null,
      ResponsibilityDivideDetail: null,
      OrderDetail: null,
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
    getResponsibilityDivideDetail() {
      this.api.getOrderAfterSaleResponsibilityDivideDetail(this.queryData.AfterSaleCode).then(res => {
        if (res.data.Status === 1000) {
          this.ResponsibilityDivideDetail = res.data.Data;
        }
      });
    },
    getAfterSaleOrderDetail() {
      this.api.getOrderDetailUseOrderID(this.queryData.OrderID).then(res => {
        if (res.data.Status === 1000) {
          this.OrderDetail = res.data.Data;
        }
      });
    },
    onSubmitClick() {
      this.$refs.DifferentiationComp.submit();
    },
  },
  mounted() {
    this.queryData = this.$route.query;
    this.getResponsibilityDivideDetail();
    this.getAfterSaleOrderDetail();
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
      >.line{
        width: 1px;
        min-width: 1px;
        background-color: #D3F2FE;
        margin-top: 40px;
        margin-right: 55px;
      }
      .responsibility-differentiation-comp{
        margin-right: 45px;
      }
      >.order-details-comp{
        min-width: 500px;
      }
      .after-sales-solution-info-comp{
        width: 483px;
      }
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
      border: none;
      background: #fff;
      color: #26BCF9;
      border: 1px solid #26BCF9;
      &.linear-bg-color{
        color: #fff;
        background: linear-gradient( 226deg, #34DEF9 0%, #26BCF9 100%);
      }
      & + .el-button{
        margin-left: 30px;
      }
    }
  }
}
</style>
