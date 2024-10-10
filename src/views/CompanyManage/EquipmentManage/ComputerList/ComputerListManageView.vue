<template>
  <section class="mp-equipment-manage-computer-manage-wrap">
    <Header @add="onDialogSaveClick(null)" :localManageListData='localManageListData' @getList="getList" />
    <main>
      <Dialog :visible.sync="visible" :item="row" :isCopy="isCopy" @submit="onDialogSubmitClick" />
      <RemarkDialog :visible.sync="remarkVisible" @submit="submit" />
      <HistoryDialog :visible.sync="history.visible" :item="history.row" />
      <Table :list="localManageListData.list" :loading="localManageListData.loading" @edit="onDialogSaveClick" @history="onHistoryClick" />
    </main>

    <Footer :Page="localManageListData.condition.Page" :PageSize="localManageListData.condition.PageSize" :listNumber="localManageListData.listNumber"
     @getList="getList" @excel="getExcelDownload" />
  </section>
</template>

<script setup lang='ts'>
import Header from './components/Header.vue';
import Dialog from './components/Dialog.vue';
import Table from './components/Table.vue';
import Footer from './components/Footer.vue';
import RemarkDialog from './components/RemarkDialog.vue';
import HistoryDialog from './components/HistoryDialog.vue';
import { onMounted, ref } from 'vue';
import { ComputerListManageClass } from './model/ComputerListManageClass';
import { useSaveDialog } from './hooks/useSaveDialog';
import { useHistory } from './hooks/useHistory';
import { useStaffList } from './hooks/useStaffList';

const localManageListData = ref(new ComputerListManageClass());

const { visible, row, isCopy, remarkVisible, onDialogSaveClick, onDialogSubmitClick, submit } = useSaveDialog(localManageListData);

const { history, onHistoryClick } = useHistory();

const { staffList, departmentList } = useStaffList();

const getList = (Page = 1) => localManageListData.value.getList(Page, staffList.value);

const getExcelDownload = () => {
  localManageListData.value.excel(staffList.value, departmentList.value);
};

onMounted(getList);
</script>

<script lang='ts'>
export default {
  name: 'ComputerListManageView',
};
</script>

<style scoped lang='scss'>
.mp-equipment-manage-computer-manage-wrap {
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
