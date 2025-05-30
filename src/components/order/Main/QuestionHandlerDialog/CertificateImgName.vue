<template>
  <div class="certificate-name" v-if="Name || CertificateItem">
    <el-image v-if="CertificateItem" :src="imgsrc" :preview-src-list="CertificateItem.CertificatePics" class="img-box" ref="oImgBox" />
    <span class="name" :class="{ gray: !!Name, 'is-bold': !Name, valid: isValid }" :title="isValid ? title : ''" @click="onclick">{{ title }}</span>
  </div>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { ICertificate } from './type';

const imgsrc = require('@/assets/images/img-preview.png');

const props = defineProps<{
  Name?: string
  CertificateItem?: ICertificate
}>();

const title = computed(() => props.Name || props.CertificateItem?.CertificateName || '');

const isValid = computed(() => !!props.CertificateItem);

const oImgBox = ref();

const onclick = () => {
  if (!isValid.value || !oImgBox.value?.$el) return;

  const img = oImgBox.value.$el.querySelector('img');
  if (img) {
    img.click();
  }
};
</script>

<style scoped lang='scss'>
.certificate-name {
  display: inline-flex;
  vertical-align: top;
  line-height: 15px;
  margin-right: 10px;
  align-items: center;

  .img-box {
    line-height: 15px;
    margin-right: 6px;
    flex: none;
  }

  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;

    &.valid {
      cursor: pointer;
    }
  }
}
</style>
