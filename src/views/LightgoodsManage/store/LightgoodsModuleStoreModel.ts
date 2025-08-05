import { ManageLightgoodsListClass } from '../LightgoodsManageListView/models/ManageLightgoodsListClass';
import { SolutionSchemeDesignManageClass } from '../PackagingSchemeDesign/models/SolutionSchemeDesignManageClass';
import { LightgoodsSolutionManageClass } from '../PackagingSchemeListView/models/LightgoodsSolutionManageClass';

export class LightgoodsModuleStoreModel {
  /** 产品列表管理 */
  productListManager = new ManageLightgoodsListClass()

  /** 产品方案列表管理 */
  solutionListManager: null | LightgoodsSolutionManageClass = null

  /** 产品方案具体设计管理 */
  schemeDesignManager: null | SolutionSchemeDesignManageClass = null
}
