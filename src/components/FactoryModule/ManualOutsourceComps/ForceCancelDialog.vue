<template>
  <CommonDialogComp
    width="460px"
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
          label="撤回原因："
          prop="Remark"
          :rules="[
            { required: true, message: '请输入撤回原因'},
          ]"
        >
          <el-input type="textarea" :rows="8" placeholder="请输入终结原因" maxlength="100" show-word-limit v-model.trim="ruleForm.Remark"></el-input>
        </el-form-item>
      </el-form>

      <p class="tips-box"> <i class="el-icon-warning"></i> 注：请和工厂沟通是否已生产，填写撤回原因并做好记录</p>
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
    min-height: 130px;
    padding: 25px 15px 5px;
    > div {
      height: 100%;
      padding: 0 25px;

      .el-form-item__content {
        display: inline-block;
        width: 260px;

        textarea {
          line-height: 20px;
          font-size: 12px;
          min-height: 160px;
        }
      }

      .tips-box {
        width: 360px;
        margin-left: 20px;
        margin-top: 5px;
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 10px;
    padding-top: 0;
  }
}
</style>
