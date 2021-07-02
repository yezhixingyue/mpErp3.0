<template>
  <section class="mp-erp-product-list-page-product-interaction-list-page-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <template v-if="showTable">
        <!-- 界面交互 -->
        <RiskWarningTable
        @setup="onSetupPageJump('interaction', $event)" type='interaction' :dataList='InteractionDataList' :PropertyList='InteractionLeftPropertyList' />
        <!-- 对比验证 -->
        <CompareInteractionTable @setup="onSetupPageJump('compare', $event)" />
        <!-- 风险提示 -->
        <RiskWarningTable @setup="onSetupPageJump('risk', $event)" type='risk' :dataList='RiskWarningDataList' :PropertyList='InteractionLeftPropertyList' />
        <!-- 子交互 -->
        <SubInteractionTable />
        <!-- 子对比 -->
        <SubCompareTable />
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
import CompareInteractionTable from '@/components/ProductManageComps/Interaction/ListTableComps/CompareInteractionTable.vue';
import RiskWarningTable from '@/components/ProductManageComps/Interaction/ListTableComps/RiskWarningTable.vue';
import SubInteractionTable from '@/components/ProductManageComps/Interaction/ListTableComps/SubInteractionTable.vue';
import SubCompareTable from '@/components/ProductManageComps/Interaction/ListTableComps/SubCompareTable.vue';

export default {
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      showTable: false,
    };
  },
  components: {
    CompareInteractionTable,
    RiskWarningTable,
    SubInteractionTable,
    SubCompareTable,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList', 'ProductInteractionDataList',
      'ControlTypeList', 'InteractionLeftPropertyList', 'InteractionRightPropertyList']),
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
        const _list = List.map(_it => {
          let { Property } = _it;
          // let { Property, CompareProperty } = _it;
          if (!Property) return _it;
          if (Property) Property = PropertyClass.getPerfectPropertyByImperfectProperty(Property, this.InteractionRightPropertyList);
          // if (CompareProperty) CompareProperty = PropertyClass.getPerfectPropertyByImperfectProperty(CompareProperty, this.InteractionRightPropertyList);
          return { ..._it, Property };
          // return { ..._it, Property, CompareProperty };
        });
        let { ItemList } = Constraint;
        ItemList = ItemList
          .map(item => {
            const { Property, ValueList } = item;
            if (Array.isArray(ValueList) && ValueList.length === 1 && !ValueList[0].Value && ValueList[0].Property) {
              ValueList[0].Property = PropertyClass.getPerfectPropertyByImperfectProperty(ValueList[0].Property, this.InteractionLeftPropertyList);
            }
            return {
              ...item,
              Property: PropertyClass.getPerfectPropertyByImperfectProperty(Property, this.InteractionLeftPropertyList),
              ValueList,
            };
          })
          .filter(item => item.Property);
        return { ...it, Constraint: { ...Constraint, ItemList }, List: _list };
      });
      return list;
    },
    RiskWarningDataList() {
      if (!Array.isArray(this.localInteractionDataList) || this.localInteractionDataList.length === 0) return [];
      const ControlType = this.$utils.getIDFromListByNames('risk', this.ControlTypeList);
      const list = this.localInteractionDataList.filter(it => it.ControlType === ControlType);
      return list;
    },
    InteractionDataList() {
      if (!Array.isArray(this.localInteractionDataList) || this.localInteractionDataList.length === 0) return [];
      const ControlType = this.$utils.getIDFromListByNames('interaction', this.ControlTypeList);
      const list = this.localInteractionDataList.filter(it => it.ControlType === ControlType);
      return list;
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
    onSetupPageJump(setType, data) {
      this.$store.commit('productManage/setCurInteractionData', data);
      // eslint-disable-next-line max-len
      const path = `/ProductInteractionSet/${this.ProductID}/${this.PartID ? this.PartID : 'null'}/${this.ProductName}/${this.titleType}/${setType}/${Date.now()}`;
      this.$router.push(path);
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
