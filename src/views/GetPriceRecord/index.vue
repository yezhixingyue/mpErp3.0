<template>
  <section class="mp-erp-get-price-record-page-containner">
    <Header />
    <main class="mp-erp-get-price-record-page-main-comp-wrap">
      <Table @detail='onDetailClick' />
      <DetailDialog v-model="visible" :detailData='detailData' />
    </main>
    <footer>
      <Count
       :watchPage='condition4RecordList.Page'
       :handlePageChange='handlePageChange'
       :count='RecordDataNumber'
       :pageSize='30'
       />
    </footer>
  </section>
</template>

<script>
import Header from '@/components/GetPriceRecordComps/Header';
import Table from '@/components/GetPriceRecordComps/Main/Table';
import Count from '@/components/common/Count.vue';
import DetailDialog from '@/components/GetPriceRecordComps/Main/DetailDialog';
import { mapState } from 'vuex';

export default {
  name: 'GetPriceRecordListPage',
  computed: {
    ...mapState('PriceRecord', ['condition4RecordList', 'RecordDataNumber']),
  },
  components: {
    Header,
    Table,
    Count,
    DetailDialog,
  },
  data() {
    return {
      visible: false,
      detailData: null,
    };
  },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('PriceRecord/getRecordList', page);
    },
    onDetailClick(data) {
      this.detailData = data;
      this.visible = true;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-get-price-record-page-containner {
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
