<template>
  <CommonDialogComp
    width="700px"
    :title="`设置默认${props.data.title}`"
    :visible.sync="localVisible"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    class="dialog"
    top="15vh"
  >
    <el-radio-group v-model="radio">
      <el-radio class="check-item" v-for="it in props.data.leftDataList" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-radio>
    </el-radio-group>
    <p v-if="props.data.leftDataList.length === 0" >
      <span class="danger ft-2"><i class="el-icon-warning ft-14 mr-5"></i>暂无数据</span>
    </p>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { message } from '@/assets/js/message';
import { GeneralMapDataClass } from '@/store/modules/transformer/map/GeneralMapDataClass';
import { CommonDialogComp } from 'mpzj-sell-lib';
import { computed, ref } from 'vue';

const props = defineProps<{
  visible: boolean
  lineData: { ID: string, Name: string }
  data: Omit<GeneralMapDataClass, 'getLeftList' | 'getRightList' | 'getMapList' | 'getData'>
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

const radio = ref('');

const onOpen = () => {
  radio.value = props.lineData ? props.lineData.ID : '';
  const ids = props.data.leftDataList.map(it => it.ID);
  if (ids.length > 0 && !ids.includes(radio.value)) {
    radio.value = '';
  }
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  radio.value = '';
};

const submit = async () => {
  if (!radio.value) {
    message.error({ title: '保存失败', message: '请选择生产线' });
    return;
  }
  const lineData = props.data.leftDataList.find(it => it.ID === radio.value);
  if (lineData) {
    const cb = () => {
      localVisible.value = false;
    };
    props.data.getDefaultLineSetup(lineData, cb);
  }
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    min-height: 150px;
    max-height: 385px;
    overflow: auto;
    overflow: overlay;
    padding: 30px 55px;
    padding-right: 20px;
    margin-right: 3px;
    padding-left: 85px;
    padding-top: 30px;
    .check-item {
      margin-right: 10px;
      margin-bottom: 8px;
      .el-radio__label {
        display: inline-block;
        vertical-align: -1px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 9em;
        font-size: 12px;
      }
    }
  }
}
</style>
