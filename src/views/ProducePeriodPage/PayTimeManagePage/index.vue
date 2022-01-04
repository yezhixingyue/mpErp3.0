<template>
  <section class="mp-erp-period-manage-pay-time-manage-list-page">
    <header>
      <el-button type="primary" sizi='small' @click="onPayTimeSetupClick(null)">添加最晚付款时间</el-button>
    </header>
    <main>
      <PayTimeTableComp :loading='loading' :dataList='PayTimeDataList' @edit="onPayTimeSetupClick" @remove="onRemoveClick" />
    </main>
    <footer>
      <CountComp
        :count='PayTimeDataNumber'
        :watchPage='Condition4PayTimeList.Page'
        :handlePageChange='getTableDataList'
        :pageSize='20'
        center
      />
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import PayTimeTableComp from '@/components/ProducePeriodComps/PayTimeComps/PayTimeTableComp';
import CountComp from '@/components/common/Count.vue';

export default {
  name: 'PayTimeManagePage',
  components: {
    PayTimeTableComp,
    CountComp,
  },
  computed: {
    ...mapState('periodManage', ['loading', 'PayTimeDataList', 'PayTimeDataNumber', 'Condition4PayTimeList']),
  },
  methods: {
    onPayTimeSetupClick(item) { // 设置最晚付款时间 为null为新增 否则为编辑
      this.$router.push({ name: 'PayTimeSetup', params: { ItemID: item ? item.ItemID : 'null' } });
    },
    onRemoveClick(item) {
      if (!item || !item.ItemID) return;
      this.$store.dispatch('periodManage/getPayTimeItemRemove', item);
    },
    getTableDataList(Page = 1) {
      this.$store.dispatch('periodManage/getPayTimeDataList', Page);
    },
  },
  mounted() {
    this.$store.commit('periodManage/clearCondition4PayTimeList');
    this.getTableDataList();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-pay-time-manage-list-page {
  background-color: #f5f5f5;
  padding: 0 8px;
  // padding-left: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  font-size: 14px;
  min-width: 700px;
  > header {
    flex: none;
    height: 60px;
    padding: 0 20px;
    background-color: #fff;
    display: flex;
    align-items: center;
    > button {
      width: 140px;
      height: 30px;
      padding: 0;
      border-radius: 2px;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin: 0 -1px;
    margin-top: 10px;
  }
  > footer {
    flex: none;
    background-color: #fff;
    height: 45px;
    padding-bottom: 10px;
    padding-top: 2px;
    text-align: right;
    color: #585858;
    .blue {
      color: #26BCF9;
      margin: 0 3px;
    }
  }
}
</style>
