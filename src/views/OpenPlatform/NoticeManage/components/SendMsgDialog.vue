<template>
  <CommonDialogComp
    width="650px"
    :visible.sync="localVisible"
    title="发送信息"
    cancelText="关闭"
    submitText="发送"
    @submit="submit"
    @cancle="cancel"
    @open="open"
    top="10vh"
    class="mp-developer-notice-list-manage-page-send-msg-dialog-comp-wrap"
  >
    <!-- 内容区域 -->
    <div class="content">
      <div class="item">
        <span class="title">接收对象：</span>
        <el-radio-group v-model="ruleForm.TargetType">
          <el-radio v-for="it in ruleForm._TargetTypeList" :key="it.ID" :label="it.ID">{{ it.Name }}</el-radio>
        </el-radio-group>
      </div>

      <div class="item" v-if="ruleForm.TargetType !== DeveloperNoticeTargetEnum.Developer" style="height: 32px;">
        <span class="title"></span>
        <el-checkbox v-model="ruleForm.IncludeNew">新注册账号也接收该消息</el-checkbox>
      </div>

      <div class="item account" v-else>
        <span class="title">指定账号：</span>
        <el-input v-model.trim="ruleForm._Mobile" size="small" placeholder="请输入手机号码" maxlength="11" show-word-limit style="width: 220px;flex: none;"
         @blur="() => ruleForm.inputBlur()" />
        <span class="ft-12 ml-20 dev-name" :title="ruleForm.DeveloperName">{{ ruleForm.DeveloperName || '' }}</span>
      </div>

      <div class="item">
        <span class="title">消息标题：</span>
        <el-input v-model.trim="ruleForm.Title" size="small" placeholder="请输入标题" maxlength="30" show-word-limit />
      </div>

      <div class="item" style="flex-direction: column;align-items: flex-start;">
        <span class="title mb-10">消息内容：</span>
        <div style="height: 320px; overflow: auto; width: 100%;">
          <SimpleTinyMCEditor v-if="visible" :modelValue.sync="ruleForm.Content" />
        </div>
      </div>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import SimpleTinyMCEditor from '@/components/common/TinyMCEditor/SimpleTinyMCEditor.vue';
import { SendMsgRuleForm } from '../js/SendMsgRuleForm';
import { DeveloperNoticeTargetEnum } from '../js/enum';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const props = defineProps<{
  visible: boolean,
}>();

const emit = defineEmits(['update:visible', 'submited']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const ruleForm = ref(new SendMsgRuleForm());
const open = () => {
  ruleForm.value = new SendMsgRuleForm();
};

const cancel = () => {
  localVisible.value = false;
};

const submit = async () => {
  const result = await ruleForm.value.submit();

  if (!result) return;

  const cb = () => {
    emit('submited', result);
    cancel();
  };

  MpMessage.dialogSuccess({
    title: '发送成功',
    onOk: cb,
    onCancel: cb,
  });
};

</script>

<style lang='scss'>
.mp-developer-notice-list-manage-page-send-msg-dialog-comp-wrap {
  .content {
    width: 555px;
    margin: 0 auto;

    .item {
      display: flex;
      align-items: center;
      margin-bottom: 18px;
      &:first-of-type {
        margin-bottom: 12px;
      }

      &.account {
        .dev-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      input::placeholder {
        font-size: 12px;
        color: #BEBEBE;
      }
    }
    .title {
      display: block;
      width: 5em;
      font-weight: 700;
      color: #444;
      flex: none;
      margin-right: 6px;
    }

    .el-checkbox {
      color: #444;

      .el-checkbox__label {
        font-size: 12px;
      }
    }

  }
}
</style>
