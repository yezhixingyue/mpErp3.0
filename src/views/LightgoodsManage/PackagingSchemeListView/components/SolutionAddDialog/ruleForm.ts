import { ILightgoodsProductSolution } from '@/views/LightgoodsManage/types/types';

export class RuleForm {
  ID: string

  Name: string

  Priority: string | number

  constructor(item: ILightgoodsProductSolution | null) {
    this.ID = item?.ID || '';
    this.Name = item?.Name || '';
    this.Priority = item ? item.Priority : '';
  }
}
