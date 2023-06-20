import { TransformerListPageDataPlainType } from '@/pinia/modules/transformer/TransformerListPageDataClass';
import { GeneralMapDataClass } from '@/pinia/modules/transformer/map/GeneralMapDataClass';
import { IPropertyType } from '@/pinia/modules/transformer/map/types';

export abstract class OtherSetupGeneralTypeClass extends GeneralMapDataClass {
  noLongerGetRightList = true; // 不再获取右侧列表数据

  constructor(data: string | TransformerListPageDataPlainType, PropertyList: IPropertyType[]) {
    super(data);

    this.rightDataList = PropertyList;
  }
}
