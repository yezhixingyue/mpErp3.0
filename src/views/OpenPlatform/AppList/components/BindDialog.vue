<template>
  <CommonDialogComp
    width="600px"
    :visible.sync="localVisible"
    title="绑定IP和客户:"
    @submit="submit"
    @cancle="cancel"
    @open="open"
    top="20vh"
    class="mp-developer-app-list-manage-page-bind-dialog-comp-wrap"
  >
    <el-form :model="ruleForm" ref="formRef" label-width="140px" class="list" size="small">
      <el-form-item label="绑定IP：" prop="BindIP" :rules="[
        { required: !!ruleForm.Customer.Mobile, message: 'IP不能为空' },
        {
          pattern: /^https*:\/\/(((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d)|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))(:\d{1,5})?$/,
          message: 'IP格式不正确',
        }
      ]">
        <el-input v-model.trim="ruleForm.BindIP" @change="onchange" maxlength="31" placeholder="请输入IP"></el-input>
      </el-form-item>
      <el-form-item label="绑定客户主账号：" prop="Customer.Mobile" :rules="[
        { required: !!ruleForm.BindIP, message: '主账号不能为空'},
        { pattern: /^1[3456789]\d{9}$/, message: '主账号格式不正确'}
      ]">
        <el-input v-model.trim="ruleForm.Customer.Mobile" @change="onchange" maxlength="11" placeholder="请输入客户主账号（手机号码）"></el-input>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { IApplication } from '../js/type';

const props = defineProps<{
  visible: boolean,
  row: IApplication | null
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

const ruleForm = ref({
  ID: '',
  BindIP: '',
  Customer: {
    Mobile: '',
  },
});

const formRef = ref();

const onchange = () => {
  formRef.value.validate();
};

const open = () => {
  if (formRef.value) formRef.value.resetFields();

  if (!props.row) return;

  ruleForm.value.ID = props.row.ID;
  ruleForm.value.BindIP = props.row.BindIP;
  ruleForm.value.Customer.Mobile = props.row.Customer?.Mobile || '';
};

const cancel = () => {
  localVisible.value = false;
};

const submit = () => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        emit('submit', ruleForm.value);
      }
    });
  }
};

</script>

<style lang='scss'>
.mp-developer-app-list-manage-page-bind-dialog-comp-wrap {
  .list {
    margin-right: 15px;
    .el-form-item__label {
      color: #444;
      font-weight: 700;
    }

    .el-input {
      input {
        font-size: 13px;
        padding: 0 10px;

        &::placeholder {
          font-size: 13px;
          color: #BEBEBE;
        }
      }
    }
  }
}
</style>
