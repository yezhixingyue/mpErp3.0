<template>
  <CommonDialogComp
    width="410px"
    :visible.sync="localVisible"
    @submit="submit"
    @cancle="cancel"
    class="dialog"
    top="27vh"
  >
    <div class="header">
      <img src="@/assets/images/icon-warn-large.png" alt="">
      <div>
        <p>确认要重新生成密钥吗？</p>
        <p>重新生成会影响数据对接</p>
      </div>
    </div>
    <div class="content">
      <p>仅在密钥泄露的情况下才需要重新生成密钥</p>
      <p>重新生成后，请更改对应服务器的密钥</p>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed } from 'vue';

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

const cancel = () => {
  localVisible.value = false;
};

const submit = () => {
  emit('submit');
};

</script>

<style scoped lang='scss'>
.dialog {
  :deep(.el-dialog__header) {
    display: none;
  }
  :deep(.el-dialog__body) {
    height: 140px;
    box-sizing: border-box;
    padding: 35px 55px;
    padding-left: 88px;
    .header {
      display: flex;
      font-weight: 700;
      color: #444;
      font-size: 17px;
      font-family: Microsoft YaHei UI-Bold, Microsoft YaHei UI;
      align-items: center;
      line-height: 18px;
      img {
        margin-right: 17px;
        flex: none;
        width: 41px;
        height: 41px;
      }
    }
    .content {
      font-size: 12px;
      margin-top: 13px;
      line-height: 18px;
      color: #444;
      font-family: Microsoft YaHei UI-Regular, Microsoft YaHei UI;
    }
  }
}
</style>
