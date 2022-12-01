<template>
  <section class="mp-erp-factory-manual-out-source-manage-page-wrap">
    <!-- 顶部筛选区域 -->
    <ManualOutsourceHeader
      :condition="condition"
      :datas="datas"
      :factorys="localFactoryList"
      :setCondition="setCondition"
      :clearCondition="clearCondition"
      @getList="getList"
     />
    <main>
      <!-- 表格 -->
      <ManualOutsourceTable
        :list="datas"
        :loading="loading"
        :factorys="localFactoryList"
        :localPermission="localPermission"
        v-model="multipleSelection"
        ref="oTable"
        @showStatus="onShowStatus"
        @singleOutsource="onSingleOutsourceClick"
       />
       <!-- 单个订单操作记录弹窗 -->
      <OutsourceRecordDisplayDialog :list="showStatusList" :visible.sync="showStatusVisible" />
    </main>
    <!-- 底部区域 -->
    <ManualOutsourceFooter
      :list="datas"
      :dataNumber="dataNumber"
      :multipleSelection="multipleSelection"
      :condition="condition"
      :factorys="localFactoryList"
      :localPermission="localPermission"
      :changeMultipleFactory="handleChangeMultipleFactory"
      @getList="getList"
      @checkAll="handleCheckAll"
      @manualOutsource="onManualOutsourceClick"
     />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import ManualOutsourceHeader from '../../../components/FactoryModule/ManualOutsourceComps/ManualOutsourceHeader.vue';
import ManualOutsourceTable from '../../../components/FactoryModule/ManualOutsourceComps/ManualOutsourceTable.vue';
import ManualOutsourceFooter from '../../../components/FactoryModule/ManualOutsourceComps/ManualOutsourceFooter.vue';
import OutsourceRecordDisplayDialog from '../../../components/FactoryModule/ManualOutsourceComps/OutsourceRecordDisplayDialog.vue';
import ConditionClass from './classType/ConditionClass';
import OutsourceOrderItemClass from './classType/OutsourceOrderItemClass';

export default {
  name: 'ManualOutsourceManagePage',
  mixins: [recordScrollPositionMixin('.mp-erp-factory-manual-out-source-manage-page-wrap .el-table__body-wrapper')],
  components: {
    ManualOutsourceHeader,
    ManualOutsourceTable,
    ManualOutsourceFooter,
    OutsourceRecordDisplayDialog,
  },
  computed: {
    ...mapState('common', ['factoryList', 'Permission']),
    localPermission() {
      return this.Permission?.PermissionList?.PermissionCheckFileOutOrder?.Obj || {};
    },
    localFactoryList() {
      return this.factoryList.filter(it => !it.Convert);
    },
  },
  data() {
    return {
      condition: new ConditionClass(),
      datas: [],
      dataNumber: 0,
      loading: false,
      multipleSelection: [], // 多选列表
      showStatusVisible: false,
      showStatusList: [],
    };
  },
  methods: {
    setCondition([[key1, key2], value]) { // 设置条件
      if (!key2) this.condition[key1] = value;
      else this.condition[key1][key2] = value;
    },
    clearCondition() {
      this.condition = new ConditionClass();
    },
    async getList(Page = 1) { // 获取列表数据
      this.condition.Page = Page;

      const temp = this.condition.getFilterObj();

      this.datas = [];
      this.multipleSelection = [];

      this.loading = true;
      const resp = await this.api.getOutOrderList(temp).catch(() => null);
      this.loading = false;

      if (resp?.data.Status === 1000) {
        const list = resp.data.Data || [];
        this.datas = list.map(it => new OutsourceOrderItemClass(it));
        this.dataNumber = resp.data.DataNumber || 0;
      }
    },
    handleCheckAll(bool) { // 全选
      if (this.$refs.oTable) {
        this.$refs.oTable.toggleSelection(bool);
      }
    },
    async handleChangeMultipleFactory(FactoryID) { // 批量修改工厂
      const OrderList = this.multipleSelection.filter(it => it.Factory.ID !== FactoryID).map(it => it.OrderID);
      if (OrderList.length > 0) {
        const temp = {
          FactoryID,
          OrderList,
        };
        const resp = await this.api.getOutOrderChangeFactory(temp).catch(() => null);
        if (!(resp?.data?.Status === 1000)) {
          return false;
        }
        this.multipleSelection.forEach(it => {
          const _it = it;
          _it.Factory.ID = FactoryID;
        });
      }
      return true;
    },
    async onShowStatus(item) { // 查看状态
      if (!item || !item.OrderID) return;
      const resp = await this.api.getOutOrderProgress(item.OrderID).catch(() => null);
      if (resp?.data?.Status === 1000) {
        this.showStatusList = resp.data.Data || [];
        this.showStatusVisible = true;
      }
    },
    onSingleOutsourceClick(item) { // 单个订单确认外协
      this.handleOutsourceConfirm([item]);
    },
    onManualOutsourceClick() { // 多个选中订单确认外协
      this.handleOutsourceConfirm(this.multipleSelection);
    },
    handleOutsourceConfirm() { // 确认外协
      // console.log('handleOutsourceConfirm -- 确认外协 后续待开发', arr);
    },
  },
  mounted() {
    this.$store.dispatch('common/getFactoryList', { isForce: true, includeConvertServer: false });
    this.getList();
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-manual-out-source-manage-page-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-left: 8px;
  background: #f6f6f6;
  box-sizing: border-box;
  > main {
    flex: 1;
    background: #fff;
    margin-top: 10px;
  }
  > footer {
    min-height: 65px;
  }
  > header, > footer {
    flex: none;
    background: #fff;
  }
}
</style>
