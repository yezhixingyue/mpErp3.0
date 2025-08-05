import { ILightgoodsProductSolution } from '@/views/LightgoodsManage/types/types';
import { ref } from 'vue';

/** 打包方案新增|编辑 */
export const useSolutionSave = () => {
  const solutionSaveState = ref({
    visible: false,
    currentSolution: null as null | ILightgoodsProductSolution,
  });

  const onSolutionSaveClick = (row: null | ILightgoodsProductSolution) => {
    solutionSaveState.value.currentSolution = row;
    solutionSaveState.value.visible = true;
  };

  return { solutionSaveState, onSolutionSaveClick };
};
