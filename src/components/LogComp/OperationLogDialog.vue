<template>
  <CommonDialogComp
    width="700px"
    :visible.sync="localVisible"
    :showSubmit="false"
    cancelText="关闭"
    title="操作日志"
    @open="open"
    @cancle="cancel"
    @closed="closed"
    class="dialog"
    top="15vh"
  >
    <template v-if="logData">
      <ul class="infinite-list" v-infinite-scroll="load" :infinite-scroll-disabled="logData.loadAll" infinite-scroll-distance="1">
        <li v-for="it in logData.list" :key="it.ID">
          <span>{{it.Content}}</span>
          <span>{{it.Operator.Name}}</span>
          <span>{{formatDateForDisplay(it.CreateTime)}}</span>
        </li>
      </ul>
      <p v-if="logData.loading">加载中...</p>
      <p v-if="logData.loadAll">没有更多了</p>
    </template>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { formatDateForDisplay } from '@/assets/js/filter';
import { ServerTypeEnum } from '@/views/serverManage/utils/types';
import { CommonDialogComp } from 'mpzj-sell-lib';
import { computed, ref } from 'vue';
import { LogListDataClass } from './types/LogListDataClass';

const props = defineProps<{
  visible: boolean
  type: ServerTypeEnum
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const logData = ref<null | LogListDataClass>(null);

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  logData.value = null;
};

const open = () => {
  logData.value = new LogListDataClass({ Type: props.type });
};

const load = () => {
  console.log('load');
  if (!logData.value || logData.value.loadAll) return;
  const p = logData.value.list.length > 0 ? logData.value.condition.Page + 1 : 1;
  logData.value.getList(p);
};

</script>

<style scoped lang='scss'>
.dialog {
  :deep(.el-dialog__body) {
    height: 460px;
    box-sizing: border-box;
    padding: 30px;
    .infinite-list {
      height: 400px;
      overflow: auto;
      li {
        height: 40px;
      }
    }
  }
}
</style>
