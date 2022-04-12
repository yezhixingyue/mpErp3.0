<template>
  <div id="app">
    <LeftMenu v-if="key" ref="oLeft" />
    <section>
      <HeaderTabs v-if="key" @downtime='handlePathChange' />
      <main class="page-wrap">
        <router-view />
      </main>
    </section>
    <div class="mp-general-loading-wrap"></div>
  </div>
</template>
<script>
import LeftMenu from './components/common/Layout/LeftMenu.vue';
import HeaderTabs from './components/common/Layout/HeaderTabs.vue';

export default {
  components: {
    LeftMenu,
    HeaderTabs,
  },
  computed: {
    key() {
      return this.$route.name !== 'login';
    },
    curRouter() {
      return this.$route.fullPath;
    },
  },
  methods: {
    handlePathChange(pathName) {
      if (this.$refs.oLeft && typeof this.$refs.oLeft.handlePathChange === 'function') {
        this.$refs.oLeft.handlePathChange(pathName);
      }
    },
  },
  watch: {
    curRouter() {
      setTimeout(() => {
        const oPoppers = document.querySelectorAll('.el-tooltip__popper');
        if (oPoppers.length === 0) return;
        oPoppers.forEach(oEl => {
          const _oEl = oEl;
          _oEl.style.display = 'none';
        });
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
  #app{
    display: flex;
    background-color: #f5f5f5;
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
