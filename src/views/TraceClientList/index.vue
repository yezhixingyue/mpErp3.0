<template>
  <section class="mp-erp-trace-client-list-page-containner">
    <Header />
    <main class="mp-erp-trace-client-list-page-main-comp-wrap">
      <Table @detail='onDetailClick' />
    </main>
    <footer>
      <Count
       :watchPage='condition4RecordList.Page'
       :handlePageChange='handlePageChange'
       :count='TraceClientListDataNumber'
       :pageSize='condition4RecordList.PageSize'
       ></Count>
    </footer>
  </section>
</template>

<script>
import Header from '@/components/TraceClientListComps/Header.vue';
import Table from '@/components/TraceClientListComps/Table.vue';
import Count from '@/components/common/Count.vue';
import { mapState } from 'vuex';

export default {
  name: 'TraceClientListPage',
  computed: {
    ...mapState('TraceClientList', ['condition4RecordList', 'TraceClientListDataNumber']),
  },
  components: {
    Header,
    Table,
    Count,
  },
  data() {
    return {
      detailData: null,
    };
  },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('TraceClientList/getTraceClientList', page);
    },
    onDetailClick(data) {
      this.detailData = data;
      const paramsData = {
        customerID: data.Customer.CustomerID,
        customerInfo: data.Customer,
      };
      this.$router.push({ name: 'TraceClientListDetail', params: paramsData });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-trace-client-list-page-containner {
  background-color: #f5f5f5;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > header {
    flex: none;
  }
  > main {
    flex: 1;
    overflow: hidden;
    background-color: #fff;
    margin-top: 10px;
  }
  > footer {
    flex: none;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: #fff;
  }
}
</style>
