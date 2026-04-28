<template>
  <div class="mp-finance-refund-exception-page-wrap">
    <Header
      :condition="ManageListData.condition"
      :list="ManageListData.list"
      @setCondition="(e) => ManageListData.condition.setConditon(e)"
      @clear="() => ManageListData.clearCondition()"
      @getList="() => ManageListData.getList()"
    />

    <main>
      <Table
       :list="ManageListData.list"
       :loading="ManageListData.loading"
       :haveHandlePermission="UserDetail.PermissionList.PermissionManageRefund.Obj.Handle === true"
       @manualProcess="onManualProcess"
       @viewProgress="onViewProgress" />
      <ProgressDialog :visible.sync="visible" :item="item" />
    </main>

    <footer>
      <MpPagination center :watchPage="ManageListData.condition.Page" :pageSize="ManageListData.condition.PageSize"
      :count="ManageListData.listNumber" :handlePageChange="(num) => ManageListData.getList(num)" />
    </footer>
  </div>
</template>

<script lang='ts' setup>
import { Ref, onMounted, ref } from 'vue';
import MpPagination from '@/components/common/Count.vue';
import { useUserStore } from '@/pinia/modules/user';
import { MyMessage } from '@/basic/message';
import { storeToRefs } from 'pinia';
import { ManageRefundExceptionListModel, RefundExceptionTableRow } from './model/ManageRefundExceptionListModel';
import Header from './components/Header.vue';
import Table from './components/Table.vue';
import ProgressDialog from './components/ProgressDialog.vue';

const userStore = useUserStore();

const { UserDetail } = storeToRefs(userStore);

const ManageListData = ref(new ManageRefundExceptionListModel()) as unknown as Ref<ManageRefundExceptionListModel>;

// 手动处理
const onManualProcess = (e) => {
  MyMessage.warn({
    title: '是否确认已手动转款',
    msg: '该操作不可逆，请谨慎选择',
    onOk: () => {
      ManageListData.value.manualProcess(e, UserDetail.value?.StaffName || '');
    },
  });
};

// 查看进度
const item = ref<null | RefundExceptionTableRow>(null);
const visible = ref(false);
const onViewProgress = (e: RefundExceptionTableRow) => {
  item.value = e;
  visible.value = true;
};

onMounted(() => {
  ManageListData.value.getList();
});
</script>

<script lang='ts'>
// eslint-disable-next-line import/first
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'RefundExceptionPage',
  mixins: [recordScrollPositionMixin('.mp-finance-refund-exception-page-wrap .el-table__body-wrapper')],
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-finance-refund-exception-page-wrap {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 70px;

  > main {
    overflow: hidden;
  }

  > footer {
    padding-top: 10px;
  }
}
</style>
