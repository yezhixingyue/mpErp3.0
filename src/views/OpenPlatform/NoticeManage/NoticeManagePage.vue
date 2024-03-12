<template>
  <section class="mp-erp-develop-open-api-notice-manage-page-wrap">
    <header>
      <el-button type="primary" @click="localNoticeManageData.visible = true">发送消息</el-button>
    </header>
    <main>
      <NoticeTable :list="localNoticeManageData.list" :loading="localNoticeManageData.loading"
        @remove="(e) => localNoticeManageData.remove(e)" @spread="(e) => localNoticeManageData.spread(e)" />
      <SendMsgDialog :visible.sync="localNoticeManageData.visible" @submited="(e) => localNoticeManageData.submited(e)" />
    </main>
    <footer>
      <MpPagination center
        :watchPage="localNoticeManageData.condition.Page"
        :count="localNoticeManageData.listNumber"
        :pageSize="localNoticeManageData.condition.PageSize"
        :handlePageChange="(num) => localNoticeManageData.getList(num)"
      />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import MpPagination from '@/components/common/Count.vue';
import { NoticeManageClass } from './js/NoticeManageClass';
import SendMsgDialog from './components/SendMsgDialog.vue';
import NoticeTable from './components/NoticeTable.vue';

const localNoticeManageData = ref(new NoticeManageClass());

onMounted(() => {
  localNoticeManageData.value.getList();
});

</script>

<script lang='ts'>
export default {
  name: 'NoticeManagePage',
};
</script>

<style scoped lang='scss'>
.mp-erp-develop-open-api-notice-manage-page-wrap {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 75px 1fr 60px;

  > header {
    padding: 20px;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
    }
  }

  > main {
    padding: 0 20px;
    overflow: hidden;
    overflow-x: auto;
  }

  > footer {
    padding-top: 8px;
    box-sizing: border-box;
    max-width: 1360px;
  }
}
</style>
