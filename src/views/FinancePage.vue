<!--
 * @Author: your name
 * @Date: 2020-05-12 10:48:37
 * @LastEditTime: 2021-10-07 15:27:02
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
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'FinancePage',
  mixins: [recordScrollPositionMixin('.mp-finance-page-wrap .el-table__body-wrapper')],
  components: {
    Header,
    Main,
  },
  // created() {
  //   const { token } = this.$route.params;
  //   if (!token) return;
  //   if (sessionStorage.getItem('ErpToken')) sessionStorage.removeItem('ErpToken');
  //   sessionStorage.setItem('ErpToken', JSON.stringify(token));
  // },
  methods: {
    ...mapActions('finance', ['getFinanceTableData']),
  },
  mounted() {
    this.$store.commit('finance/clearConfigObj');
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
