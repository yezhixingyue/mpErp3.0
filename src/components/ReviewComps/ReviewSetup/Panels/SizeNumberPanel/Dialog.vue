<template>
  <CommonDialogComp
    width="800px"
    :title="title"
    :visible.sync="localVisible"
    class="mp-erp-review-setting-panels-size-number-panel-dialog-comp-wrap"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    submitText="确定"
    top="6vh"
  >
    <template v-if="ruleForm">
      <p class="mp-common-title-wrap">输出文件：</p>
      <OutputFileListSelectComp :loading="loading" :OutputFileList="OutputFileList" onlyPDF v-model="ruleForm.FileList" :disabledIds="disabledFileIds" />

      <p class="mp-common-title-wrap" style="margin-bottom: 20px">
        <label>宽高互换：</label>
        <el-checkbox v-model="ruleForm.AllowSizeExchange">允许宽高互换</el-checkbox>
      </p>

      <p class="mp-common-title-wrap">
        <label>宽：</label>
        <span class="blue-span" @click="onFormulaSelectClick('LengthFormula')">选择公式</span>
        <span class="formula" :class="{'is-gray':!(ruleForm&&ruleForm.LengthFormula)}">{{getFormulaName('LengthFormula')}}</span>
      </p>
      <dl class="content ft-12" v-show="ruleForm&&ruleForm.LengthFormula">
        <dt>宽允许误差：</dt>
        <dd>
          <i>+</i>
          <el-input size="mini" maxlength="9" v-model.trim="ruleForm.LengthErrorRange.MaxValue"></el-input>
          <em>mm</em>
        </dd>
        <dd>
          <i>-</i>
          <el-input size="mini" maxlength="9" v-model.trim="ruleForm.LengthErrorRange.MinValue"></el-input>
          <em>mm</em>
        </dd>
      </dl>

      <p class="mp-common-title-wrap">
        <label>高：</label>
        <span class="blue-span" @click="onFormulaSelectClick('WidthFormula')">选择公式</span>
        <span class="formula" :class="{'is-gray':!(ruleForm&&ruleForm.WidthFormula)}">{{getFormulaName('WidthFormula')}}</span>
      </p>
      <dl class="content ft-12" v-show="ruleForm&&ruleForm.WidthFormula">
        <dt>高允许误差：</dt>
        <dd>
          <i>+</i>
          <el-input size="mini" maxlength="9" v-model.trim="ruleForm.WidthErrorRange.MaxValue"></el-input>
          <em>mm</em>
        </dd>
        <dd>
          <i>-</i>
          <el-input size="mini" maxlength="9" v-model.trim="ruleForm.WidthErrorRange.MinValue"></el-input>
          <em>mm</em>
        </dd>
      </dl>

      <p class="mp-common-title-wrap">出血：</p>
      <BleedSetupComp :ruleForm='ruleForm' @change="onBleedChange"/>

      <p class="mp-common-title-wrap">
        <label>修改产品数量为：</label>
        <span class="blue-span" @click="onFormulaSelectClick('NumberFormula')">选择公式</span>
        <span class="formula" :class="{'is-gray':!(ruleForm&&ruleForm.NumberFormula)}">{{getFormulaName('NumberFormula')}}</span>
      </p>

      <p class="is-pink">注：1. 尺寸公式的单位必须是毫米，否则会造成文件尺寸检查结果完全不符合预期</p>
      <p class="is-pink s">2. 数量公式单位须与产品/部件的数量单位保持一致，否则会造成不可预测的结果。</p>
    </template>
    <ProductFormulasSelectDialog :visible.sync='formulaVisible' :list='formulaList' title="选择公式" hideConstant
     :canEmpty="curkey==='NumberFormula'"
     :productData='productDetailData' @select='onPropertySelected' :selectedIDs='selectedIDs' />
  </CommonDialogComp>
</template>

