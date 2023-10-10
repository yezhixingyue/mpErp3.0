<template>
  <section class="mp-erp-price-module-makeup-ctrl-page-material-wastage-panel-wrap">
    <header>
      <el-radio-group v-model="Rule">
        <el-radio :label="it.ID" v-for="it in WastageRuleList" :key="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
      <div>
        <el-input v-model.trim="Value" size="mini" maxlength="9" v-show="!Formula"></el-input>
        <el-select v-model="Unit" size="mini" v-show="!Formula">
          <el-option
            v-for="item in WastageUnitList"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>
        <div class="formula-box" v-show="Formula">
          <span :title="Formula ? `公式:${Formula.Name}` : ''">{{ Formula ? `公式:${Formula.Name}` : '' }}</span>
          <span>张</span>
        </div>
        <el-select v-model="UnitType" size="mini">
          <el-option
            v-for="item in WastageUnitTypeList"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>
        <span class="blue-span" @click="onUseFormulaClick">使用公式</span>
        <span class="is-font-size-12 is-gray">（ {{ Formula ? '已使用' : '未使用' }} ）</span>
      </div>
    </header>
    <main>
      <div class="tips-box">
        <aside>
          <i class="el-icon-warning"></i>
          <span>注：</span>
        </aside>
        <ul>
          <li>展开物料数量指以展开尺寸为大小的物料数量。</li>
          <li>印刷幅面物料数量指的是拼成大版后需要印刷的物料数量，如四开、对开。</li>
          <li>百分比以产品/部件实际数量不加任何损耗的情况下为基数。</li>
        </ul>
      </div>
    </main>
    <ProductFormulasSelectDialog :visible.sync='visible' :list='SizeNumberPropertyList' title='选择公式'
     :productData='productData' @select='onPropSelect' :selectedIDs='selectedIDs' />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ProductFormulasSelectDialog from '@/components/common/FormulaAndConditionComps/ProductFormulasSelectDialog.vue';

export default {
  props: {
    initData: {
      type: Object,
      default: null,
    },
    SizeNumberPropertyList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    // FormulaPanelElementSelectDialog,
    ProductFormulasSelectDialog,
  },
  computed: {
    ...mapState('priceManage', ['WastageRuleList', 'WastageUnitTypeList', 'WastageUnitList']),
    selectedIDs() {
      if (!this.Formula) return [];
      return [this.Formula.ID || ''];
    },
  },
  data() {
    return {
      Rule: 0,
      Value: '',
      Unit: 0,
      UnitType: 1,
      visible: false,
      productData: null,
      Formula: null,
    };
  },
  methods: {
    getSubmitInfo() {
      const { Rule, Value, Unit, UnitType } = this;
      if (Value === '' && Value === null && !this.Formula) {
        this.messageBox.failSingleError('保存失败', '请设置损耗数量');
        return null;
      }

      if (!this.Formula) {
        const bool = this.$utils.getValueIsOrNotNumber(Value, Unit !== 0);
        if (!bool) {
          this.messageBox.failSingleError('保存失败', '损耗数量输入不正确，应为数字类型，单位为%时可使用小数');
          return null;
        }
        if (+Value < 0) {
          this.messageBox.failSingleError('保存失败', '损耗数量不能为负');
          return null;
        }
      }
      const Wastage = {
        Rule,
        UnitType,
      };
      if (this.Formula) Wastage.FormulaID = this.Formula.ID;
      else {
        Wastage.Unit = Unit;
        Wastage.Value = Value;
      }
      return { Wastage };
    },
    initEditData() {
      this.getProductData();
      if (this.initData && this.initData.Wastage) {
        const { Rule, Value, Unit, UnitType, FormulaID } = this.initData.Wastage;
        this.Rule = (Rule || Rule === 0) ? Rule : 0;
        this.Value = (Value || Value === 0) ? Value : 0;
        this.Unit = (Unit || Unit === 0) ? Unit : 0;
        this.UnitType = (UnitType || UnitType === 0) ? UnitType : 0;
        if (FormulaID) {
          const t = this.SizeNumberPropertyList.find(it => it.ID === FormulaID);
          if (t) this.Formula = t;
        }
      }
    },
    onPropSelect(e) {
      this.Formula = e;
    },
    onUseFormulaClick() {
      this.visible = true;
    },
    async getProductData() {
      const resp = await this.$store.dispatch('priceManage/getProductCraftData', this.$route.params.ProductID);
      if (resp) this.productData = resp;
    },
  },
  mounted() {
    this.initEditData();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-ctrl-page-material-wastage-panel-wrap {
  > header {
    padding-top: 5px;
    .el-radio {
      margin-right: 40px;
      margin-bottom: 30px;
      .el-radio__label {
        font-size: 12px;
        color: #444;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
    > div {
      display: flex;
      line-height: 28px;
      align-items: center;
      > .el-input {
        width: 95px;
        margin-right: 15px;
      }
      .el-select {
        width: 80px;
        &:last-of-type {
          width: 150px;
          margin-left: 15px;
        }
      }
      .el-input__inner {
        font-size: 12px;
      }
      .blue-span {
        line-height: 28px;
        margin-left: 30px;
        & + .is-gray {
          letter-spacing: 0.5px;
          margin-left: 2px;
        }
      }
      .formula-box {
        height: 28px;
        color: #585858;
        > span {
          display: inline-block;
          vertical-align: top;
          width: 145px;
          margin-right: 15px;
          text-align: center;
          color: #444;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 13px;
          &:last-of-type {
            color: #989898;
            width: 30px;
            margin-right: 0;
            font-size: 12px;
          }
        }
      }
    }
  }
  > main {
    padding-top: 10vh;
    > div {
      height: 90px;
      display: flex;
      padding-top: 5px;
      > aside {
        width: 58px;
        text-align: right;
        flex: none;
        margin-right: 2px;
      }
      > ul {
        letter-spacing: 1px;
      }
    }
  }
}
</style>
