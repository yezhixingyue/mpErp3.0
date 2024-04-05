<template>
  <div class="search-box">
    <el-input v-model.trim="content" ref="oInp" :disabled="disabled" :class="{blue: isBlue}"
     :placeholder="placeholder || '请输入分类关键字'" maxlength="20" @keyup.enter.native="onSearchClick" clearable @clear='onSearchClick'>
      <template #append>
        <el-button class="blue-button" @click="onSearchClick" :disabled="disabled">
          <i class="el-icon-search"></i>
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const props = defineProps<{
  value: string
  placeholder?: string
  isBlue?: boolean
  disabled?: boolean
}>();

const emit = defineEmits(['change']);

const content = ref(props.value);

const onSearchClick = () => { // 点击搜索事件
  emit('change', content.value || '');
};

const oInp = ref();

// watch(() => props.value, (val) => {
//   if (val !== content.value) content.value = val;
// });

const focus = () => {
  if (oInp.value) {
    oInp.value.focus();
  }
};

const clear = () => {
  content.value = '';
};

defineExpose({
  focus,
  clear,
});

</script>

<style scoped lang='scss'>
.search-box {
  :deep(.el-input) {
    height: 36px;
    line-height: 36px;
    input {
      height: 36px;
      border-color: #d5d5d5;
      color: #585858;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      &::placeholder {
        color: #cbcbcb;
      }
    }

    .el-input-group__append {
      background-color: #26bcf9;
      border: none;
    }
  }
  .blue-button {
    height: 36px;
    width: 80px;
    margin-left: -21px;
    border: none;
    background-color: #26bcf9;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 20px;
    }

    &:hover {
      background-color: #009EF9;
    }
    &:active {
      background-color: #35dff9;
    }
  }
}

</style>
