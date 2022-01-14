<template>
  <section class="mp-erp-price-module-craft-price-cost-composition-set-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="name" v-if="curPartName">当前部件：{{curPartName}}</span>
      <span class="name">价格名称：{{PriceName}}</span>
      <span class="name" v-if="!isQuotationPage">设置工艺：{{curCraft.Name}}</span>
      <TopRadioButtonComp
        v-model="SolutionID"
        title="费用"
       :list='SolutionList'
       :loading='false'
       @remove='onRemoveClick'
       @itemSave='onItemSaveClick'
       />
    </header>
    <main>
      <PriceTableComp
        :disabled='!SolutionID'
        @export='onTableItemExport'
        @setup='onTableItemConditionSetupClick'
        @remove='onTableItemRemove'
        @write="onFormDataWritePageJump($event, '', '')"
        :titleObj='{title:"费用表",btnText:"+ 添加费用表"}'
        :loading='isTableLoading'
        :dataList='tableDataList'
        />
      <CraftPriceTitleItemSaveDialog
       :showGroup='!isQuotationPage'
       :visible.sync="visible"
       :rangeList='rangeList'
       :saveData='saveData'
       @submit="handleDialogSubmit" />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import handleExcelDownload from '@/assets/js/upload/downloadExcel';
import CraftPriceTitleItemSaveDialog from './Comps/CraftPriceTitleItemSaveDialog.vue';
import TopRadioButtonComp from '../../../../components/common/NewComps/TopRadioButtonComp/index.vue';
import PriceTableComp from './Comps/PriceTableComp.vue';
import { insertShowName4SolutionList } from '../utils';

