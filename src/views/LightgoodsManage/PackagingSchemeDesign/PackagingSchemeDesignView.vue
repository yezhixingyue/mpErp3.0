<template>
  <section class="mp-erp-lightgoods-manage-solution-scheme-design-view-wrap">
    <header>
      <h2>{{ lightgoodsModuleStore.schemeDesignManager.currentProduct.ProductName }} | 打包方案</h2>
      <p>{{ lightgoodsModuleStore.schemeDesignManager.currentSolution.Name }}</p>
    </header>

    <main>
      <LRWidthDragAutoChangeComp leftWidth='820px'>
        <template v-slot:left>
          <LeftComp />
        </template>
        <template v-slot:right>
          <RightComp ref="oRight" />
        </template>
      </LRWidthDragAutoChangeComp>
    </main>

    <footer>
      <el-button class="cancel-blue-btn" @click="onReturnClick">返回</el-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { goBackLastPage } from '@/router';
import { LRWidthDragAutoChangeComp } from '@/components/common/mpzj-sell-lib/lib';
import { lightgoodsModuleStore } from '../store';
import LeftComp from './components/left/LeftComp.vue';
import RightComp from './components/right/RightComp.vue';
import { ref } from 'vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const oRight = ref();

const onReturnClick = () => {
  const formulaData = oRight.value.getFormulaData(true);
  if (!formulaData || formulaData.Content === lightgoodsModuleStore.value.schemeDesignManager.FormulaContent) {
    goBackLastPage();
    return;
  }

  MpMessage.warn('确定返回页面吗 ?', '公式内容发生变化尚未保存', () => {
    goBackLastPage();
  });
};

</script>

<script lang='ts'>
export default {
  name: 'PackagingSchemeDesignView',
};
</script>

<style scoped lang='scss'>
.mp-erp-lightgoods-manage-solution-scheme-design-view-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding-left: 8px;
  background-color: #f5f5f5;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 88px 1fr 65px;

  > header, > main, > footer {
    background-color: #fff;
  }

  > header {
    padding: 20px;
    padding-bottom: 15px;

    h2 {
      color: #21CAE3;
      font-weight: 700;
      font-size: 18px;
    }

    p {
      color: #888;
      line-height: 18px;
      margin-top: 5px;
    }
  }

  :deep(.blue-v-line) {
    font-size: 14px;
    font-weight: 700;
    color: #444;
    margin-left: -10px;
  }

  > main {
    overflow: hidden;
    padding-left: 20px;
  }

  > footer {
    box-sizing: border-box;
    padding-top: 10px;
    text-align: center;

    .cancel-blue-btn {
      width: 125px;
      height: 35px;
      border-radius: 4px;
    }
  }
}
</style>
