<template>
  <section style="height: 100%">
    <header style="padding:25px 0 9px 20px">
      <el-radio-group v-model="radio" size="medium">
        <el-radio-button :label="it.ID" v-for="it in ProductClassifyIDList" :key="it.ID">{{it.Name}}</el-radio-button>
      </el-radio-group>
    </header>
    <ClassifyContentComp :classifyData='twoLevelsProductClassify4Sort' :type='1' title='产品' style="height:calc(100% - 70px)"
     @goback='onGobackClick' @sort='onSortSuccess' :fetchData='fetchClassifyData' />
  </section>
</template>

<script>
import ClassifyContentComp from '@/components/common/ClassifyManage/ClassifyContentComp.vue';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    ClassifyContentComp,
  },
  computed: {
    ...mapState('common', ['ProductClassifyIDList']),
    ...mapGetters('common', ['twoLevelsProductClassify4Sort']),
  },
  data() {
    return {
      radio: '',
    };
  },
  methods: {
    onGobackClick() {
      this.$router.replace('/ProductManageList');
    },
    async fetchClassifyData(bool) {
      const resBool = await this.$store.dispatch('common/getProductList', { bool });
      return resBool;
    },
    onSortSuccess(list) {
      this.$store.commit('common/setProductList', list);
    },
  },
};
</script>
<style lang='scss'>
</style>
