<template>
  <section class="mp-erp-cash-back-list-page-wrap">
    <header>
      <el-button type="primary" @click="onAddClick">添加消费返现</el-button>
    </header>
    <main>
      主体区域
    </main>
    <footer>
      底部分页区域
    </footer>
  </section>
</template>

<script>
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'CashBackListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-print-bean-list-page-wrap .el-table__body-wrapper')],
  methods: {
    onAddClick() {
      this.$router.push({
        name: 'cashBackSetup',
        params: {
          ID: 'null',
        },
      });
    },
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
    this.$store.dispatch('common/getAreaList'); // 使用筛选组件后 注释该方法的使用
  },
};
</script>
<style lang='scss'>
.mp-erp-cash-back-list-page-wrap {
  display: flex;
  flex-direction: column;
  background: rgb(245, 245, 245);
  width: 100%;
  height: 100%;
  padding-left: 8px;
  box-sizing: border-box;
  overflow: hidden;
  > header {
    flex: none;
    height: 60px;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 20px;
    > button {
      width: 120px;
      height: 30px;
      padding: 0;
      border-radius: 2px;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 10px;
  }
  > footer {
    flex: none;
    background-color: #fff;
    height: 70px;
  }
}
</style>
