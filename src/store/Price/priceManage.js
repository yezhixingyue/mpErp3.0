import api from '@/api/index';
import messageBox from '@/assets/js/utils/message';
import CommonClassType from '@/store/CommonClassType';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import PriceTableClass from '@/assets/js/TypeClass/PriceTableClass';
import { getIDFromListByNames } from '@/assets/js/utils/util';

const initConditon = {
  ProductClass: {
    First: '',
    Second: '',
  },
  Page: 1,
  PageSize: 20,
  KeyWords: '',
  ClassType: '',
  FieldType: 4,
  NoPrice: false,
};

export default {
  namespaced: true,
  state: {
    /** 请求列表数据的对象
     ---------------------------------------- */
    condition4PriceManageList: JSON.parse(JSON.stringify(initConditon)),
    PriceManageList: [], // 价格产品列表
    PriceManageListNumber: 0,
    needScrollToExtend: false,
    isPriceDataLoading: false,
    ApplyRangeTemplateList: [], // 适用范围数据列表
    ApplyRangeTemplateListFetched: false,
    MakeupControlTypeList: [
      { Name: '尺寸数量', ID: 0, UseModule: 35 },
      { Name: '拼版幅面', ID: 1, UseModule: 36 },
      { Name: '拼版规则', ID: 2, UseModule: 36 },
      { Name: '拼版算法', ID: 3, UseModule: 37 },
      { Name: '印刷次数', ID: 4, UseModule: 46 },
      { Name: '物料损耗', ID: 5, UseModule: 30 },
      { Name: '物料尺寸', ID: 6, UseModule: 30 },
    ],
    /** 拼版控制相关
     ---------------------------------------- */
    ProductFormulaPropertyList: [],
    ProductFormulasListJoinCalculate: [], // 带计算公式的产品公式列表
    curMakeupItemEditData: null,
    CuttingRuleList: [
      { Name: '最大数量', ID: 0 },
      { Name: '考虑通刀', ID: 1 },
      { Name: '方向一致', ID: 2 },
    ],
    PrintTimesRuleList: [
      { Name: '两倍纸张数量', ID: 0 },
      { Name: '纸张数量', ID: 1 },
    ],
    WastageRuleList: [
      { Name: '物料损耗设为', ID: 0 },
      { Name: '物料损耗增加', ID: 1 },
    ],
    WastageUnitTypeList: [
      { Name: '展开物料数量', ID: 1 },
      { Name: '印刷幅面物料数量', ID: 2 },
    ],
    WastageUnitList: [
      { Name: '%', ID: 0 },
      { Name: '张', ID: 1 },
    ],
    /** 子条件
    ----------------------------------------- */
    ChildConditionPropertyList: [],
    curChildConditionEditData: null,
    /**
     * 计算公式与子公式相关
     */
    curEditFormulaData: null,
    curEditSubFormulaData: null,
    curSubFormulaAddProperty: null,
    /** 单条价格条目相关
    ----------------------------------------- */
    curPriceItem: null,
    ProductCraftDataObj: null, // 工艺费产品及部件工艺数据汇总对象
    curCraftPriceItemData: null, // 正在设置工艺费用的单个工艺数据信息
    curQuotationSchemeData: null, // 当前正在编辑的报价方案数据
    curQuotationResultData: null, // 报价结果
    curSolutionItem: null, // 设置费用表用到的当前费用方案条目数据
    curEditPriceItemData: null, // 当前正在编辑的费用表数据信息
    PriceItemPropertyList: [], // 价格表 X Y轴属性选择列表数据
    PriceTableList: [],
    PriceTableConditionPropertyList: [],
    curPriceTableItemData: null, // 当前正在设置结果公式的价格表信息（或工艺费价格表信息）
    curPriceTableResultFormulaData: null, // 当前正在设置的结果公式数据信息
    ResultFormulaList: [], // 结果公式列表数据
    AllPricePropertyList: [], // 全部价格使用的属性列表数据
    // QuotationResultSolutionList: [], // 报价结果方案列表
    curNumberSwapData: null, // 当前正在编辑的数值转换信息
    NumberSwapList: [], // 数值转换数据列表
    QuotationResultPropertyList: [], // 报价结果条件列表
    PriceItemAxisPropertyList: [], // 轴数据列表公式
    MakeupCtrlConditionSetupPropertyList: [], // 拼版控制设置页面属性列表
  },
  getters: {
  },
  mutations: {
    /** 设置请求列表数据的对象信息
     ---------------------------------------- */
    setCondition4PriceManageList(state, [[key1, key2], value]) {
      if (!key2) state.condition4PriceManageList[key1] = value;
      else state.condition4PriceManageList[key1][key2] = value;
    },
    /** 设置请求列表数据 及 条目数量
     ---------------------------------------- */
    setPriceManageList(state, [list, count]) {
      state.PriceManageList = list;
      if (!count && count !== 0) return;
      state.PriceManageListNumber = count;
    },
    /** 设置列表数据是否正在加载中
     ---------------------------------------- */
    setIsPriceDataLoading(state, bool) {
      state.isPriceDataLoading = bool;
    },
    /** 清除列表数据请求信息
     ---------------------------------------- */
    clearCondition4PriceManageList(state) {
      state.condition4PriceManageList = JSON.parse(JSON.stringify(initConditon));
    },
    setApplyRangeTemplateList(state, [list, bool = true]) { // 设置适用范围列表
      state.ApplyRangeTemplateList = list;
      state.ApplyRangeTemplateListFetched = bool;
    },
    /** 添加 | 编辑 产品价格
     ---------------------------------------- */
    setPriceItemSave(state, [data, type]) {
      const t = state.PriceManageList.find(it => it.ID === data.ProductID);
      if (!t) return;
      if (type === 'edit') {
        const i = t.PriceList.findIndex(it => it.ID === data.ID);
        if (i > -1) t.PriceList.splice(i, 1, data);
      }
      if (type === 'add') {
        const MakeupList = state.MakeupControlTypeList.map(it => ({ Type: it.ID, Solution: null, PriceID: data.ID }));
        t.PriceList.unshift({ ...data, MakeupList });
      }
    },
    setPriceItemRemove(state, [ProductID, ID]) {
      const t = state.PriceManageList.find(it => it.ID === ProductID);
      if (t) {
        t.PriceList = t.PriceList.filter(it => it.ID !== ID);
      }
    },
    setPriceModeSetup(state, data) { // 设置报价方式
      if (!data) return;
      const { ID, ProductID, IsOwnPrice, BasePriceID, ReferencePriceList } = data;
      const t = state.PriceManageList.find(it => it.ID === ProductID);
      if (t) {
        const targetPrice = t.PriceList.find(it => it.ID === ID);
        if (targetPrice) {
          targetPrice.IsOwnPrice = IsOwnPrice;
          if (!IsOwnPrice) {
            targetPrice.BasePriceID = BasePriceID;
            targetPrice.ReferencePriceList = ReferencePriceList;
          }
        }
      }
    },
    /** 拼版控制相关
    ----------------------------------------- */
    setMakeupPropertyList(state, [ProductFormulaList]) {
      state.ProductFormulaPropertyList = Array.isArray(ProductFormulaList) ? ProductFormulaList : [];
    },
    setCurMakeupItemEditData(state, data) {
      state.curMakeupItemEditData = data;
    },
    setProductFormulasListJoinCalculate(state, [ProductFormulaList]) {
      state.ProductFormulasListJoinCalculate = Array.isArray(ProductFormulaList) ? ProductFormulaList : [];
    },
    /** 子条件
    ----------------------------------------- */
    setChildConditionPropertyList(state, list) {
      state.ChildConditionPropertyList = list;
    },
    setCurChildConditionEditData(state, data) {
      state.curChildConditionEditData = data;
    },
    /**
     * 计算公式与子公式相关
     */
    setCurEditFormulaData(state, data) {
      state.curEditFormulaData = data;
    },
    setCurEditSubFormulaData(state, data) {
      state.curEditSubFormulaData = data;
    },
    setCurSubFormulaAddProperty(state, data) { // 添加子公式选中的属性
      state.curSubFormulaAddProperty = data;
    },
    /** 单条价格条目相关
    ----------------------------------------- */
    // setPriceModeChange(state, data) {
    //   if (!data) return;
    //   const { ID, ProductID, IsOwnPrice, BasePriceID, ReferencePriceList } = data;
    // },
    setCurPriceItem(state, data) {
      state.curPriceItem = JSON.parse(JSON.stringify(data));
    },
    setPriceItemMakeupSolutionChange(state, [ProductID, PriceID, Type, SolutionID]) { // 设置拼版方案选择
      const t = state.PriceManageList.find(it => it.ID === ProductID);
      if (t) {
        const targetPrice = t.PriceList.find(it => it.ID === PriceID);
        if (targetPrice) {
          const targetType = targetPrice.MakeupList.find(it => it.Type === Type);
          if (targetType) targetType.Solution = { ID: SolutionID };
        }
      }
    },
    setProductCraftDataObj(state, itemData) {
      if (!itemData) return;
      const { ID } = itemData;
      if (!state.ProductCraftDataObj) state.ProductCraftDataObj = {};
      state.ProductCraftDataObj[ID] = itemData;
    },
    setCurCraftPriceItemData(state, data) {
      state.curCraftPriceItemData = data;
      if (!data.PriceID) return;
      // 下面是新增工艺费用组成或总费用而新获取到CraftPriceID时对原有CraftPriceID的数据更新操作
      const target = state.curPriceItem.CraftPriceList.find(it => it.CraftID === data.Craft.ID && (it.PartID === data.PartID || (!it.PartID && !data.PartID)));
      if (target) target.ID = data.Craft.CraftPriceID;
      const t = state.PriceManageList.find(it => it.ID === data.ProductID); // 目标产品
      if (t) {
        const t2 = t.PriceList.find(it => it.ID === data.PriceID); // 目标价格条目
        if (t2) {
          const t3 = t2.CraftPriceList.find(it => it.CraftID === data.Craft.ID && (it.PartID === data.PartID || (!it.PartID && !data.PartID)));
          if (t3) {
            t3.ID = data.Craft.CraftPriceID;
          }
        }
      }
    },
    setCurQuotationSchemeData(state, data) {
      state.curQuotationSchemeData = data;
    },
    setCurQuotationResultData(state, data) { // 当前正在编辑的报价结果条目信息
      state.curQuotationResultData = data;
    },
    setPriceItemSolutionListChange(state, [ProductID, PriceID, isEdit, data, itemID]) { // 报价方案添加编辑后的处理函数，用于同步修改列表数据
      const t = state.PriceManageList.find(it => it.ID === ProductID); // 目标产品
      if (t) {
        const t2 = t.PriceList.find(it => it.ID === PriceID); // 目标价格条目
        if (t2) {
          if (!isEdit) {
            t2.SolutionList.unshift({ ...data, ID: itemID });
            return;
          }
          const i = t2.SolutionList.findIndex(it => it.ID === itemID); // 目标方案索引
          if (i > -1) {
            t2.SolutionList.splice(i, 1, data);
          }
        }
      }
    },
    setPriceItemSolutionListRemove(state, [ProductID, PriceID, itemID]) { // 报价方案删除
      const t = state.PriceManageList.find(it => it.ID === ProductID); // 目标产品
      if (t) {
        const t2 = t.PriceList.find(it => it.ID === PriceID); // 目标价格条目
        if (t2) {
          t2.SolutionList = t2.SolutionList.filter(it => it.ID !== itemID);
        }
      }
    },
    setPriceItemSolutionItemRemove(state, [ProductID, PriceID, itemID, isQuotationPage, CraftPriceID]) { // 工艺费 - 价格表 顶部价格方案删除
      const t = state.PriceManageList.find(it => it.ID === ProductID); // 目标产品
      if (t) {
        const t2 = t.PriceList.find(it => it.ID === PriceID); // 目标价格条目
        if (t2) {
          if (isQuotationPage) {
            t2.PriceTableList = t2.PriceTableList.filter(it => it.ID !== itemID);
            state.curPriceItem.PriceTableList = state.curPriceItem.PriceTableList.filter(it => it.ID !== itemID);
          } else {
            const t3 = t2.CraftPriceList.find(it => it.ID === CraftPriceID);
            if (t3) {
              t3.PriceTableList = t3.PriceTableList.filter(it => it.ID !== itemID);
            }
            const curT3 = state.curPriceItem.CraftPriceList.find(it => it.ID === CraftPriceID);
            if (curT3) {
              curT3.PriceTableList = curT3.PriceTableList.filter(it => it.ID !== itemID);
            }
          }
        }
      }
    },
    setPriceItemSolutionItemChange(state, [ProductID, PriceID, itemData, itemID, isQuotationPage, CraftPriceID]) { // 工艺费 - 价格
      const t = state.PriceManageList.find(it => it.ID === ProductID); // 目标产品
      if (t) {
        const t2 = t.PriceList.find(it => it.ID === PriceID); // 目标价格条目
        if (t2) {
          const setFunc = list => {
            if (!itemData.ID) { // 添加
              list.push({ ...itemData, ID: itemID, TableNumber: 0 });
            } else { // 编辑
              const i = list.findIndex(it => it.ID === itemData.ID);
              if (i > -1) list.splice(i, 1, { ...list[i], ...itemData });
            }
          };
          if (isQuotationPage) {
            if (Array.isArray(t2.PriceTableList)) setFunc(t2.PriceTableList);
            else t2.PriceTableList = [{ ...itemData, ID: itemID, TableNumber: 0 }];
            if (Array.isArray(state.curPriceItem.PriceTableList)) setFunc(state.curPriceItem.PriceTableList);
            else state.curPriceItem.PriceTableList = [{ ...itemData, ID: itemID, TableNumber: 0 }];
          } else {
            const t3 = t2.CraftPriceList.find(it => it.ID === CraftPriceID);
            if (t3) {
              if (Array.isArray(t3.PriceTableList)) setFunc(t3.PriceTableList);
              else t3.PriceTableList = [{ ...itemData, ID: itemID, TableNumber: 0 }];
            } else {
              t2.CraftPriceList.push({
                ID: CraftPriceID,
                PriceTableList: [{ ...itemData, ID: itemID, TableNumber: 0 }],
                CraftID: state.curCraftPriceItemData.Craft.ID,
                PartID: state.curCraftPriceItemData.PartID,
              });
            }
            const curT3 = state.curPriceItem.CraftPriceList.find(it => it.ID === CraftPriceID);
            if (curT3) {
              if (Array.isArray(curT3.PriceTableList)) setFunc(curT3.PriceTableList);
              else curT3.PriceTableList = [{ ...itemData, ID: itemID, TableNumber: 0 }];
            } else {
              state.curPriceItem.CraftPriceList.push({
                ID: CraftPriceID,
                PriceTableList: [{ ...itemData, ID: itemID, TableNumber: 0 }],
                CraftID: state.curCraftPriceItemData.Craft.ID,
                PartID: state.curCraftPriceItemData.PartID,
              });
            }
          }
        }
      }
    },
    setCurSolutionItem(state, data) {
      state.curSolutionItem = data;
    },
    setCurEditPriceItemData(state, data) {
      state.curEditPriceItemData = data;
    },
    setPriceItemPropertyList(state, list) {
      state.PriceItemPropertyList = list;
    },
    setPriceTableList(state, list) { // 设置价格表数据 工艺费和价格表通用
      state.PriceTableList = list;
    },
    setPriceTableListItemChange(state, [data, ID, isQuotationPage, ProductID, CraftPriceID]) { // 价格表编辑 | 添加
      if (!data.ID) { // 新增
        const temp = new PriceTableClass({ ...data, ID });
        state.PriceTableList.unshift(temp);
        // 下面为在解决方案下方表格添加时对产品数据中的TableNumber进行修改 对其进行+1操作
        const target1 = state.PriceManageList.find(it => it.ID === ProductID); // 目标产品
        if (target1) {
          const target2 = target1.PriceList.find(it => it.ID === data.PriceID); // 目标价格条目
          const setFunc = list => {
            const _t = list.find(it => it.ID === data.SolutionID);
            if (_t) _t.TableNumber += 1;
          };
          if (isQuotationPage) setFunc(target2.PriceTableList);
          if (isQuotationPage) setFunc(state.curPriceItem.PriceTableList);
          else {
            const target3 = target2.CraftPriceList.find(it => it.ID === CraftPriceID);
            const curPriceItemTarget3 = state.curPriceItem.CraftPriceList.find(it => it.ID === CraftPriceID);
            if (target3) setFunc(target3.PriceTableList);
            if (curPriceItemTarget3) setFunc(curPriceItemTarget3.PriceTableList);
          }
        }
      } else { // 编辑
        const t = state.PriceTableList.find(it => it.ID === ID);
        if (t) {
          const { XAxis, YAxis, DataList, Unit, PriceList } = data;
          t.XAxis = XAxis;
          t.YAxis = YAxis;
          t.DataList = DataList;
          t.Unit = Unit;
          t.PriceList = PriceList;
        }
      }
    },
    setPriceTableListItemRemove(state, [data, isQuotationPage, ProductID, CraftPriceID]) { // 价格表删除
      state.PriceTableList = state.PriceTableList.filter(it => it.ID !== data.ID);
      // 下面为在解决方案下方表格删除时对产品数据中的TableNumber进行修改 对其进行-1操作
      const target1 = state.PriceManageList.find(it => it.ID === ProductID); // 目标产品
      if (target1) {
        const target2 = target1.PriceList.find(it => it.ID === data.PriceID); // 目标价格条目
        const setFunc = list => {
          const _t = list.find(it => it.ID === data.SolutionID);
          if (_t) _t.TableNumber -= 1;
        };
        if (isQuotationPage) setFunc(target2.PriceTableList);
        if (isQuotationPage) setFunc(state.curPriceItem.PriceTableList);
        else {
          const target3 = target2.CraftPriceList.find(it => it.ID === CraftPriceID);
          const curPriceItemTarget3 = state.curPriceItem.find(it => it.ID === CraftPriceID);
          if (target3) setFunc(target3.PriceTableList);
          if (curPriceItemTarget3) setFunc(curPriceItemTarget3.PriceTableList);
        }
      }
    },
    setPriceTableListItemCondition(state, { TableID, Constraint, Priority }) {
      const t = state.PriceTableList.find(it => it.ID === TableID);
      if (t) {
        t.Constraint = Constraint;
        t.Priority = Priority;
      }
    },
    setPriceTableConditionPropertyList(state, AxisPropertyList) { // 价格表条件属性列表
      state.PriceItemAxisPropertyList = Array.isArray(AxisPropertyList) ? AxisPropertyList : [];
    },
    setCurPriceTableItemResultFormulaInfo(state, [tableData, formulaData]) { // 设置结果公式所需的相关数据(价格表数据与公式编辑数据)
      state.curPriceTableItemData = tableData;
      state.curPriceTableResultFormulaData = formulaData;
    },
    setResultFormulaList(state, list) { // 设置结果公式列表数据
      state.ResultFormulaList = list;
    },
    setResultFormulaItemChange(state, [item, ID, isAllCostPage]) { // 编辑或添加结果公式
      if (!item) return;
      if (!isAllCostPage) {
        const t = state.PriceTableList.find(it => it.PriceID === item.PriceID && it.ID === item.TableID);
        if (t) { // 对列表中数据进行修改 以保证同步最新
          if (!t.FormulaList) t.FormulaList = [];
          if (!item.ID) { // 新增
            t.FormulaList.unshift({ ...item, ID });
          } else { // 编辑
            const i = t.FormulaList.findIndex(it => it.ID === ID);
            if (i > -1) {
              const _item = { ...t.FormulaList[i], ...item };
              t.FormulaList.splice(i, 1, _item);
            }
          }
        }
      } else {
        const { ProductID, PriceID, CraftPriceID } = item;
        const t = state.PriceManageList.find(it => it.ID === ProductID);
        if (t) {
          const targetPrice = t.PriceList.find(it => it.ID === PriceID);
          if (targetPrice) {
            const targetCraftPrice1 = targetPrice.CraftPriceList.find(it => it.ID === CraftPriceID);
            const targetCraftPrice2 = state.curPriceItem.CraftPriceList.find(it => it.ID === CraftPriceID);
            if (targetCraftPrice1 && targetCraftPrice2) {
              if (!item.ID) {
                if (!targetCraftPrice1.FormulaList) targetCraftPrice1.FormulaList = [];
                if (!targetCraftPrice2.FormulaList) targetCraftPrice2.FormulaList = [];
                targetCraftPrice1.FormulaList.unshift({ ...item, ID });
                targetCraftPrice2.FormulaList.unshift({ ...item, ID });
              } else {
                const i1 = targetCraftPrice1.FormulaList.findIndex(it => it.ID === item.ID);
                if (i1 > -1) {
                  const _item = { ...targetCraftPrice1.FormulaList[i1], ...item };
                  targetCraftPrice1.FormulaList.splice(i1, 1, _item);
                }
                const i2 = targetCraftPrice2.FormulaList.findIndex(it => it.ID === item.ID);
                if (i2 > -1) {
                  const _item = { ...targetCraftPrice2.FormulaList[i2], ...item };
                  targetCraftPrice2.FormulaList.splice(i2, 1, _item);
                }
              }
            }
          }
        }
      }

      if (!item.ID) { // 新增
        state.ResultFormulaList.unshift({ ...item, ID });
      } else { // 编辑
        const i = state.ResultFormulaList.findIndex(it => it.ID === ID);
        if (i > -1) {
          const _item = { ...state.ResultFormulaList[i], ...item };
          state.ResultFormulaList.splice(i, 1, _item);
        }
      }
    },
    setResultFormulaItemRemove(state, [item, isAllCostPage]) { // 删除结果公式 工艺费结果公式、工艺总费用、价格表等3个共用
      const t = state.PriceTableList.find(it => it.PriceID === item.PriceID && it.ID === item.TableID);
      if (t && Array.isArray(t.FormulaList)) { // 对列表中数据进行修改 以保证同步最新
        t.FormulaList = t.FormulaList.filter(it => it.ID !== item.ID);
      }
      state.ResultFormulaList = state.ResultFormulaList.filter(it => it.ID !== item.ID);
      if (isAllCostPage) {
        const { ProductID, PriceID, CraftPriceID } = item;
        const targetProduct = state.PriceManageList.find(it => it.ID === ProductID);
        if (targetProduct) {
          const targetPrice = targetProduct.PriceList.find(it => it.ID === PriceID);
          if (targetPrice) {
            const targetCraftPrice = targetPrice.CraftPriceList.find(it => it.ID === CraftPriceID);
            if (targetCraftPrice) {
              targetCraftPrice.FormulaList = targetCraftPrice.FormulaList.filter(it => it.ID !== item.ID);
            }
          }
          if (state.curPriceItem?.CraftPriceList) {
            const targetCraftPrice = state.curPriceItem.CraftPriceList.find(it => it.ID === CraftPriceID);
            if (targetCraftPrice) {
              targetCraftPrice.FormulaList = targetCraftPrice.FormulaList.filter(it => it.ID !== item.ID);
            }
          }
        }
      }
    },
    // setQuotationResultSolutionList(state, list) { // 设置报价结果中需要用到的方案列表
    //   state.QuotationResultSolutionList = list;
    // },
    setPriceResultItemChange(state, [item, ID, ProductID, PriceID]) {
      const t = state.PriceManageList.find(it => it.ID === ProductID);
      if (t) {
        const _price = t.PriceList.find(it => it.ID === PriceID);
        if (_price) {
          if (!item.ID) {
            if (!_price.ResultList) _price.ResultList = [];
            _price.ResultList.unshift({ ...item, ID });
            if (!state.curPriceItem.ResultList) state.curPriceItem.ResultList = [];
            state.curPriceItem.ResultList.unshift({ ...item, ID });
          } else { // 编辑
            const i = _price.ResultList.findIndex(it => it.ID === ID);
            if (i > -1) _price.ResultList.splice(i, 1, item);
            const i2 = state.curPriceItem.ResultList.findIndex(it => it.ID === ID);
            if (i2 > -1) state.curPriceItem.ResultList.splice(i, 1, item);
          }
        }
      }
    },
    setPriceResultItemRemove(state, [ID, ProductID, PriceID]) {
      const t = state.PriceManageList.find(it => it.ID === ProductID);
      if (t) {
        const _price = t.PriceList.find(it => it.ID === PriceID);
        if (_price) {
          _price.ResultList = _price.ResultList.filter(it => it.ID !== ID);
          state.curPriceItem.ResultList = state.curPriceItem.ResultList.filter(it => it.ID !== ID);
        }
      }
    },
    setAllPricePropertyList(state, list) {
      state.AllPricePropertyList = list;
    },
    setCurNumberSwapData(state, data) { // 当前正在编辑的数值转换条目信息
      state.curNumberSwapData = data;
    },
    setNumberSwapList(state, list) { // 设置数值转换列表
      state.NumberSwapList = list;
    },
    setNumberSwapRemove(state, ID) { // 数值转换删除
      state.NumberSwapList = state.NumberSwapList.filter(it => it.ID !== ID);
    },
    setNumberSwapItemChange(state, [item, ID]) {
      if (!item.ID) {
        state.NumberSwapList.unshift({ ...item, ID });
      } else {
        const i = state.NumberSwapList.findIndex(it => it.ID === ID);
        if (i > -1) state.NumberSwapList.splice(i, 1, { ...state.NumberSwapList[i], ...item });
      }
    },
    setQuotationResultPropertyList(state, list) { // 设置报价结果条件列表
      state.QuotationResultPropertyList = list;
    },
    setNeedScrollToExtend(state, bool) { // 拷贝价格后标记重新获取数据后需滚动至价格拷贝处
      state.needScrollToExtend = bool;
    },
    setMakeupCtrlConditionSetupPropertyList(state, list) {
      state.MakeupCtrlConditionSetupPropertyList = list;
    },
  },
  actions: {
    async getPriceManageList({ state, commit }, page = 1) { // 获取产品列表数据
      commit('setCondition4PriceManageList', [['Page', ''], page]);
      commit('setPriceManageList', [[], undefined]);
      const _obj = CommonClassType.filter(state.condition4PriceManageList);
      commit('setIsPriceDataLoading', true);
      let key = true;
      const res = await api.getManageProductLists(_obj).catch(() => { key = false; });
      commit('setIsPriceDataLoading', false);
      if (key && res && res.status === 200 && res.data.Status === 1000) {
        commit('setPriceManageList', [res.data.Data, res.data.DataNumber]);
      }
    },
    async getPriceItemRemove({ commit }, { ProductID, ID }) { // 价格删除
      const resp = await api.getProductPriceRemove(ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setPriceItemRemove', [ProductID, ID]);
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
    async getPriceItemCopy({ commit }, [data, callback]) { // 拷贝价格条目
      const resp = await api.getProductPriceCopy(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setNeedScrollToExtend', true);
          if (callback) callback();
        };
        messageBox.successSingle('拷贝成功', cb, cb);
      }
    },
    async getApplyRangeTemplateList({ commit, state }) { // 获取范围模板列表
      if (state.ApplyRangeTemplateListFetched) return;
      const resp = await api.getApplyRangeTemplateList().catch(() => {});
      if (resp && resp.data.Status === 1000) {
        commit('setApplyRangeTemplateList', [resp.data.Data]);
      }
    },
    async getPriceModeSetup({ commit }, [data, callback]) { // 设置报价方式
      const temp = { ...data };
      if (temp.IsOwnPrice) {
        delete temp.BasePriceID;
        delete temp.ReferencePriceList;
      }
      const resp = await api.getPriceModeSetup(temp).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setPriceModeSetup', temp);
          if (callback) callback();
        };
        messageBox.successSingle('保存成功', cb, cb);
      }
    },
    async getMakeupPropertyList({ commit }, ProductID) { // 获取拼版控制左侧弹窗属性列表数据
      commit('setMakeupPropertyList', []);
      const [ProductFormulaResp] = await Promise.all([
        api.getProductFormulasList(ProductID).catch(() => {}), // 设置尺寸数量
      ]);
      const ProductFormulaList = ProductFormulaResp && ProductFormulaResp.data.Status === 1000 ? ProductFormulaResp.data.Data : [];
      if (ProductFormulaResp && ProductFormulaResp.data.Status === 1000) {
        commit('setMakeupPropertyList', [ProductFormulaList]);
        return true;
      }
      commit('setMakeupPropertyList', [ProductFormulaList]);
      return false;
    },
    async getProductFormulasListJoinCalculate({ commit }, ProductID) { // 物料损耗公式列表数据
      commit('setProductFormulasListJoinCalculate', []);
      const [ProductFormulaResp] = await Promise.all([
        api.getProductFormulasList(ProductID, true).catch(() => {}), // 设置尺寸数量
      ]);
      const ProductFormulaList = ProductFormulaResp && ProductFormulaResp.data.Status === 1000 ? ProductFormulaResp.data.Data : [];
      if (ProductFormulaResp && ProductFormulaResp.data.Status === 1000) {
        commit('setProductFormulasListJoinCalculate', [ProductFormulaList]);
        return true;
      }
      commit('setProductFormulasListJoinCalculate', [ProductFormulaList]);
      return false;
    },
    async getChildConditionPropertyList({ commit }, PartIDs) {
      commit('setChildConditionPropertyList', []);
      const respList = await Promise.all(PartIDs.map(PartIDObj => PropertyClass.getPropertyList({ UseModule: 27, ...PartIDObj })));
      if (respList) {
        commit('setChildConditionPropertyList', respList);
      }
    },
    async getProductCraftData({ commit, rootState }, ProductID) { // 获取产品及部件工艺信息
      const dataType = ['Craft', 'Part'];
      const List = getIDFromListByNames(dataType, rootState.productManage.ProductModuleKeyIDList);
      const _temp = { ID: ProductID, List };
      const resp = await api.getProductModuleData(_temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        commit('setProductCraftDataObj', resp.data.Data);
        return resp.data.Data;
      }
      return null;
    },
    async getPriceTablePropertyLists({ commit }, [ProductID, PartID, GroupID, PriceID, CraftID]) { // 获取价格表条件使用属性列表 及 价格表X Y轴选择属性列表数据
      commit('setPriceTableConditionPropertyList', []);
      const list = await PropertyClass.getPropertyList({ UseModule: 31, ProductID, PartID, GroupID, PriceID, CraftID });
      commit('setPriceTableConditionPropertyList', list);
    },
    async getQuotationResultPropertyList({ commit }, [ProductID, PriceID]) { // 获取工艺总费用表 条件属性列表
      commit('setQuotationResultPropertyList', []);
      const list = await PropertyClass.getPropertyList({ UseModule: 35, ProductID, PriceID });
      if (list) {
        commit('setQuotationResultPropertyList', list);
      }
    },
    async getPriceTableList({ commit }, SolutionID) {
      commit('setPriceTableList', []);
      const resp = await api.getPriceTableList(SolutionID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        commit('setPriceTableList', resp.data.Data);
      }
    },
    async getResultFormulaList({ commit }, data) { // 获取结果公式列表数据
      commit('setResultFormulaList', []);
      const resp = await api.getFormulaList(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        commit('setResultFormulaList', resp.data.Data);
      }
    },
    async getAllPricePropertyList({ state, commit }, ProductID) { // 获取工艺总费用表 条件属性列表
      if (state.AllPricePropertyList.length > 0 && state.AllPricePropertyList[0].Product?.ID === ProductID) return;
      commit('setAllPricePropertyList', []);
      const list = await PropertyClass.getPropertyList({ UseModule: 255, ProductID });
      if (list) {
        commit('setAllPricePropertyList', list);
      }
    },
    async getNumberSwapList({ commit }, priceID) {
      commit('setNumberSwapList', []);
      const resp = await api.getNumberSwapList(priceID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        commit('setNumberSwapList', resp.data.Data || []);
      }
    },
    async getCraftPriceIDAndSetToCurItem({ state, commit }, PriceID) {
      if (!state.curCraftPriceItemData) return;
      const { Craft, PartID, ProductID } = state.curCraftPriceItemData;
      const resp = await api.getCraftPriceTagID(ProductID, PriceID, Craft.ID, PartID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const CraftPriceID = resp.data.Data;
        const temp = { ...state.curCraftPriceItemData, Craft: { ...Craft, CraftPriceID }, PriceID };
        commit('setCurCraftPriceItemData', temp);
        return;
      }
      commit('setCurCraftPriceItemData', null);
    },
  },
};
