<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive :include='[...curTabPagesNameList, "CraftManageList"]'>
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
    keepAlive() {
      // return this.pageName && this.curTabPagesNameList && this.curTabPagesNameList.includes(this.pageName);
      return Math.random > 0.5;
    },
  },
};
</script>
<style lang='scss'>
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .3s;
  overflow: hidden;
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
