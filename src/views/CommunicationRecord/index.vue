<template>
  <section class="mp-erp-get-price-record-page-containner">
    <Header />
    <main class="mp-erp-get-price-record-page-main-comp-wrap">
      <Table @detail='onDetailClick' />
    </main>
    <footer>
      <Count
       :watchPage='condition4RecordList.Page'
       :handlePageChange='handlePageChange'
       :count='RecordDataNumber'
       :pageSize='30'
       >
       <DownLoadExcelComp :configObj="configObj" v-if="localPermission.ExportExcel" />
      </Count>
    </footer>
  </section>
</template>

<script>
import Header from '@/components/CommunicationRecordComps/Header.vue';
import Table from '@/components/CommunicationRecordComps/Table.vue';
import Count from '@/components/common/Count.vue';
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
import CommonClassType from '@/store/CommonClassType';
import { mapState } from 'vuex';

export default {
  name: 'CommunicationRecordPage',
  computed: {
    ...mapState('CommunicationRecord', ['condition4RecordList', 'RecordDataNumber']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionCalculateRecord?.Obj) {
        return this.Permission.PermissionList.PermissionCalculateRecord.Obj;
      }
      return {};
    },
    condition() {
      return CommonClassType.filter(this.condition4RecordList, true);
    },
    configObj() {
      return {
        condition: this.condition,
        count: this.RecordDataNumber,
        fileDefaultName: '报价记录',
        fileDate: this.condition4RecordList.CalculateDate,
        downFunc: data => this.api.getCalculatePriceRecordListExcel(data),
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
      this.$store.dispatch('CommunicationRecord/getRecordList', page);
    },
    onDetailClick(data) {
      this.detailData = data;
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
