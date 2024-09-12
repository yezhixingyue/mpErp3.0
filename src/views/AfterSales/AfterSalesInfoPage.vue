<template>
  <section class="mp-after-sales-info-page-wrap">
    <header>
      <BreadcrumbNav backLabel="售后列表"
      :label="`${[10, 25].find(it => it === AfterSaleInfoDetail?.Status) ? '执行售后' : '查看详情'}`"></BreadcrumbNav>
    </header>
    <main>
      <div class="left">
        <div class="top">
          <CustomerAppealComp v-if="AfterSaleInfoDetail" :appealData="AfterSaleInfoDetail"/>
          <OrderDetailsComp showDownload :OrderDetail="OrderDetail" :AfterSaleCode="queryData?.AfterSaleCode" :AfterSaleStatus="AfterSaleInfoDetail?.Status"/>
        </div>
        <ScheduleComp v-if="AfterSaleInfoDetail" :Progresses="AfterSaleInfoDetail.ServiceProgresses"/>
      </div>
      <template v-if="queryData && AfterSaleInfoDetail && PackagesList">
        <AfterSalesSolutionInfoComp :PackagesList="PackagesList" :appealData="AfterSaleInfoDetail" IsShowExtraPayForm
        v-if="queryData.Status === 30 || queryData.Status === 40 || queryData.Status === 255" showResponsibilities/>
        <template v-else>
          <AfterSalesSolutionFromComp :PackagesList="PackagesList" :OrderID="queryData.OrderID" :OrderStatus="OrderDetail.Status"
          @changeVisible="HandOnVisible = false" :appealData="AfterSaleInfoDetail" ref="AfterSalesSolutionFrom"
          :HandOnVisible="HandOnVisible" :AfterSaleCode="queryData?.AfterSaleCode" :dataInfo="OrderDetail"
          :KindCount="OrderDetail?.ProductParams?.Attributes?.Unit"/>
        </template>
      </template>
    </main>
    <footer v-if="AfterSaleInfoDetail">
      <el-button @click="AfterSaleSubmit" v-if="[10, 25].find(it => it === AfterSaleInfoDetail.Status)" class="linear-bg-color">执行售后</el-button>
      <el-button @click="SuspendClick" v-if="AfterSaleInfoDetail.Status === 10">挂起</el-button>
      <el-button @click="HandOnClick" v-if="AfterSaleInfoDetail.Status === 25">转他人处理</el-button>
      <el-button @click="onGoBackClick" v-if="[25, 30, 40, 255].find(it => it === AfterSaleInfoDetail.Status)">返回</el-button>
      <!-- <el-button @click="onGoBackClick">back</el-button> -->
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CustomerAppealComp from '@/components/AfterSalesComps/CustomerAppealComp.vue';
import AfterSalesSolutionInfoComp from '@/components/AfterSalesComps/AfterSalesSolutionInfoComp.vue';
import OrderDetailsComp from '@/components/AfterSalesComps/OrderDetailsComp.vue';
import AfterSalesSolutionFromComp from '@/components/AfterSalesComps/AfterSalesSolutionFromComp.vue';
import BreadcrumbNav from '@/components/AfterSalesComps/BreadcrumbNav.vue';
import ScheduleComp from '@/components/AfterSalesComps/ScheduleComp.vue';

export default {
  name: 'AfterSalesInfoPage',
  components: {
    CustomerAppealComp,
    OrderDetailsComp,
    AfterSalesSolutionFromComp,
    BreadcrumbNav,
    ScheduleComp,
    AfterSalesSolutionInfoComp,
  },
  data() {
    return {
      queryData: null,
      HandOnVisible: false,
      PackagesList: null,

      AfterSaleInfoDetail: null,
      OrderDetail: null,
    };
  },
  computed: {
    ...mapState('common', ['Permission', 'ServerApplyTypeList']),
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    async getPackagesByOrderID() {
      const resp = await this.api.getPackagesByOrderID(this.OrderDetail.OrderID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        this.PackagesList = resp.data.Data;
      }
    },
    SuspendClick() {
      this.$refs.AfterSalesSolutionFrom.onSuspendClick();
    },
    HandOnClick() {
      this.HandOnVisible = true;
    },
    AfterSaleSubmit() {
      this.$refs.AfterSalesSolutionFrom.submit();
    },
    getSaveDetail(AfterSaleCode) {
      this.api.getSaveDetailAsync(AfterSaleCode).then(res => {
        if (res.data.Status === 1000) {
          this.AfterSaleInfoDetail = res.data.Data;
        }
      });
    },
    getSuccessDetail(AfterSaleCode) {
      this.api.getSuccessDetail(AfterSaleCode).then(res => {
        if (res.data.Status === 1000) {
          this.AfterSaleInfoDetail = res.data.Data;
        }
      });
    },
    getAfterSaleOrderDetail(OrderID) {
      this.api.getOrderDetailUseOrderID(OrderID).then(res => {
        if (res.data.Status === 1000) {
          this.OrderDetail = res.data.Data;
          this.getPackagesByOrderID();
        }
      });
    },
  },
  mounted() {
    this.queryData = this.$route.query;
    if (this.queryData.Status === 30 || this.queryData.Status === 40 || this.queryData.Status === 255) {
      this.getSuccessDetail(this.queryData.AfterSaleCode);
    } else {
      this.getSaveDetail(this.queryData.AfterSaleCode);
    }
    this.getAfterSaleOrderDetail(this.queryData.OrderID);
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-after-sales-info-page-wrap{
  overflow-x: auto;
  height: 100%;
  padding-left: 20px;
  >header{
    margin-top: 20px;
  }
  >main{
    display: flex;
    >.left{
      display: flex;
      flex-direction: column;
    >.top{
      display: flex;
    }
    }
    .after-sales-solution-info-comp{
      min-width: 530px;
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
