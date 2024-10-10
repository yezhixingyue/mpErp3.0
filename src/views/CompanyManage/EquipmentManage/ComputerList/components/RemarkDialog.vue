<template>
  <CommonDialogComp
    class="dialog" width="500px" top="15vh" title="设置编辑备注"
    :visible.sync="localVisible"
    @open="open" @submit="submit" @cancle="cancel">
    <el-form :model="ruleForm" ref="formRef" label-width="85px" style="margin-right: 10px;" size="mini" v-if="ruleForm" @submit.native.prevent>
      <el-form-item required label="备注：" prop="content" :rules="[{ required: true, message: '请输入备注内容'}]">
        <el-input type="textarea" :rows="10" v-model.trim="ruleForm.content"
         placeholder="请输入文字备注，记录本次更改内容，后续可在修改历史查询" maxlength="200" show-word-limit></el-input>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script lang="ts" setup>
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, ref } from 'vue';

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

const formRef = ref();
const ruleForm = ref({ content: '' });

const open = async () => {
  if (formRef.value) formRef.value.resetFields();

  ruleForm.value.content = '';
};

const cancel = () => {
  localVisible.value = false;
};

const submit = async () => {
  if (!ruleForm.value || !formRef.value) return;

  const bool = await formRef.value.validate().catch(() => false);

  if (bool) {
    emit('submit', ruleForm.value.content);
  }
};
</script>
<style lang='scss' scoped>
.dialog-content {
  display: flex;
  margin: 0 auto;

  > form {
    width: 348px;

    :deep(label.el-form-item__label) {
      font-size: 13px;
    }
  }
}
</style>
