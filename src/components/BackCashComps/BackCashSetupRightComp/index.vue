<template>
  <section class="mp-erp-back-cash-setup-page-right-comp-wrap">
    <header>
      <el-button type="primary" size="mini" @click="onAddClick">+添加返现规则</el-button>
      <p class="tips-box" v-if="ItemList.length === 0">
        <i class="el-icon-warning"></i>
        <span>请点击左侧按钮添加返现规则吧</span>
      </p>
    </header>
    <main class="mp-scroll-wrap">
      <ItemComp
       v-for="(it, i) in ItemList"
       :key="it.ID || it.key"
       :itemData='it'
       @remove='handleRemove(i)'
       @productSetup='e => handleProductSetup(e, i)'
       @productFilter='e => handleProductFilter(e, i)'
       @productRemove='e => handleProductRemove(e, i)'
       @returnValueSetup='e => handleReturnValueSetup(e, i)'
       @returnValueRemove='e => handleReturnValueRemove(e, i)'
       />
      <TreeSelectDialogComp :visible.sync="productVisible" :value='curEditData' @input="onProductChange" />
      <ReturnValueSetupDialog :visible.sync="returnValueVisible" :value='curEditData' @submit="onReturnValueChange" />
    </main>
  </section>
</template>

<script>
import ItemComp from './ItemComp.vue';
import TreeSelectDialogComp from '../../common/SelectorComps/NewAreaTreeSpreadComp/TreeSelectDialogComp.vue';
import ReturnValueSetupDialog from './ReturnValueSetupDialog.vue';

export default {
  props: {
    ItemList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ItemComp,
    TreeSelectDialogComp,
    ReturnValueSetupDialog,
  },
  data() {
    return {
      curIndex: -1,
      curLevel2Index: -1,
      curEditData: null,
      productVisible: false,
      returnValueVisible: false,
    };
  },
  methods: {
    onAddClick() {
      this.$emit('add');
    },
    handleRemove(i) {
      this.$emit('remove', i);
    },
    handleProductSetup([data, level2Index], i) {
      this.curIndex = i;
      this.curLevel2Index = level2Index;
      this.curEditData = data;
      this.productVisible = true;
    },
    handleProductFilter([, level2Index], i) {
      this.$emit('productFilter', level2Index, i);
    },
    handleProductRemove(level2Index, index) {
      this.$emit('productRemove', level2Index, index);
    },
    onProductChange(e) {
      this.$emit('productSetup', e, this.curIndex, this.curLevel2Index);
    },
    handleReturnValueSetup([data, level2Index], i) {
      this.curIndex = i;
      this.curLevel2Index = level2Index;
      this.curEditData = data;
      this.returnValueVisible = true;
    },
    onReturnValueChange(e) {
      this.$emit('returnValueSetup', e, this.curIndex, this.curLevel2Index);
    },
    handleReturnValueRemove(level2Index, index) {
      this.$emit('returnValueRemove', level2Index, index);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-back-cash-setup-page-right-comp-wrap {
  padding-left: 35px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 700px;
  > header {
    padding-bottom: 15px;
    flex: none;
    > button {
      font-size: 14px;
      width: 130px;
    }
    > .tips-box {
      display: inline-block;
      width: 280px;
      margin-left: 20px;
    }
  }
  > main {
    flex: 1;
    padding: 10px 0;
    overflow: auto;
    overflow: overlay;
  }
}
</style>
