<template>
  <section class="mp-erp-price-module-price-table-common-set-page-wrap" v-if="PriceTableData">
    <header>
      <div class="title-box">
        <h2>{{$route.params.name}}</h2>
        <span>价格名称：{{curPriceItem ? curPriceItem.Name : ''}}</span>
        <span v-if="!isQuotationPage && curCraftPriceItemData">设置工艺：{{curCraftPriceItemData.Craft.Name}}</span>
      </div>
      <div class="import">
        <span class="mp-common-title-wrap black f-15">{{curSolutionItem.ShowName}}</span>
        <div>
          <SpanUpload @afterUpload='handleExcelImport' :paramsArray='paramsArray' accept='.xls' />
          <el-tooltip effect="light" popper-class='common-property-condition-text-tips-box' placement="bottom-start" :visible-arrow='false'>
            <div slot="content">
              <template v-if="Array.isArray(PriceTableData._ConditionText)">
                <p class="if-box"><span class="is-origin">如果</span> {{FilterTypeText}}：</p>
                <p v-for="(it, i) in PriceTableData._ConditionText" :key="it.name + 'tips' + i">
                  <span v-if="i > 0" class="type">{{PriceTableData.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                  <span class="name">{{it.name}}</span>
                  <span class="is-origin">{{it.operator}}</span>
                  <span class="val">{{it.val}}</span>
                  <span v-if="i === PriceTableData._ConditionText.length - 1" style="margin-left:2px"> 。</span>
                  <span v-else style="margin-left:2px">；</span>
                </p>
              </template>
              <p v-else>{{PriceTableData._ConditionText}}</p>
              <p>时使用此表</p>
            </div>
            <div class="common-property-condition-text-content-box condition">
              <template v-if="Array.isArray(PriceTableData._ConditionText)">
                <p class="if-box"><span class="is-origin">如果</span> {{FilterTypeText}}</p>
                <p v-for="(it, i) in PriceTableData._ConditionText" :key="it.name + 'content' + i">
                  <span v-if="i > 0" class="type">{{PriceTableData.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                  <span>{{it.name}}</span>
                  <span>{{it.operator}}</span>
                  <span>{{it.val}}</span>
                </p>
              </template>
              <p v-else>{{PriceTableData._ConditionText}}</p>
              <p>时使用此表</p>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="setup">
        <ul class="l">
          <li>
            <span class="label">横轴：</span>
            <span class="blue-span" @click="onAxisPropSetupClick('X')" :class="{disabled: loading}">设置</span>
            <span class="content">{{XAxisProp?XAxisProp.DisplayContent.replace(/\[|\]/g, ""):'未设置'}}</span>
            <span class="blue-span" @click="onAxisDataSetupClick('X')" :class="{disabled: !XAxisProp}">设置数据</span>
            <el-checkbox :disabled='!XAxisProp || XAxisProp.ValueType !== 0 || PriceTableData.YAxis.IsCumsum'
             v-model="PriceTableData.XAxis.IsCumsum">分段累加</el-checkbox>
          </li>
          <li>
            <span class="label">竖轴：</span>
            <span class="blue-span" @click="onAxisPropSetupClick('Y')" :class="{disabled: loading}">设置</span>
            <span class="content">{{YAxisProp?YAxisProp.DisplayContent.replace(/\[|\]/g, ""):'未设置'}}</span>
            <span class="blue-span" @click="onAxisDataSetupClick('Y')" :class="{disabled: !YAxisProp}">设置数据</span>
            <el-checkbox :disabled='!YAxisProp || YAxisProp.ValueType !== 0 || PriceTableData.XAxis.IsCumsum'
             v-model="PriceTableData.YAxis.IsCumsum">分段累加</el-checkbox>
          </li>
        </ul>
        <div class="r">
          <span class="label">数据：</span>
          <span class="blue-span" @click="onTableItemDataSetClick">设置</span>
          <div>
            <p>数据单位：{{FormDataUnit || '无'}}</p>
            <p>其他数据：{{OtherDataUnit || '未设置'}}</p>
          </div>
        </div>
      </div>
    </header>
    <main>
      <!-- 横竖轴属性设置 -->
      <FormulaPanelElementSelectDialog
       :visible.sync='AxisPropVisible'
       :selectedElementIDs='selectedElementIDs'
       :list='PriceItemAxisPropertyList'
       :title='AxisTitle'
       freeText='不限'
       showConstant
       @submit='onAxisPropSelect' />

      <!-- 横竖轴选中属性的数据设置 -->
      <AxisPropDataSetDialog
      :visible.sync="AxisPropDataSetVisible"
      :saveData='PriceTableData'
      :type='curAxisPropSetType'
      @submit='onAxisDataSetSubmit' />

      <!-- 表格单元项数据设置 如增量、起步价设置等 -->
      <FormItemOptionDataSetDialog
      :visible.sync="FormItemOptionSetVisible"
      :saveData='PriceTableData'
      @submit="onFormItemOptionDataSubmit" />

      <!-- 表体 -->
      <!-- <el-scrollbar wrap-class="scrollbar-wrapper"> -->
      <TableContentComp
       v-if="PriceTableData"
       :tableData='PriceTableData'
       :XAxisList='XAxisList'
       :YAxisList='YAxisList'
       @itemInput='onPriceItemInput' />
      <!-- </el-scrollbar> -->
      <p class="submit">
        <el-button type="primary" size="small" :disabled='disabled' @click="onTableSubmit" class="blue-full-color-btn-styles is-blue-button">保存表数据</el-button>
      </p>

      <!-- 结果公式列表 -->
      <ResultFormulaTableCom
       v-if="PriceTableData && PriceTableData.ID" @setup='onFormulaSetupClick' @remove="onFormulaRemove"
       :fetchFormulaListData='fetchFormulaListData' :initFetch='initFetchResultFormula' />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import PriceTableClass from '@/assets/js/TypeClass/PriceTableClass';
import FormulaPanelElementSelectDialog from '@/components/common/FormulaAndConditionComps/FormulaPanelElementSelectDialog.vue';
import AxisPropDataSetDialog from '@/components/PriceComps/PriceTableItem/AxisPropDataSetDialog.vue';
import FormItemOptionDataSetDialog from '@/components/PriceComps/PriceTableItem/FormItemOptionDataSetDialog.vue';
import TableContentComp from '@/components/PriceComps/PriceTableItem/TableContentComp.vue';
import ResultFormulaTableCom from '@/components/PriceComps/PriceTableItem/ResultFormulaTableCom.vue';
import SpanUpload from '@/components/common/NewComps/SpanUpload.vue';

export default {
  name: 'CraftPriceTableItemSet',
  components: {
    FormulaPanelElementSelectDialog,
    AxisPropDataSetDialog,
    FormItemOptionDataSetDialog,
    TableContentComp,
    ResultFormulaTableCom,
    SpanUpload,
  },
  data() {
    return {
      productData: null,
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
      CraftPriceID: '',
      isQuotationPage: false,
      PriceTableData: null,
      AxisPropVisible: false, // 控制横竖轴属性选择弹窗展示
      loading: false,
      curAxisPropSetType: '', // 当前正在设置的轴属性类型 X | Y
      selectedElementIDs: [],
      AxisPropDataSetVisible: false, // 控制横竖轴设置数据弹窗展示
      FormItemOptionSetVisible: false, // 表单项目设置弹窗(起步价等)
      initFetchResultFormula: true,
    };
  },
  computed: {
    // curEditPriceItemData 为null时为添加
    ...mapState('priceManage', ['curSolutionItem', 'curEditPriceItemData', 'curPriceItem', 'curCraftPriceItemData', 'PriceItemAxisPropertyList']),
    AxisTitle() {
      if (this.curAxisPropSetType === 'X') return '设置横轴属性';
      if (this.curAxisPropSetType === 'Y') return '设置竖轴属性';
      return '设置轴属性';
    },
    ConstraintContent() { // 顶部条件信息
      if (!this.PriceTableData) return '';
      const { Constraint } = this.PriceTableData;
      if (!Constraint || !Array.isArray(Constraint.ItemList) || Constraint.ItemList.length === 0) return '条件为空';
      return '有条件，尚未编写显示';
    },
    XAxisProp() { // X轴上选中的属性
      return this.PriceTableData?.XAxis?.Property;
    },
    YAxisProp() { // X轴上选中的属性
      return this.PriceTableData?.YAxis?.Property;
    },
    FormDataUnit() { // 数据单位
      return this.PriceTableData?.Unit;
    },
    OtherDataUnit() { // 其它数据
      return this.PriceTableData?.DataList.map(it => (it.Unit ? `${it.Name}（单位：${it.Unit}）` : `${it.Name}`)).join('、');
    },
    XAxisList() {
      if (Array.isArray(this.PriceTableData.XAxis.List) && this.PriceTableData.XAxis.List.length > 0) return this.PriceTableData.XAxis.List;
      if (!this.PriceTableData.XAxis.Property
       && Array.isArray(this.PriceTableData.YAxis.List)
       && this.PriceTableData.YAxis.List.length > 0) return [{ ID: '', Value: '' }];
      return [];
    },
    YAxisList() {
      if (Array.isArray(this.PriceTableData.YAxis.List) && this.PriceTableData.YAxis.List.length > 0) return this.PriceTableData.YAxis.List;
      if (!this.PriceTableData.YAxis.Property
       && Array.isArray(this.PriceTableData.XAxis.List)
       && this.PriceTableData.XAxis.List.length > 0) return [{ ID: '', Value: '' }];
      return [];
    },
    disabled() {
      return this.XAxisList.length === 0 || this.YAxisList.length === 0;
    },
    FilterTypeText() {
      if (!this.PriceTableData || !this.PriceTableData.Constraint) return '';
      return this.PriceTableData.Constraint.FilterType === 1 ? '满足所有' : '满足任一';
    },
    fetchFormulaListData() {
      if (!this.PriceTableData || !this.PriceTableData.ID) return null;
      return {
        TableID: this.PriceTableData.ID,
        ProductID: this.ProductID,
        PriceID: this.PriceID,
        CraftPriceID: this.CraftPriceID,
        UseModule: 5,
      };
    },
    paramsArray() {
      const solutionID = this.curSolutionItem?.ID || '';
      return [solutionID];
    },
  },
  methods: {
    getInitDataFromRoutePath() { // 初始通过路径params中获取页面信息
      const isQuotationPage = this.$route.params.isQuotation; // 是否为价格表页面 否则为设置工艺费用组成页面
      if (!isQuotationPage && (!this.curPriceItem || !this.curCraftPriceItemData || !this.curCraftPriceItemData.Craft) && !this.curSolutionItem) {
        this.onGoBackClick();
        return;
      }
      const { ID, Name } = this.curPriceItem;
      this.PriceID = ID;
      this.PriceName = Name;
      this.ProductID = this.$route.params.id;
      this.ProductName = this.$route.params.name;

      if (isQuotationPage) { // 价格表页面执行操作
        this.isQuotationPage = isQuotationPage;
      }
      if (!isQuotationPage) { // 工艺费用组成设置页面
        // 暂无操作
        this.CraftPriceID = this.curCraftPriceItemData?.Craft?.CraftPriceID || '';
      }
    },
    async FetchInitDatas() { // 获取产品数据 X Y轴属性选择列表
      this.loading = true;
      const [productData] = await Promise.all([
        this.$store.dispatch('priceManage/getProductCraftData', this.$route.params.id),
        // this.$store.dispatch('priceManage/getPriceTablePropertyList', this.$route.params.id),
      ]);
      this.productData = productData;
      this.loading = false;
    },
    onGoBackClick() { // 返回上一页
      const { params } = this.$route;
      const pathName = this.isQuotationPage ? 'QuotationList' : 'CompositionCostOfCraft';
      this.$router.replace(({ name: pathName, params }));
    },
    onAxisPropSetupClick(type) { // 横轴竖轴属性点击设置 X | Y
      // if (type === 'X' && this.XAxisProp) this.selectedElementIDs = [this.XAxisProp.StoredContent];
      // else if (type === 'Y' && this.YAxisProp) this.selectedElementIDs = [this.YAxisProp.StoredContent];
      // else this.selectedElementIDs = [];
      this.selectedElementIDs = [this.YAxisProp?.StoredContent, this.XAxisProp?.StoredContent].filter(it => it);
      this.curAxisPropSetType = type;
      this.AxisPropVisible = true;
    },
    onAxisDataSetupClick(type) { // 横轴竖轴选中属性后的设置数据点击事件
      this.curAxisPropSetType = type;
      this.AxisPropDataSetVisible = true;
    },
    onTableItemDataSetClick() { // 表单项设置
      // ---------------------------------------------------------------- 表单项更改 会影响到表体内容
      this.FormItemOptionSetVisible = true;
    },
    onAxisPropSelect(e) { // X Y轴设置选中属性事件
      // ---------------------------------------------------------------- 切换属性 清空已设置数据 ok 及 表体内容 未好
      let targetProp = null;
      let targetList = [];
      if (this.curAxisPropSetType === 'X') {
        targetProp = this.PriceTableData.XAxis;
        targetList = this.XAxisList;
      }
      if (this.curAxisPropSetType === 'Y') {
        targetProp = this.PriceTableData.YAxis;
        targetList = this.YAxisList;
      }
      if (targetProp) {
        let showTip = false;
        if (targetList.length > 0) {
          const t = this.PriceTableData.PriceList.find(it => it.List.find(_it => _it.Second));
          if (t) showTip = true;
        }
        if (!showTip) {
          this.handlePropSelectSuccess(e, targetProp);
        } else {
          this.messageBox.warnCancelBox('确定更改属性吗', '更改属性将会导致表格已填写数据全部清空', () => {
            this.handlePropSelectSuccess(e, targetProp);
          });
        }
      }
    },
    handlePropSelectSuccess(e, targetProp) {
      const prop = targetProp;
      prop.Property = e;
      if (prop.IsCumsum && (!e || e.ValueType !== 0)) {
        prop.IsCumsum = false;
      }
      prop.InputContent = '';
      prop.List = [];
      this.PriceTableData.PriceList = []; // 清除价格数据
      if (e && e.ValueType === 0 && e.Element && e.Element.NumbericAttribute && e.Element.NumbericAttribute.GeneralValues) {
        prop.InputContent = e.Element.NumbericAttribute.GeneralValues.join(',');
        prop.List = e.Element.NumbericAttribute.GeneralValues.map(it => ({ ID: this.$utils.getAUUID(), Value: `${it}` }));
      }
      this.generatePriceListData();
    },
    onAxisDataSetSubmit(data, axis) { // 设置轴数据
      const { InputContent, Operator, List } = data;
      let targetProp = null;
      let lastList = [];
      if (axis === 'X') targetProp = this.PriceTableData.XAxis;
      if (axis === 'Y') targetProp = this.PriceTableData.YAxis;
      if (targetProp) {
        targetProp.InputContent = InputContent;
        targetProp.Operator = { ...Operator };
        lastList = [...targetProp.List];
        const list = List.map(item => {
          const { Value, Values } = item;
          if (Value && (!Values || (Array.isArray(Values) && Values.length === 0))) {
            const t = targetProp.List.find(it => it.Value && it.Value === Value);
            return t || item;
          }
          const t = targetProp.List.find(it => it.Values && this.getIsOrNotSameBy2Array(it.Values, Values));
          return t || item;
        });
        targetProp.List = [...list]; // 此处覆盖时，应该筛选下，已有的仍保留原有数据 ok
      }
      this.AxisPropDataSetVisible = false;
      this.generatePriceListData(axis, targetProp, lastList);
    },
    generatePriceListData(changeAxis, targetProp, lastList) { // 生成表单价格数据 lastList 为上一次的属性列表 为获取旧ID对应的value使用
      const XPropList = this.XAxisList;
      const YPropList = this.YAxisList;
      if (!XPropList || !YPropList || XPropList.length === 0 || YPropList.length === 0) {
        this.PriceTableData.PriceList = [];
        return;
      }
      const list = [];
      const _DataList = [{ ID: '', Name: '' }];
      if (Array.isArray(this.PriceTableData.DataList) && this.PriceTableData.DataList.length > 0) {
        _DataList.push(...this.PriceTableData.DataList);
      }
      const _DataListIDs = _DataList.map(_it => _it.ID);
      const _PriceList = [...this.PriceTableData.PriceList];
      XPropList.forEach(XProp => {
        YPropList.forEach(YProp => {
          const i = _PriceList.findIndex(it => (it.XAxisID === XProp.ID || (!it.XAxisID && !XProp.ID))
           && (it.YAxisID === YProp.ID || (!it.YAxisID && !YProp.ID)));
          if (i < 0) {
            // 找不到的情况下， . // changeAxis 有才判断
            // 1. 查看数据为数字值还是选项值，
            // 2. 如果为数字值，则进一步查看，
            // 3. 查看其是否在一个符合的区间范围内，
            // 4. 如果在且该符号区间已不存在于当前列表中，继承该区间的填写值，并移除掉该区间，以防下次重复使用
            if (changeAxis && targetProp && targetProp.Property.ValueType === 0 && _PriceList.length > 0) {
              const _targetPropList = changeAxis === 'X' ? XPropList : YPropList;
              const _targetProp = changeAxis === 'X' ? YProp : XProp;
              const _targetProp2 = changeAxis === 'X' ? XProp : YProp;
              const _targetPropID = changeAxis === 'X' ? 'YAxisID' : 'XAxisID';
              const _filterPropID = changeAxis === 'X' ? 'XAxisID' : 'YAxisID';
              const _CurXPropIDList = _targetPropList.map(_it => _it.ID);
              const TList = _PriceList.filter(_it => _it[_targetPropID] === _targetProp.ID && !_CurXPropIDList.includes(_it[_filterPropID])).map(_it => {
                const targetAxisProp = lastList.find(xp => xp.ID === _it[_filterPropID]);
                if (!targetAxisProp) return '';
                return { ..._it, TargetValue: targetAxisProp.Value };
              }).filter(_it => _it);
              if (TList.length === 0) {
                const temp = { XAxisID: XProp.ID, YAxisID: YProp.ID, List: [] };
                _DataList.forEach(ItemData => {
                  temp.List.push({ First: ItemData.ID, Second: '' });
                });
                list.push(temp);
              } else {
                const _t = TList.find(_it => {
                  const list1 = _it.TargetValue.split(' ');
                  const list2 = _targetProp2.Value.split(' ');
                  if (list1.length === 1 && list2.length === 1) return false;
                  const len1 = list1.length + list2.length;
                  const len2 = [...new Set([...list1, ...list2])].length;
                  return len1 > len2;
                });
                if (_t) {
                  const temp = { XAxisID: XProp.ID, YAxisID: YProp.ID, List: [..._t.List] };
                  list.push(temp);
                  const i2 = _PriceList.findIndex(_it => _it.YAxisID === _t.YAxisID && _it.XAxisID === _t.XAxisID);
                  if (i2 > -1) _PriceList.splice(i2, 1);
                } else {
                  const temp = { XAxisID: XProp.ID, YAxisID: YProp.ID, List: [] };
                  _DataList.forEach(ItemData => {
                    temp.List.push({ First: ItemData.ID, Second: '' });
                  });
                  list.push(temp);
                }
              }
            } else { // 不需要判断
              const temp = { XAxisID: XProp.ID, YAxisID: YProp.ID, List: [] };
              _DataList.forEach(ItemData => {
                temp.List.push({ First: ItemData.ID, Second: '' });
              });
              list.push(temp);
            }
          } else {
            const t = _PriceList[i];
            const temp = { ...t, List: [...t.List.filter(_it => _DataListIDs.includes(_it.First) || _it.First === '00000000-0000-0000-0000-000000000000')] };
            _DataList.forEach(ItemData => {
              const t2 = temp.List.find(_it => {
                const bool = (
                  _it.First === ItemData.ID || (!ItemData.ID && (_it.First === '00000000-0000-0000-0000-000000000000' || !_it.First))
                );
                return bool;
              });
              if (!t2) temp.List.push({ First: ItemData.ID, Second: '' });
            });
            list.push(temp);
            _PriceList.splice(i, 1);
          }
        });
      });
      this.PriceTableData.PriceList = list;
    },
    onFormItemOptionDataSubmit({ Unit, DataList }) { // 设置表格单元数据
      this.PriceTableData.Unit = Unit;
      this.PriceTableData.DataList = DataList;
      this.FormItemOptionSetVisible = false;
      this.generatePriceListData();
    },
    handleExcelImport(e) { // 导入表格点击
      if (!e || typeof e !== 'object') return;
      const ID = this.curEditPriceItemData ? this.curEditPriceItemData.ID : '';
      const temp = { ...e, ID };
      this.PriceTableData = new PriceTableClass(temp); // 初始化价格类对象（添加|编辑）
      this.generatePriceListData(); // 初始化价格表数据PriceList
      this.getInitDataFromRoutePath();
      if (!this.fetchFormulaListData) this.initFetchResultFormula = false;
    },
    getIsOrNotSameBy2Array(arr1, arr2) {
      if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
      if (arr1.length !== arr2.length || arr1.length === 0) return false;
      let bool = true;
      arr1.forEach(it => {
        if (!bool) return;
        const t = arr2.find(_it => _it.First === it.First);
        if (!t || t.Second !== it.Second) bool = false;
      });
      return bool;
    },
    onPriceItemInput(val, YAxisID, XAxisID, First) {
      const t = this.PriceTableData.PriceList.find(it => (it.XAxisID === XAxisID || (!it.XAxisID && !XAxisID))
           && (it.YAxisID === YAxisID || (!it.YAxisID && !YAxisID)));
      if (t && Array.isArray(t.List)) {
        const targetItem = t.List.find(it => it.First === First || (!First && (it.First === '00000000-0000-0000-0000-000000000000' || !it.First)));
        if (targetItem) targetItem.Second = val;
      }
    },
    async onTableSubmit() { // 保存表数据
      if (this.disabled) return;
      const bool = this.tableSubmitChecker();
      if (!bool) return;
      const list = this.PriceTableData.PriceList.filter(it => it.List.map(_it => _it.Second).filter(_it => _it).length > 0); // 筛选掉为空的价格列表数据
      const { ID, PriceID, SolutionID, XAxis, YAxis, DataList, Unit } = this.PriceTableData;
      const temp = { ID, PriceID, SolutionID, XAxis, YAxis, DataList, Unit, PriceList: list };
      const resp = await this.api.getPriceTableSave(temp).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('priceManage/setPriceTableListItemChange', [temp, resp.data.Data, this.isQuotationPage, this.ProductID, this.CraftPriceID]);
          if (!this.PriceTableData.ID) this.PriceTableData.ID = resp.data.Data;
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    tableSubmitChecker() {
      let t = this.PriceTableData.PriceList.find(it => it.List.find(_it => _it.Second && !this.$utils.getValueIsOrNotNumber(_it.Second)));
      if (t) {
        this.messageBox.failSingleError('保存失败', '表单项必须为数字值');
        return false;
      }
      t = this.PriceTableData.PriceList.find(it => it.List.find(_it => _it.Second && _it.Second < 0));
      if (t) {
        this.messageBox.failSingleError('保存失败', '表单项输入值不能小于0');
        return false;
      }
      t = this.PriceTableData.PriceList.find(it => {
        const _list = it.List.map(_it => _it.Second).filter(_it => _it);
        return _list.length > 0 && _list.length < it.List.length;
      });
      if (t) {
        this.messageBox.failSingleError('保存失败', '同一表格单元内数据应同时填写或同时不填写');
        return false;
      }
      return true;
    },
    onFormulaSetupClick(e) { // 设置结果公式 (添加|编辑)
      this.$store.commit('priceManage/setCurPriceTableItemResultFormulaInfo', [this.PriceTableData, e]);
      const { params } = this.$route;
      const pathName = this.isQuotationPage ? 'QuotationPriceResultFormulaSet' : 'CraftPriceTableResultFormulaSet';
      this.$router.replace(({ name: pathName, params }));
    },
    async onFormulaRemove(e) { // 结果公式删除
      const resp = await this.api.getFormulaRemove(e.ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('priceManage/setResultFormulaItemRemove', [e, false]);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
  created() {
    const initData = JSON.parse(JSON.stringify(this.curEditPriceItemData)) || { ID: '', PriceID: this.curPriceItem?.ID, SolutionID: this.curSolutionItem?.ID };
    this.PriceTableData = new PriceTableClass(initData); // 初始化价格类对象（添加|编辑）
    this.generatePriceListData(); // 初始化价格表数据PriceList
    this.getInitDataFromRoutePath();
    if (!this.fetchFormulaListData) this.initFetchResultFormula = false;
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-price-table-common-set-page-wrap {
  padding-left: 10px;
  background-color: #f5f5f5;
  min-width: 980px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  > header {
    padding: 20px;
    padding-bottom: 25px;
    line-height: 15px;
    background-color: #fff;
    box-sizing: border-box;
    flex: none;
    > div {
      &.title-box {
        white-space: nowrap;
        display: flex;
        font-size: 15px;
        color: #21CAE3;
        font-weight: bold;
        > span {
          font-weight: 400;
          margin-left: 80px;
          font-size: 14px;
          & + span {
            margin-left: 40px;
          }
        }
      }
      &.import {
        display: flex;
        align-items: center;
        padding: 40px 0 30px 0;
        > div {
          padding-left: 25%;
          flex: 1;
          display: flex;
          overflow: hidden;
          align-items: center;
          .blue-span {
            font-size: 14px;
            padding-right: 12px;
            display: inline-block;
            border-right: 1px solid #eee;
            margin-right: 12px;
            flex: none;
          }
          .condition {
            font-size: 14px;
            flex: 1;
            color: #999;
            padding-right: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            max-width: 560px;
          }
        }
      }
      &.setup {
        display: flex;
        font-size: 12px;
        color: #999999;
        height: 55px;
        align-items: center;
        overflow: hidden;
        width: 100%;
        .label {
          font-weight: 700;
          color: #585858;
          font-size: 14px;
        }
        .el-checkbox__label {
          font-size: 12px;
          color: #585858;
        }
        .is-disabled .el-checkbox__label {
          color: #cbcbcb;
        }
        .blue-span {
          margin-right: 15px;
        }
        > ul.l {
          padding-right: 35px;
          border-right: 1px solid #eee;
          height: 44px;
          overflow: hidden;
          li {
            padding-bottom: 3px;
            display: flex;
            > span {
              flex: none;
              line-height: 19px;
              &.content {
                flex: 1;
                margin-right: 20px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                min-width: 5em;
              }
            }
          }
        }
        > div.r {
          padding-left: 25px;
          display: flex;
          line-height: 19px;
          height: 44px;
          overflow: hidden;
          .blue-span {
            margin-right: 20px;
            height: 24px;
          }
          > span {
            flex: none;
          }
          > div {
            overflow: hidden;
            > p {
              padding-bottom: 3px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    padding-left: 20px;
    padding-top: 0px;
    padding-right: 18px;
    display: flex;
    flex-direction: column;
    &.loading {
      opacity: 0.2;
    }
    .submit {
      text-align: right;
      padding-top: 15px;
      padding-right: 25px;
      > button {
        height: 35px !important;
        font-size: 14px;
        border-radius: 3px;
      }
    }
  }
  > footer {
    background-color: #fff;
    padding: 20px;
    text-align: center;
    padding-right: 120px;
    flex: none;
    margin-bottom: 10px;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      &:last-of-type {
        color: #26BCF9;
        margin-left: 30px;
      }
    }
  }
}
</style>
