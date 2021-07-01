<template>
  <section class="mp-erp-product-list-page-product-interaction-list-page-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <!-- 界面交互 -->
      <DisplayInteractionTable @setup="onSetupPageJump('interaction', $event)" />
      <!-- 对比验证 -->
      <CompareInteractionTable @setup="onSetupPageJump('compare', $event)" />
      <!-- 风险提示 -->
      <RiskWarningTable @setup="onSetupPageJump('risk', $event)" :dataList='RiskWarningDataList' :PropertyList='InteractionLeftPropertyList' />
      <!-- 子交互 -->
      <SubInteractionTable />
      <!-- 子对比 -->
      <SubCompareTable />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import DisplayInteractionTable from '@/components/ProductManageComps/Interaction/ListTableComps/DisplayInteractionTable.vue';
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
    };
  },
  components: {
    DisplayInteractionTable,
    CompareInteractionTable,
    RiskWarningTable,
    SubInteractionTable,
    SubCompareTable,
  },
  computed: {
    // eslint-disable-next-line max-len
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList', 'ProductInteractionDataList', 'ControlTypeList', 'InteractionLeftPropertyList']),
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
      const list = this.ProductInteractionDataList.map(it => {
        const { Constraint } = it;
        let { ItemList } = Constraint;
        ItemList = ItemList
          .map(item => ({ ...item, Property: PropertyClass.getPerfectPropertyByImperfectProperty(item.Property, this.InteractionLeftPropertyList) }))
          .filter(item => item.Property);
        return { ...it, Constraint: { ...Constraint, ItemList } };
      });
      return list;
    },
    RiskWarningDataList() {
      if (!Array.isArray(this.localInteractionDataList) || this.localInteractionDataList.length === 0) return [];
      const ControlType = this.$utils.getIDFromListByNames('risk', this.ControlTypeList);
      const list = this.localInteractionDataList.filter(it => it.ControlType === ControlType);
      return list;
    },
  },
  methods: {
    getPositionID() {
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
      this.$store.dispatch('productManage/getInteractionLeftPropertyList', this.ProductID);
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
      console.log(data);
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