export default {
  name: 'CompositionCostOfCraft',
  components: {
    TopRadioButtonComp,
    CraftPriceTitleItemSaveDialog,
    PriceTableComp,
  },
  computed: {
    // eslint-disable-next-line max-len
    ...mapState('priceManage', ['curCraftPriceItemData', 'curPriceItem', 'PriceManageList', 'PriceTableList', 'PriceItemAxisPropertyList']),
    curProduct() {
      return this.PriceManageList.find(it => it.ID === this.ProductID);
    },
    curPartName() {
      if (this.isQuotationPage || !this.curCraftPriceItemData || !this.ProductData) return '';
      if (!this.curCraftPriceItemData.PartID) return '产品本身';
      const t = this.ProductData.PartList.find(it => it.ID === this.curCraftPriceItemData.PartID);
      return t ? t.Name : '';
    },
    curCraft() {
      return (this.curCraftPriceItemData && this.curCraftPriceItemData.Craft) || {};
    },
    rangeList() {
      if (!this.ProductData) return [];
      const list = [];
      // 1. 处理产品
      const temp = {
        PartID: '',
        Name: '产品',
        CraftGroupList: this.getCraftGroupList(this.ProductData.CraftList),
      };
      list.push(temp);
      // 2. 处理部件
      if (Array.isArray(this.ProductData.PartList)) {
        this.ProductData.PartList.forEach(Part => {
          const { ID, Name, CraftList } = Part;
          const _temp = {
            PartID: ID,
            Name,
            CraftGroupList: this.getCraftGroupList(CraftList, Name),
          };
          list.push(_temp);
        });
      }
      return list;
    },
    SolutionList() { // 费用条目列表
      if (!this.curPriceItem) return [];
      if (this.isQuotationPage) return insertShowName4SolutionList(this.curPriceItem.PriceTableList, this.ProductData, this.rangeList) || [];
      if (!this.CraftPriceID || !Array.isArray(this.curPriceItem.CraftPriceList)) return [];
      const t = this.curPriceItem.CraftPriceList.find(it => it.ID === this.CraftPriceID);
      return t ? insertShowName4SolutionList(t.PriceTableList, this.ProductData, this.rangeList) : [];
    },
    curSolutionItem() {
      if (!this.SolutionID) return null;
      return this.SolutionList.find(it => it.ID === this.SolutionID);
    },
    tableDataList() {
      if (!Array.isArray(this.PriceTableList) || this.PriceTableList.length === 0) return [];
      const ConditionPropertyList = this.curConditionList;
      const _list = JSON.parse(JSON.stringify(this.PriceTableList)).map(it => {
        const { Constraint, XAxis, YAxis } = it;
        const [_Constraint, _ConditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(
          Constraint, ConditionPropertyList,
        );
        let _XAxis = null;
        let _YAxis = null;
        if (XAxis) {
          const XProperty = PropertyClass.getPerfectPropertyByImperfectProperty(XAxis.Property, this.PriceItemAxisPropertyList);
          _XAxis = { ...XAxis, Property: XProperty };
        }
        if (YAxis) {
          const YProperty = PropertyClass.getPerfectPropertyByImperfectProperty(YAxis.Property, this.PriceItemAxisPropertyList);
          _YAxis = { ...YAxis, Property: YProperty };
        }
        return { ...it, Constraint: _Constraint, _ConditionText, XAxis: _XAxis, YAxis: _YAxis };
      });
      return _list;
    },
    curSolutionPartID() {
      if (this.curSolutionItem?.ApplyRange) return this.curSolutionItem.ApplyRange.PartID;
      return 'unkown';
    },
    curConditionList() {
      if (this.curSolutionItem && this.curSolutionItem.ApplyRange) {
        const { PartID, GroupID, CraftID } = this.curSolutionItem.ApplyRange;
        const t = this.ConditionPropertyObjList.find(it => it.PartID === PartID && it.CraftID === CraftID && it.GroupID === GroupID);
        return t ? t.PropertyList : [];
      }
      return [];
    },
  },
  data() {
    return {
      SolutionID: '',
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
      CraftPriceID: '',
      visible: false,
      saveData: null,
      ProductData: null,
      isQuotationPage: false, // 是否为价格表页面
      canLoadContentTableData: true, // 是否可在方案切换时获取表体数据
      isTableLoading: false,
      ConditionPropertyObjList: [], // 当前方案条件属性列表
    };
  },
  methods: {
    onGoBackClick() { // 返回页面
      this.$goback();
    },
    onRemoveClick() { // 删除
      this.messageBox.warnCancelBox('确定要删除当前方案吗', `方案名称：[ ${this.curSolutionItem ? this.curSolutionItem.Name : '未知方案名称'} ]`, () => {
        this.getPriceSolutionRemove();
      });
    },
    onItemSaveClick(ID) { // 添加 | 编辑方案   ok
      const data = ID ? this.SolutionList.find(it => it.ID === ID) : null;
      let PartID = '';
      let CraftID = '';
      let GroupID = '';
      if (data && data.ApplyRange) {
        PartID = data.ApplyRange.PartID || '';
        CraftID = data.ApplyRange.CraftID || '';
        GroupID = data.ApplyRange.GroupID || '';
      }
      const temp = {
        ID: data ? data.ID : '',
        Name: data ? data.Name : '',
        CraftPriceID: this.isQuotationPage ? '' : this.CraftPriceID,
        PriceID: this.PriceID,
        PartID,
        CraftID,
        GroupID,
      };
      this.saveData = temp;
      this.visible = true;
    },
    async handleDialogSubmit(data) { // 方案提交
      const nameSameItem = this.SolutionList.find(it => (
        it.Name === data.Name
        // && (it.ApplyRange.CraftID === data.ApplyRange.CraftID || (!it.ApplyRange.CraftID && !data.ApplyRange.CraftID))
        // && (it.ApplyRange.GroupID === data.ApplyRange.GroupID || (!it.ApplyRange.GroupID && !data.ApplyRange.GroupID))
        && (it.ApplyRange.PartID === data.ApplyRange.PartID || (!it.ApplyRange.PartID && !data.ApplyRange.PartID))
      ));
      if (nameSameItem) {
        if (nameSameItem.ID === data.ID) {
          this.messageBox.failSingleError('保存失败', '方案名称未发生更改');
        } else {
          this.messageBox.failSingleError('保存失败', '存在相同的方案名称且应用的部件相同');
        }
        return;
      }
      const resp = await this.api.getPriceSolutionSave(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('priceManage/setPriceItemSolutionItemChange', [
            this.ProductID, this.PriceID, data, resp.data.Data, this.isQuotationPage, this.CraftPriceID,
          ]); // 在数据仓库中改动
          this.visible = false;
          if (this.SolutionList.length === 1 && !this.SolutionID) {
            // 可以设置一个临时开关为true 以阻止此处下方列表数据的获取 -- 后面添加
            this.canLoadContentTableData = false;
          }
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    async getProductData() { // 获取产品信息
      const data = await this.$store.dispatch('priceManage/getProductCraftData', this.ProductID);
      this.ProductData = data;
    },
    getCraftGroupList(CraftList, PartName) { // 获取一个工艺列表中全部工艺中的可多次使用的元素组的数组列表  -- 用于rangeList提取
      if (!Array.isArray(CraftList)) return [];
      const list = [];
      CraftList.forEach(Craft => {
        if (Array.isArray(Craft.GroupList)) {
          Craft.GroupList.forEach(Group => {
            const { UseTimes } = Group;
            if (UseTimes && UseTimes.MaxValue > 1) {
              let Name = `${Craft.Name}-${Group.Name}`;
              if (PartName) Name = `${PartName}-${Name}`;
              list.push({ ...Group, CraftID: Craft.ID, Name });
            }
          });
        }
      });
      return list;
    },
    async getPriceSolutionRemove() { // 删除方案
      const resp = await this.api.getPriceSolutionRemove(this.SolutionID).catch(() => {});
      const cb = () => {
        const i = this.SolutionList.findIndex(it => it.ID === this.SolutionID);
        if (i > -1) {
          this.$store.commit('priceManage/setPriceItemSolutionItemRemove', [
            this.ProductID, this.PriceID, this.SolutionID, this.isQuotationPage, this.CraftPriceID,
          ]); // 在数据仓库中改动
          if (this.SolutionList.length > 0) this.SolutionID = this.SolutionList[0].ID;
          else this.SolutionID = '';
        }
      };
      if (resp && resp.data.Status === 1000) {
        this.messageBox.successSingle('删除成功', cb, cb);
      }
      // else if (resp && resp.data.Status === 1004) {
      //   cb();
      // }
    },
    async getPriceTableList() { // 获取费用表数据 根据顶部方案切换获取
      if (!this.SolutionID || !this.curSolutionItem) return;
      const { PriceID, ApplyRange } = this.curSolutionItem;
      if (!ApplyRange) return;
      const { PartID, GroupID, CraftID } = ApplyRange;
      this.isTableLoading = true;
      const getListData = () => {
        if (!this.canLoadContentTableData) {
          this.canLoadContentTableData = true;
        } else {
          return this.$store.dispatch('priceManage/getPriceTableList', this.SolutionID);
        }
        return null;
      };
      await Promise.all([
        getListData(),
        this.getConditionPropertyList(PriceID, PartID, GroupID, CraftID),
        this.$store.dispatch('priceManage/getPriceTablePropertyLists', [this.ProductID, PartID, GroupID, PriceID, CraftID]),
      ]);
      this.isTableLoading = false;
    },
    async getConditionPropertyList(PriceID, PartID, GroupID, CraftID) {
      const t = this.ConditionPropertyObjList.find(it => it.PartID === PartID && it.CraftID === CraftID && it.GroupID === GroupID);
      if (t) return;
      const resp = await PropertyClass.getPropertyList({ UseModule: 32, ProductID: this.ProductID, PriceID, PartID, GroupID, CraftID });
      const PropertyList = resp || [];
      const obj = {
        PartID,
        CraftID,
        GroupID,
        PropertyList,
      };
      this.ConditionPropertyObjList.push(obj);
    },
    async onTableItemRemove(e) { // ok
      if (!e || !e.ID) return;
      const resp = await this.api.getPriceTableRemobe(e.ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('priceManage/setPriceTableListItemRemove', [e, this.isQuotationPage, this.ProductID, this.CraftPriceID]);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    onFormDataWritePageJump(data) { // 填写表数据
      const pathName = this.isQuotationPage ? 'QuotationPriceTableItemSet' : 'CraftPriceTableItemSet';
      const { params } = this.$route;
      this.$store.commit('priceManage/setPriceItemPropertyList', this.curConditionList);
      this.$store.commit('priceManage/setCurSolutionItem', this.curSolutionItem);
      this.$store.commit('priceManage/setCurEditPriceItemData', data);
      this.$store.commit('priceManage/setResultFormulaList', []);
      this.$router.push({ name: pathName, params });
    },
    onTableItemConditionSetupClick(data) { // 设置条件
      const pathName = this.isQuotationPage ? 'QuotationPriceConditionSet' : 'CraftPriceTableConditionSet';
      const { params } = this.$route;
      this.$store.commit('priceManage/setPriceItemPropertyList', this.curConditionList);
      this.$store.commit('priceManage/setCurSolutionItem', this.curSolutionItem);
      this.$store.commit('priceManage/setCurEditPriceItemData', data);
      this.$router.push({ name: pathName, params });
    },
    // eslint-disable-next-line no-unused-vars
    onTableItemExport(data) { // 表格导出
      if (!data || !data.ID) return;
      // console.log('onTableItemExport tableID', data.ID, 'ProductID:', this.ProductID, data, this.curSolutionItem, this.PriceName);
      const params = { tableID: data.ID, productID: this.ProductID };
      handleExcelDownload(params, this.api.getPriceTableExport, `费用表导出（${this.PriceName}-${this.curSolutionItem.ShowName}）`);
    },
  },
  watch: {
    SolutionList(newVal, oldVal) {
      if (newVal.length > 0 && oldVal.length === 0 && !this.SolutionID) this.SolutionID = newVal[0].ID;
    },
    SolutionID(val) {
      if (!val) return;
      this.getPriceTableList();
    },
  },
  created() {
    this.$store.commit('priceManage/setPriceTableList', []);
  },
  mounted() {
    const isQuotationPage = this.$route.params.isQuotation; // 是否为价格表页面 否则为设置工艺费用组成页面
    if (!isQuotationPage && (!this.curPriceItem || !this.curCraftPriceItemData || !this.curCraftPriceItemData.Craft)) {
      this.$goback();
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
      this.CraftPriceID = this.curCraftPriceItemData.Craft.CraftPriceID;
    }
    this.getProductData();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-craft-price-cost-composition-set-page-wrap {
  // padding: 0 10px;
  background-color: #f5f5f5;
  min-width: 980px;
  min-height: 100%;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  > header {
    padding: 20px;
    padding-bottom: 22px;
    line-height: 15px;
    background-color: #fff;
    box-sizing: border-box;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    white-space: nowrap;
    .name {
      font-weight: 400;
      margin-left: 80px;
      font-size: 14px;
      & + .name {
        margin-left: 40px;
      }
    }
  }
  > main {
    flex: 1;
    margin-top: 10px;
    background-color: #fff;
    padding-left: 20px;
    padding-top: 30px;
    padding-right: 8px;
    .mp-common-title-wrap {
      color: #444;
      font-size: 15px;
      &::before {
        height: 15px;
      }
    }
    &.loading {
      opacity: 0.2;
    }
  }
  > footer {
    background-color: #fff;
    padding: 20px;
    text-align: center;
    padding-right: 120px;
    flex: none;
    // width: 1100px;
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
