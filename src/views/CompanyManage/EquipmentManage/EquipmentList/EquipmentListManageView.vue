<template>
  <section class="mp-equipment-manage-equip-list-manage-wrap">
    <Header @add='() => localListManageData.itemHandler.setVisible()' :localListManageData='localListManageData' @getList="getList" />

    <main>
      <Table
        :list="localListManageData.list"
        :loading="localListManageData.loading"
        @edit="(e) => localListManageData.itemHandler.setVisible(e)"
        @history="(e) => localListManageData.historyHandler.open(e)"
        @changeStatus="(...args) => localListManageData.itemHandler.openRemarkDialog(...args)"
        />

      <Dialog
        :type="localListManageData.condition.Type"
        :item="localListManageData.itemHandler.target"
        :visible.sync="localListManageData.itemHandler.visible"
        @submit="(e) => localListManageData.itemHandler.onSave(e)"
       />

      <RemarkDialog
        :visible.sync="localListManageData.itemHandler.remarkDiaManageData.visible"
        :row="localListManageData.itemHandler.target"
        :type="localListManageData.itemHandler.remarkDiaManageData.type"
        @submit="(...args) => localListManageData.itemHandler.remarkSubmit(localListManageData, ...args)"
       />

      <HistoryDialog
        :item="localListManageData.historyHandler.item"
        :visible.sync="localListManageData.historyHandler.visible"
       />
    </main>

    <Footer :Page="localListManageData.condition.Page" :PageSize="localListManageData.condition.PageSize" :listNumber="localListManageData.listNumber"
     @getList="getList" @excel="getExcelDownload" />
  </section>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import Header from './components/Header.vue';
import Table from './components/Table/Table.vue';
import Footer from './components/Footer.vue';
import Dialog from './components/Dialog/SaveDialog/Dialog.vue';
import RemarkDialog from './components/Dialog/RemarkDialog.vue';
import HistoryDialog from './components/Dialog/HistoryDialog.vue';
import { ManageEquipmentListClass } from './model/ManageEquipmentListClass';
import { useStaffList } from './hooks/useStaffList';

const localListManageData = ref(new ManageEquipmentListClass());

const { staffList, departmentList, jobPostList } = useStaffList();

const getList = (Page?: number) => localListManageData.value.getList(Page || 1, staffList.value);

onMounted(getList);

const getExcelDownload = () => {
  localListManageData.value.excel(staffList.value, departmentList.value, jobPostList.value);
};
</script>

<script lang='ts'>
export default {
  name: 'EquipmentListManageView',
};
</script>

<style scoped lang='scss'>
.mp-equipment-manage-equip-list-manage-wrap {
  width: 100%;
  height: 100%;
  padding-left: 8px;
  box-sizing: border-box;
  background-color: #f6f6f6;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;

  > header, > main, > footer {
    background-color: #fff;
  }

  > main {
    overflow: hidden;
  }
}
</style>
