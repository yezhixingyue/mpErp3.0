<template>
  <CommonDialogComp class="dialog" width="620px" top="15vh" title="权限人负责情况设置"
    :visible.sync="localVisible"
    @open="open" @submit="submit" @cancle="cancel">
    <el-form :model="ruleForm" ref="formRef" class="form" label-width="110px" size="mini"
      v-if="ruleForm" @submit.native.prevent>
      <el-form-item required label="提醒人：" prop="ID" :rules="[{ required: true, message: '请选择提醒人' }]">
        <el-select v-model="ruleForm.ID" filterable style="width: 150px;top: -2px;">
          <el-option v-for="item in staffList.filter(it => !ids.includes(it.StaffID))" :key="item.StaffID" :label="item.StaffName" :value="item.StaffID" />
        </el-select>
      </el-form-item>

      <el-form-item required label="消息类型：" prop="Types" :rules="[{ required: true, message: '请选择消息类型' }]">
        <el-checkbox-group v-model="ruleForm.Types">
          <el-checkbox  v-for="it in SystemMessageTypeEnumList" :key="it.ID" :label="it.ID">{{ it.Name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

    </el-form>
  </CommonDialogComp>
</template>

<script lang="ts" setup>
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, ref } from 'vue';
import { IMessageMember } from '../types';
import { RuleForm } from '../model/RuleForm';
import { SystemMessageTypeEnumList } from '../types/enum';
import { MessageMemberListManageModel } from '../model/MessageMemberListManageModel';

const props = defineProps<{
  visible: boolean
  row: null | IMessageMember
  staffList: MessageMemberListManageModel['staffList']
  list: IMessageMember[]
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

const formRef = ref();
const ruleForm = ref(new RuleForm(null));

const ids = computed(() => props.list.map(it => it.ID).filter(it => it !== props.row?.ID));

const open = async () => {
  try {
    if (formRef.value) formRef.value.resetFields();
  // eslint-disable-next-line no-empty
  } catch (error) {}

  ruleForm.value = new RuleForm(props.row);
};

const cancel = () => {
  localVisible.value = false;
};

const submit = async () => {
  if (!ruleForm.value || !formRef.value) return;

  const bool = await formRef.value.validate().catch(() => false);

  if (bool) {
    emit('submit', ruleForm.value.getParams());
  }
};
</script>
<style lang='scss' scoped>
.form {
  :deep(.el-form-item__content) {
    .el-checkbox {
      margin-right: 10px;

      .el-checkbox__label {
        width: 10em;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
    }
  }
}
</style>
