<template>
  <div id="app">
    <LeftMenu v-if="router.currentRoute.name !== 'login'" ref="oLeft" />
    <section>
      <HeaderTabs v-if="router.currentRoute.name !== 'login'" @downtime='handlePathChange' />
      <main class="page-wrap">
        <router-view />
      </main>
    </section>
  </div>
</template>
<script setup lang="ts">
import {
  onMounted, ref, watch,
} from 'vue';
import LeftMenu from './components/Layout/LeftMenu.vue';
import HeaderTabs from './components/Layout/HeaderTabs.vue';
import router from './router';

const oLeft = ref<InstanceType<typeof LeftMenu>>();

const handlePathChange = (pathName: string) => {
  if (oLeft.value) {
    oLeft.value.handlePathChange(pathName);
  }
};

watch(() => router.currentRoute.fullPath, () => {
  console.log('router.currentRoute.fullPath change');
  setTimeout(() => {
    const oPoppers = document.querySelectorAll('.el-tooltip__popper');
    if (oPoppers.length === 0) return;
    [...oPoppers].forEach(oEl => {
      const _oEl = oEl as HTMLElement;
      _oEl.style.display = 'none';
    });
  }, 500);
});

onMounted(() => {
  // 简单判断是否使用Chrome相同内核或Firefox浏览器
  const bool = navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Firefox');
  if (!bool) {
    const url = process.env.NODE_ENV === 'development' ? '/browser' : '/Web/browser';
    window.location.replace(url);
  }
});
</script>

<style lang="scss" scoped>
  #app{
    display: flex;
    background-color: #f5f5f5;
    height: 100vh;
    > .leftmenu {
      flex: none;
      width: 180px;
    }
    > section {
      flex: 1;
      width: calc(100vw - 180px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: #fff;
      > header {
        padding: 0;
        // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
        // background-color: #eee;
        flex: none;
        width: 100%;
      }
      > main {
        overflow: auto;
        overflow: overlay;
        width: 100%;
        flex: 1;
        // margin-left: 5px;
        // padding-right: 15px;
      }
    }
  }
</style>
