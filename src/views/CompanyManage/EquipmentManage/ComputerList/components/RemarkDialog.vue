<template>
  <CommonDialogComp class="dialog" width="512px" top="15vh" :title="`设置电脑${operationTypeText}信息`"
    :visible.sync="localVisible" :showDanger="showDanger" :showSubmit="!showDanger" :dangerText="operationTypeText"
    @open="open" @submit="submit" @danger="submit" @cancle="cancel">
    <el-form :model="ruleForm" ref="formRef" class="form" label-width="85px" style="margin-right: 10px;" size="mini"
      v-if="ruleForm" @submit.native.prevent>
      <!-- 输入框 -->
      <el-form-item required label="备注：" prop="content" :rules="[{ required: true, message: '请输入备注内容' }]">
        <el-input type="textarea" :rows="10" v-model="ruleForm.content"
          :placeholder="`请输入文字备注，记录电脑${operationTypeText}信息，后续可在设备历史记录中查询`" maxlength="200" show-word-limit></el-input>
      </el-form-item>

      <!-- 警告 -->
      <el-form-item v-if='showDanger' style="margin-bottom: -30px;line-height: 20px;">
        <span class="danger">
          提交后，电脑将变更为{{ operationTypeText }}状态并移除使用人信息
          <template v-if="props.operationType === EquipmentHistoryTypeEnum.abandon">，此操作不可逆转，请谨慎执行本操作!</template>
        </span>
      </el-form-item>

      <!-- 使用状态: 是否已启用 -->
      <el-form-item label="使用状态" prop="state" v-if="operationType === EquipmentHistoryTypeEnum.callin" style="height: 48px;">
        <!-- 设置使用状态 -->
        <el-col :span="6">
          <el-form-item>
            <el-checkbox v-model="ruleForm.state" :true-label="ComputerUseStateEnum.inUse"
              :false-label="ComputerUseStateEnum.leisure">使用中</el-checkbox>
          </el-form-item>
        </el-col>

        <!-- 使用人信息 -->
        <el-col :span="18">
          <el-form-item required label="使用人" prop="user" style="position: relative;top: -1px;"
            :rules="[{ required: true, message: '请选择使用人' }]"
            v-if="ruleForm.state === ComputerUseStateEnum.inUse && operationType === EquipmentHistoryTypeEnum.callin">
            <el-select v-model="ruleForm.user" filterable style="width: 150px;top: -2px;">
              <el-option v-for="item in staffList" :key="item.StaffID" :label="item.StaffName" :value="item.StaffID" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

    </el-form>
  </CommonDialogComp>
</template>

<script lang="ts" setup>
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { useUserStore } from '@/pinia/modules/user';
import { computed, ref } from 'vue';
import { useStaffList } from '../hooks/useStaffList';
import { ComputerUseStateEnum, EquipmentHistoryTypeEnum, EquipmentHistoryTypeEnumList } from '../types/enum';
import { ICallinStateInfo, IComputer, IRemarkSubmitParams } from '../types/type';

const props = defineProps<{
  visible: boolean
  row: null | IComputer
  operationType: EquipmentHistoryTypeEnum
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const { staffList } = useStaffList();
const operationTypeText = computed(() => EquipmentHistoryTypeEnumList.find(it => it.ID === props.operationType)?.Name);
const showDanger = computed(() => [EquipmentHistoryTypeEnum.abandon, EquipmentHistoryTypeEnum.callout].includes(props.operationType));

const formRef = ref();
const ruleForm = ref({ content: '', state: ComputerUseStateEnum.inUse, user: '' });

const open = async () => {
  try {
    if (formRef.value) formRef.value.resetFields();
  // eslint-disable-next-line no-empty
  } catch (error) {}

  ruleForm.value = { content: '', state: ComputerUseStateEnum.inUse, user: '' };
};

const cancel = () => {
  localVisible.value = false;
};

const submit = async () => {
  if (!ruleForm.value || !formRef.value) return;

  const bool = await formRef.value.validate().catch(() => false);

  if (bool) {
    const data: IRemarkSubmitParams = {
      content: ruleForm.value.content,
      creator: useUserStore().UserDetail.StaffID,
      equipmentId: props.operationType === EquipmentHistoryTypeEnum.create ? undefined : props.row.id || '',
      type: props.operationType,
    };
    const callinStateData: ICallinStateInfo | undefined = props.operationType === EquipmentHistoryTypeEnum.callin ? { ...ruleForm.value } : undefined;
    emit('submit', data, callinStateData);
  }
};
</script>
<style lang='scss' scoped>
.form {
  :deep(.el-form-item__content) {
    .danger {
      color: #ff3769;
      font-size: 12px;
      line-height: 20px;
      display: inline-block;
      // letter-spacing: 0.5px;
    }
  }
}
</style>
