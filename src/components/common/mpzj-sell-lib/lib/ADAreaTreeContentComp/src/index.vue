<template>
  <TreeComp
    class="mp-erp-ad-area-content-selector-comp-for-new-wrap"
    :class="{treeType: true, displayLevel2: displayLevel2}"
    :title="title"
    :treeList="allLevelList"
    :defaultCheckedKeys="defaultCheckedKeys"
    :handleChangeFunc="handleAreaChangeFunc"
    newDataType
    :checkAllTitle="`所有${title}`"
    :defaultProps="defaultProps"
    ref="TreeComp"
  />
</template>

<script>
// import { mapGetters, mapState } from 'vuex';
import TreeComp from './TreeComp.vue';
import { generateProductString, getTreeTextDisplayContent } from '../../js/util';

export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: 'area', // area|product
    },
    treeType: {
      type: String,
      default: 'area', // area|product|sellArea
    },
    productClassifyType: {
      type: Number,
      default: 6, // 代客下单分类
    },
    displayLevel2: { // 是否仅展示到2级结构
      type: Boolean,
      default: false,
    },
    defaultLabels: { // 如果不想使用defaultPropKeys中指定的2种格式类型时，传入此值
      type: Object,
      default: null,
    },
    shouldDisabledList: {
      type: Array,
      default: () => [],
    },
    showDisabled: {
      type: Boolean,
      default: false,
    },
    useSpreadDataType: { // 展开数据格式 类似2.0
      type: Boolean,
      default: false,
    },
    adAreaList: { // 行政区域列表数据
      type: Array,
      default: () => [],
    },
    allAdAreaTreeList: { // 行政区域树形数据  --- 后续根据使用情况自动由上面数据生成？
      type: Array,
      default: () => [],
    },
    areaList: { // 销售区域列表数据
      type: Array,
      default: () => [],
    },
    allAreaTreeList: { // 销售区域树形数据
      type: Array,
      default: () => [],
    },
    allProductClassify: { // 产品3级结构树形数据
      type: Array,
      default: () => [],
    },
    allProductAndLevelList: { // 产品2级结构树形数据
      type: Array,
      default: () => [],
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
    // ...mapState('common', ['adAreaList', 'areaList']),
    // ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allProductAndLevelList', 'allAreaTreeList']),
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
      if (this.defaultLabels) {
        return this.defaultLabels;
      }
      if (['area', 'sellArea'].includes(this.treeType)) {
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
      if (this.treeType === 'sellArea') {
        return this.areaList;
      }
      return this.allProductAndLevelList;
    },
    allLevelList() {
      if (this.treeType === 'area') {
        return this.allAdAreaTreeList;
      }
      if (this.treeType === 'sellArea') {
        return this.allAreaTreeList;
      }
      return this.allProductClassify;
    },
    defaultCheckedKeys() { // 差还原keys 还原后该组件即可使用
      if (this.useSpreadDataType) {
        return this.value.map((it) => it[this.defaultPropKeys.lv3Key]);
      }
      const list = this.getDefaultCheckedKeys(this.value);
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
      return this.spreadList.filter((it) => it.Level === 3).map((it) => it.ID);
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
      if (this.useSpreadDataType) {
        const _level2List = checkedNodes.filter((it) => it.Level === 2);
        const _list = checkedNodes.filter((it) => it.Level === 3).map((it) => {
          const lv2KeyID = it.ParentID;
          let _t = _level2List.find((it2) => it2.ID === lv2KeyID);
          if (!_t) {
            _t = this.Level2AreaList.find((it4) => it4.ID === lv2KeyID);
          }
          const lv1KeyID = _t ? _t.ParentID : '';
          return ({ [this.defaultPropKeys.lv1Key]: lv1KeyID, [this.defaultPropKeys.lv2Key]: lv2KeyID, [this.defaultPropKeys.lv3Key]: it.ID });
        });
        this.$emit('input', _list);
        return;
      }
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
      _level1List.forEach((lv1) => {
        _lv1List.push(this.createItem(1, lv1.ID, 0, this.lv3KeyEmptyValue));
      });
      if (this.Level1AreaList.length === _lv1List.length && _lv1List.length > 0) {
        this.$emit('input', [{ ...this.allStateItem }]);
        return;
      }
      const _level1IDList = _level1List.map((it) => it.ID);
      const _level2List = checkedNodes.filter((it) => it.Level === 2); // 已选全部城区的城市列表
      _level2List.forEach((lv2) => {
        if (!_level1IDList.includes(lv2.ParentID)) {
          _lv2List.push(this.createItem(1, lv2.ParentID, lv2.ID, this.lv3KeyEmptyValue));
        }
      });
      const _level2IDList = _level2List.map((it) => it.ID);
      const _level3list = checkedNodes.filter((it) => it.Level === 3 && !_level2IDList.includes(it.ParentID));
      // 生成3级目录并加入
      _level3list.forEach((lv3) => {
        const t = this.Level2AreaList.find((it) => it.ID === lv3.ParentID);
        if (t) {
          _lv3List.push(this.createItem(1, t.ParentID, lv3.ParentID, lv3.ID));
        }
      });
      const list = [..._lv1List, ..._lv2List, ..._lv3List];
      this.$emit('input', list);
    },
    getTextDisplayContent() { // 获取选中区域文字展示
      if (this.useSpreadDataType) {
        return generateProductString(this.value, this.allLevelList, this.defaultProps);
      }
      return getTreeTextDisplayContent(this.value, this.allLevelList, this.treeType, this.defaultPropKeys);
    },
    getDefaultCheckedKeys(arr) {
      const list = [];
      if (Array.isArray(arr) && arr.length > 0) {
        if (arr.length === 1) {
          if (arr[0][this.defaultPropKeys.lv1Key] === 0) return this.AllLevel3AreaKeysList;
        }
        arr.forEach((it) => { // 可能为省全部、市全部 也可能为单个城区
          if (it[this.defaultPropKeys.lv2Key] === 0) { // 全省
            const lv1 = this.allLevelList.find((_it) => _it.ID === it[this.defaultPropKeys.lv1Key]);
            if (lv1) {
              lv1.children.forEach((lv2) => {
                list.push(...lv2.children.map((lv3) => lv3.ID));
              });
            }
          } else if (it[this.defaultPropKeys.lv3Key] === this.lv3KeyEmptyValue) { // 全市
            const lv1 = this.allLevelList.find((_it) => _it.ID === it[this.defaultPropKeys.lv1Key]);
            if (lv1) {
              const lv2 = lv1.children.find((_it) => _it.ID === it[this.defaultPropKeys.lv2Key]);
              if (lv2) {
                list.push(...lv2.children.map((lv3) => lv3.ID));
              }
            }
          } else { // 单个城区
            list.push(it[this.defaultPropKeys.lv3Key]);
          }
        });
      }
      return list;
    },
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
  &.displayLevel2 {
    &.mp-common-comps-tree-comp-wrap > .content > .el-tree > .el-tree-node {
      > .el-tree-node__children {
        // display: flex;
        // flex-wrap: wrap;
        // padding-top: 4px;
        // padding-bottom: 10px;
        > .el-tree-node .el-tree-node__children {
          display: none;
        }
      }
    }
  }
}
</style>
