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
      <!-- 操作按钮列表 -->
      <Buttons
       :list="datas"
       :condition="condition"
       :multipleSelection="multipleSelection"
       :selectableStatuses="selectableStatuses"
       :localPermission="localPermission"
       @checkAll="handleCheckAll"
       @download="download"
       @BatchSendFactory="onBatchSendFactoryClick"
       @BatchHelpOrder="onBatchHelpOrderClick"
       />

      <!-- 表格 -->
      <ManualOutsourceTable
        :list="datas"
        :loading="loading"
        :factorys="localFactoryList"
        :localPermission="localPermission"
        :selectableStatuses="selectableStatuses"
        v-model="multipleSelection"
        ref="oTable"
        @showStatus="onShowStatus"
        @download="download"
        @singleOutsource="onSingleOutsourceClick"
        @helpOrder="getOutOrderReceive"
        @comfirmCancle="handleComfirmCancle"
        @forceCancel="handleForceCancel"
       />
      <!-- 强制撤回原因输入弹窗 -->
      <ForceCancelDialog :visible.sync="forceCancelVisible" @submit="forceCancelSubmit" />
      <!-- 单个订单操作记录弹窗 -->
      <DetailRecordDialog :item="currentItem" :visible.sync="showStatusVisible" />
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
      @manualOutsource="onBatchSendFactoryClick"
      @changePageSize="changePageSize"
     />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import CommonClassType from '@/store/CommonClassType';
import ManualOutsourceHeader from '../../../components/FactoryModule/ManualOutsourceComps/ManualOutsourceHeader.vue';
import Buttons from '../../../components/FactoryModule/ManualOutsourceComps/Buttons.vue';
import ManualOutsourceTable from '../../../components/FactoryModule/ManualOutsourceComps/ManualOutsourceTable.vue';
import ManualOutsourceFooter from '../../../components/FactoryModule/ManualOutsourceComps/ManualOutsourceFooter.vue';
// import OutsourceRecordDisplayDialog from '../../../components/FactoryModule/ManualOutsourceComps/OutsourceRecordDisplayDialog.vue';
import ForceCancelDialog from '../../../components/FactoryModule/ManualOutsourceComps/ForceCancelDialog.vue';
import DetailRecordDialog from '../../../components/FactoryModule/ManualOutsourceComps/DetailRecordDialog.vue';
import ConditionClass from './classType/ConditionClass';
import OutsourceOrderItemClass from './classType/OutsourceOrderItemClass';
import { CheckFileOrderStatusEnumObj, CheckFileOrderStatusEnumList } from './classType/EnumList.ts';

