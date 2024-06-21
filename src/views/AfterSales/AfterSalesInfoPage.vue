<template>
  <section class="mp-after-sales-info-page-wrap">
    <header>
      <BreadcrumbNav backLabel="售后列表" label="售后详情"></BreadcrumbNav>
    </header>
    <main>
      <div class="left">
        <div class="top">
          <CustomerAppealComp/>
          <OrderDetailsComp/>
        </div>
        <ScheduleComp/>
      </div>
      <AfterSalesSolutionFromComp/>
      <SuspendDialogComp :visible="SuspendVisible" @cloce="SuspendVisible = false" @submit="SuspendVisible = false"></SuspendDialogComp>
    </main>
    <footer>
      <el-button @click="onGoBackClick" class="linear-bg-color">返回</el-button>
      <el-button @click="SuspendClick">guaqi</el-button>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CustomerAppealComp from '@/components/AfterSalesComps/CustomerAppealComp.vue';
import OrderDetailsComp from '@/components/AfterSalesComps/OrderDetailsComp.vue';
import AfterSalesSolutionFromComp from '@/components/AfterSalesComps/AfterSalesSolutionFromComp.vue';
import BreadcrumbNav from '@/components/AfterSalesComps/BreadcrumbNav.vue';
import ScheduleComp from '@/components/AfterSalesComps/ScheduleComp.vue';
import SuspendDialogComp from '@/components/AfterSalesComps/SuspendDialogComp.vue';

export default {
  name: 'AfterSalesInfoPage',
  components: {
    CustomerAppealComp,
    OrderDetailsComp,
    AfterSalesSolutionFromComp,
    BreadcrumbNav,
    ScheduleComp,
    SuspendDialogComp,
  },
  data() {
    return {
      nowDate: null,
      SuspendVisible: false,
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
    SuspendClick() {
      this.SuspendVisible = true;
    },
  },
  mounted() {
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
