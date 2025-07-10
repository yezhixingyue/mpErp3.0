import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { UseModuleEnum } from '@/pinia/modules/transformer/map/enum';
import { IProduct } from '@/pinia/modules/transformer/types';
import { goBackLastPage } from '@/router';

export class ProcessDecompositionClass {
  currentProduct: IProduct

  list = []

  loading = false

  propertyList = []

  item = null

  constructor(item: IProduct) {
    this.currentProduct = item;
  }

  async save(data) {
    const resp = await api.getCraftResolveSave(data);

    if (resp?.data?.isSuccess) {
      const isEdit = !!this.item;
      const title = isEdit ? '编辑成功' : '添加成功';

      const cb = () => {
        if (!isEdit) {
          this.currentProduct.CraftResolveCount += 1;
          this.list.push({ ...data, ID: resp.data.Data });
        } else {
          const i = this.list.findIndex(it => it.Constraint.ConstraintID === this.item.Constraint.ConstraintID);
          if (i > -1) {
            this.list.splice(i, 1, data);
          }
        }

        goBackLastPage();
      };
      MpMessage.success(title, '', cb, cb);
    }
  }

  async remove(constraintID: string) {
    const resp = await api.getCraftResolveRemove(this.currentProduct.ServerID, this.currentProduct.ID, constraintID);

    if (resp?.data?.isSuccess) {
      const cb = () => {
        const i = this.list.findIndex(it => it.Constraint.ConstraintID === constraintID);
        if (i > -1) {
          this.list.splice(i, 1);
          this.currentProduct.CraftResolveCount -= 1;
        }
      };
      MpMessage.success('删除成功', '', cb, cb);
    }
  }

  async getList() {
    this.loading = true;
    const resp = await api.getGetCraftResolveList(this.currentProduct.ServerID, this.currentProduct.ID);
    this.loading = false;

    if (resp?.data?.Status === 1000) {
      this.list = resp.data.Data;
    }
  }

  async getPropertyList() {
    const temp = {
      ProductID: this.currentProduct.ID,
      ServerID: this.currentProduct.ServerID,
      UseModule: UseModuleEnum.ProcessDecomposition,
    };

    const resp = await api.getPropertyList(temp).catch(() => null);
    if (resp?.data?.Status === 1000) {
      this.propertyList = resp.data.Data;
    }
  }
}
