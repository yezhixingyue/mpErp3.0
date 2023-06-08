<template>
  <ResultFormulaTableComp
    hiddenTip
    usePropList
    showName
    :FormulaList='dataList'
    :PropertyList='PropertyList'
    :isLoading='loading'
    :showHeader="false"
    :showCtrlMenus="hasPermission"
    :getDisplayContent="getDisplayContent"
    :allAdAreaTreeList="allAdAreaTreeList"
    :allProductClassify="allProductClassify"
    :allAreaTreeList="allAreaTreeList"
    nameAtBefore
    :showNameLabel="false"
    operationTitle="分配策略"
    rightText = '则'
    @setup='edit' @remove="remove"
  />
</template>

<script>
import { mapGetters } from 'vuex';
import { ResultFormulaTableComp } from '@/components/common/mpzj-sell-lib/lib';
import ReviewAllocationItemClass from '../Setup/ReviewAllocationItemClass';

export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    PropertyList: {
      type: Array,
      default: () => [],
    },
    curPanel: {
      type: Object,
      default: null,
    },
    hasPermission: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allAreaTreeList']),
  },
  components: {
    ResultFormulaTableComp,
  },
  methods: {
    getDisplayContent(e) {
      return ReviewAllocationItemClass.getDisplayContent(e);
    },
    edit(e) {
      this.$emit('edit', e);
    },
    remove(e) {
      this.$emit('remove', e);
    },
  },
};
</script>
<style lang='scss'>
</style>
