<!--
 * @Author: your name
 * @Date: 2020-05-12 10:48:37
 * @LastEditTime: 2021-05-07 17:19:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/views/FinancePage.vue
-->
<template>
  <div class="mp-finance-page-wrap">
      <Header />
      <Main />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Header from '@/components/Finance/Header/index.vue';
import Main from '@/components/Finance/Main/index.vue';

export default {
  name: 'FinancePage',
  components: {
    Header,
    Main,
  },
  // created() {
  //   const { token } = this.$route.params;
  //   if (!token) return;
  //   if (sessionStorage.getItem('token')) sessionStorage.removeItem('token');
  //   sessionStorage.setItem('token', JSON.stringify(token));
  // },
  methods: {
    ...mapActions('finance', ['getFinanceTableData']),
  },
  mounted() {
    this.getFinanceTableData();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-finance-page-wrap {
  width: 100%;
  background-color: $--bg-color-base;
  display: flex;
  flex-direction: column;
}
</style>
