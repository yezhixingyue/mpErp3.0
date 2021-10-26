<template>
  <section class="mp-erp-product-list-page-product-interaction-list-page-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <template v-if="showTable">
        <!-- 界面交互 -->
        <CommonInteractionTable @remove='onTableItemRemove' @setup="onSetupPageJump" type='interaction' :dataList='InteractionDataList' />
        <!-- 对比验证 -->
        <CommonInteractionTable @remove='onTableItemRemove' @setup="onSetupPageJump" type='compare' :dataList='CompareDataList' />
        <!-- 风险提示 -->
        <CommonInteractionTable @remove='onTableItemRemove' @setup="onSetupPageJump" type='risk' :dataList='RiskWarningDataList' />
        <!-- 子交互 -->
        <CommonInteractionTable @remove='onTableItemRemove' @setup="onSetupPageJump" type='subInteraction' :dataList='subInteractionDataList' />
        <!-- 子对比 -->
        <CommonInteractionTable @remove='onTableItemRemove'  @setup="onSetupPageJump" type='subCompare' :dataList='subCompareDataList' />
        <!-- 子交互 子对比选择属性弹窗组件 -->
        <SubFormulaAddAndSelectDialog :visible.sync='visible' :PropertyList='subDialogPropertyList' :loading='isSubDialogPropertyLoading'
         @submit='onSelectCompleted' :title='dialogTitle' :initDataStr='initDialogDataStr' />
      </template>
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import CommonInteractionTable from '@/components/ProductManageComps/Interaction/CommonInteractionTable.vue';
import SubFormulaAddAndSelectDialog from '@/components/common/FormulaAndConditionComps/SubFormulaAddAndSelectDialog.vue';

