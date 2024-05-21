<template>
  <CommonDialogComp
    width="500px"
    :visible.sync="localVisible"
    title="复核确认"
    submitText="通过"
    cancelText="关闭"
    @submit="submit"
    @cancle="cancel"
    @open="open"
    top="32vh"
    class="mp-developer-list-manage-page-check-dialog-comp-resolve-wrap"
  >
    <!-- 内容区域 -->
    <div class="content">
      <h4>请在输入框中输入‘通过’两字：</h4>
      <el-input v-model.trim="text" maxlength="10" size="small"></el-input>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { Message } from 'element-ui';

const props = defineProps<{
  visible: boolean,
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

const text = ref('');
const open = () => {
  text.value = '';
};

const cancel = () => {
  localVisible.value = false;
};

const submit = () => {
  if (text.value !== '通过') {
    Message({ showClose: true, message: '输入内容不正确', type: 'error' });
    return;
  }
  emit('submit');
  cancel();
};

</script>

<style scoped lang='scss'>
.mp-developer-list-manage-page-check-dialog-comp-resolve-wrap {
  .content {
    width: 300px;
    margin: 0 auto;

    h4 {
      font-weight: 700;
      color: #444;
      margin-bottom: 10px;
    }
  }
}
</style>
