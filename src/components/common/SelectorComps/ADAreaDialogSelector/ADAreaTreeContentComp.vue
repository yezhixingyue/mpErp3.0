<template>
  <TreeComp
    class="mp-erp-ad-area-content-selector-comp-for-new-wrap"
    :class="treeType"
    :title="`${treeType==='area' ? '行政区域' : '产品'}`"
    :treeList="allLevelList"
    :defaultCheckedKeys="defaultCheckedKeys"
    :handleChangeFunc="handleAreaChangeFunc"
    newDataType
    :checkAllTitle="`所有${treeType==='area' ? '地区' : '产品'}`"
    :defaultProps="defaultProps"
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
    treeType: {
      type: String,
      default: 'area', // area|product
    },
    productClassifyType: {
      type: Number,
      default: 6, // 代客下单分类
    },
  },
  components: {
    TreeComp,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('common', ['adAreaList']),
    ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allProductAndLevelList']),
    defaultProps() {
      if (this.treeType === 'area') {
        return {
          children: 'children',
          label: 'Name',
        };
      }
      return {
        children: 'children',
        label: 'ClassName',
      };
    },
    defaultPropKeys() {
      if (this.treeType === 'area') {
        return {
          rootKey: 'CountryID',
          lv1Key: 'ProvinceID',
          lv2Key: 'CityID',
          lv3Key: 'CountyID',
        };
      }
      return {
        rootKey: '',
        lv1Key: 'FirstLevelID',
        lv2Key: 'SecondLevelID',
        lv3Key: 'ProductID',
      };
    },
    lv3KeyEmptyValue() {
      return this.treeType === 'product' ? '00000000-0000-0000-0000-000000000000' : 0;
    },
    allStateItem() {
      return this.createItem(1, 0, 0, this.lv3KeyEmptyValue);
    },
    spreadList() {
      if (this.treeType === 'area') {
        return this.adAreaList;
      }
      return this.allProductAndLevelList;
    },
    allLevelList() {
      if (this.treeType === 'area') {
        return this.allAdAreaTreeList;
      }
      return this.allProductClassify;
    },
    defaultCheckedKeys() { // 差还原keys 还原后该组件即可使用
      const list = [];
      if (Array.isArray(this.value) && this.value.length > 0) {
        if (this.value.length === 1) {
          if (this.value[0][this.defaultPropKeys.lv1Key] === 0) return this.AllLevel3AreaKeysList;
        }
        this.value.forEach(it => { // 可能为省全部、市全部 也可能为单个城区
          if (it[this.defaultPropKeys.lv2Key] === 0) { // 全省
            const lv1 = this.allLevelList.find(_it => _it.ID === it[this.defaultPropKeys.lv1Key]);
            if (lv1) {
              lv1.children.forEach(lv2 => {
                list.push(...lv2.children.map(lv3 => lv3.ID));
              });
            }
          } else if (it[this.defaultPropKeys.lv3Key] === this.lv3KeyEmptyValue) { // 全市
            const lv1 = this.allLevelList.find(_it => _it.ID === it[this.defaultPropKeys.lv1Key]);
            if (lv1) {
              const lv2 = lv1.children.find(_it => _it.ID === it[this.defaultPropKeys.lv2Key]);
              if (lv2) {
                list.push(...lv2.children.map(lv3 => lv3.ID));
              }
            }
          } else { // 单个城区
            list.push(it[this.defaultPropKeys.lv3Key]);
          }
        });
      }
      return list;
    },
    Level1AreaList() {
      if (this.spreadList.length === 0) return [];
      return this.spreadList.filter((it) => it.Level === 1);
    },
    Level2AreaList() {
      if (this.spreadList.length === 0) return [];
      return this.spreadList.filter((it) => it.Level === 2);
    },
    AllLevel3AreaKeysList() {
      if (this.spreadList.length === 0) return [];
      return this.spreadList.filter((it) => it.Level === 3).map(it => it.ID);
    },
  },
  methods: {
    createItem(rootVal, lv1Val, lv2Val, lv3Val) {
      const temp = {
        [this.defaultPropKeys.lv1Key]: lv1Val,
        [this.defaultPropKeys.lv2Key]: lv2Val,
        [this.defaultPropKeys.lv3Key]: lv3Val,
      };
      if (this.defaultPropKeys.rootKey) {
        temp[this.defaultPropKeys.rootKey] = rootVal;
      }
      return temp;
    },
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
        _lv1List.push(this.createItem(1, lv1.ID, 0, this.lv3KeyEmptyValue));
      });
      if (this.Level1AreaList.length === _lv1List.length && _lv1List.length > 0) {
        this.$emit('input', [{ ...this.allStateItem }]);
        return;
      }
      const _level1IDList = _level1List.map(it => it.ID);
      const _level2List = checkedNodes.filter((it) => it.Level === 2); // 已选全部城区的城市列表
      _level2List.forEach(lv2 => {
        if (!_level1IDList.includes(lv2.ParentID)) {
          _lv2List.push(this.createItem(1, lv2.ParentID, lv2.ID, this.lv3KeyEmptyValue));
        }
      });
      const _level2IDList = _level2List.map(it => it.ID);
      const _level3list = checkedNodes.filter((it) => it.Level === 3 && !_level2IDList.includes(it.ParentID));
      // 生成3级目录并加入
      _level3list.forEach(lv3 => {
        const t = this.Level2AreaList.find(it => it.ID === lv3.ParentID);
        if (t) {
          _lv3List.push(this.createItem(1, t.ParentID, lv3.ParentID, lv3.ID));
        }
      });
      const list = [..._lv1List, ..._lv2List, ..._lv3List];
      this.$emit('input', list);
    },
    getTextDisplayContent() { // 获取选中区域文字展示
      return this.$utils.getTreeTextDisplayContent(this.value, this.allLevelList);
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
    margin-top: -1px;
  }
  &.mp-common-comps-tree-comp-wrap
    > .content
    > .el-tree
    > .el-tree-node
    > .el-tree-node__content
    > .el-tree-node__label
    > span.title {
    width: 8.3em;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 1px;
  }
  &.product {
    &.mp-common-comps-tree-comp-wrap > .content > .el-tree > .el-tree-node > .el-tree-node__children > .el-tree-node > .el-tree-node__content {
      width: 10em;
    }
    &.mp-common-comps-tree-comp-wrap > .content > .el-tree
     > .el-tree-node > .el-tree-node__children > .el-tree-node .el-tree-node__children > .el-tree-node > .el-tree-node__content {
      width: 12em;
    }
  }
}
</style>
