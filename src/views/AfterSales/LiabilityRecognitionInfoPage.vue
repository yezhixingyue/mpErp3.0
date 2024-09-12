<template>
  <section class="liability-recognition-info-page-wrap">
    <header class="is-bold">
      <BreadcrumbNav backLabel="责任确认" :label="`${queryData?.Status === 0 ? '责任确认' : '查看详情'}`"></BreadcrumbNav>
    </header>
    <main v-if="ResponsibilityConfirmDetail">
      <div class="top">
        <AfterSalesSolutionInfoComp :showImg="true" :appealData="ResponsibilityConfirmDetail"/>
        <div class="line"></div>
        <ResponsibilityConfirmComp ref="ConfirmComp" :ConfirmDetail="ResponsibilityConfirmDetail"
        :AfterSaleCode="queryData?.AfterSaleCode" :OrderID="queryData?.OrderID" :Status="queryData?.Status"/>
        <OrderDetailsComp :OrderDetail="OrderDetail" :AfterSaleCode="queryData?.AfterSaleCode"/>
      </div>
      <ScheduleComp v-if="ResponsibilityConfirmDetail" :Progresses="ResponsibilityConfirmDetail.DivideProgresses.map(it => ({
        ConfirmType: it.ConfirmType,
        CreateTime: it.CreateTime,
        DivideName: `${it.OperaterUserName||''}${it.DivideName}`,
      }))" title="定责进度" :defaultKey="{
        Time: 'CreateTime',
        Content: 'DivideName',
      }"/>
    </main>
    <footer>
      <el-button v-if="queryData && queryData.Status === 0" @click="onSubmitClick" class="linear-bg-color">确定责任</el-button>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AfterSalesSolutionInfoComp from '@/components/AfterSalesComps/AfterSalesSolutionInfoComp.vue';
import ResponsibilityConfirmComp from '@/components/AfterSalesComps/ResponsibilityConfirmComp.vue';
import OrderDetailsComp from '@/components/AfterSalesComps/OrderDetailsComp.vue';
import BreadcrumbNav from '@/components/AfterSalesComps/BreadcrumbNav.vue';
import ScheduleComp from '@/components/AfterSalesComps/ScheduleComp.vue';

export default {
  name: 'LiabilityRecognitionPage',
  components: {
    AfterSalesSolutionInfoComp,
    ResponsibilityConfirmComp,
    OrderDetailsComp,
    BreadcrumbNav,
    ScheduleComp,
  },
  data() {
    return {
      queryData: null,
      OrderDetail: null,
      ResponsibilityConfirmDetail: null,
    };
  },
  computed: {
    ...mapState('common', ['Permission', 'ServerApplyTypeList']),
    ...mapState('AfterSale', ['ResponsibilityConfirmCondition']),
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
    getAfterSaleOrderDetail() {
      this.api.getOrderDetailUseOrderID(this.queryData.OrderID).then(res => {
        if (res.data.Status === 1000) {
          this.OrderDetail = res.data.Data;
        }
      });
    },
    onSubmitClick() {
      this.$refs.ConfirmComp.submit();
    },
  },
  mounted() {
    this.queryData = this.$route.query;
    this.api.getOrderAfterSaleResponsibilityConfirmDetail(this.queryData.AfterSaleCode, this.ResponsibilityConfirmCondition.DepartmentID).then(res => {
      if (res.data.Status === 1000) {
        this.ResponsibilityConfirmDetail = res.data.Data;
      }
    });
    this.getAfterSaleOrderDetail();
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
      .responsibility-confirm-comp{
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
