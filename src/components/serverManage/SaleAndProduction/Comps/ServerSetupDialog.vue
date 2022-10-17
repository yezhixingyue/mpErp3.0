<template>
  <CommonDialogComp
    width="700px"
    :title="title"
    :visible.sync="localVisible"
    @open="onOpen"
    @submit="submitForm"
    @cancle="cancel"
    @closed="closed"
    class="dialog"
    top="20vh"
  >
    <el-form :model="ruleForm" :rules="rules" hide-required-asterisk ref="oForm" label-width="140px" class="adapter-ruleForm" v-if="ruleForm" size="small">
      <el-form-item :label="`${props.pageTypeData.options.title}名称：`" prop="Name">
        <el-input v-model.trim="ruleForm.Name" autocomplete="off" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="服务器地址：" prop="Url">
        <el-input v-model.trim="ruleForm.Url" autocomplete="off" maxlength="255"></el-input>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { SaleAndProductionListItemClass } from '@/views/serverManage/utils/SaleAndProductionListItemClass';
import { SaleAndProductionPageClassType } from '@/views/serverManage/utils/SaleAndProductionPageClassType';
import { Form } from 'element-ui';
import { CommonDialogComp } from 'mpzj-sell-lib';
import { computed, ref } from 'vue';

const props = defineProps<{
  pageTypeData: SaleAndProductionPageClassType
}>();

const title = computed(() => {
  const o = props.pageTypeData.curEditItem ? '编辑' : '添加';
  return `${o}${props.pageTypeData.options.title}`;
});

const localVisible = computed({
  get() {
    return props.pageTypeData.visible;
  },
  set(val) {
    props.pageTypeData.setVisible(val);
  },
});

const ruleForm = ref<null | SaleAndProductionListItemClass>(null);

const validateNameRepeat = (rule: unknown, value: string, callback: (arg0?: Error) => void) => {
  const t = props.pageTypeData.list.find(it => ruleForm.value && it.ID !== ruleForm.value.ID && it.Name === value);
  if (t) {
    callback(new Error(`${props.pageTypeData.options.title}名称重复，请检查`));
  } else {
    callback();
  }
};

const rules = {
  Name: [
    { required: true, message: `请输入${props.pageTypeData.options.title}名称`, trigger: 'change' },
    { validator: validateNameRepeat, trigger: 'change' },
  ],
  Url: [
    { required: true, message: '请输入服务器地址', trigger: 'change' },
    { pattern: /^(http(s)?:\/\/)/, message: '请以http://或https://开头，输入正确的服务器地址', trigger: 'change' },
  ],
};

const onOpen = () => {
  ruleForm.value = new SaleAndProductionListItemClass(props.pageTypeData.curEditItem || props.pageTypeData.options.type);
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  ruleForm.value = null;
};

const oForm = ref<InstanceType<typeof Form>>();

const submitForm = () => {
  if (!oForm.value) return;
  oForm.value.validate(async (valid) => {
    if (valid && ruleForm.value) {
      const result = await ruleForm.value.save();
      if (result) {
        props.pageTypeData.handleItemChange({ ...ruleForm.value });
      }
    }
  });
};

</script>

<style scoped lang='scss'>
.dialog {
  :deep(.el-dialog__body) {
    height: 140px;
    padding: 35px 55px;
  }
}
</style>
