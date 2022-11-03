<template>
  <CommonDialogComp
    width="620px"
    :title="`${props.curItem ? '编辑' : '添加'}员工`"
    :visible.sync="localVisible"
    @open="onOpen"
    @submit="submitForm"
    @cancle="cancel"
    @closed="closed"
    class="dialog"
    top="20vh"
  >
    <el-form :model="ruleForm" :rules="rules" hide-required-asterisk ref="oForm" label-width="120px" class="ruleForm-box" v-if="ruleForm" size="small">
      <el-form-item prop="Name" label="姓名：" class="n">
        <el-input placeholder="请输入员工姓名" v-model.trim="ruleForm.Name" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item prop="Mobile" label="手机号：">
        <el-input placeholder="请输入手机号码" maxlength="11" v-model.trim="ruleForm.Mobile"></el-input>
      </el-form-item>
      <el-form-item prop="Password" label="密码：">
        <el-input :placeholder="`${props.curItem ? '不修改密码请留空' : '请输入密码'}`" maxlength="16" v-model.trim="ruleForm.Password"></el-input>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { Form } from 'element-ui';
import { CommonDialogComp } from 'mpzj-sell-lib';
import { computed, ref } from 'vue';
import { StaffClass } from './StaffClass';
import { IStaff } from './types';

const props = defineProps<{
  visible: boolean
  curItem: null | IStaff
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

const oForm = ref<InstanceType<typeof Form>>();

const ruleForm = ref<null | StaffClass>(null);

const checkPasswordRequired = (rule: unknown, value: string, callback: (arg0?: Error) => void) => {
  if (!value && !props.curItem) {
    callback(new Error('请输入密码'));
    return;
  }
  callback();
};

const rules = {
  Name: [
    { required: true, message: '请输入员工姓名', trigger: 'change' },
  ],
  Mobile: [
    { required: true, message: '请输入手机号码', trigger: 'change' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', target: 'change' },
  ],
  Password: [
    { validator: checkPasswordRequired, trigger: 'change' },
    { min: 6, message: '密码长度应在6 - 16位之间', trigger: 'change' },
  ],
};

const onOpen = async () => {
  ruleForm.value = new StaffClass(props.curItem);
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  ruleForm.value = null;
};

const submitForm = () => {
  if (!oForm.value) return;
  oForm.value.validate(async (valid) => {
    if (valid && ruleForm.value) {
      emit('submit', ruleForm.value);
    }
  });
};

</script>

<style scoped lang='scss'>
.dialog {
  :deep(.el-dialog__body) {
    padding: 30px 50px;
    padding-right: 40px;
    .ruleForm-box {
      .el-form-item__label {
        font-size: 13px;
        color: #888E99;
      }
      .el-input {
        width: 360px;
        height: 30px;
        input {
          height: 30px;
        }
      }
    }
  }
}
</style>
