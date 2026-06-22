<template>
  <section class="mp-notification-manage-list-manage-wrap">
    <header>
      <el-button type="primary" @click="onSaveClick(null)">+ 添加提醒人</el-button>
    </header>

    <main>
      <Table :loading="localManageModel.loading" :list="localManageModel.list" :staffList="localManageModel.staffList"
       @edit="e => onSaveClick(e)" @remove="(e) => localManageModel.remove(e)"
        :Permission="UserDetail?.PermissionList.PermissionManageMessage" />

      <Dialog :visible.sync="localManageModel.visible" :row="currentRow" :list="localManageModel.list" :staffList="localManageModel.staffList"
       @submit="(e) => localManageModel.save(e)" />
    </main>

    <footer>
      <span class="count">共检索出 <i>{{ localManageModel.list.length }}</i> 条记录</span>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/pinia/modules/user';
import { storeToRefs } from 'pinia';
import Table from './components/Table.vue';
import Dialog from './components/Dialog.vue';
import { MessageMemberListManageModel } from './model/MessageMemberListManageModel';
import { IMessageMember } from './types';

const userStore = useUserStore();

const { UserDetail } = storeToRefs(userStore);

const localManageModel = ref(new MessageMemberListManageModel());

const currentRow = ref<null | IMessageMember>(null);
const onSaveClick = (item: null | IMessageMember) => {
  console.log(item);
  currentRow.value = item;
  localManageModel.value.visible = true;
};

onMounted(() => {
  localManageModel.value.getList();
  localManageModel.value.getStaffList();
});
</script>

<script lang='ts'>
// eslint-disable-next-line import/first
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'NotificationListManageView',
  mixins: [recordScrollPositionMixin('.mp-notification-manage-list-manage-wrap > main .el-table__body-wrapper')],
};
</script>

<style scoped lang='scss'>
.mp-notification-manage-list-manage-wrap {
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

  > header {
    margin-bottom: 10px;
    padding: 20px;

    button {
      height: 32px;
      padding: 0;
      width: 120px;
    }
  }

  > main {
    overflow: hidden;
  }

  > footer {
    height: 50px;
    text-align: right;
    box-sizing: border-box;
    padding-top: 10px;

    .count {
      font-size: 13px;
      color: #444;
      margin-right: 30px;
      line-height: 24px;
      letter-spacing: 0.5px;

      i {
        font-weight: 700;
        color: #26bcf9;
      }
    }
  }
}
</style>
