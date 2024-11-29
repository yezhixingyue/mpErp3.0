<template>
  <section class="freight-write-off-from-page">
    <header>
      <BreadcrumbNav backLabel="订单列表" label="运费结算"></BreadcrumbNav>
    </header>
    <main>
      <OrderDetailsComp v-if="OrderDetail" :OrderDetail="OrderDetail"/>
      <FreightWriteOffFromComp v-if="OrderDetail" :OrderDetail="OrderDetail" ref="FreightWriteOffFromComp" />
    </main>
    <footer>
      <el-button @click="AfterSaleSubmit" class="linear-bg-color">提交</el-button>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import OrderDetailsComp from '@/components/FreightWriteOff/OrderDetailsComp.vue';
import FreightWriteOffFromComp from '@/components/FreightWriteOff/FreightWriteOffFromComp.vue';
import BreadcrumbNav from '@/components/AfterSalesComps/BreadcrumbNav.vue';

export default {
  name: 'FreightWriteOffPage',
  components: {
    OrderDetailsComp,
    FreightWriteOffFromComp,
    BreadcrumbNav,
  },
  data() {
    return {
      OrderID: '',
      OrderDetail: null,
    };
  },
  computed: {},
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    getOrderDetail(OrderID) {
      this.api.getOrderDetail(OrderID).then(res => {
        if (res.data.Status === 1000) {
          this.OrderDetail = res.data.Data;
        }
      });
    },

    AfterSaleSubmit() {
      this.$refs.FreightWriteOffFromComp.submit();
    },
  },
  created() {
    if (this.$route.params.OrderID) this.OrderID = this.$route.params.OrderID;
  },
  mounted() {
    this.getOrderDetail(this.OrderID);
  },
};
</script>

<style lang='scss'>
.freight-write-off-from-page{
  overflow-x: auto;
  height: 100%;
  padding-left: 20px;
  min-width: 1230px;
  >header{
    margin-top: 20px;
  }
  >main{
    display: flex;
    padding-top: 50px;
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
