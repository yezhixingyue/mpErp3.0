<template>
  <section class="open-platform-doc-manage-wrap">
    <iframe id="open-doc-manage" title="open-doc-manage" :src="iframeUrl" width="100%" height="100%" frameborder="0" @click="onclick"></iframe>
  </section>
</template>

<script setup lang='ts'>
import { WikiHandler } from '@/assets/js/TypeClass/WikiHandler';
import TokenClass from '@/assets/js/utils/tokenManage';
import { onMounted, ref } from 'vue';

const iframeUrl = ref('');

const onclick = () => {
  console.log('onclick iframe');
};

onMounted(() => {
  const token = TokenClass.getToken();

  if (token) {
    const siteType = 5;
    const target = 'manage';

    const _url = WikiHandler.getJumpUrl({ token, siteType, target });

    iframeUrl.value = _url;
  }
});

</script>

<script lang='ts'>
export default {
  name: 'DocManagePage',
};
</script>

<style scoped lang='scss'>
.open-platform-doc-manage-wrap {
  height: 99%;
  width: 100%;
  box-sizing: border-box;
  padding-left: 8px;
  background-color: #eee;
}
</style>
