import api from '@/api';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import { ILightgoodsProduct, ILightgoodsProductSolution } from '../../types/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';

export class LightgoodsSolutionManageClass {
  currentProduct: ILightgoodsProduct

  solutionList: ILightgoodsProductSolution[] = []

  loading = false

  constructor(product: ILightgoodsProduct) {
    this.currentProduct = product;
  }

  async getSolutionList() {
    this.loading = true;
    const resp = await api.lightgoodsApis.getLightgoodsSulotionList(this.currentProduct.ProductID);
    this.loading = false;

    if (resp?.data.isSuccess) {
      this.solutionList = resp.data.Data;
    }
  }

  async saveSolution(data: Pick<ILightgoodsProductSolution, 'ID' | 'Name' | 'Priority'>) {
    const resp = await api.lightgoodsApis.getLightgoodsSulotionSave({ ...data, ProductID: this.currentProduct.ProductID });
    if (resp?.data.isSuccess) {
      if (data.ID) { // 编辑
        const t = this.solutionList.find(it => it.ID === data.ID);
        if (t) {
          t.Name = data.Name;
          t.Priority = data.Priority;
        }
      } else { // 新增
        const temp: ILightgoodsProductSolution = {
          ID: resp.data.Data,
          Name: data.Name,
          ProductID: this.currentProduct.ProductID,
          Priority: data.Priority,
          Constraint: null,
          InputContent: '',
          Operator: null,
          DataList: [],
          Formula: null,
        };
        this.solutionList.unshift(temp);
        this.currentProduct.SolutionNumber += 1;
      }

      return true;
    }

    return false;
  }

  async removeSolution(row: ILightgoodsProductSolution) {
    const resp = await api.lightgoodsApis.getLightgoodsSolutionRemove(row.ID);
    if (resp?.data.isSuccess) {
      const cb = () => {
        this.solutionList = this.solutionList.filter(it => it.ID !== row.ID);
        this.currentProduct.SolutionNumber -= 1;
      };

      MpMessage.success('删除成功', undefined, cb, cb);
    }
  }

  conditionPropertyList = []

  async getConditionPropertyList() {
    const data = await PropertyClass.getPropertyList({ UseModule: 53, ProductID: this.currentProduct.ProductID });
    this.conditionPropertyList = data || [];
  }
}
