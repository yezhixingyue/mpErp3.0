<template>
  <section class="mp-after-sales-info-page-wrap">
    <header>
      <p class="is-bold">
        <span>售后列表</span>
        <i></i>
        售后详情
      </p>
    </header>
    <main>
      <div class="left">
        <div class="top">
          <CustomerAppealComp/>
          <OrderDetailsComp/>
        </div>
      </div>
      <AfterSalesSolutionFromComp/>
    </main>
    <el-button @click="onGoBackClick">返回</el-button>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CustomerAppealComp from '@/components/AfterSalesComps/CustomerAppealComp.vue';
import OrderDetailsComp from '@/components/AfterSalesComps/OrderDetailsComp.vue';
import AfterSalesSolutionFromComp from '@/components/AfterSalesComps/AfterSalesSolutionFromComp.vue';

export default {
  name: 'AfterSalesInfoPage',
  components: {
    CustomerAppealComp,
    OrderDetailsComp,
    AfterSalesSolutionFromComp,
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
.mp-after-sales-info-page-wrap{
  overflow-x: auto;
  height: 100%;
  padding-left: 20px;
  >header{
    margin-top: 20px;
    >p{
      margin-bottom: 5px;
      font-size: 12px;
      >span{
        color: #26BCF9;
        cursor: pointer;
      }
    }
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
}
</style>
