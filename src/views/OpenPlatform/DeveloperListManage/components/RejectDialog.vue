<template>
  <CommonDialogComp
    width="500px"
    :visible.sync="localVisible"
    :showSubmit="false"
    showDanger
    title="不通过原因"
    cancelText="关闭"
    dangerText="不通过"
    @danger="submit"
    @cancle="cancel"
    @open="open"
    top="25vh"
    class="mp-developer-list-manage-page-check-dialog-comp-resolve-wrap"
  >
    <!-- 内容区域 -->
    <div class="content">
      <h4>不通过原因：</h4>
      <el-input v-model="Remark" :rows="10" type="textarea" maxlength="300" size="small" show-word-limit></el-input>
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

const Remark = ref('');
const open = () => {
  Remark.value = '';
};

const cancel = () => {
  localVisible.value = false;
};

const submit = () => {
  if (!Remark.value) {
    Message({ showClose: true, message: '请输入不通过原因', type: 'error' });
    return;
  }
  emit('submit', Remark.value);
  cancel();
};

</script>

<style scoped lang='scss'>
.mp-developer-list-manage-page-check-dialog-comp-resolve-wrap {
  .content {
    width: 410px;
    margin: 0 auto;

    h4 {
      font-weight: 700;
      color: #444;
      margin-bottom: 10px;
    }
  }
}
</style>
