<template>
  <section class="mp-erp-period-manage-special-day-manage-list-page">
    <header  v-if="localPermission.DiliveryStopSetup">
      <el-button type="primary" sizi='small' @click="onItemSetupClick(null)">添加快递停发</el-button>
    </header>
    <main>
      <ExpressStopTableComp :loading='loading' :dataList='ExpressStopDataList' @edit="onItemSetupClick" @remove="onRemoveClick" />
    </main>
    <footer>
      <CountComp
        :count='ExpressStopDataNumber'
        :watchPage='Condition4ExpressStopList.Page'
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
import ExpressStopTableComp from '../../../components/ProducePeriodComps/ExpressStopComps/ExpressStopTableComp.vue';

export default {
  name: 'ExpressStopListPage',
  components: {
    ExpressStopTableComp,
    CountComp,
  },
  computed: {
    ...mapState('periodManage', ['loading', 'ExpressStopDataList', 'ExpressStopDataNumber', 'Condition4ExpressStopList']),
    ...mapGetters('common', ['subExpressList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionProducePeriod?.Obj) {
        return this.Permission.PermissionList.PermissionProducePeriod.Obj;
      }
      return {};
    },
    localSpecialtype: {
      get() {
        return this.Condition4ExpressStopList.Specialtype;
      },
      set(val) {
        this.setCondition2ListData([['Specialtype'], val]);
      },
    },
  },
  methods: {
    onItemSetupClick(item) { // 为null为新增 否则为编辑
      this.$router.push({ name: 'ExpressStopSetup', params: { ItemID: item ? item.ItemID : 'null' } });
    },
    onRemoveClick(item) {
      if (!item || !item.ItemID) return;
      this.$store.dispatch('periodManage/getSpecialDayItemRemove', item);
    },
    getTableDataList(Page = 1) {
      this.$store.dispatch('periodManage/getExpressStopDataList', Page);
    },
    setCondition2ListData(e) {
      this.$store.commit('periodManage/setCondition4ExpressStopList', e);
    },
  },
  created() {
    this.$store.dispatch('common/getExpressList');
  },
  mounted() {
    this.$store.commit('periodManage/clearCondition4ExpressStopList');
    this.getTableDataList();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-special-day-manage-list-page {
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
      margin-right:65px;
    }
    > div {
      color: #444;
      > label {
        font-weight: 700;
      }
      .el-radio__label {
        color: #444;
      }
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
