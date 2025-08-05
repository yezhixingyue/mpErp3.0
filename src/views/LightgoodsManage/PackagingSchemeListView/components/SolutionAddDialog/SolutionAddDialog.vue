<template>
  <CommonDialogComp
    width="500px"
    :visible.sync="localVisible"
    :title="item ? '编辑打包方案' : '新增打包方案'"
    submitText="保存"
    cancelText="取消"
    @submit="submit"
    @cancle="localVisible = false"
    @open="open"
    @closed="closed"
    class="mp-lightgoods-manage-page-solution-save-dialog-comp-wrap"
  >
    <!-- 内容区域 -->
    <div class="content">
      <el-form :model="ruleForm" ref="oFormRef" label-width="110px" size="small" v-if="ruleForm">
        <el-form-item
          label="方案名称:"
          prop="Name"
          :rules="[
            { required: true, message: '请输入方案名称'},
            { validator: checkRepeat, trigger: 'blur'},
          ]"
        >
          <el-input v-model.trim="ruleForm.Name" autocomplete="off" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item
          label="优先级:"
          prop="Priority"
          :rules="[
            { required: true, message: '请输入优先级'},
            { type: 'number', message: '优先级必须为数字值'},
            { type: 'number', min: 0, message: '优先级不能为负'}
          ]"
        >
          <el-input v-model.number="ruleForm.Priority" autocomplete="off" maxlength="3"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, nextTick, ref } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { Message } from 'element-ui';
import { ILightgoodsProductSolution } from '../../../types/types';
import { RuleForm } from './ruleForm';

const props = defineProps<{
  visible: boolean
  item: ILightgoodsProductSolution | null
  list: ILightgoodsProductSolution[]
  submit:(data: Omit<RuleForm, 'Priority'> & { Priority: number }) => Promise<boolean>;
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

const ruleForm = ref(new RuleForm(null));

const open = async () => {
  ruleForm.value = new RuleForm(props.item);
  await nextTick();
  oFormRef.value?.clearValidate();
};

const closed = () => oFormRef.value?.resetFields();

const checkRepeat = (rule, value, callback) => {
  const t = props.list.find(it => it.ID !== ruleForm.value.ID && it.Name === ruleForm.value.Name);
  if (t) {
    return callback(new Error('名称不能重复'));
  }

  return callback();
};

const oFormRef = ref();
const submit = () => {
  oFormRef.value.validate(async (valid) => {
    if (valid) {
      const bool = await props.submit(ruleForm.value as Omit<RuleForm, 'Priority'> & { Priority: number });
      if (bool) {
        Message.success(props.item ? '编辑成功' : '添加成功');
        localVisible.value = false;
      }
    }
  });
};

</script>

<style scoped lang='scss'>
.mp-lightgoods-manage-page-solution-save-dialog-comp-wrap {
  .content {
    padding: 0 20px;
    margin-top: -10px;
    margin-bottom: -15px;
    height: 120px;
    padding-right: 40px;

    :deep(input.el-input__inner) {
      padding-right: 50px !important;
    }
  }
}
</style>
