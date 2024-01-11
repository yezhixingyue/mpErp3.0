<template>
  <div
    class="mp-file-uploader-wrap"
    :class="{disabled: disabled, empty: fileList.length === 0, dropover: dropover }"
    :style="`width:${styles.width};height:${styles.height};`"
    @drop.prevent="ondrop"
    @dragover.prevent="() => { if (!props.disabled) dropover = true }"
    @dragleave.prevent="dropover = false"
    >
    <input type="file" :accept="accept" :multiple="multiple" ref="oInput" @change="onInputChange">

    <div class="empty" @click="onClick" v-if="fileList.length === 0">
      <img src="./cloud.png" alt="">
      <p class="blue mt-13">
        <template v-if="title">{{ title }}</template>
        <template v-else>{{ multiple ? '多文件，' : '' }}点击此处添加文件或将文件拖到此处可上传</template>
      </p>
    </div>

    <div class="list-content" v-else>
      <div class="box mp-scroll-wrap">
        <slot></slot>
      </div>
      <div class="clear" @click="onClick">
        <span>
          <img src="./refresh.png" alt="">
        </span>
        <span>重新上传文件</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Message } from 'element-ui';
import { computed, ref } from 'vue';

const props = defineProps<{
  accept?: string // 格式：'.jpg,.cdr,.pdf,.ai,.zip,.rar,.7z'
  multiple?: boolean
  width?: number | string
  height?: number | string
  disabled?: boolean
  title?: string
  fileList: File[]
}>();

const emit = defineEmits(['update:fileList', 'change']);

const styles = computed(() => {
  let { width } = props;
  let { height } = props;

  if (typeof width === 'number') width = `${width}px`;
  if (typeof height === 'number') height = `${height}px`;

  return { width, height };
});

const oInput = ref<HTMLInputElement>();

const onClick = () => {
  if (!oInput.value || props.disabled) return;
  oInput.value.click();
};

const handleFileChange = (files: FileList) => { // 不能为空，清空文件使用另外一种方法clear --- 方法内部会根据格式筛选文件
  if (files.length === 0 || props.disabled) return;

  const fileList = (props.accept && props.accept !== '*') ? [...files].filter(file => {
    const { type, name } = file;

    const extname = name.indexOf('.') > -1 ? `.${name.split('.').pop()}` : ''; // 后缀名， 如：.jpeg
    const baseType = type.replace(/\/.*$/, ''); // 文件数据类型，如：application/pdf  application/x-zip-compressed 可能为''

    return props.accept.split(',')
      .map(it => it.trim())
      .filter(it => it)
      .some(acceptedType => {
        if (/\.[\w\W]+$/.test(acceptedType)) {
          return extname === acceptedType;
        }
        if (/\/\*$/.test(acceptedType)) {
          return baseType === acceptedType.replace(/\/\*$/, '');
        }
        // eslint-disable-next-line no-useless-escape
        if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
          return type === acceptedType;
        }
        return false;
      });
  }) : [...files];

  if (fileList.length < files.length) {
    Message.error('已清除掉部分不符合格式的文件');
  }

  emit('update:fileList', fileList);
  emit('change', fileList);
};

const onInputChange = () => { // DragEvent  InputEvent
  if (props.disabled || !oInput.value) return;

  handleFileChange(oInput.value.files);
  oInput.value.value = '';
};

const dropover = ref(false);

const ondrop = (e: DragEvent) => {
  dropover.value = false;

  if (props.disabled) return;

  handleFileChange(e.dataTransfer.files);
};

</script>

<style scoped lang='scss'>
.mp-file-uploader-wrap {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  border: 2px dashed rgba($color: #26bcf9, $alpha: 0.2);
  border-radius: 4px;
  transition: 0.12s ease-in-out;
  transition-property: border-color;
  cursor: pointer;

  .blue {
    color: #26bcf9;
  }

  > input {
    display: none;
  }

  > .empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    img {
      width: 97px;
      height: 61px;
    }
  }

  > .list-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 8px 2px;
    padding-bottom: 0;
    box-sizing: border-box;
    overflow: hidden;

    > .box {
      flex: 1;
      cursor: default;
      width: 100%;
      overflow: auto;
      padding: 2px 8px;
      box-sizing: border-box;
    }

    > .clear {
      color: #26bcf9;
      font-size: 12px;
      display: flex;
      align-items: center;
      padding: 8px;
      width: 100%;
      justify-content: center;
      transition: background-color 0.2s ease-in-out;
      border-radius: 4px;

      img {
        margin-right: 10px;
      }
      &:hover {
        background-color: lighten($color: #26bcf9, $amount: 36);
      }
      &:active {
        background-color: lighten($color: #26bcf9, $amount: 30);
      }
    }
  }

  &.empty:hover {
    border-color: rgba($color: #26bcf9, $alpha: 0.7);
  }
  &.empty:active, &:not(.empty), &.dropover {
    border-color: rgba($color: #26bcf9, $alpha: 1);
  }

  &.dropover {
    border-width: 3px;
  }

  &.disabled {
    border-width: 2px;
    // border-color: #eee !important;
    cursor: not-allowed;
    user-select: none;
    // pointer-events: none;
    // * {
    //   color: #cbcbcb !important;
    // }
    // img {
    //   filter: grayscale(1);
    //   opacity: 0.4;
    // }

    .list-content > .clear {
      pointer-events: none;
    }
  }
}
</style>
