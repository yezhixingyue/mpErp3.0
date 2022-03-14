<template>
  <div class="mp-erp-sell-area-setup-page-right-content-sub-area-manage-comp-wrap" v-if="localAreaData">
    <!-- 省级列表 -->
    <ListItemDisplayComp
      :list="provinceDisplayList"
      :activeId='curProvinceID'
      :selectedIds="curProvinceSelectedIds"
      @click="onProvinceClick"
    />
    <!-- 市级列表 -->
    <ListItemDisplayComp
      :list="cityDisplayList"
      :activeId='curCityID'
      :selectedIds="curCitySelectedIds"
      :disabledIds='curCityDisabledIds'
      @click="onCityClick"
    />
    <!-- 区县级列表 -->
    <ListItemDisplayComp
      :list="countyDisplayList"
      :value="curCountySelectedIds"
      @input="handleCheckout"
      type='checkbox'
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ListItemDisplayComp from './ListDisplayComp.vue';

export default {
  props: {
    curManageArea: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ListItemDisplayComp,
  },
  computed: {
    ...mapState('common', ['areaList']),
    ...mapGetters('common', ['allAdAreaTreeList']),
    allSellAreaCityList() { // 销售区域中包含的全部城市列表
      return this.areaList.filter(it => it.Level === 2);
    },
    provinceDisplayList() {
      return this.allAdAreaTreeList;
    },
    cityDisplayList() {
      if (!this.curProvinceID) return [];
      const t = this.allAdAreaTreeList.find(it => it.ID === this.curProvinceID);
      return t && t.children ? t.children : [];
    },
    countyDisplayList() {
      if (!this.curCityID) return [];
      const t = this.cityDisplayList.find(it => it.ID === this.curCityID);
      return t && t.children ? t.children : [];
    },
    curProvinceSelectedIds() { // 当前区域被选中的省份列表
      return this.provinceDisplayList.filter(it => it.children.some(city => this.curCitySelectedIds.includes(city.ID))).map(it => it.ID);
    },
    curCitySelectedIds() {
      return this.localAreaData.children.map(it => it.ID);
    },
    curCityDisabledIds() {
      return this.allSellAreaCityList.filter(it => !this.curCitySelectedIds.includes(it.ID)).map(it => it.ID);
    },
    curCountySelectedIds() { // 选中的区级id列表
      if (!this.curCityID) return [];
      const t = this.localAreaData.children.find(it => it.ID === this.curCityID);
      if (t && t.children) {
        return t.children.map(it => it.ID);
      }
      return [];
    },
    curCity() {
      return this.cityDisplayList.find(it => it.ID === this.curCityID);
    },
  },
  data() {
    return {
      curProvinceID: '',
      curCityID: '',
      localAreaData: null,
    };
  },
  methods: {
    onProvinceClick(it) {
      if (!it) return;
      this.curProvinceID = it.ID;
    },
    onCityClick(it) {
      if (!it) return;
      this.curCityID = it.ID;
    },
    handleCheckout(ids) {
      if (!this.curCity) return;
      const list = ids.map(id => {
        const t = this.countyDisplayList.find(_it => _it.ID === id);
        if (t) {
          const temp = {
            ClassName: t.Name,
            ID: id,
            Level: 3,
            ParentID: this.curCityID,
          };
          return temp;
        }
        return null;
      }).filter(it => it);
      if (list.length === 0) {
        this.localAreaData.children = this.localAreaData.children.filter(city => city.ID !== this.curCityID);
        return;
      }
      const t = this.localAreaData.children.find(city => city.ID === this.curCityID);
      if (t) {
        t.children = list;
        return;
      }
      const cityTemp = {
        ClassName: this.curCity.Name,
        ID: this.curCity.ID,
        Level: 2,
        ParentID: this.localAreaData.ID,
        children: list,
      };
      this.localAreaData.children.push(cityTemp);
    },
    getIsOrNotChange() {
      if (!this.localAreaData && !this.curManageArea) return false;
      return JSON.stringify(this.localAreaData) !== JSON.stringify(this.curManageArea);
    },
    getSubmitData() {
      const level2List = [];
      const level3List = [];
      this.localAreaData.children.forEach(level2 => {
        const temp = { ...level2 };
        delete temp.children;
        level2List.push(temp);
        level3List.push(...level2.children);
      });
      return {
        level2List,
        level3List,
        RegionalID: this.curManageArea.ID,
      };
    },
  },
  watch: {
    curManageArea: {
      handler(val) {
        this.curProvinceID = '';
        this.curCityID = '';
        this.localAreaData = val ? JSON.parse(JSON.stringify(val)) : null;
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-sell-area-setup-page-right-content-sub-area-manage-comp-wrap {
  padding: 4px 5px;
  height: 100%;
  overflow: auto;
  .mp-erp-sell-area-setup-page-right-content-list-display-comp-wrap {
    margin-bottom: 20px;
  }
}
</style>
