<template>
  <div class="wrap">
    <span class="label">{{ label }}：</span>
    <div class="box">
      <el-input ref="oInp" placeholder="请输入" v-model="localValue" maxlength="8" size="small"></el-input>

      <transition name="el-fade-in-linear">
        <p class="is-pink tip" ref="oTip" v-show="isActive">{{ tip }}</p>
      </transition>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  value: string
  label: string
  tip: string
  regex?: RegExp
}>();

const emit = defineEmits(['update:value']);

const localValue = computed({
  get() {
    return props.value;
  },
  set(val) {
    emit('update:value', val);
  },
});

const isActive = ref(false);

const oTip = ref<HTMLElement>();
const oInp = ref();

const onbodymousechange = (e: MouseEvent) => {
  const bool = e.target === oTip.value || e.target === oInp.value.$el.querySelector('input');

  if (bool) {
    isActive.value = bool;
    return;
  }

  if (props.regex && localValue.value && !props.regex.test(localValue.value)) {
    return;
  }

  isActive.value = bool;
};

onMounted(() => {
  document.body.addEventListener('mousedown', onbodymousechange);
  document.body.addEventListener('mouseup', onbodymousechange);
});

onUnmounted(() => {
  document.body.removeEventListener('mousedown', onbodymousechange);
  document.body.removeEventListener('mouseup', onbodymousechange);
});

onActivated(() => {
  document.body.addEventListener('mousedown', onbodymousechange);
  document.body.addEventListener('mouseup', onbodymousechange);
});

onDeactivated(() => {
  document.body.removeEventListener('mousedown', onbodymousechange);
  document.body.removeEventListener('mouseup', onbodymousechange);
});

</script>

<style scoped lang='scss'>
.wrap {
  display: flex;
  height: 56px;

  .label {
    width: 150px;
    line-height: 30px;
    text-align: right;
    padding-right: 15px;
    font-size: 12px;
  }

  .box {
    :deep(.el-input) {
      width: 100px;
      .el-input__inner {
        height: 30px;
        line-height: 30px;
        font-size: 12px;

        &::placeholder {
          color: #AEAEAE;
        }
      }
    }

    .tip {
      font-size: 12px;
      line-height: 16px;
      margin-top: 1px;
    }
  }
}
</style>
