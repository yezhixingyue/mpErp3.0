<template>
  <transition name="fade-transform" mode="out-in" @before-leave="beforeLeave" @after-enter="afterEnter">
    <keep-alive :include='[...curTabPagesNameList]'>
      <router-view :key="router.currentRoute.path" v-if="showCommonView" />
    </keep-alive>
  </transition>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/store/modules/layout';
import router from '@/router';
import { ref } from 'vue';

const layoutStore = useLayoutStore();

const { showCommonView, curTabPagesNameList } = storeToRefs(layoutStore);

const oPageContent = ref<null | HTMLElement>(null);

const getContentDom = () => {
  if (!oPageContent.value) {
    const dom = document.querySelector('#app > section > main.page-wrap') as HTMLElement;
    if (!dom) return null;
    oPageContent.value = dom;
  }
  return oPageContent.value;
};

const beforeLeave = () => {
  const dom = getContentDom();
  if (!dom) return;
  dom.style.overflow = 'hidden';
};

const afterEnter = () => {
  const dom = getContentDom();
  if (!dom) return;
  dom.style.overflow = 'auto';
  dom.style.overflow = 'overlay';
};

</script>

<style lang='scss'>
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.23s ease-in-out;
  overflow: hidden;
  user-select: none;
  width: 100%;
  box-sizing: border-box;
  max-width: none;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
