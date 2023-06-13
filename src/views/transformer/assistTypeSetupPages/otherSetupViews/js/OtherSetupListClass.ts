import api from '@/api';
import { TransformerListPageDataPlainType } from '@/pinia/modules/transformer/TransformerListPageDataClass';
import { PropertyClass } from '@/components/common/mpzj-sell-lib/lib';
import { UseModuleEnum } from '@/pinia/modules/transformer/map/enum';
import { IPropertyType } from '@/pinia/modules/transformer/map/types';
import { IWorkTimesRightType } from '../../workTimesMap/WorkTimesMapClass';
import { FeedEdgeSetupTypeClass } from './TypeClass/FeedEdgeSetupTypeClass';
import { MillingSetupTypeClass } from './TypeClass/MillingSetupTypeClass';
import { MoveSetupTypeClass } from './TypeClass/MoveSetupTypeClass';
import { SheetIndexTypeClass } from './TypeClass/SheetIndexTypeClass';
import { IListPageTableList } from '@/pinia/modules/transformer';
import { GeneralMapItemClass } from '@/pinia/modules/transformer/map/GeneralMapItemClass';

export class OtherSetupListClass {
  ServerID: string

  UseModule = UseModuleEnum.otherSetupGeneral

  /** 当前页面数据  TransformerListPageDataClass */
  curPageData: null | TransformerListPageDataPlainType = null

  PropertyList: IPropertyType[] = []

  FormulaList: IWorkTimesRightType[] = []

  constructor(data: TransformerListPageDataPlainType) {
    this.ServerID = data.ServerID;
    this.curPageData = data;

    this.init();
  }

  DisplayPageTableList: IListPageTableList[] = []

  curSetupTableData: null | IListPageTableList = null

  curSetupTableDataRowItem: null | GeneralMapItemClass = null

  setCurTableData(data, item) {
    this.curSetupTableData = data;
    this.curSetupTableDataRowItem = item;
  }

  private async init() {
    await Promise.all([this.getPropertyList(), this.getFormulaList()]);

    this.DisplayPageTableList = [
      {
        data: new SheetIndexTypeClass(this.curPageData, this.PropertyList),
        title: '帖标',
        buttonContent: '+  帖标设置',
        remark: '注：仅匹配一条，优先级数字越小，越优先匹配',
        rightText: '则',
        operationTitle: '帖标设置',
      },
      {
        data: new MoveSetupTypeClass(this.curPageData, this.PropertyList),
        title: '爬移',
        buttonContent: '+  爬移设置',
        remark: '注：仅匹配一条，优先级数字越小，越优先匹配',
        rightText: '则',
        operationTitle: '爬移设置',
      },
      {
        data: new FeedEdgeSetupTypeClass(this.curPageData, this.PropertyList),
        title: '叼口',
        buttonContent: '+  叼口设置',
        remark: '注：仅匹配一条，优先级数字越小，越优先匹配',
        rightText: '则',
        operationTitle: '叼口设置',
      },
      {
        data: new MillingSetupTypeClass(this.curPageData, this.PropertyList),
        title: '铣背',
        buttonContent: '+  铣背设置',
        remark: '注：仅匹配一条，优先级数字越小，越优先匹配',
        rightText: '则',
        operationTitle: '铣背设置',
      },
    ];
  }

  /** 获取条件属性列表 */
  private async getPropertyList() {
    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const PartID = this.curPageData?.curPart?.ID || undefined;

    const temp = {
      ServerID: this.ServerID,
      UseModule: this.UseModule,
      ProductID,
      PartID,
    };
    const resp = await PropertyClass.getPropertyList(temp, api.getPropertyList).catch(() => null);
    this.PropertyList = resp || [];
  }

  /** 获取公式和子公式列表 */
  private async getFormulaList() {
    const ProductID = this.curPageData?.curEditItem?.ID || '';
    const PartID = this.curPageData?.curPart?.ID || null;

    const resp = await api.getProductFormulasList(ProductID).catch(() => null);
    const list = resp?.data.Status === 1000 ? resp.data.Data : [];

    this.FormulaList = PropertyClass.filterProductFormulasList(list, PartID);
  }
}
