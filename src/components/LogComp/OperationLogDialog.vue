<template>
  <CommonDialogComp
    width="550px"
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
      <ul class="infinite-list" v-load-more="load">
        <li v-for="it in logData.list" :key="it.ID">
          <span class="c" :title="it.Content">{{it.Content}}</span>
          <span class="n" :title="it.Operator.Name">{{it.Operator.Name}}</span>
          <span class="t">{{formatDateForDisplay(it.CreateTime)}}</span>
        </li>
        <p class="state">
          <template v-if="logData.loading">加载中...</template>
          <template v-if="logData.loadAll && logData.listNumber > 10">没有更多了</template>
          <template v-if="logData.loadAll && logData.listNumber === 0">暂无数据</template>
        </p>
      </ul>
    </template>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { formatDateForDisplay } from '@/assets/ts/filter';
import { ServerTypeEnum } from '@/views/serverManage/utils/types';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, ref } from 'vue';
import { LogListDataClass } from './types/LogListDataClass';

const props = defineProps<{
  visible: boolean
  type: ServerTypeEnum
  ServerID?: string
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
  const temp = { Type: props.type, ServerID: props.ServerID };
  if (!props.ServerID) {
    delete temp.ServerID;
  }
  // console.log(temp);
  logData.value = new LogListDataClass(temp);
};

const load = () => {
  if (!logData.value || logData.value.loadAll || logData.value.loading) return;
  const p = logData.value.list.length > 0 ? logData.value.condition.Page + 1 : 1;
  logData.value.getList(p);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    height: 440px;
    box-sizing: border-box;
    padding: 20px;
    padding-left: 30px;
    padding-bottom: 0;
    padding-right: 12px;
    border-bottom: 1px solid #d9d9d9;
    .infinite-list {
      height: 100%;
      overflow: auto;
      overflow: overlay;
      @include scroll;
      padding-right: 10px;
      li {
        height: 30px;
        display: flex;
        > span {
          flex: none;
          margin-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.c {
            flex: 1;
          }
          &.n {
            width: 6em;
            text-align: right;
            margin-right: 15px;
          }
          &.t {
            width: 110px;
            margin-right: 0;
          }
        }
      }
    }
    color: #888E99;
    font-size: 12px;
    line-height: 16px;
    .state {
      height: 34px;
      line-height: 32px;
      color: #aaa;
    }
  }
  :deep(.el-dialog__footer) {
    padding-top: 2px;
  }
}
</style>
