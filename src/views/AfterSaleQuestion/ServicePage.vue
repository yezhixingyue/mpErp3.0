<!--
 * @Author: your name
 * @Date: 2020-04-09 14:23:16
 * @LastEditTime: 2022-11-24 18:30:15
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
import ServiceMain from '@/components/ServiceAfterSale/Main/ServiceMain.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import ServiceHeader from '@/components/ServiceAfterSale/Header/ServiceHeader.vue';

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
  mounted() {
    this.$store.commit('service/clearConfigObj');
    this.getServiceListData();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-service-page-wrap{
  padding: 10px;
  background-color: $--bg-color-base;
  width: calc(100% - 180px);
  box-sizing: border-box;
}
</style>
