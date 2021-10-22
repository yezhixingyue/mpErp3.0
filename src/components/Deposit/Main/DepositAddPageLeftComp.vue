<template>
  <div class="mp-deposit-add-page-content-left-comp-wrap mp-scroll-wrap">
    <tree-comp-two-levels
        title="选择产品"
        isProduct
        :treeList='twoLevelsProductClassify'
        :defaultCheckedKeys='defaultCheckedKeys'
        :handleChangeFunc='handleChangeFunc'
        checkAllTitle='所有产品' />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import TreeCompTwoLevels from '@/components/common/TreeCompTwoLevels.vue';

export default {
  components: {
    TreeCompTwoLevels,
  },
  computed: {
    ...mapGetters('common', ['twoLevelsProductClassify']),
    ...mapState('deposit', ['objForDepositAdd']),
    defaultCheckedKeys() {
      return this.objForDepositAdd.ProductList.map(it => it.SecondLevelID);
    },
  },
  methods: {
    handleChangeFunc(checkedNodes) {
      const _list = checkedNodes.filter(_it => _it.Level === 2).map(_it => ({
        FirstLevelID: _it.ParentID,
        SecondLevelID: _it.ID,
        ClassName: _it.ClassName,
      }));
      this.$store.commit('deposit/setObjForDepositAdd', [['ProductList', ''], _list]);
    },
  },
  mounted() {
    this.$store.dispatch('common/getProductClassifyData', { key: 6 });
  },
};
</script>

<style lang='scss'>
.mp-deposit-add-page-content-left-comp-wrap {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
