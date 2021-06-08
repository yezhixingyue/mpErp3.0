<template>
  <section class="mp-erp-product-classify-manage-page-wrap">
    <header>
      <el-radio-group v-model="radio" size="medium" @change='onRadioChange'>
        <el-radio-button :label="it.ID" v-for="it in ProductClassifyIDList" :key="it.ID">{{it.Name}}</el-radio-button>
      </el-radio-group>
    </header>
    <ClassifyContentComp :classifyData='classifyData' :type='1' title='产品'
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
    ...mapGetters('common', ['twoLevelsMultipleProductClassifyList4Sort']),
    classifyData() {
      if ((!this.radio && this.radio !== 0) || this.twoLevelsMultipleProductClassifyList4Sort.length === 0) return [];
      const t = this.twoLevelsMultipleProductClassifyList4Sort.find(it => it.type === this.radio);
      return t ? t.List : [];
    },
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
      const resBool = await this.$store.dispatch('common/getProductClassifyData', { bool, key: this.radio });
      return resBool;
    },
    onSortSuccess(List) {
      this.$store.commit('common/setProductMultipleClassifyList', { type: this.radio, List });
    },
    onRadioChange(e) {
      this.$store.dispatch('common/getProductClassifyData', { bool: true, key: e });
    },
  },
  mounted() {
    this.radio = this.ProductClassifyIDList[0].ID;
  },
};
</script>
<style lang='scss'>
.mp-erp-product-classify-manage-page-wrap {
  height: 100%;
  > header {
    padding:25px 0 9px 20px;
    .el-radio-button--medium .el-radio-button__inner {
      padding: 9px 20px;
      width: 120px;
    }
    .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0 3px 3px 0;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 3px 0 0 3px;
    }
  }
  > .mp-erp-common-classify-manage-comp-wrap {
    height:calc(100% - 70px);
  }
}
</style>
