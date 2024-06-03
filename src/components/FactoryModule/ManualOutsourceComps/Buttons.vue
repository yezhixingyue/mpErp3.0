<template>
  <div class="mp-erp-factory-manual-out-source-manage-page-main-buttons-wrap">
    <el-checkbox v-model="checked" :disabled="checkAllDisabled" :indeterminate="isIndeterminate">全选本页</el-checkbox>
    <template v-if="localPermission.ReceiveOrder">
      <mp-button :disabled="outsourcingDisabled" type="primary" @click="onSendFactoryClick">批量外购</mp-button>
      <mp-button :disabled="orderDisabled" class="blue" @click="onHelpOrderClick">批量接单</mp-button>
    </template>
    <mp-button :disabled="downloadDisabled" class="blue" @click="onDownloadClick">批量下载</mp-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CheckFileOrderStatusEnumObj } from '@/views/FactoryManage/ManualOutsourceManage/classType/EnumList';
import OutsourceOrderItemClass from '@/views/FactoryManage/ManualOutsourceManage/classType/OutsourceOrderItemClass';
import ConditionClass from '@/views/FactoryManage/ManualOutsourceManage/classType/ConditionClass';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const props = defineProps<{
  list: OutsourceOrderItemClass[]
  multipleSelection: OutsourceOrderItemClass[]
  localPermission: { ReceiveOrder: boolean }
  condition: ConditionClass
  selectableStatuses: number[]
}>();

const emit = defineEmits(['checkAll', 'download', 'BatchSendFactory', 'BatchHelpOrder']);

const checked = computed({
  get() {
    return props.multipleSelection.length > 0 && props.multipleSelection.length === props.list.length;
  },
  set(val) {
    emit('checkAll', val);
  },
});

const isIndeterminate = computed(() => !checked.value && props.multipleSelection.length > 0);

const checkAllDisabled = computed(() => props.condition.CheckFileOrderStatus === '' || [...new Set(props.list.map(it => it.CheckFileStatus))].length > 1);
const outsourcingDisabled = computed(() => {
  if (props.multipleSelection.length === 0) return true;

  if (props.selectableStatuses.length === 1) return props.selectableStatuses[0] !== CheckFileOrderStatusEnumObj.WaitSendFactory.ID;

  return true;
});
const orderDisabled = computed(() => {
  if (props.multipleSelection.length === 0) return true;

  if (props.selectableStatuses.length === 1) return props.selectableStatuses[0] !== CheckFileOrderStatusEnumObj.OutsourceComfirm.ID;

  return true;
});
const downloadDisabled = computed(() => props.multipleSelection.length === 0);

const onDownloadClick = () => {
  if (props.multipleSelection.length === 0) return;

  MpMessage.warn({
    title: '批量外购提醒!',
    msg: `当前选中<i class="is-pink">${props.multipleSelection.length}个</i>订单，确定是否下载`,
    onOk: () => {
      emit('download', props.multipleSelection);
    },
  });
};
const onSendFactoryClick = () => {
  if (props.multipleSelection.length === 0) return;

  MpMessage.warn({
    title: '批量下载提醒!',
    msg: `当前选中<i class="is-pink">${props.multipleSelection.length}个</i>订单，将外购给指定工厂`,
    onOk: () => {
      emit('BatchSendFactory');
    },
  });
};
const onHelpOrderClick = () => {
  if (props.multipleSelection.length === 0) return;

  MpMessage.warn({
    title: '批量接单提醒!',
    msg: `当前选中<i class="is-pink">${props.multipleSelection.length}个</i>订单，已与对方工厂沟通确认接单`,
    onOk: () => {
      emit('BatchHelpOrder', props.multipleSelection);
    },
  });
};
</script>

<style lang='scss'>
.mp-erp-factory-manual-out-source-manage-page-main-buttons-wrap {
  height: 65px;

  display: flex;
  align-items: center;

  .el-checkbox__label {
    font-size: 12px;
    color: #444;
  }

  > button.el-button {
    width: 120px;
    height: 35px;
    border-radius: 3px;
    margin-left: 30px;
    padding: 0;

    &:first-of-type {
      margin-left: 20px;
    }

    &.is-disabled {
      color: #949494;
      background-color: #F5F5F5;
      border-color: #DCDFE6;
    }
  }
}
</style>