export default {
  name: 'ProductInteractionList',
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      showTable: false,
      visible: false,
      setType4SubInteractionAndSubCompare: '', // 记录打开弹窗时的目的类型：子交互 | 子对比
      itemData4SubInteractionAndSubCompare: null,
      subDialogPropertyList: [],
      initDialogDataStr: '',
      isSubDialogPropertyLoading: false,
    };
  },
  components: {
    CommonInteractionTable,
    SubFormulaAddAndSelectDialog,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList', 'ProductInteractionDataList', 'subComparePropList', 'InteractionAllPropList',
      'ControlTypeList', 'InteractionLeftPropertyList', 'InteractionRightPropertyList', 'CompareLeftPropertyList', 'CompareRightPropertyList']),
    curProduct() {
      if (!this.ProductID) return null;
      return this.ProductManageList.find(it => it.ID === this.ProductID);
    },
    curPart() {
      if (!this.PartID || !this.curProduct) return null;
      return this.curProduct.PartList.find(it => it.ID === this.PartID);
    },
    localInteractionDataList() {
      if (!Array.isArray(this.ProductInteractionDataList) || this.ProductInteractionDataList.length === 0) return [];
      const list = JSON.parse(JSON.stringify(this.ProductInteractionDataList)).map(it => {
        const { Constraint, List } = it;
        const type = this.$utils.getNameFromListByIDs(it.ControlType, this.ControlTypeList);
        // console.log(type);
        let _RightPropertyList = this.InteractionAllPropList;
        let _LeftPropertyList = this.InteractionAllPropList;
        switch (type) {
          case 'interaction':
            _RightPropertyList = this.InteractionRightPropertyList;
            _LeftPropertyList = this.InteractionLeftPropertyList;
            break;
          case 'compare':
            _RightPropertyList = this.CompareRightPropertyList;
            _LeftPropertyList = this.CompareLeftPropertyList;
            break;
          // case 'subInteraction': // ?
          //   _RightPropertyList = this.CompareRightPropertyList;
          default:
            break;
        }
        const _list = List.map(_it => {
          let { Property, CompareProperty } = _it;
          if (!Property) return _it;
          if (CompareProperty && Property) {
            Property = PropertyClass.getPerfectPropertyByImperfectProperty(Property, _RightPropertyList);
            CompareProperty = PropertyClass.getPerfectPropertyByImperfectProperty(CompareProperty, _RightPropertyList);
          } else if (Property) {
            Property = PropertyClass.getPerfectPropertyByImperfectProperty(Property, _RightPropertyList);
          }
          return { ..._it, Property, CompareProperty };
        });
        const [_Constraint] = PropertyClass.getConstraintAndTextByImperfectConstraint(Constraint, _LeftPropertyList);
        return { ...it, Constraint: _Constraint, List: _list };
      });
      return list;
    },
    RiskWarningDataList() {
      return this.getTargetDataList('risk');
    },
    InteractionDataList() {
      return this.getTargetDataList('interaction');
    },
    CompareDataList() {
      return this.getTargetDataList('compare');
    },
    subInteractionDataList() {
      return this.getTargetDataList('subInteraction');
    },
    subCompareDataList() {
      return this.getTargetDataList('subCompare');
    },
    dialogTitle() {
      if (this.setType4SubInteractionAndSubCompare === 'subCompare') {
        return this.initDialogDataStr ? '编辑子对比' : '添加子对比';
      }
      if (this.setType4SubInteractionAndSubCompare === 'subInteraction') {
        return this.initDialogDataStr ? '编辑子交互' : '添加子交互';
      }
      return '';
    },
  },
  methods: {
    async getPositionID() {
      if (!this.$route.params) {
        this.onGoBackClick();
        return;
      }
      const { ProductID, PartID, name, type } = this.$route.params;
      if (!ProductID || !PartID || !name || !type) {
        this.onGoBackClick();
        return;
      }
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
      this.getProductOrderData();
      this.getPropertyList4SubInteractionAndSubCompare();
      await this.$store.dispatch('productManage/getInteractionPropertyList', this.ProductID);
      this.showTable = true;
    },
    async getProductOrderData(dataType = ['Interaction']) { // 获取初始交互列表信息
      const ID = this.PartID ? this.PartID : this.ProductID;
      const List = this.$utils.getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
      const _temp = { ID, List };
      this.loading = true;
      await this.$store.dispatch('productManage/getProductInteractionDataList', _temp);
      this.loading = false;
    },
    onGoBackClick() {
      this.$router.replace('/ProductManageList');
    },
    handleJumpToNewPage(setType, data) {
      this.$store.commit('productManage/setCurInteractionData', data);
      const { ProductID, ProductName, titleType } = this;
      const PartID = this.PartID ? this.PartID : 'null';
      const path = `/ProductInteractionSet/${ProductID}/${PartID}/${ProductName}/${titleType}/${setType}/${Date.now()}`;
      this.$router.push(path);
    },
    async onSetupPageJump(setType, data) {
      if (setType !== 'subCompare' && setType !== 'subInteraction') {
        this.$store.commit('productManage/setSubTargetData', null);
        this.handleJumpToNewPage(setType, data);
      } else {
        if (data && data.target) {
          this.$store.commit('productManage/setSubTargetData', data.target);
          this.handleJumpToNewPage(setType, data);
          return;
        }
        const bool = await this.getPropertyList4SubInteractionAndSubCompare();
        if (bool) {
          this.setType4SubInteractionAndSubCompare = setType;
          this.itemData4SubInteractionAndSubCompare = data;
          if (data && data.target) {
            const str = JSON.stringify(data.target);
            if (str !== '{}') this.initDialogDataStr = str;
            else this.initDialogDataStr = '';
          } else {
            this.initDialogDataStr = '';
          }
          this.visible = true;
        }
      }
    },
    getTargetDataList(targetType) {
      if (!targetType || !Array.isArray(this.localInteractionDataList) || this.localInteractionDataList.length === 0) return [];
      const ControlType = this.$utils.getIDFromListByNames(targetType, this.ControlTypeList);
      let list = this.localInteractionDataList.filter(it => it.ControlType === ControlType);
      if (targetType === 'subCompare' || targetType === 'subInteraction') {
        list = list.map(it => ({
          ...it,
          target: this.getItemTarget(it, this.subDialogPropertyList),
        }));
      }
      return list;
    },
    getItemTarget(item, list) {
      const { ProductID, PartID, CraftID, GroupID } = item;
      const t = list.find(it => {
        const { Product, Part, Craft, Group } = it;
        if (!((Product && ProductID && Product.ID === ProductID) || (!Product && !ProductID))) return false;
        if (!((Part && PartID && Part.ID === PartID) || (!Part && !PartID))) return false;
        if (!((Craft && CraftID && Craft.ID === CraftID) || (!Craft && !CraftID))) return false;
        if (!((Group && GroupID && Group.ID === GroupID) || (!Group && !GroupID))) return false;
        return true;
      });
      return t || {};
    },
    async getPropertyList4SubInteractionAndSubCompare() { // 获取子公式子对比数据
      if (this.subDialogPropertyList && Array.isArray(this.subDialogPropertyList) && this.subDialogPropertyList.length > 0) return true;
      this.isSubDialogPropertyLoading = true;
      const resp = await this.api.getSubformulaUseableProperty(this.ProductID).catch(() => {});
      this.isSubDialogPropertyLoading = false;
      if (resp && resp.data.Status === 1000) {
        this.subDialogPropertyList = resp.data.Data;
        return true;
      }
      return false;
    },
    onSelectCompleted(e) { // 选择组件完成
      if (!e) return;
      this.$store.commit('productManage/setSubTargetData', e);
      // const idsObj = PropertyClass.getPropIDsObj(e);
      // const resp = PropertyClass.getPropertyList()
      this.visible = false;
      this.handleJumpToNewPage(this.setType4SubInteractionAndSubCompare, this.itemData4SubInteractionAndSubCompare);
    },
    onTableItemRemove(data) {
      if (!data) return;
      const label = this.ControlTypeList.find(it => it.ID === data.ControlType);
      const msg = label ? `交互类型：[ ${label.label} ]` : '';
      this.messageBox.warnCancelBox('确定删除该条设置吗', msg, () => {
        this.$store.dispatch('productManage/getProductControlRemove', data.ID);
      });
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-interaction-list-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 40px;
    line-height: 15px;
    box-sizing: border-box;
    height: 15px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
  }
  > main {
    flex: 1;
    padding-top: 15px;
    > section {
      padding-bottom: 45px;
      > header {
        padding-bottom: 20px;
        > .mp-common-title-wrap {
          font-size: 15px;
          color: #444;
          width: 7em;
          &::before {
            height: 16px;
          }
        }
        > .blue-span {
          font-size: 14px;
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
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
