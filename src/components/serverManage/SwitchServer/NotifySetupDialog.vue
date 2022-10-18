<template>
  <CommonDialogComp
    width="620px"
    title="转换失败通知设置"
    :visible.sync="localVisible"
    @open="onOpen"
    @submit="submitForm"
    @cancle="cancel"
    @closed="closed"
    class="dialog"
    top="15vh"
  >
    <el-form :model="ruleForm" :rules="rules" hide-required-asterisk ref="oForm" label-width="120px" class="ruleForm-box" v-if="ruleForm" size="mini">
      <el-form-item prop="Name" label="转换器名称：" class="n">
        <h4>{{ruleForm.Name}}</h4>
      </el-form-item>
      <el-form-item prop="NotifyType" label="通知方式：">
        <el-radio-group v-model="ruleForm.NotifyType">
          <el-radio :label="NotifyTypeEnum.message">短信通知</el-radio>
          <el-radio :label="NotifyTypeEnum.WeChat">微信通知</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="Mobile" label="接收手机号码：">
        <el-input type="textarea" :rows="5" placeholder="请输入手机号码" maxlength="100" show-word-limit v-model="ruleForm.Mobile"></el-input>
      </el-form-item>
    </el-form>
    <p class="tip-box warning ft-12">
      <i class="el-icon-warning ft-14"></i>
      <span>注: 多个手机号使用全角或半角逗号隔开</span>
    </p>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { NotifyTypeEnum, SwitchListItemClass } from '@/views/serverManage/utils/SwitchListItemClass';
import { SwitchPageDataClassType } from '@/views/serverManage/utils/SwitchPageDataClassType';
import { Form } from 'element-ui';
import { CommonDialogComp } from 'mpzj-sell-lib';
import { computed, ref } from 'vue';

const props = defineProps<{
  pageTypeData: SwitchPageDataClassType
}>();

const localVisible = computed({
  get() {
    return props.pageTypeData.notifyVisible;
  },
  set(val) {
    props.pageTypeData.setNotifyVisible(val);
  },
});

const oForm = ref<InstanceType<typeof Form>>();

const ruleForm = ref<null | SwitchListItemClass>(null);

const validateMobile = (rule: unknown, value: string, callback: (arg0?: Error) => void) => {
  if (!/^1[3456789]\d{9}((,|，)1[3456789]\d{9})*$/.test(value)) {
    callback(new Error('格式不正确，格式为[ 手机号码 + 逗号 + 手机号码 ]，且手机号码格式需正确'));
    return;
  }
  const arr = value.split(/,|，/);
  const len1 = arr.length;
  const len2 = [...new Set(arr)].length;
  if (len1 > len2) {
    callback(new Error('存在重复手机号码'));
    return;
  }
  callback();
};

const rules = {
  Mobile: [
    { required: true, message: '请输入手机号码', trigger: 'change' },
    { validator: validateMobile, trigger: 'change' },
  ],
};

const onOpen = async () => {
  ruleForm.value = new SwitchListItemClass(props.pageTypeData.curEditItem || undefined);
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
      const result = await ruleForm.value.setNotify();
      if (result) {
        props.pageTypeData.handleItemChange({ ...ruleForm.value });
      }
    }
  });
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    padding: 30px 50px;
    padding-right: 40px;
    .tip-box {
      margin-top: 25px;
      margin-bottom: 10px;
      margin-left: 120px;
      width: 360px;
      text-align: center;
      i {
        margin-right: 8px;
        vertical-align: -1px;
      }
    }
    .ruleForm-box {
      .el-form-item__label {
        font-size: 12px;
        color: #888E99;
      }
      .n {
        margin-bottom: 12px;
      }
      .el-textarea {
        width: 360px;
      }
    }
  }
}
</style>
