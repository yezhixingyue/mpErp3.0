<template>
  <section class="mp-erp-period-manage-dispatch-time-manage-list-page">
    <header>
      <el-button type="primary" sizi='small' @click="onItemSetupClick(null)" v-if="localPermission.DispatchSetup">添加派件时间</el-button>
      <!-- <AreaSelector
        title="区域"
        useADArea
        useLabel
        :changePropsFunc="setCondition2ListData"
        :requestFunc="getTableDataList"
        :RegionalID="Condition4DispatchTimeList.ProvinceName"
        :CityID="Condition4DispatchTimeList.CityName"
        :CountyID="Condition4DispatchTimeList.CountyName"
        :typeList="[['ProvinceName', ''],['CityName', ''],['CountyName', '']]"
      /> -->
      <EpCascaderByArea
         title="区域"
         useAdArea
         useLabel
         class="mr-20"
        :setCondition="setCondition2ListData"
        :getList="getTableDataList"
        :RegionalID="Condition4DispatchTimeList.ProvinceName"
        :CityID="Condition4DispatchTimeList.CityName"
        :CountyID="Condition4DispatchTimeList.CountyName"
        :typeList="[['ProvinceName', ''],['CityName', ''],['CountyName', '']]"
      />
    </header>
    <main>
      <DispatchTimeTableComp :loading='loading' :dataList='DispatchTimeDataList' @edit="onItemSetupClick" @remove="onRemoveClick" />
    </main>
    <footer>
      <CountComp
        :count='DispatchTimeDataNumber'
        :watchPage='Condition4DispatchTimeList.Page'
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
// import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
import DispatchTimeTableComp from '../../../components/ProducePeriodComps/DispatchTimeComps/DispatchTimeTableComp.vue';
import EpCascaderByArea from '../../../components/common/SelectorComps/EpCascaderWrap/EpCascaderByArea.vue';

export default {
  name: 'DispatchTimeListPage',
  components: {
    DispatchTimeTableComp,
    CountComp,
    // AreaSelector,
    EpCascaderByArea,
  },
  computed: {
    ...mapState('periodManage', ['loading', 'DispatchTimeDataList', 'DispatchTimeDataNumber', 'Condition4DispatchTimeList']),
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
      this.$router.push({ name: 'DispatchTimeSetup', params: { ItemID: item ? item.ItemID : 'null' } });
    },
    onRemoveClick(item) {
      if (!item || !item.ItemID) return;
      this.$store.dispatch('periodManage/getDispatchTimeItemRemove', item);
    },
    getTableDataList(Page = 1) {
      this.$store.dispatch('periodManage/getDispatchTimeDataList', Page);
    },
    setCondition2ListData(e) {
      this.$store.commit('periodManage/setCondition4DispatchTimeList', e);
    },
  },
  created() {
    this.$store.dispatch('common/getExpressList');
  },
  mounted() {
    this.$store.commit('periodManage/clearCondition4DispatchTimeList');
    this.getTableDataList();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-dispatch-time-manage-list-page {
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
