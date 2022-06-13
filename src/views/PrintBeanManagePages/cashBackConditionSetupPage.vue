<template>
  <section class="mp-erp-cash-back-item-condition-setup-page-wrap">
    <header>
      <TableItemShowComp v-if="content" :list='content' effect='dark' class="products" title='产品' />
    </header>
    <main class="mp-scroll-wrap">
      <ContionCommonComp
        v-if="itemData && PropertyList && PropertyList.length > 0"
        ref="oLeftCondition"
        :PropertyList='PropertyList'
        :curEditData='itemData'
        :showPriority='false'
        single
      />
    </main>
    <footer>
      <el-button :disabled='!PropertyList || !itemData || PropertyList.length === 0'
       @click="onSubmitClick" class="is-blue-button" type="primary">确定</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp.vue';
import TableItemShowComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/TableItemShowComp';
import { getSelectedContentBySelectedDataAndAllData } from '@/components/common/SelectorComps/NewAreaTreeSpreadComp/utils';

export default {
  name: 'cashBackConditionSetupPage',
  components: {
    ContionCommonComp,
    TableItemShowComp,
  },
  computed: {
    ...mapState('cashback', ['curItemData']),
    ...mapGetters('common', ['allProductClassify']),
  },
  data() {
    return {
      itemData: null,
      ProductID: '',
      UseModule: 49,
      PropertyList: [],
      content: null,
    };
  },
  methods: {
    getInitData() {
      if (!this.curItemData) return;
      const { level1Index, level2Index } = this.$route.params;
      const t = this.curItemData.ItemList?.[level1Index]?.RangeList?.[level2Index];
      if (t) {
        const { Constraint, ProductClassList, IsIncludeIncreasedProduct } = t;
        this.itemData = { Constraint: JSON.parse(JSON.stringify(Constraint)) };
        if (!IsIncludeIncreasedProduct && ProductClassList.length === 1) {
          const [{ IsIncludeIncreased, List }] = ProductClassList;
          if (!IsIncludeIncreased && List.length === 1) {
            if (!List[0].IsIncludeIncreased && List[0].List.length === 1) {
              this.ProductID = List[0].List[0].ID;
            }
          }
        }
        const temp = { List: ProductClassList, IsIncludeIncreased: IsIncludeIncreasedProduct };
        this.content = getSelectedContentBySelectedDataAndAllData(temp, this.allProductClassify, '产品');
      }
    },
    async getPropertyList() {
      if (!this.curItemData) return;
      const t = this.curItemData._allPropertyList.find(it => it.id === this.ProductID);
      if (t) {
        this.PropertyList = t.PropertyList;
        return;
      }
      const temp = { UseModule: this.UseModule };
      if (this.ProductID) {
        temp.ProductID = this.ProductID;
      }
      const res = await PropertyClass.getPropertyList(temp);
      if (res) {
        this.PropertyList = res;
        this.$store.commit('cashback/addItemToAllPropertyList', { PropertyList: res, id: this.ProductID });
      }
    },
    onGoBackClick() {
      this.$goback();
    },
    onSubmitClick() {
      const condition = this.$refs.oLeftCondition.getConditonResult();
      if (!condition) return;
      this.onSubmitSave(condition);
    },
    onSubmitSave({ Constraint }) {
      // 保存并返回页面
      const { level1Index, level2Index } = this.$route.params;
      this.$store.commit('cashback/handleRightProductConditionSetup', [Constraint, level1Index, level2Index]);
      this.onGoBackClick();
    },
  },
  mounted() {
    this.getInitData();
    this.getPropertyList();
  },
};
</script>
<style lang='scss'>
.mp-erp-cash-back-item-condition-setup-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 20px;
  width: 800px;
  > header {
    flex: none;
    padding: 25px 0;
    font-size: 14px;
    font-weight: 700;
    color: #21CAE3;
    padding-bottom: 20px;
  }
  > main {
    flex: 1;
    overflow: auto;
    overflow: overlay;
  }
  > footer {
    text-align: left;
    padding: 25px;
    padding-top: 40px;
    flex: none;
    padding-left: 260px;
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
