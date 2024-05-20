<template>
  <CommonDialogComp
    width="500px"
    :visible.sync="localVisible"
    :title="editData.item ? '编辑分类' : '添加分类'"
    submitText="保存"
    cancelText="关闭"
    @submit="submit"
    @cancle="cancel"
    @open="open"
    class="mp-doc-manage-page-class-save-dialog-comp-wrap"
  >
    <!-- 内容区域 -->
    <div class="content">
      <el-form :model="ruleForm" ref="oFormRef" label-width="90px" size="small" @submit.native.prevent>
        <el-form-item
          label="名称"
          prop="Name"
          :rules="[
            { required: true, message: '请输入分类名称'},
            { validator: checkRepeat, }
          ]"
        >
          <el-input v-model.trim="ruleForm.Name" autocomplete="off" maxlength="20" show-word-limit></el-input>
        </el-form-item>
      </el-form>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { IClassEditData } from '../type';
import { ClassSaveRuleForm } from './ruleForm';

const props = defineProps<{
  visible: boolean,
  editData: IClassEditData
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

const cancel = () => {
  localVisible.value = false;
};

const ruleForm = ref(new ClassSaveRuleForm(props.editData));
const oFormRef = ref();

const checkRepeat = (rule, value, callback) => {
  if (ruleForm.value._sameLevelNames.includes(value)) {
    callback(new Error('名称不能重复'));
  } else {
    callback();
  }
};

const open = () => {
  oFormRef.value?.resetFields();
  ruleForm.value = new ClassSaveRuleForm(props.editData);
};

const submit = () => {
  oFormRef.value?.validate(async (valid) => {
    if (valid) {
      ruleForm.value.submit();
    }
  });
};

</script>

<style scoped lang='scss'>
.mp-doc-manage-page-class-save-dialog-comp-wrap {
  .content {
    display: block;
    padding-right: 36px;
  }
}
</style>
