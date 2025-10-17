<template>
  <section class="mp-erp-period-manage-new-special-manage-list-page">
    <header>
      <el-button type="primary" sizi='small' @click="onItemSaveClick(null)" v-if="localPermission.ProduceSpecialSetup">添加特殊情况</el-button>
      <span class="blue-span" @click="onToLogClick(null)">删除记录</span>
      <span class="warning ft-12 tips-box ml-22" style="width: 360px;">
        <i class="el-icon-warning ft-14 mr-8  ml-1"></i>
        注：仅匹配一条，优先级数字越小，越优先匹配
      </span>
    </header>
    <main>
      <NewSpecialTable :loading='loading' :dataList='NewSpecialDataListByGetters' @edit="onItemSaveClick" @remove="onRemoveClick" @log="onToLogClick" />
    </main>
    <footer>
      <CountComp
        :count='NewSpecialDataNumber'
        :watchPage='Condition4NewSpecialList.Page'
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
import NewSpecialTable from '../../../components/ProducePeriodComps/NewSpecialComps/NewSpecialTable.vue';

export default {
  name: 'SpecialListPage',
  components: {
    NewSpecialTable,
    CountComp,
  },
  computed: {
    ...mapState('periodManage', ['loading', 'NewSpecialDataNumber', 'Condition4NewSpecialList']),
    ...mapState('common', ['Permission']),
    ...mapGetters('periodManage', ['NewSpecialDataListByGetters']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionProducePeriod?.Obj) {
        return this.Permission.PermissionList.PermissionProducePeriod.Obj;
      }
      return {};
    },
  },
  methods: {
    onItemSaveClick(item) {
      this.$router.push({ name: 'SpecialSetup', params: { ItemID: item ? item.ItemID : 'null' } });
    },
    async onRemoveClick(item) {
      if (!item || !item.ItemID) return;
      const resp = await this.api.getPeriodSpecialSituationRemove(item.ItemID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const isEdit = false;
          const isRemove = true;
          this.$store.commit('periodManage/setNewSpecialItemChange', [item, isEdit, isRemove]);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    getTableDataList(Page = 1) {
      this.$store.dispatch('periodManage/getPeriodSpecialSituationList', Page);
    },
    setCondition2ListData(e) {
      this.$store.commit('periodManage/setCondition4NewSpecialList', e);
    },
    onToLogClick(data) {
      const SituationID = data ? data.ItemID : 'null';
      const LogType = data ? 4 : 3;
      const ItemName = data ? data.ItemName : '';
      this.$router.push({
        name: 'SpecialLogList',
        params: { SituationID, LogType, ItemName },
      });
    },
  },
  mounted() {
    this.$store.commit('periodManage/clearCondition4NewSpecialList');
    this.$store.dispatch('periodManage/getPeriodSpecialPropertyList');
    this.$store.dispatch('common/fetchAdAreaList');
    this.$store.dispatch('common/getProductClassifyData');
    this.$store.dispatch('common/getAllProductNames');
    this.getTableDataList();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-new-special-manage-list-page {
  background-color: #f5f5f5;
  padding: 0 8px;
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
