<template>
  <section style="height: 100%">
    <ClassifyContentComp :classifyData='twoLevelsCraftClassify4Sort' :type='0' title='工艺'
     @goback='onGobackClick' @sort='onSortSuccess' :fetchData='fetchClassifyData' />
  </section>
</template>

<script>
import ClassifyContentComp from '@/components/common/ClassifyManage/ClassifyContentComp.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'CraftClassifyManagePage',
  components: {
    ClassifyContentComp,
  },
  computed: {
    ...mapGetters('common', ['twoLevelsCraftClassify4Sort']),
  },
  methods: {
    onGobackClick() {
      this.$router.replace('/CraftManageList');
    },
    async fetchClassifyData(bool) {
      const resBool = await this.$store.dispatch('common/getCraftClassifyData', bool);
      return resBool;
    },
    onSortSuccess(list) {
      this.$store.commit('common/setCraftClassifyData', list);
      this.$store.commit('basicSet/setCraftFetchData', true);
    },
  },
};
</script>
<style lang='scss'>
</style>
