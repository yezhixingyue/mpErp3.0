<!--
 * @Author: your name
 * @Date: 2020-04-09 14:23:16
 * @LastEditTime: 2022-01-08 09:57:51
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
  mounted() {
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
