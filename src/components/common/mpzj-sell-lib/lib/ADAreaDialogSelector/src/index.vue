<template>
  <CommonDialogComp
    width="750px"
    top="8vh"
    :visible.sync="localVisible"
    :title="`选择${title}`"
    class="mp-erp-ad-area-dialog-selector-comp-wrap"
    submitText='确定'
    @submit="onSubmit"
    @closed="onClosed"
    @open="onOpen"
    @cancle="localVisible = false"
  >
    <ADAreaTreeContentComp
      ref="oTreeWrap"
      v-model="localAreaList"
      v-if="localVisible"
      :title="title"
      :treeType='treeType'
      :displayLevel2='displayLevel2'
      :productClassifyType='productClassifyType'
      :adAreaList="adAreaList"
      :allAdAreaTreeList="allAdAreaTreeList"
      :areaList="areaList"
      :allAreaTreeList="allAreaTreeList"
      :allProductClassify="allProductClassify"
      :allProductAndLevelList="allProductAndLevelList"
     />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../CommonDialogComp';
import ADAreaTreeContentComp from '../../ADAreaTreeContentComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
    AreaDescribe: {
      type: String,
      default: '',
    },
    treeType: {
      type: String,
      default: 'area', // area | sellArea | product
    },
    productClassifyType: {
      type: Number,
      default: 6, // 代客下单分类
    },
    displayLevel2: {
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
    CommonDialogComp,
    ADAreaTreeContentComp,
  },
  data() {
    return {
      localAreaList: [],
    };
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    title() {
      let str = '';
      switch (this.treeType) {
        case 'area':
          str = '行政区域';
          break;
        case 'product':
          str = '产品';
          break;
        case 'sellArea':
          str = '销售区域';
          break;
        default:
          break;
      }
      return str;
    },
  },
  methods: {
    onClosed() {
      if (this.$refs.oTreeWrap && this.$refs.oTreeWrap.$refs.TreeComp) {
        this.$refs.oTreeWrap.$refs.TreeComp.clearTreeData();
      }
    },
    onOpen() {
      this.localAreaList = [...this.value];
    },
    onSubmit() {
      this.$emit('input', [...this.localAreaList]);
      this.$emit('update:AreaDescribe', this.$refs.oTreeWrap.getTextDisplayContent());
      this.localVisible = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-ad-area-dialog-selector-comp-wrap {
  .el-dialog__body {
    height: 520px;
    overflow: auto;
    padding-left: 30px;
    margin-right: 3px;
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cbcbcb;
      border-radius: 3px;
      &:hover {
        background-color: #989898;
      }
    }
  }
}
</style>