<script>
import { mapState } from 'vuex';
import { PropertyClass } from '@/components/common/mpzj-sell-lib/lib';
import CommonDialogComp from '../../../../../packages/CommonDialogComp';
import OutputFileListSelectComp from '../OutputFileListSelectComp.vue';
import ProductFormulasSelectDialog from '../../../../common/FormulaAndConditionComps/ProductFormulasSelectDialog.vue';
import SizeNumberItemClass from './SizeNumberItemClass';
import { getIDFromListByNames } from '../../../../../assets/js/utils/util';
import BleedSetupComp from './BleedSetupComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
    product: {
      type: Object,
      default: null,
    },
    part: {
      type: Object,
      default: null,
    },
    disabledFileIds: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    OutputFileListSelectComp,
    ProductFormulasSelectDialog,
    BleedSetupComp,
  },
  computed: {
    ...mapState('review', ['OutputFileList', 'loading']),
    ...mapState('productManage', ['ProductModuleKeyIDList']),
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    title() {
      return this.item ? '编辑文件尺寸检查' : '添加文件尺寸检查';
    },
    selectedIDs() {
      const id = this.curkey && this.ruleForm && this.ruleForm[this.curkey] && this.ruleForm[this.curkey].ID;
      return id ? [id] : [];
    },
  },
  data() {
    return {
      ruleForm: null,
      formulaVisible: false,
      formulaList: [],
      productDetailData: null,
      curkey: '',
    };
  },
  methods: {
    getFileList() {
      if (this.OutputFileList.length === 0) {
        this.$store.dispatch('review/getOutputFileList');
      }
    },
    async getProductFormulasList() {
      if (!this.product || this.formulaList.length > 0) return;
      const resp = await this.api.getProductFormulasList(this.product.ID).catch(() => null);
      if (resp && resp.data && resp.data.Status === 1000) {
        this.formulaList = PropertyClass.filterProductFormulasList(resp.data.Data, this.part ? this.part.ID : null);
      }
    },
    async getProductDetailData() {
      if (!this.product || this.productDetailData) return;
      const dataType = ['Part'];
      const List = getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
      const _temp = { ID: this.product.ID, List };
      const resp = await this.api.getProductModuleData(_temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        this.productDetailData = resp.data.Data;
      }
    },
    onOpen() {
      this.getFileList();
      this.getProductFormulasList();
      this.getProductDetailData();
      this.ruleForm = new SizeNumberItemClass(this.item);
    },
    submit() {
      const bool = this.ruleForm.checker();
      if (bool) {
        this.$emit('submit', this.ruleForm);
        this.localVisible = false;
      }
    },
    cancel() {
      this.localVisible = false;
    },
    closed() {
      this.ruleForm = null;
    },
    getFormulaName(key) {
      if (this.ruleForm?.[key]) {
        const { Name, Unit } = this.ruleForm[key];
        return `${Name}${Unit ? ` （单位：${Unit}）` : ''}`;
      }
      return '未设置';
    },
    onFormulaSelectClick(key) {
      this.curkey = key;
      this.formulaVisible = true;
    },
    onPropertySelected(formula) {
      if (!this.curkey) return;
      this.ruleForm[this.curkey] = formula;
    },
    onBleedChange([key, value]) {
      this.ruleForm[key] = value;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-setting-panels-size-number-panel-dialog-comp-wrap {
  > .el-dialog > .el-dialog__body {
    padding-top: 25px;
    padding-bottom: 30px;
    padding-left: 106px;
    height: 580px;
    > .mp-common-title-wrap {
      margin-bottom: 14px;
      margin-left: -65px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: calc(100% + 60px);
      > span {
        font-weight: 400;
        font-size: 14px;
        margin-left: 10px;
        &.formula {
          margin-left: 20px;
          color: #585858;
          font-size: 13px;
          &.is-gray {
            font-size: 12px;
          }
        }
      }
      .el-checkbox__label {
        font-size: 12px;
      }
    }
    > .output-file-list-select-comp {
      margin-left: 40px;
      max-height: 112px;
      margin-top: -5px;
      margin-bottom: 10px;
      overflow: auto;
      overflow: overlay;
      .el-checkbox {
        margin-bottom: 10px;
      }
      .el-checkbox__label {
        width: 10em;
      }
    }
    > dl.content {
      margin-bottom: 30px;
      color: #888;
      > dt {
        display: inline-block;
      }
      > dd {
        display: inline-block;
        margin-right: 25px;
        > .el-input {
          width: 100px;
          input {
            text-align: center;
          }
        }
        > i {
          display: inline-block;
          width: 2em;
          text-align: center;
          margin-right: 2px;
        }
        > em {
          margin-left: 8px;
        }
      }
    }
    > p.is-pink {
      font-size: 12px;
      text-align: left;
      margin-left: -65px;
      padding-top: 50px;
      letter-spacing: 1px;
      &.s {
        padding-top: 8px;
        text-indent: calc(2em + 2px);
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 45px;
  }
}
</style>
