<template>
  <!-- v-bind="$attrs" v-on="$listeners" -->
  <EpCascader
    :showLine="showLine"
    :list="allAreaTreeList"
    :fiexdWidth="fiexdWidth"
    :title="title"
    v-model="EpCascaderAreaValue"
   />
</template>

<script>
import { mapGetters } from 'vuex';
import EpCascader from '../../../../packages/EpCascader/index.vue';

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
  },
  components: {
    EpCascader,
  },
  computed: {
    ...mapGetters('common', ['allAreaTreeList']),
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
        this.setCondition([this.typeList[0], RegionalID]);
        this.setCondition([this.typeList[1], CityID]);
        this.setCondition([this.typeList[2], CountyID]);
        this.getList();
      },
    },
  },
  mounted() {
    this.$store.dispatch('common/getAreaList');
  },
};
</script>
<style lang='scss'>
</style>
