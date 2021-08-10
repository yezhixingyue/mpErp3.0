<template>
  <section class="mp-erp-price-module-quotation-result-setup-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="name">价格名称：{{PriceName}}</span>
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp" :ComparePropertyList='PriceItemPropertyList' :PropertyList='PriceItemPropertyList'
       leftWidth='715px' :curEditData='curQuotationResultData' rightTitle="则使用下列报价方案">
        <!-- 右侧面板 -->
        <div class="right-solution-setup-panel">
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="it in SolutionList" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-checkbox>
          </el-checkbox-group>
          <el-radio-group v-model="form.UseMinPrice">
            <el-radio :label="true">以上价格选择最低价</el-radio>
            <el-radio :label="false">以上价格选择最高价</el-radio>
          </el-radio-group>
          <div class="tip">
            <p class="tips-box">
              <i class="el-icon-warning"></i>
              <span>注：如果报价方案没有报出价格，则不参与比价！</span>
            </p>
          </div>
        </div>
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

export default {
  name: 'QuotationResultSet',
  components: {
    ContionCommonComp,
  },
  data() {
    return {
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
      form: {
        List: [],
        UseMinPrice: true,
      },
    };
  },
  computed: {
    ...mapState('priceManage', ['curPriceItem', 'curQuotationResultData', 'PriceItemPropertyList']),
    checkList: {
      get() {
        return this.form.List.map(it => it.ID);
      },
      set(val) {
        this.form.List = val.map(it => ({ ID: it }));
      },
    },
    SolutionList() {
      return this.curPriceItem?.SolutionList || [];
    },
    SolutionListIDs() {
      return this.SolutionList.map(it => it.ID);
    },
  },
  methods: {
    initDataFromPath() {
      const { ID, Name } = this.curPriceItem;
      this.PriceID = ID;
      this.PriceName = Name;
      this.ProductID = this.$route.params.id;
      this.ProductName = this.$route.params.name;
      if (this.curQuotationResultData) {
        const { UseMinPrice, List } = this.curQuotationResultData;
        this.form.UseMinPrice = UseMinPrice;
        this.form.List = List.filter(it => this.SolutionListIDs.includes(it.ID));
      }
    },
    onGoBackClick() {
      this.$router.replace({
        name: 'QuotationResult',
        params: this.$route.params,
      });
    },
    onSubmitClick() {
      const condition = this.$refs.oLeftComp.getConditonResult();
      if (!condition) return;
      if (this.checkList.length === 0) {
        this.messageBox.failSingleError('保存失败', '请选择方案');
        return;
      }
      const temp = { ...condition, ...this.form, PriceID: this.PriceID };
      this.submitSave(temp);
    },
    async submitSave(data) {
      const resp = await this.api.getPriceResultSetup(data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        // 保存成功
        const isEdit = !!data.ID;
        const msg = isEdit ? '编辑成功' : '添加成功';
        const callback = () => {
          // this.$emit('successSubmit', [isEdit, data, resp.data.Data]);
          this.$store.commit('priceManage/setPriceResultItemChange', [data, resp.data.Data, this.ProductID, this.PriceID]);
          this.onGoBackClick();
        };
        this.messageBox.successSingle(msg, callback, callback);
      }
    },
  },
  mounted() {
    this.initDataFromPath();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-quotation-result-setup-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 20px;
    line-height: 15px;
    box-sizing: border-box;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    .name {
      font-weight: 400;
      margin-left: 80px;
      font-size: 14px;
      & + .name {
        margin-left: 40px;
      }
    }
    > p {
      padding-top: 40px;
      > button {
        width: 125px;
        font-size: 14px;
      }
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    padding-left: 5px;
    .right-solution-setup-panel {
      max-width: 680px;
      min-width: 540px;
      .el-checkbox-group {
        padding-bottom: 55px;
        padding-top: 10px;
        .el-checkbox {
          margin-right: 10px;
          margin-bottom: 8px;
          .el-checkbox__label {
            font-size: 12px;
            color: #585858;
            width: 100px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            vertical-align: -4px;
          }
        }
      }
      .el-radio-group {
        width: 100%;
        text-align: center;
        .el-radio__label {
          font-size: 12px;
          color: #444;
        }
      }
      > .tip {
        display: flex;
        justify-content: center;
        padding-top: 32px;
        > p {
          width: 400px;
          letter-spacing: 1px;
        }
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
