<template>
  <section class="mp-erp-promote-condition-set-page-wrap">
    <header>
      <span>活动产品：</span>
      <span>{{$route.params.productNames}}</span>
    </header>
    <main>
      <ContionCommonComp v-if="!loading" ref="oLeftComp" :PropertyList='PropertyList' :ComparePropertyList='PropertyList' :showPriority='false'
        leftWidth='45%' :curEditData='curEditData' rightTitle="则执行价格"
        :adAreaList="adAreaList" :areaList="areaList" :allAdAreaTreeList="allAdAreaTreeList"
        :allProductClassify="allProductClassify" :allProductAndLevelList="allProductAndLevelList" :allAreaTreeList="allAreaTreeList">
        <ResultComps
          :PriceUnitList='PriceUnitList'
          v-model="priceData" />
      </ContionCommonComp>
    </main>
    <footer>
      <el-button @click="onSubmitClick" type="primary">确定</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ContionCommonComp } from '@/components/common/mpzj-sell-lib/lib';
import ResultComps from '@/components/Promote/Comps/ResultComps';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import PromoteAddEditObjClassType from '@/store/Promote/PromoteAddEditObjClassType';

export default {
  name: 'promoteConditionSet',
  components: {
    ContionCommonComp,
    ResultComps,
  },
  data() {
    return {
      curEditData: null,
      priceData: {
        PriceUnit: '',
        Price: '',
      },
      PropertyList: [],
      loading: true,
    };
  },
  computed: {
    ...mapState('promoteStore', ['promoteAddRequestObj']), // commonPropertyList
    ...mapState('common', ['adAreaList', 'areaList', 'PriceUnitList']),
    ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allProductAndLevelList', 'allAreaTreeList']),
  },
  methods: {
    onSubmitClick() {
      const condition = this.$refs.oLeftComp.getConditonResult();
      if (!condition) return;
      const { PriceUnit, Price } = this.priceData;
      if (!PriceUnit && PriceUnit !== 0) {
        this.messageBox.failSingleError('保存失败', '请设置活动价格类型');
        return;
      }
      if (!Price) {
        this.messageBox.failSingleError('保存失败', '请输入活动执行价格');
        return;
      }
      if (!this.$utils.getValueIsOrNotNumber(Price) || Price <= 0) {
        this.messageBox.failSingleError('保存失败', '活动执行价格应为大于0的数字类型');
        return;
      }
      const t = this.PriceUnitList.find(it => it.ID === PriceUnit);
      if (t) {
        if (t.name === '百分比' && Price > 100) {
          this.messageBox.failSingleError('保存失败', '百分比折扣不能大于100%');
          return;
        }
        // 开始提交
        const obj = {
          Constraint: condition.Constraint,
          PriceUnit,
          Price,
        };
        if (this.$route.params.itemIndex === 'new') {
          this.$store.commit('promoteStore/addPrice4AddRequestObj', [this.$route.params.productIndex, obj]);
        } else {
          this.$store.commit('promoteStore/delPrice4AddRequestObj', [this.$route.params.productIndex, this.$route.params.itemIndex, obj]);
        }
        this.onGoBackClick();
      }
    },
    onGoBackClick() {
      this.$goback();
    },
    async getPropertyList(obj, PropertyList) {
      if (!obj.ProductID) {
        if (this.promoteAddRequestObj.commonPropertyList.length > 0) this.PropertyList = this.promoteAddRequestObj.commonPropertyList;
        else {
          const list = await PropertyClass.getPropertyList(obj);
          if (list) {
            this.PropertyList = list;
            this.$store.commit('promoteStore/addCommonPropertyListToAddRequestObj', list);
          }
        }
      } else if (PropertyList && PropertyList.length > 0) {
        this.PropertyList = PropertyList;
      } else {
        const list = await PropertyClass.getPropertyList(obj);
        if (list) {
          this.PropertyList = list;
          this.$store.commit('promoteStore/addSingleProductPropertyListToAddRequestObj', [list, this.$route.params.productIndex]);
        }
      }

      this.loading = false;
    },
    getInitData() { // 初始化数据（存在编辑或新增2种情况）
      const _data = this.promoteAddRequestObj.ProductList[this.$route.params.productIndex];
      const { ProductClassList, PropertyList, IsIncludeIncreasedProduct } = _data;
      if ((!ProductClassList || ProductClassList.length === 0) && !IsIncludeIncreasedProduct) {
        this.loading = false;
        return;
      }
      const obj = { UseModule: 41 };
      const ProductID = PromoteAddEditObjClassType.getUniqueProductID(_data);
      if (ProductID) obj.ProductID = ProductID;
      if (this.$route.params.itemIndex !== 'new') {
        // 还原curEditData 与 priceData
        const { Constraint, PriceUnit, Price } = _data.ItemList[this.$route.params.itemIndex];
        this.curEditData = { Constraint };
        this.priceData = { PriceUnit, Price };
      } else {
        this.curEditData = null;
        this.priceData = {
          PriceUnit: this.PriceUnitList && this.PriceUnitList[0] ? this.PriceUnitList[0].ID : '',
          Price: '',
        };
      }
      this.getPropertyList(obj, PropertyList);
    },
  },
  mounted() {
    this.getInitData();
  },
};
</script>
<style lang='scss'>
.mp-erp-promote-condition-set-page-wrap {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    color: #21CAE3;
    font-size: 15px;
    padding: 30px 0;
    font-weight: 700;
    flex: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 80px;
  }
  > main {
    flex: 1;
    padding-bottom: 30px;
    .right {
      > .right-content > header {
        padding-top: 20px;
      }
    }
  }
  > footer {
    flex: none;
    padding: 25px 0 30px 0;
    text-align: center;
    > button.el-button {
      padding: 0;
      width: 120px;
      height: 35px;
      & + button.el-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
