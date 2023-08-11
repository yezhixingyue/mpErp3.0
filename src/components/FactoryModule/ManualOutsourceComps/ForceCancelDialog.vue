<template>
  <CommonDialogComp
    width="560px"
    title="强制撤回"
    :visible.sync="localVisible"
    class="mp-erp-out-source-force-cancel-dialog-comp-wrap"
    @open="onOpen"
    @cancle="localVisible = false"
    @submit="submit"
    top="15vh"
  >
    <div>
      <el-form :model="ruleForm" ref="formRef">
        <el-form-item
          label=""
          prop="Remark"
          :rules="[
            { required: true, message: '请输入强制撤回原因'},
          ]"
        >
          <el-input type="textarea" :rows="5" placeholder="请输入强制撤回原因" maxlength="30" show-word-limit v-model.trim="ruleForm.Remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </CommonDialogComp>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import CommonDialogComp from '../../../packages/CommonDialogComp';

const props = defineProps<{
  visible: boolean
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
  Remark: '',
});
const formRef = ref();

const onOpen = () => {
  ruleForm.value.Remark = '';
  if (formRef.value) formRef.value.resetFields();
};

const submit = () => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        emit('submit', ruleForm.value.Remark);
      }
    });
  }
};

</script>
<style lang='scss'>
.mp-erp-out-source-force-cancel-dialog-comp-wrap {
  .el-dialog__header {
    height: 20px !important;
    line-height: 20px !important;
  }
  .el-dialog__body {
    height: 130px;
    padding: 25px 15px;
    > div {
      height: 100%;
      padding: 0 25px;
    }
  }
  .el-dialog__footer {
    padding-bottom: 25px;
  }
}
</style>
