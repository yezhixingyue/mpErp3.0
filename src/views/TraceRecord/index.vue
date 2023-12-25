<template>
  <section class="mp-erp-get-price-record-page-containner">
    <Header />
    <main class="mp-erp-get-price-record-page-main-comp-wrap">
      <Table @detail='onDetailClick' />
    </main>
    <footer>
      <Count
       :watchPage='condition4TraceRecordList.Page'
       :handlePageChange='handlePageChange'
       :count='TraceRecordDataNumber'
       :pageSize='30'
       >
       <DownLoadExcelComp :configObj="configObj" v-if="localPermission.ExportExcel" />
      </Count>
    </footer>
  </section>
</template>

<script>
import Header from '@/components/TraceRecordComps/Header';
import Table from '@/components/TraceRecordComps/Table.vue';
import Count from '@/components/common/Count.vue';
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
import CommonClassType from '@/store/CommonClassType';
import { mapState } from 'vuex';

export default {
  name: 'TraceRecordPage',
  computed: {
    ...mapState('TraceRecord', ['condition4TraceRecordList', 'TraceRecordDataNumber']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionCalculateRecord?.Obj) {
        return this.Permission.PermissionList.PermissionCalculateRecord.Obj;
      }
      return {};
    },
    condition() {
      return CommonClassType.filter(this.condition4TraceRecordList, true);
    },
    configObj() {
      return {
        condition: this.condition,
        count: this.TraceRecordDataNumber,
        fileDefaultName: '追踪记录',
        fileDate: this.condition4TraceRecordList.AddTime,
        downFunc: data => this.api.getCustomerTrackLogListExcel(data),
      };
    },
  },
  components: {
    Header,
    Table,
    Count,
    DownLoadExcelComp,
  },
  data() {
    return {
      detailData: null,
    };
  },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('TraceRecord/getCustomerTrackLogList', page);
    },
    onDetailClick(data) {
      this.detailData = data;
      const paramsData = {
        customerID: data.Customer.CustomerID,
        customerInfo: data.Customer,
      };
      this.$router.push({ name: 'TraceRecordDetail', params: paramsData });
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
