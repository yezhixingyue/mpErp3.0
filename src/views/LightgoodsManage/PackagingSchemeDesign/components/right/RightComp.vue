<template>
  <section class="right-comp-wrap">
    <header>
      <h4 class="blue-v-line">订单体积计算公式</h4>
    </header>

    <main>
      <!-- 右侧公式设置 -->
      <FormulaPanelComp
        ref="oRightFormulaPanel"
        class="mp-erp-formula-set-box-wrap"
        hiddenHeader
        isVertical
        hiddenFooter
        useSpecialFunc
        :NowEditFormulaData='lightgoodsModuleStore.schemeDesignManager.currentSolution?.Formula || {}'
        :Condition4getProperty='Condition4getFormulaProperty'
      >
      </FormulaPanelComp>
    </main>

    <footer>
      <el-button type="primary" class="is-blue-button" style="width: 120px;height: 35px;padding: 0;border-radius: 4px;" @click="submit">保存公式</el-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import FormulaPanelComp from '@/components/common/FormulaAndConditionComps/FormulaPanelComp.vue';
import { lightgoodsModuleStore } from '../../../store';
import { onMounted, ref } from 'vue';

const Condition4getFormulaProperty = {
  ProductID: lightgoodsModuleStore.value.schemeDesignManager.currentProduct.ProductID,
  SolutionID: lightgoodsModuleStore.value.schemeDesignManager.currentSolution.ID,
  UseModule: 102,
};

const oRightFormulaPanel = ref();

/** 获取公式数据  ignore：是否忽略验证直接获取数据 */
const getFormulaData = (ignore = false) => oRightFormulaPanel.value?.getFormulaData(ignore);

const submit = () => {
  const formulaData = getFormulaData();
  if (!formulaData) return;

  const temp = { ...formulaData };
  delete temp.ID;
  delete temp.Name;
  delete temp.ProductID;

  lightgoodsModuleStore.value.schemeDesignManager.saveFormulaData(temp); // 保存公式数据
};

defineExpose({ getFormulaData });

onMounted(() => {
  lightgoodsModuleStore.value.schemeDesignManager.oRightFormulaPanel = oRightFormulaPanel;
});
</script>

<style scoped lang='scss'>
.right-comp-wrap {
  padding-left: 40px;
  // white-space: nowrap;

  :deep(.mp-erp-common-comps-formula-set-panel-comp-left-content-wrap) {
    .tips-box {
      display: none;
    }
  }

  > footer {
    padding-bottom: 20px;
  }
}
</style>
