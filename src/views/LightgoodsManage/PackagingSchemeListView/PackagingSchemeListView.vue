<template>
  <section class="mp-erp-lightgoods-manage-solution-scheme-list-view-wrap">
    <header>
      <el-button type="primary" style="height: 35px;padding: 0;width: 125px;" @click="onSolutionSaveClick(null)">+ 添加打包方案</el-button>
      <div v-if="lightgoodsModuleStore.solutionListManager.currentProduct" class="blue-v-line"
        >“{{lightgoodsModuleStore.solutionListManager.currentProduct.ProductName}}”打包方案</div>
    </header>

    <main>
      <Table
        :list="lightgoodsModuleStore.solutionListManager.solutionList"
        :loading="lightgoodsModuleStore.solutionListManager.loading"
        @edit="e => onSolutionSaveClick(e)"
        @remove="e => lightgoodsModuleStore.solutionListManager.removeSolution(e)"
        @setup="e => onSolutionSetupClick(e)"
      />

      <SolutionAddDialog
        :visible.sync="solutionSaveState.visible"
        :item="solutionSaveState.currentSolution"
        :list="lightgoodsModuleStore.solutionListManager.solutionList"
        :submit="e => lightgoodsModuleStore.solutionListManager.saveSolution(e)"
       />
    </main>

    <footer>
      <el-button class="cancel-blue-btn" @click="goBackLastPage">返回</el-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import router, { goBackLastPage } from '@/router';
import { lightgoodsModuleStore } from '../store';
import SolutionAddDialog from './components/SolutionAddDialog/SolutionAddDialog.vue';
import { useSolutionSave } from './hooks/useSolutionSave';
import { onMounted } from 'vue';
import Table from './components/Table.vue';
import { ILightgoodsProductSolution } from '../types/types';
import { SolutionSchemeDesignManageClass } from '../PackagingSchemeDesign/models/SolutionSchemeDesignManageClass';

const { solutionSaveState, onSolutionSaveClick } = useSolutionSave();

/** 方案设计 */
const onSolutionSetupClick = (row: ILightgoodsProductSolution) => {
  lightgoodsModuleStore.value.schemeDesignManager = new SolutionSchemeDesignManageClass(lightgoodsModuleStore.value.solutionListManager.currentProduct, row);
  router.push('/packagingSchemeDesign');
};

onMounted(() => {
  lightgoodsModuleStore.value.solutionListManager.getSolutionList();
  lightgoodsModuleStore.value.solutionListManager.getConditionPropertyList();
});
</script>

<script lang='ts'>
export default {
  name: 'PackagingSchemeListView',
};
</script>

<style scoped lang='scss'>
.mp-erp-lightgoods-manage-solution-scheme-list-view-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding-left: 8px;
  background-color: #f5f5f5;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 106px 1fr 65px;
  max-width: 1628px;

  > header, > main, > footer {
    background-color: #fff;
  }

  > header {
    padding: 20px;
    padding-bottom: 15px;

    .blue-v-line {
      margin-top: 18px;
      font-size: 14px;
      line-height: 14px;
      height: 14px;
      font-weight: 700;
      color: #444;
      margin-left: 1px;

      &::before {
        vertical-align: -3px;
        margin-right: 2px;
      }
    }
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
