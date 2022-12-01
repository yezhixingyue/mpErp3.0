<template>
  <transition name="fade-transform" mode="out-in" @before-leave="beforeLeave" @after-enter="afterEnter">
    <keep-alive :include='[...curTabPagesNameList]'>
      <router-view :key="key" v-if="showCommonView" />
    </keep-alive>
  </transition>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState('layout', ['showCommonView']),
    ...mapGetters('layout', ['curTabPagesNameList']),
    key() {
      return this.$route.path;
    },
    pageName() {
      if (this.$route.meta.pageName) return this.$route.meta.pageName;
      let _name = '';
      if (this.$route.matched && this.$route.matched.length > 1) {
        this.$route.matched.forEach(match => {
          if (match.meta.pageName) _name = match.meta.pageName;
        });
      }
      return _name;
    },
  },
  data() {
    return {
      dom: null,
    };
  },
  methods: {
    beforeLeave() {
      if (!this.setThisDom()) return;
      this.dom.style.overflow = 'hidden';
    },
    afterEnter() {
      if (!this.setThisDom()) return;
      this.dom.style.overflow = 'auto';
      this.dom.style.overflow = 'overlay';
    },
    setThisDom() {
      if (!this.dom) {
        const dom = document.querySelector('#app > section > main.page-wrap');
        if (!dom) return false;
        this.dom = dom;
      }
      return true;
    },
  },
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
