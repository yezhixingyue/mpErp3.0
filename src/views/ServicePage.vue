<!--
 * @Author: your name
 * @Date: 2020-04-09 14:23:16
 * @LastEditTime: 2021-05-07 16:17:26
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


export default {
  name: 'ServicePage',
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
