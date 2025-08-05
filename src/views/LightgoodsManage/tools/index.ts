import { lightgoodsModuleStore } from '../store';
import { ILightgoodsProductSolution } from '../types/types';
import { PropertyClass } from '@/components/common/mpzj-sell-lib/lib';

export const getConditionObj = (row: ILightgoodsProductSolution) => {
  if (!row.Constraint) return null;

  const [Constraint, conditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(
    row.Constraint,
    lightgoodsModuleStore.value.solutionListManager.conditionPropertyList,
  );

  return { ...row, Constraint, conditionText, FilterTypeText: row.Constraint && row.Constraint.FilterType === 1 ? '满足所有' : '满足任一' };
};
