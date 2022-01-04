<template>
  <section class="mp-erp-common-module-formula-setup-page-comp-wrap">
    <header>
      <slot name="header"></slot> <!-- h2 span -->
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp" :ComparePropertyList='FormulaConditionPropertyList' :PropertyList='FormulaConditionPropertyList'
       leftWidth='45%' :curEditData='curEditItemData' rightTitle="使用此公式">
        <!-- 右侧公式设置 -->
        <FormulaPanelComp
          ref="oRightFormulaPanel"
          hiddenHeader
          isSingle
          :NowEditFormulaData='curEditItemData || {}'
          :Condition4getProperty='Condition4getProperty'
        >
        </FormulaPanelComp>
      </ContionCommonComp>
    </main>
    <footer>
      <el-button type="primary" @click="onSubmitClick">保存</el-button>
      <el-button @click="onGoBackClick" class="go-back">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp.vue';
import FormulaPanelComp from '@/components/common/FormulaAndConditionComps/FormulaPanelComp.vue';

export default {
  props: {
    FormulaConditionPropertyList: {
      type: Array,
      default: () => [],
    },
    curEditItemData: { // 有值为编辑 无值为新增
      type: Object,
      default: null,
    },
    Condition4getProperty: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ContionCommonComp,
    FormulaPanelComp,
  },
  data() {
    return {
      isQuotationPage: false,
      isAllCostPage: false,
      CraftPriceID: '',
    };
  },
  computed: {
    ...mapState('priceManage', ['curCraftPriceItemData', 'curPriceItem', 'curPriceTableItemData']),
  },
  methods: {
    onGoBackClick() { // 返回上一页
      this.$goback();
    },
    onSubmitClick() {
      const condition = this.$refs.oLeftComp.getConditonResult();
      if (!condition) return;
      const formulaData = this.$refs.oRightFormulaPanel.getFormulaData();
      if (!formulaData) return;
      const { Constraint, Priority, ID } = condition;
      const { Content, PropertyList, Remark } = formulaData;
      const temp = { ID, Constraint, Priority, Content, PropertyList, Remark, ...this.Condition4getProperty, CraftPriceID: this.CraftPriceID };
      this.submitSave(temp);
    },
    async submitSave(data) {
      const resp = await this.api.getFormulaSave(data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        // 保存成功
        const isEdit = !!data.ID;
        const msg = isEdit ? '编辑成功' : '添加成功';
        const callback = () => {
          this.$emit('successSubmit', [isEdit, data, resp.data.Data]);
          this.onGoBackClick();
        };
        this.messageBox.successSingle(msg, callback, callback);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-module-formula-setup-page-comp-wrap {
  display: flex;
  flex-direction: column;
  min-width: 1200px;
  height: 100%;
  > header {
    padding: 20px;
    padding-bottom: 30px;
    line-height: 15px;
    background-color: #fff;
    box-sizing: border-box;
    flex: none;
    display: flex;
    color: #21CAE3;
    font-size: 14px;
    align-items: center;
    > h2 {
      font-weight: 700;
      font-size: 15px;
    }
    > span {
      margin-left: 50px;
    }
  }
  > main {
    flex: 1;
    padding: 20px;
    overflow: hidden;
    .right {
      height: 100%;
      .right-content {
        min-width: 780px;
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    bottom: 20px;
    > button {
      width: 120px;
      height: 35px;
      border-radius: 3px;
      padding: 0;
      &.go-back {
        border: 1px solid #26BCF9;
        color: #26BCF9;
        margin-left: 40px;
      }
    }
  }
}
</style>
