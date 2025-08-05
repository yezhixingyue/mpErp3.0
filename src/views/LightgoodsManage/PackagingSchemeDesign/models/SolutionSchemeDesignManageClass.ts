import api from '@/api';
import { ILightgoodsProduct, ILightgoodsProductSolution, ILightgoodsProductSolutionTableItem } from '../../types/types';
import { TLeftRuleFormType } from './LeftRuleForm';
import { MpMessage } from '@/assets/js/utils/MpMessage';

/** 产品打包方案具体设计 */
export class SolutionSchemeDesignManageClass {
  currentProduct: ILightgoodsProduct

  currentSolution: ILightgoodsProductSolution

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oRightFormulaPanel: any

  /** 公式内容 */
  private _FormulaContent = ''

  get FormulaContent() {
    return this._FormulaContent;
  }

  setFormulaContent(Formula) {
    this._FormulaContent = (Formula && typeof Formula === 'object' && 'Content' in Formula)
      ? (Formula as { Content?: string }).Content || ''
      : '';
  }

  constructor(product: ILightgoodsProduct, solution: ILightgoodsProductSolution) {
    this.currentProduct = product;
    this.currentSolution = solution;

    this.setFormulaContent(solution.Formula);
  }

  async saveTableData(data: ReturnType<TLeftRuleFormType['getParams']>) {
    const resp = await api.lightgoodsApis.getLightgoodsSolutionTableDataSave(data);

    if (resp?.data.isSuccess) {
      const cb = () => {
        if (!this.currentSolution.DataList || this.currentSolution.DataList.length === 0) { // 此时（第一次创建表数据）重新获取右侧属性列表数据
          this.oRightFormulaPanel.getPropertyListAfresh();
        }

        this.currentSolution.Constraint = data.Constraint;
        this.currentSolution.DataList = data.DataList as ILightgoodsProductSolutionTableItem[];
        this.currentSolution.InputContent = data.InputContent;
        this.currentSolution.Operator = data.Operator;
      };

      MpMessage.success('表数据保存成功', undefined, cb, cb);
    }
  }

  async saveFormulaData(Formula: ILightgoodsProductSolution['Formula']) {
    const temp = {
      ID: this.currentSolution.ID,
      ProductID: this.currentProduct.ProductID,
      Formula,
    };
    const resp = await api.lightgoodsApis.getLightgoodsSolutionFormulaSave(temp);

    if (resp?.data.isSuccess) {
      const cb = () => {
        this.currentSolution.Formula = Formula;
        this.setFormulaContent(Formula);
      };

      MpMessage.success('公式保存成功', undefined, cb, cb);
    }
  }
}
