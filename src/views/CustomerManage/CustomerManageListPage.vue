<template>
  <section class="mp-erp-customer-manage-list-page-wrap">
    <CustomerManageListHeader @setup='onSetupClick' />
    <main>
      <CustomerManageListTable
        :dataList="customerDataList"
        :loading='loading'
        @setup='onSetupClick'
        @remove='onRemoveClick'
        @detail='onShowDetailClick'
        @setPrice='onSetPriceClick'
        @setShop='onSetShopClick'
       />
      <CustomerDialogComp :visible.sync="detailVisible" :CustomerID='CustomerID' :openType='openType' />
    </main>
    <footer>
      <CountComp :count='customerDataNumber' :watchPage='condition4DataList.Page' :handlePageChange='getDataList' center />
      <DownLoadExcelComp :configObj="configObj" />
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CountComp from '@/components/common/Count.vue';
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
import CommonClassType from '@/store/CommonClassType';
import CustomerManageListHeader from '../../components/CustomerManageComps/ListPageComps/CustomerManageListHeader.vue';
import CustomerManageListTable from '../../components/CustomerManageComps/ListPageComps/CustomerManageListTable.vue';
import CustomerDialogComp from '../../components/CustomerManageComps/ListPageComps/CustomerDialogComp/index.vue';

export default {
  name: 'CustomerManageListPage',
  components: {
    CustomerManageListHeader,
    CustomerManageListTable,
    CountComp,
    DownLoadExcelComp,
    CustomerDialogComp,
  },
  computed: {
    ...mapState('customerManage', ['customerDataList', 'customerDataNumber', 'loading', 'condition4DataList']),
    configObj() { // 导出Excel条件对象
      return {
        condition: CommonClassType.filter(this.condition4DataList, true),
        count: this.customerDataNumber,
        fileDefaultName: '客户列表',
        // fileDate: '',
        downFunc: data => this.api.getCustomerList2Excel(data),
      };
    },
  },
  data() {
    return {
      detailVisible: false,
      CustomerID: '',
      openType: 'detail',
    };
  },
  methods: {
    onSetupClick(ID) { // 新建 | 编辑客户
      this.$router.push({ name: 'CustomerManageSetup', params: { ID } });
    },
    getDataList(page = 1) { // 获取数据列表
      this.$store.dispatch('customerManage/getCustomerDataList', page);
    },
    onRemoveClick(CustomerID) { // 删除
      this.$store.dispatch('customerManage/getCustomerRemove', CustomerID);
    },
    onShowDetailClick({ CustomerID }) { // 详情
      this.CustomerID = CustomerID;
      this.openType = 'detail';
      this.detailVisible = true;
    },
    onSetPriceClick({ CustomerID }) { // 设置价格
      this.CustomerID = CustomerID;
      this.openType = 'setPrice';
      this.detailVisible = true;
    },
    onSetShopClick() { // 设置关联店铺
      // console.log('onSetShopClick', item);
    },
  },
  mounted() {
    this.$store.commit('customerManage/clearCondition2DataList');
    this.$store.dispatch('customerManage/getCustomerDataList');
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-manage-list-page-wrap {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  > header {
    flex: none;
  }
  > main {
    flex: 1;
    padding-left: 20px;
    padding-right: 20px;
  }
  > footer {
    flex: none;
    height: 55px;
    padding-top: 0px;
    display: flex;
    align-items: center;
    > button {
      flex: none;
      padding-right: 20px;
    }
    > div.count-wrap {
      flex: 1;
      padding-right: 30px;
      padding-left: 40px;
      > .count {
        right: 35px;
      }
    }
  }
}
</style>
