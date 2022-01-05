<template>
  <section class="mp-erp-period-manage-delivery-time-manage-list-page">
    <header>
      <el-button type="primary" sizi='small' @click="onItemSetupClick(null)" v-if="localPermission.ShiftSetup">添加发货班次</el-button>
      <AreaSelector
        title="区域"
        useADArea
        useLabel
        :changePropsFunc="setCondition2ListData"
        :requestFunc="getTableDataList"
        :RegionalID="Condition4DeliveryTimeList.ProvinceName"
        :CityID="Condition4DeliveryTimeList.CityName"
        :CountyID="Condition4DeliveryTimeList.CountyName"
        :typeList="[['ProvinceName', ''],['CityName', ''],['CountyName', '']]"
      />
      <OrderChannelSelector
        useEmpty
        :options="subExpressList"
        :requestFunc="getTableDataList"
        :changePropsFunc="setCondition2ListData"
        :typeList="[['CompanyID', '']]"
        :defaultProps="{ label: 'Name', value: 'ID' }"
        :value="Condition4DeliveryTimeList.CompanyID"
        label="配送方式"
      />
    </header>
    <main>
      <DeliveryTimeTableComp :loading='loading' :dataList='DeliveryTimeDataList' @edit="onItemSetupClick" @remove="onRemoveClick" />
    </main>
    <footer>
      <CountComp
        :count='DeliveryTimeDataNumber'
        :watchPage='Condition4DeliveryTimeList.Page'
        :handlePageChange='getTableDataList'
        :pageSize='20'
        center
      />
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import CountComp from '@/components/common/Count.vue';
import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import DeliveryTimeTableComp from '../../../components/ProducePeriodComps/DeliveryTimeComps/DeliveryTimeTableComp.vue';

export default {
  name: 'DeliveryTimeListPage',
  components: {
    DeliveryTimeTableComp,
    CountComp,
    AreaSelector,
    OrderChannelSelector,
  },
  computed: {
    ...mapState('periodManage', ['loading', 'DeliveryTimeDataList', 'DeliveryTimeDataNumber', 'Condition4DeliveryTimeList']),
    ...mapGetters('common', ['subExpressList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionProducePeriod?.Obj) {
        return this.Permission.PermissionList.PermissionProducePeriod.Obj;
      }
      return {};
    },
  },
  methods: {
    onItemSetupClick(item) { // 为null为新增 否则为编辑
      this.$router.push({ name: 'DeliveryTimeSetup', params: { ItemID: item ? item.ItemID : 'null' } });
    },
    onRemoveClick(item) {
      if (!item || !item.ItemID) return;
      this.$store.dispatch('periodManage/getDeliveryTimeItemRemove', item);
    },
    getTableDataList(Page = 1) {
      this.$store.dispatch('periodManage/getDeliveryTimeDataList', Page);
    },
    setCondition2ListData(e) {
      this.$store.commit('periodManage/setCondition4DeliveryTimeList', e);
    },
  },
  created() {
    this.$store.dispatch('common/getExpressList');
  },
  mounted() {
    this.$store.commit('periodManage/clearCondition4DeliveryTimeList');
    this.getTableDataList();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-delivery-time-manage-list-page {
  background-color: #f5f5f5;
  padding: 0 8px;
  // padding-left: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  font-size: 14px;
  min-width: 900px;
  > header {
    flex: none;
    height: 60px;
    padding: 0 20px;
    background-color: #fff;
    display: flex;
    align-items: center;
    // flex-wrap: wrap;
    > button {
      width: 140px;
      flex: none;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      margin-right: 30px;
    }
    > ul {
      margin-right: 30px;
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
