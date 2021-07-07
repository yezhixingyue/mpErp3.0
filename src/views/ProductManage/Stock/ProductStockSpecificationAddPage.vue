<template>
  <section class="mp-erp-product-list-page-product-stock-set-comp-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp" :PropertyList='StockLeftPropertyList' rightTitle='产品库存' >
        <p>
          <span class="label">核减数量：</span>
          <span class="blue-span" @click="selectVisible=true">选择</span>
          <span class="selected-property" v-if="rightData.Property">
            <i>{{rightData.Property.DisplayContent.replace(/\[|\]/g, '')}}</i>
            <i v-if="rightData.Property.Unit">（单位：{{rightData.Property.Unit}}）</i>
          </span>
        </p>
        <ul>
          <li>
            <span class="label">初始库存：</span>
            <el-input maxlength="9" v-model.number.trim="rightData.Number" size="small"></el-input>
            <span class="intro">-1代表无穷大</span>
          </li>
          <li>
            <span class="label">单位：</span>
            <el-input maxlength="6" v-model.trim="rightData.Unit" size="small"></el-input>
          </li>
        </ul>
      </ContionCommonComp>
      <FormulaPanelElementSelectDialog :DialogTitle="fixedPartName" :fixedPartName='fixedPartName'
       :visible.sync='selectVisible' :list='StockRightPropertyList' @submit='onElementSelect' :selectedElementIDs='[]' />
    </main>
    <footer>
      <p>
        <span class="is-origin">注：保存后不能再进行编辑，只能更改库存数量</span>
      </p>
      <el-button @click="onSubmitClick" type="primary">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp.vue';
import FormulaPanelElementSelectDialog from '@/components/common/FormulaAndConditionComps/FormulaPanelElementSelectDialog.vue';

export default {
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      fixedPartName: '',
      rightData: {
        Number: '',
        Unit: '',
        Property: null,
      },
      selectVisible: false,
    };
  },
  components: {
    ContionCommonComp,
    FormulaPanelElementSelectDialog,
  },
  computed: {
    ...mapState('productManage', ['StockLeftPropertyList', 'StockRightPropertyList']),
  },
  methods: {
    getPositionID() {
      if (!this.$route.params) {
        this.onGoBackClick();
        return;
      }
      const { ProductID, PartID, name, type, fixedPartName } = this.$route.params;
      if (!ProductID || !PartID || !name || !type) {
        this.onGoBackClick();
        return;
      }
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
      this.fixedPartName = fixedPartName;
    },
    onSubmitClick() {
      const condition = this.$refs.oLeftComp.getConditonResult();
      if (!condition) return;
      if (!this.rightData.Property) {
        this.messageBox.failSingleError('保存失败', '请选择核减数量元素');
        return;
      }
      if (!this.rightData.Number && this.rightData.Number !== 0) {
        this.messageBox.failSingleError('保存失败', '请输入初始库存');
        return;
      }
      if (!this.$utils.isPositiveInteger(this.rightData.Number, true, true)) {
        this.messageBox.failSingleError('保存失败', '初始库存输入值不正确，可为0，-1及正整数');
        return;
      }
      const { ProductID, PartID } = this;
      const temp = { ...condition, ...this.rightData, ProductID, PartID };
      this.$store.dispatch('productManage/getProductStockSave', [temp, this.onGoBackClick]);
    },
    onGoBackClick() {
      this.$router.replace(`/ProductStockList/${this.ProductID}/null/${this.ProductName}/${this.titleType}/${Date.now()}`);
      // this.$goback();
    },
    onElementSelect(e) {
      this.rightData.Property = e;
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-stock-set-comp-wrap {
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
    .right-content-main-wrap {
      .label {
        font-size: 14px;
        color: #888E99;
        margin-right: 4px;
      }
      > p {
        white-space: nowrap;
        .blue-span {
          font-size: 14px;
          margin-right: 30px;
        }
        .selected-property {
          font-size: 12px;
          color: #999999;
          white-space: nowrap;
        }
        margin-bottom: 20px;
      }
      > ul {
        display: flex;
        > li {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          position: relative;
          margin-right: 25px;
          .el-input {
            width: 120px;
            flex: 0 0 auto;
          }
          .intro {
            position: absolute;
            font-size: 12px;
            color: #A2A2A2;
            width: 118px;
            line-height: 24px;
            right: 0;
            top: 32px;
          }
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
    > p {
      font-size: 12px;
      margin-bottom: 20px;
      padding-right: 15px;
    }
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
