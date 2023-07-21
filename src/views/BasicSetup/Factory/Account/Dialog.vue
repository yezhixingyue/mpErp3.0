<template>
  <CommonDialogComp
    width="500px"
    :title="`${localPageData.curEditInfo.item ? '编辑' : '添加'}工厂账号`"
    :visible.sync="localVisible"
    class="dialog"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    top="18vh"
  >
    <el-form :model="ruleForm" ref="oValidateForm" label-width="120px" class="content" v-if="ruleForm" size="small">
      <el-form-item
        label="名称："
        prop="Name"
        :rules="[
          { required: true, message: '名称不能为空'},
        ]"
      >
        <el-input v-model.trim="ruleForm.Name" autocomplete="off" maxlength="20" placeholder="请输入账号名称"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号码："
        prop="Mobile"
        :rules="[
          { required: true, message: '手机号码不能为空'},
          { pattern: /^1[3|5|6|7|8|9]\d{9}$/, message: '手机号码格式不正确' },
        ]"
      >
        <el-input v-model.trim="ruleForm.Mobile" autocomplete="off" maxlength="11" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item
        label="密码："
        prop="Password"
        :rules="[
          { required: !ruleForm.ID, message: '密码不能为空' },
          { min: 6, max: 16, message: '密码长度应在6 - 16位之间' },
          { pattern: /^\w{6,16}$/, message: '密码只能由数字或字母组成' },
        ]"
      >
        <el-input v-model.trim="ruleForm.Password" autocomplete="off" maxlength="16" :placeholder="ruleForm.ID ? '不修改密码请留空' : '请输入密码'"></el-input>
      </el-form-item>
      <el-form-item label="是否启用：" prop="Status">
        <el-switch v-model="ruleForm.Status" active-color="#26bcf9" inactive-color="#eee"
          :active-value="FactoryAccountStatusEnum.enable" :inactive-value="FactoryAccountStatusEnum.disable" active-text="是" inactive-text="否">
        </el-switch>
      </el-form-item>
    </el-form>
  </CommonDialogComp>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Form } from 'element-ui';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { AccountItemRuleForm } from './AccountItemRuleForm';
import { FactoryAccountStatusEnum } from './enum';
import { FactoryAccountListClass } from './FactoryAccountListClass';

const props = defineProps<{
  visible: boolean
  localPageData: FactoryAccountListClass
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const ruleForm = ref<AccountItemRuleForm | null>(null);
const oValidateForm = ref<null | InstanceType<typeof Form>>();

const onOpen = () => {
  ruleForm.value = new AccountItemRuleForm(props.localPageData.curEditInfo.item || props.localPageData.FactoryID);
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  if (oValidateForm.value) oValidateForm.value.clearValidate();
  ruleForm.value = null;
};

const submit = async () => {
  if (!oValidateForm.value || !ruleForm.value) return;

  const bool = await oValidateForm.value.validate().catch(() => false);
  if (!bool) return;

  props.localPageData.submitItem(ruleForm.value);
};

</script>
<style lang='scss' scoped>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    padding-top: 30px;
    padding-left: 30px;
    padding-right: 80px;
    min-height: 205px;
    // ul.content {
    //   > li {
    //     // height: 40px;
    //   }
    // }
    .el-form-item__label {
      font-size: 13px;
    }
    input {
      font-size: 13px;
    }
  }
}
</style>
