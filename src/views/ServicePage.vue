<!--
 * @Author: your name
 * @Date: 2020-04-09 14:23:16
 * @LastEditTime: 2021-10-07 15:18:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/views/ServicePage.vue
-->
<template>
  <div class="mp-service-page-wrap">
    <ServiceHeader />
    <ServiceMain />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ServiceHeader from '@/components/ServiceAfterSale/Header/ServiceHeader.vue';
import ServiceMain from '@/components/ServiceAfterSale/Main/ServiceMain.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';


export default {
  name: 'ServicePage',
  mixins: [recordScrollPositionMixin('.mp-service-page-wrap .el-table__body-wrapper')],
  components: {
    ServiceHeader,
    ServiceMain,
  },
  methods: {
    ...mapActions('service', ['getServiceListData']),
  },
  // created() {
  //   const { token } = this.$route.params;
  //   if (!token) return;
  //   if (sessionStorage.getItem('ErpToken')) sessionStorage.removeItem('ErpToken');
  //   sessionStorage.setItem('ErpToken', JSON.stringify(token));
  // },
  mounted() {
    this.$store.commit('service/clearConfigObj');
    this.getServiceListData();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-service-page-wrap{
  padding: 10px;
  background-color: $--bg-color-base;
  width: calc(100% - 180px);
  box-sizing: border-box;
}
</style>
