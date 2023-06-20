<template>
  <CommonDialogComp
    width="420px"
    :title="`折手设置`"
    :visible.sync="localVisible"
    :disabled="NeedFolding === radio"
    @open="onOpen"
    @submit="submit"
    @cancle="localVisible = false"
    class="dialog"
    top="20vh"
  >
    <div class="content">
      <span>折手：</span>
      <el-radio-group v-model="radio">
        <el-radio :label="true" class="mr-60">需要</el-radio>
        <el-radio :label="false">不需要</el-radio>
      </el-radio-group>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
// import { MpMessage } from '@/assets/js/utils/MpMessage';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, ref } from 'vue';

const props = defineProps<{
  visible: boolean
  NeedFolding: boolean
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    if (val === props.visible) return;
    emit('update:visible', val);
  },
});

const radio = ref(false);

const onOpen = () => {
  radio.value = props.NeedFolding;
};

const submit = () => {
  emit('submit', radio.value);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    padding: 30px 10px;
    margin-right: 3px;
    padding-top: 20px;
    .content {
      height: 30px;
      overflow: auto;
      overflow: overlay;
      @include scroll;
      padding-left: 60px;
      padding-top: 5px;
      box-sizing: border-box;
    }
  }
}
</style>