export default {
  name: 'ManualOutsourceManagePage',
  mixins: [recordScrollPositionMixin('.mp-erp-factory-manual-out-source-manage-page-wrap .el-table__body-wrapper')],
  components: {
    ManualOutsourceHeader,
    Buttons,
    ManualOutsourceTable,
    ManualOutsourceFooter,
    DetailRecordDialog,
    ForceCancelDialog,
  },
  computed: {
    ...mapState('common', ['factoryList', 'Permission']),
    localPermission() {
      return this.Permission?.PermissionList?.PermissionCheckFileOutOrder?.Obj || {};
    },
    localFactoryList() {
      return this.factoryList.filter(it => !it.Convert);
    },
    selectableStatuses() { // 当前可以勾选的状态列表
      const ids = CheckFileOrderStatusEnumList.map(it => it.ID); // 全部状态

      if (this.multipleSelection.length > 0) {
        return [this.multipleSelection[0].CheckFileStatus];
        // if (this.multipleSelection[0].CheckFileStatus === CheckFileOrderStatusEnumObj.WaitSendFactory.ID) { // 可外购
        //   return [CheckFileOrderStatusEnumObj.WaitSendFactory.ID];
        // }

        // if (this.multipleSelection[0].CheckFileStatus === CheckFileOrderStatusEnumObj.OutsourceComfirm.ID) { // 可接单
        //   return [CheckFileOrderStatusEnumObj.OutsourceComfirm.ID];
        // }

        // return ids.filter(id => ![CheckFileOrderStatusEnumObj.WaitSendFactory.ID, CheckFileOrderStatusEnumObj.OutsourceComfirm.ID].includes(id));
      }

      return ids;
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
      forceCancelVisible: false,
      showStatusList: [],
      willForceCancelList: [], // 要被强制撤回的订单列表
      currentItem: null,
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

      CommonClassType.setDate(this.condition, 'PayTime');

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
      this.currentItem = item;
      this.showStatusVisible = true;
      // const resp = await this.api.getOutOrderProgress(item.OrderID).catch(() => null);
      // if (resp?.data?.Status === 1000) {
      //   this.showStatusList = resp.data.Data || [];
      //   this.showStatusVisible = true;
      // }
    },
    async download(arr) { // 下载文件
      const temp = { OrderList: arr.map(it => ({ OrderID: it.OrderID, Describe: it.Describe })) };

      const resp = await this.api.getOutOrderDownload(temp).catch(() => null);

      if (resp?.data.Status === 1000) {
        resp.data.Data.forEach((it) => {
          const iframe = document.createElement('iframe');

          iframe.src = it.FilePath;
          iframe.style.display = 'none';
          iframe.style.height = '0px';

          document.body.appendChild(iframe);

          setTimeout(() => {
            iframe.remove();
          }, 60 * 1000);
        });
      }
    },
    onSingleOutsourceClick(item) { // 单个订单确认外购
      this.handleOutsourceConfirm([item], true);
    },
    onBatchSendFactoryClick() { // 多个选中订单确认外购
      this.handleOutsourceConfirm(this.multipleSelection);
    },
    onBatchHelpOrderClick() { // 批量接单
      this.getOutOrderReceive(this.multipleSelection);
    },
    changePageSize(PageSize) {
      this.condition.PageSize = PageSize;
      this.getList();
    },
    async handleOutsourceConfirm(arr, isSingle = false) { // 确认外购
      if (!arr || arr.length === 0) return;
      const temp = {
        OrderList: arr.map(it => it.OrderID),
      };
      const resp = await this.api.getOutOrderComfirm(temp).catch(() => null);

      if (resp?.data?.Status === 1000) {
        const cb = () => {
          arr.forEach(it => {
            const _it = it;
            _it.CheckFileStatus = CheckFileOrderStatusEnumObj.OutsourceComfirm.ID;
          });
          if (this.$refs.oTable && isSingle) {
            const ids = this.multipleSelection.map(m => m.OrderID);
            this.$refs.oTable.toggleRowSelection(arr.filter(a => ids.includes(a.OrderID)));
          }
        };
        this.messageBox.successSingle(isSingle ? '外购成功' : '批量外购成功', cb, cb);
      }
    },
    async getOutOrderReceive(arr, isSingle = false) { // 确认接单
      if (!arr || arr.length === 0) return;
      const temp = {
        OrderList: arr.map(it => it.OrderID),
      };
      const resp = await this.api.getOutOrderReceive(temp).catch(() => null);

      if (resp?.data?.Status === 1000) {
        const cb = () => {
          arr.forEach(it => {
            const _it = it;
            _it.CheckFileStatus = CheckFileOrderStatusEnumObj.HaveSendFactory.ID;
          });
          if (this.$refs.oTable && isSingle) {
            const ids = this.multipleSelection.map(m => m.OrderID);
            this.$refs.oTable.toggleRowSelection(arr.filter(a => ids.includes(a.OrderID)));
          }
        };
        this.messageBox.successSingle(isSingle ? '接单成功' : '批量接单成功', cb, cb);
      }
    },
    async handleComfirmCancle(arr) { // 取消外购 -- 作废
      if (!arr || arr.length === 0) return;
      const temp = {
        OrderList: arr.map(it => it.OrderID),
      };
      const resp = await this.api.getOutOrderComfirmCancle(temp).catch(() => null);

      if (resp?.data?.Status === 1000) {
        const cb = () => {
          arr.forEach(it => {
            const _it = it;
            _it.CheckFileStatus = CheckFileOrderStatusEnumObj.WaitSendFactory.ID;
          });
        };
        this.messageBox.successSingle('取消成功', cb, cb);
      }
    },
    handleForceCancel(arr) {
      this.willForceCancelList = arr;
      this.forceCancelVisible = true;
    },
    async forceCancelSubmit(Remark) { // 强制撤销
      const temp = {
        Remark,
        OrderList: this.willForceCancelList.map(it => it.OrderID),
      };
      const resp = await this.api.getOutOrderComfirmCancle(temp).catch(() => null);

      if (resp?.data?.Status === 1000) {
        const cb = () => {
          this.willForceCancelList.forEach(it => {
            const _it = it;
            _it.CheckFileStatus = CheckFileOrderStatusEnumObj.WaitSendFactory.ID;
          });
          this.forceCancelVisible = false;

          if (this.$refs.oTable) {
            const ids = this.multipleSelection.map(m => m.OrderID);
            this.$refs.oTable.toggleRowSelection(this.willForceCancelList.filter(a => ids.includes(a.OrderID)));
          }
        };
        this.messageBox.successSingle('强制撤回成功', cb, cb);
      }
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
    overflow: hidden;
    padding-left: 20px;
  }

  > footer {
    flex: none;
    height: 65px;
  }

  > header, > footer {
    flex: none;
    background: #fff;
  }
}
</style>
