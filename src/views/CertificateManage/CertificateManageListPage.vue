<template>
  <section class="mp-erp-get-certificate-manage-page-containner">
    <Header @getList="getCertificateList" @setRequest="setRequest" :CertificateList="CertificateList"
    :getCertificateCondition="getCertificateCondition" @clearRequest="clearRequest"
    :CheckStatus = "CheckStatus" :CertificateStatus = "CertificateStatus"/>
    <main class="mp-erp-certificate-manage-list-page-main-comp-wrap">
      <Table :CertificateList="CertificateList"
      :CheckStatus = "CheckStatus" :CertificateStatus = "CertificateStatus"/>
    </main>
    <footer>
      <Count
       :watchPage='getCertificateCondition.Page'
       :handlePageChange='handlePageChange'
       :count='CertificateDataNumber'
       :pageSize='getCertificateCondition.PageSize'
       center
       >
      </Count>
    </footer>
  </section>
</template>

<script>
import Header from '@/components/CertificateManage/Header';
import Table from '@/components/CertificateManage/Table';
import Count from '@/components/common/Count.vue';
import { mapState } from 'vuex';

export default {
  name: 'CertificateListPage',
  computed: {
    ...mapState('PriceRecord', ['condition4RecordList', 'RecordDataNumber']),
  },
  components: {
    Header,
    Table,
    Count,
  },
  data() {
    return {
      CertificateList: [],
      CertificateDataNumber: 0,
      getCertificateCondition: {
        CertificateType: '',
        CertificateStatus: '',
        CheckStatus: '',
        ID: '',
        FieldType: 1,
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      },
      CheckStatus: [
        {
          label: '不限',
          value: '',
        },
        {
          label: '未审核',
          value: 0,
        },
        {
          label: '已审核',
          value: 1,
        },
        {
          label: '未通过',
          value: 2,
        },
      ],
      CertificateStatus: [
        {
          label: '不限',
          value: '',
        },
        {
          label: '已过期',
          value: 0,
        },
        {
          label: '有效',
          value: 1,
        },
      ],
    };
  },
  methods: {
    getCertificateList(page = 1) {
      if (this.getCertificateCondition.Page !== page) {
        this.getCertificateCondition.Page = page;
      }
      this.api.getCustomerCertificateManageList(this.getCertificateCondition).then(res => {
        if (res.data.Status === 1000) {
          this.CertificateList = res.data.Data;
          this.CertificateDataNumber = res.data.DataNumber;
        }
      });
    },
    handlePageChange(page) {
      this.getCertificateList(page);
    },
    setRequest([[key1, key2], value]) {
      if (key2) {
        this.getCertificateCondition[key1][key2] = value;
      } else {
        this.getCertificateCondition[key1] = value;
      }
    },
    clearRequest() {
      this.getCertificateCondition = {
        CertificateType: '',
        CertificateStatus: '',
        CheckStatus: '',
        ID: '',
        FieldType: 1,
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      };
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-get-certificate-manage-page-containner {
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
