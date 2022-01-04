<template>
  <TreeComp
    class="mp-erp-ad-area-content-selector-comp-for-new-wrap"
    title="行政区域"
    :treeList="allAdAreaTreeList"
    :defaultCheckedKeys="defaultCheckedKeys"
    :handleChangeFunc="handleAreaChangeFunc"
    newDataType
    checkAllTitle="所有地区"
    :defaultProps="{
      children: 'children',
      label: 'Name',
    }"
    ref="TreeComp"
  />
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import TreeComp from '@/components/common/TreeComp.vue';

export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    TreeComp,
  },
  data() {
    return {
      allStateItem: {
        CountryID: 1,
        ProvinceID: 0,
        CityID: 0,
        CountyID: 0,
      },
    };
  },
  computed: {
    ...mapState('common', ['adAreaList']),
    ...mapGetters('common', ['allAdAreaTreeList']),
    defaultCheckedKeys() { // 差还原keys 还原后该组件即可使用
      const list = [];
      if (Array.isArray(this.value) && this.value.length > 0) {
        if (this.value.length === 1) {
          const [{ CountryID, ProvinceID }] = this.value;
          if (CountryID === 1 && ProvinceID === 0) return this.AllLevel3AreaKeysList;
        }
        this.value.forEach(it => { // 可能为省全部、市全部 也可能为单个城区
          const { ProvinceID, CityID, CountyID } = it;
          if (CityID === 0) { // 全省
            const lv1 = this.allAdAreaTreeList.find(_it => _it.ID === ProvinceID);
            if (lv1) {
              lv1.children.forEach(lv2 => {
                list.push(...lv2.children.map(lv3 => lv3.ID));
              });
            }
          } else if (CountyID === 0) { // 全市
            const lv1 = this.allAdAreaTreeList.find(_it => _it.ID === ProvinceID);
            if (lv1) {
              const lv2 = lv1.children.find(_it => _it.ID === CityID);
              if (lv2) {
                list.push(...lv2.children.map(lv3 => lv3.ID));
              }
            }
          } else { // 单个城区
            list.push(CountyID);
          }
        });
      }
      return list;
    },
    Level1AreaList() {
      if (this.adAreaList.length === 0) return [];
      return this.adAreaList.filter((it) => it.Level === 1);
    },
    Level2AreaList() {
      if (this.adAreaList.length === 0) return [];
      return this.adAreaList.filter((it) => it.Level === 2);
    },
    AllLevel3AreaKeysList() {
      if (this.adAreaList.length === 0) return [];
      return this.adAreaList.filter((it) => it.Level === 3).map(it => it.ID);
    },
  },
  methods: {
    handleAreaChangeFunc(checkedNodes, checkedKeys, isAll) {
      if (checkedNodes.length === 0) {
        this.$emit('input', []);
        return;
      }
      if (isAll) {
        this.$emit('input', [{ ...this.allStateItem }]);
        return;
      }
      const _lv1List = [];
      const _lv2List = [];
      const _lv3List = [];
      const _level1List = checkedNodes.filter((it) => it.Level === 1); // 已选全部城市的省份列表
      _level1List.forEach(lv1 => {
        _lv1List.push({ CountryID: 1, ProvinceID: lv1.ID, CityID: 0, CountyID: 0 });
      });
      if (this.Level1AreaList.length === _lv1List.length && _lv1List.length > 0) {
        this.$emit('input', [{ ...this.allStateItem }]);
        return;
      }
      const _level1IDList = _level1List.map(it => it.ID);
      const _level2List = checkedNodes.filter((it) => it.Level === 2); // 已选全部城区的城市列表
      _level2List.forEach(lv2 => {
        if (!_level1IDList.includes(lv2.ParentID)) {
          _lv2List.push({ CountryID: 1, ProvinceID: lv2.ParentID, CityID: lv2.ID, CountyID: 0 });
        }
      });
      const _level2IDList = _level2List.map(it => it.ID);
      const _level3list = checkedNodes.filter((it) => it.Level === 3 && !_level2IDList.includes(it.ParentID));
      // 生成3级目录并加入
      _level3list.forEach(lv3 => {
        const t = this.Level2AreaList.find(it => it.ID === lv3.ParentID);
        if (t) {
          _lv3List.push({ CountryID: 1, ProvinceID: t.ParentID, CityID: lv3.ParentID, CountyID: lv3.ID });
        }
      });
      const list = [..._lv1List, ..._lv2List, ..._lv3List];
      this.$emit('input', list);
    },
    getTextDisplayContent() { // 获取选中区域文字展示
      const list = [];
      if (Array.isArray(this.value) && this.value.length > 0) {
        this.value.forEach(it => { // 可能为省全部、市全部 也可能为单个城区
          const { ProvinceID, CityID, CountyID } = it;
          if (ProvinceID === 0) { // 全部区域
            list.push('全部区域');
          } else if (CityID === 0) { // 全省
            const lv1 = this.allAdAreaTreeList.find(_it => _it.ID === ProvinceID);
            list.push(lv1.Name);
          } else if (CountyID === 0) { // 全市
            const lv1 = this.allAdAreaTreeList.find(_it => _it.ID === ProvinceID);
            if (lv1) {
              const lv2 = lv1.children.find(_it => _it.ID === CityID);
              if (lv2) {
                const item = { Name: lv2.Name, CountyList: [] };
                const t = list.find(_item => _item.Province === lv1.Name);
                if (t) {
                  t.CityList.push(item);
                } else {
                  const temp = {
                    Province: lv1.Name,
                    CityList: [item],
                  };
                  list.push(temp);
                }
              }
            }
          } else { // 单个城区
            const lv1 = this.allAdAreaTreeList.find(_it => _it.ID === ProvinceID);
            if (lv1) {
              const lv2 = lv1.children.find(_it => _it.ID === CityID);
              if (lv2) {
                const lv3 = lv2.children.find(_it => _it.ID === CountyID);
                if (lv3) {
                  const _ProvinceItem = list.find(_item => _item.Province === lv1.Name);
                  if (_ProvinceItem) {
                    const _CityItem = _ProvinceItem.CityList.find(city => city.Name === lv2.Name);
                    if (_CityItem) {
                      _CityItem.CountyList.push(lv3.Name);
                    } else {
                      _ProvinceItem.CityList.push({ Name: lv2.Name, CountyList: [lv3.Name] });
                    }
                  } else {
                    const temp = {
                      Province: lv1.Name,
                      CityList: [{ Name: lv2.Name, CountyList: [lv3.Name] }],
                    };
                    list.push(temp);
                  }
                }
              }
            }
          }
        });
      }
      return list.map(it => {
        if (typeof it === 'string') return it;
        const { Province, CityList } = it;
        return `${Province}：[${CityList.map(city => {
          const { Name, CountyList } = city;
          if (CountyList.length === 0) return `${Name}全部区域`;
          const _Name = Name === Province ? '' : `${Name}：`;
          const CountyListContent = CountyList.join('、');
          return `${_Name}${CountyListContent}`;
        }).join('、')}]`;
      }).join('\r\n');
    },
  },
  mounted() {
    this.$store.dispatch('common/fetchAdAreaList');
  },
};
</script>
<style lang='scss'>
.mp-erp-ad-area-content-selector-comp-for-new-wrap {
  &.mp-common-comps-tree-comp-wrap
    > .content
    > .el-tree
    > .el-tree-node
    > .el-tree-node__children
    > .el-tree-node
    > .el-tree-node__content {
    margin-top: -4px;
  }
  &.mp-common-comps-tree-comp-wrap
    > .content
    > .el-tree
    > .el-tree-node
    > .el-tree-node__content
    > .el-tree-node__label
    > span.title {
    width: 7em;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
