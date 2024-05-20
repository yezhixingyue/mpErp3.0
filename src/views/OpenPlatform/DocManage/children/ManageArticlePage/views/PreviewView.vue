<template>
  <section>
    <!-- <iframe :title="article.helpdocuTitle" ref="iframe" style="width: 100%;height: 100%;">
    </iframe> -->
    <DocViewer :Content="article.helpdocuContent" />
  </section>
</template>

<script setup lang='ts'>
// import { onMounted, ref } from 'vue';
import DocViewer from '@/views/OpenPlatform/NoticeManage/components/DocViewer.vue';
import { IArticle } from '../../../js/types';

const props = defineProps<{
  article: IArticle
}>();

console.log('预览页面 article:', props.article);
// const iframe = ref<HTMLIFrameElement>();

// onMounted(() => {
//   if (iframe.value) {
//     iframe.value.contentWindow.document.write(props.article.helpdocuContent);
//   }
// });
</script>

<style scoped lang='scss'>
</style>
