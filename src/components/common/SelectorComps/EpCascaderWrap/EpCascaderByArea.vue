<template>
  <!-- v-bind="$attrs" v-on="$listeners" -->
  <EpCascader
    :showLine="showLine"
    :list="areaTreeList"
    :fiexdWidth="fiexdWidth"
    :title="title"
    :level="level"
    :defaultProps="defaultProps"
    v-model="EpCascaderAreaValue"
   />
</template>

<script>
import { mapGetters } from 'vuex';
// import EpCascader from '../../../../packages/EpCascader/index.vue';
import { EpCascader } from '@/components/common/mpzj-sell-lib/lib';

export default {
  props: {
    showLine: {
      type: Boolean,
      default: true,
    },
    fiexdWidth: {
      type: Number,
      default: 240,
    },
    title: {
      type: String,
      default: '销售区域',
    },
    RegionalID: {
      default: '',
    },
    CityID: {
      default: '',
    },
    CountyID: {
      default: '',
    },
    typeList: {
      type: Array,
      default: () => [['SellArea', 'RegionalID'], ['SellArea', 'CityID'], ['SellArea', 'CountyID']],
    },
    setCondition: {
      type: Function,
      default: () => {},
    },
    getList: {
      type: Function,
      default: () => {},
    },
    useAdArea: {
      type: Boolean,
      default: false,
    },
    useLabel: { // 是否使用中文做为筛选条件
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: undefined,
    },
  },
  components: {
    // EpCascader,
    EpCascader,
  },
  computed: {
    ...mapGetters('common', ['allAreaTreeList', 'allAdAreaTreeList']),
    areaTreeList() {
      return this.useAdArea ? this.allAdAreaTreeList : this.allAreaTreeList;
    },
    defaultProps() {
      return this.useAdArea ? {
        ID: !this.useLabel ? 'ID' : 'Name',
        Name: 'Name',
        children: 'children',
      } : undefined;
    },
    EpCascaderAreaValue: {
      get() {
        const list = [
          this.RegionalID,
          this.CityID,
          this.CountyID,
        ];
        return list.filter(it => it || it === 0);
      },
      set(ids) {
        const [_RegionalID, _CityID, _CountyID] = ids;
        const RegionalID = _RegionalID || _RegionalID === 0 ? _RegionalID : '';
        const CityID = _CityID || _CityID === 0 ? _CityID : '';
        const CountyID = _CountyID || _CountyID === 0 ? _CountyID : '';
        if (this.typeList[0]) this.setCondition([this.typeList[0], RegionalID]);
        if (this.typeList[1]) this.setCondition([this.typeList[1], CityID]);
        if (this.typeList[2]) this.setCondition([this.typeList[2], CountyID]);
        this.getList();
      },
    },
  },
  mounted() {
    if (this.useAdArea) {
      this.$store.dispatch('common/fetchAdAreaList');
    } else {
      this.$store.dispatch('common/getAreaList');
    }
  },
};
</script>
<style lang='scss'>
</style>
