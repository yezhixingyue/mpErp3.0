<template>
  <CommonDialogComp
    width="660px"
    :title="title"
    :visible.sync="localVisible"
    class="mp-erp-review-setting-panels-page-number-panel-dialog-comp-wrap"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    submitText="确定"
    top="10vh"
  >
    <template v-if="ruleForm">
      <p class="mp-common-title-wrap">输出文件：</p>
      <OutputFileListSelectComp :loading="loading" :OutputFileList="OutputFileList" onlyPDF v-model="ruleForm.FileList" :disabledIds="disabledFileIds" />

      <p class="mp-common-title-wrap">
        <label>类型：</label>
        <el-radio-group v-model="ruleForm.Type">
          <el-radio v-for="it in PagesNumberTypeEnums" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </p>

      <p class="mp-common-title-wrap">
        <label>页数：</label>
        <span class="blue-span" @click="onFormulaSelectClick('Formula')">选择公式</span>
        <span class="formula" v-show="ruleForm&&ruleForm.Formula">{{getFormulaName('Formula')}}</span>
        <el-input size="mini" v-show="!ruleForm||!ruleForm.Formula" maxlength="9" v-model.number="ruleForm.Value"></el-input>
        <i v-show="!ruleForm||!ruleForm.Formula">页</i>
      </p>
    </template>

    <ProductFormulasSelectDialog :visible.sync='formulaVisible' :list='formulaList' title="选择公式"
     :productData='productDetailData' @select='onPropertySelected' :selectedIDs='selectedIDs' />
  </CommonDialogComp>
</template>

<script>
import { mapState } from 'vuex';
import { PropertyClass } from '@/components/common/mpzj-sell-lib/lib';
import CommonDialogComp from '../../../../../packages/CommonDialogComp';
import OutputFileListSelectComp from '../OutputFileListSelectComp.vue';
import ProductFormulasSelectDialog from '../../../../common/FormulaAndConditionComps/ProductFormulasSelectDialog.vue';
import PageNumberItemClass from './PageNumberItemClass';
import { getIDFromListByNames } from '../../../../../assets/js/utils/util';
import { PagesNumberTypeEnums } from '../../../../../store/review/reviewEnums';

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
      return this.item ? '编辑文件页数检查' : '添加文件页数检查';
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
      PagesNumberTypeEnums,
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
      this.ruleForm = new PageNumberItemClass(this.item);
    },
    submit() {
      const bool = this.ruleForm.checker();
      if (bool) {
        if (this.ruleForm.Formula) {
          this.ruleForm.Value = '';
        }
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
  },
};
</script>
<style lang='scss'>
.mp-erp-review-setting-panels-page-number-panel-dialog-comp-wrap {
  > .el-dialog > .el-dialog__body {
    padding-top: 25px;
    padding-bottom: 30px;
    padding-left: 106px;
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
        margin-left: 48px;
        &.formula {
          margin-left: 20px;
          color: #585858;
          font-size: 13px;
          &.is-gray {
            font-size: 12px;
          }
        }
      }
      > .el-radio-group {
        margin-left: 48px;
      }
      &:last-of-type {
        margin-top: 20px;
      }
      > .el-input {
        width: 100px;
        margin-left: 15px;
        margin-right: 8px;
        input {
          text-align: center;
        }
      }
      > i {
        font-weight: 400;
        color: #989898;
        font-size: 12px;
      }
    }
    > .output-file-list-select-comp {
      margin-left: 40px;
      max-height: 165px;
      margin-top: -5px;
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
      margin-bottom: 35px;
      color: #888;
      > dt {
        display: inline-block;
      }
    }
    > p.is-pink {
      font-size: 12px;
      text-align: left;
      margin-left: -65px;
      padding-top: 50px;
    }
  }
  .el-dialog__footer {
    padding-bottom: 45px;
  }
}
</style>
