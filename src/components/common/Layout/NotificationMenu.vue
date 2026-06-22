<template>
  <el-tooltip placement="bottom-start" popper-class="mp-erp-header-message-tooltip-popper-box" v-show="localMessageList.list.length > 0">
    <div slot="content" class="mp-erp-header-message-tooltip-content">
      <ul>
        <!-- <li>
          <span style="font-weight: 700;font-size: 13px;">订阅的提醒信息：</span>
        </li> -->
        <li v-for="it in localMessageList.list" :key="it.label">
          <span>{{ it.label }}-</span>
          <!-- <i>-</i> -->
          <span>（{{ it.count }}）</span>
        </li>
      </ul>
    </div>
    <span class="notification-menu mr-20">
      <i class="iconfont icon-tixing"></i>
      <em v-if="localMessageList.total" class="count">{{ localMessageList.total }}</em>
    </span>
  </el-tooltip>
</template>

<script setup lang='ts'>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { signalR } from '@/assets/js/notification/SignalRService';
import { IWebSocketMessage } from '@/views/CompanyManage/NotificationManage/types';
import { SystemMessageTypeEnumList } from '@/views/CompanyManage/NotificationManage/types/enum';
import api from '@/api';

const messageData = ref<IWebSocketMessage[]>([]);

const localMessageList = computed(() => {
  const list = SystemMessageTypeEnumList.map(it => {
    const label = it.Name;
    let count = 0;
    let havePermission = false;

    const t = messageData.value.find(m => m.Type === it.ID);
    if (t) {
      count = Number(t.Content);
      havePermission = true;
    }

    return { label, count, havePermission };
  }).filter(it => it.havePermission);

  const total = list.map(it => it.count).reduce((t, num) => t + num, 0);

  return {
    list,
    total,
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const receiveNotification = (event: any) => {
  const msg = event.detail as IWebSocketMessage;

  const t = messageData.value.find(it => it.Type === msg.Type);
  if (t) {
    t.Content = msg.Content;
  } else {
    messageData.value.push(msg);
  }
};

const getMessageList = async () => {
  const resp = await api.getMessageList();
  if (resp?.data?.isSuccess) {
    messageData.value = [...resp.data.Data];
  }
};

onMounted(async () => {
  await getMessageList();

  window.addEventListener('notification', receiveNotification);
});

onUnmounted(() => {
  window.removeEventListener('notification', receiveNotification);
  signalR.stop();
});
</script>

<style scoped lang='scss'>
.notification-menu {
  vertical-align: -1px;
  font-size: 17px;
  position: relative;
  padding: 0 3px;
  display: inline-block;
  height: 27px;
  color: #ddd;

  &:hover {
    color: #26bcf9;
  }

  .iconfont {
    font-size: 19px;
  }

  .count {
    position: absolute;
    left: 11px;
    top: -1px;
    color: #fff;
    background-color: red;
    font-size: 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 14px;
    min-width: 14px;
    box-sizing: border-box;
    padding: 0 2px;
    transform: scale(0.8);
  }
}

.mp-erp-header-message-tooltip-content {
  color: #eee;
  padding: 10px 10px 6px;
  font-size: 12px;
  > ul {
    > li {
      padding-bottom: 4px;
      min-width: 150px;
    }
  }
}
</style>
