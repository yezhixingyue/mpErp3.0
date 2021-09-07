<template>
  <section class="mp-erp-price-module-makeup-ctrl-size-number-panel-container">
    <p class="title">{{Name}}：</p>
    <ul>
      <FieldItem v-model="LengthFormula" @select="onSelectClick" />
      <FieldItem v-model="WidthFormula" @select="onSelectClick" />
      <FieldItem v-model="DifferentContentFormula" @select="onSelectClick" />
      <FieldItem v-model="PrintNumberFormula" @select="onSelectClick" />
    </ul>
    <ProductFormulasSelectDialog :visible.sync='visible' :list='SizeNumberPropertyList'
     :productData='productData' @select='onPropertySelected' :selectedIDs='selectedIDs' />
    <!-- 右侧说明抽屉面板 -->
    <el-drawer :visible.sync="drawer" size='470px' :show-close='false'>
      <template slot='title'>
        <span class="drawer-title" @click="drawer=false"> <i class="el-icon-arrow-right"></i> 说明</span>
      </template>
      <div class="drawer-content">
        <p>注意：拼版时会使用此处设置的长度、宽度、数量进行拼版，并印刷指定份数。此处尺寸指的是展开尺寸，物料数量指的是每份不同印刷内容的物料数量。</p>
        <p class="is-pink">特别注意：物料数量是以此展开尺寸为基础的此尺寸物料数量，且印刷内容不同。</p>
        <div>
          <p>例如：</p>
          <ul>
            <li>
              锁线胶装画册 1000本，封面 4P，则宽度为成品宽度 *2+书脊厚度+勒口宽度*2，长度为成品长，物料数量则为 1，共需印刷 1000份。
            </li>
            <li>
              锁线胶装画册 1000本，内文64P，双面印，内容不同，则长度为成品长*2，宽度为成品宽，物料数量则为 16，共需印刷 1000份。
            </li>
            <li>
              锁线胶装画册 1000本，内文64P，双面印，内容相同1P循环，则长度为成品长*2，宽度为成品宽，物料数量则为 1，共需印刷 16000份。
            </li>
            <li>
              锁线胶装画册 1000本，内文64P，双面印，内容相同8P循环，则长度为成品长*2，宽度为成品宽，物料数量则为 2，共需印刷 8000份。
            </li>
          </ul>
          <p>
            <img src="@/assets/images/smile.png" alt="">
            <span class="is-gray">其他应用请自己思考</span>
          </p>
        </div>
      </div>
    </el-drawer>
  </section>
</template>

<script>
import ProductFormulasSelectDialog from '@/components/common/FormulaAndConditionComps/ProductFormulasSelectDialog.vue';
import FieldItem from './FieldItem.vue';

export default {
  props: {
    drawerVisible: {
      type: Boolean,
      default: false,
    },
    SizeNumberPropertyList: {
      type: Array,
      default: () => [],
    },
    initData: {
      type: Object,
      default: null,
    },
    Name: {
      type: String,
      default: '',
    },
  },
  components: {
    ProductFormulasSelectDialog,
    FieldItem,
  },
  computed: {
    drawer: {
      get() {
        return this.drawerVisible;
      },
      set(val) {
        this.$emit('update:drawerVisible', val);
      },
    },
    selectedIDs() {
      if (!this.selectType || !this[this.selectType].Property) return [];
      return [this[this.selectType].Property.ID];
    },
  },
  data() {
    return {
      LengthFormula: {
        FormulaID: '',
        Value: '',
        Property: null,
        label: '展开尺寸长度',
        key: 'LengthFormula',
      },
      WidthFormula: {
        FormulaID: '',
        Value: '',
        Property: null,
        label: '展开尺寸宽度',
        key: 'WidthFormula',
      },
      DifferentContentFormula: {
        FormulaID: '',
        Value: '',
        Property: null,
        label: '内容不同的展开物料数量',
        key: 'DifferentContentFormula',
      },
      PrintNumberFormula: {
        FormulaID: '',
        Value: '',
        Property: null,
        label: '共需要印刷多少份',
        key: 'PrintNumberFormula',
      },
      visible: false,
      selectType: '',
      productData: null,
    };
  },
  methods: {
    onSelectClick(type) {
      this.selectType = type;
      this.visible = true;
    },
    onPropertySelected(e) { // 左侧选中属性处理事件
      this[this.selectType].Property = e;
    },
    getFormatItem(obj) {
      if (!obj) return obj;
      const { Property, Value } = obj;
      const temp = { FormulaID: '' };
      if (Property) {
        temp.FormulaID = Property.ID;
      } else if (Value) temp.Value = Value;
      return temp;
    },
    getSubmitInfo() {
      const bool = this.getCheckResult();
      if (bool) {
        const LengthFormula = this.getFormatItem(this.LengthFormula);
        const WidthFormula = this.getFormatItem(this.WidthFormula);
        const DifferentContentFormula = this.getFormatItem(this.DifferentContentFormula);
        const PrintNumberFormula = this.getFormatItem(this.PrintNumberFormula);

        return { LengthFormula, WidthFormula, DifferentContentFormula, PrintNumberFormula };
      }
      return null;
    },
    fieldItemChecker({ Property, Value, label }, isInteger) {
      if (Property) return true;
      if (!Value && Value !== 0) {
        this.messageBox.failSingleError('保存失败', `${label}未设置`);
        return false;
      }
      if (!this.$utils.getValueIsOrNotNumber(Value, isInteger) || Value <= 0) {
        this.messageBox.failSingleError('保存失败', `${label}输入数值不正确`);
        return false;
      }
      return true;
    },
    getCheckResult() {
      return this.fieldItemChecker(this.LengthFormula)
        && this.fieldItemChecker(this.WidthFormula)
        && this.fieldItemChecker(this.DifferentContentFormula, true)
        && this.fieldItemChecker(this.PrintNumberFormula, true);
    },
    getValueOrPropertyFromInitDataItem(data) {
      const temp = { Property: null, Value: '' };
      if (!data) return temp;
      const { FormulaID, Value } = data;
      if (FormulaID) { // 属性
        const t = this.SizeNumberPropertyList.find(it => it.ID === FormulaID);
        if (t) temp.Property = t;
      }
      if (Value || Value === 0) temp.Value = Value;
      return temp;
    },
    async getProductData() {
      const resp = await this.$store.dispatch('priceManage/getProductCraftData', this.$route.params.ProductID);
      if (resp) this.productData = resp;
    },
  },
  mounted() {
    console.log(123, 'mounted');
    this.getProductData();
    if (this.initData) { // 编辑时还原数据
      const { LengthFormula, WidthFormula, DifferentContentFormula, PrintNumberFormula } = this.initData;
      const LengthFormulaInitObj = this.getValueOrPropertyFromInitDataItem(LengthFormula);
      const WidthFormulaInitObj = this.getValueOrPropertyFromInitDataItem(WidthFormula);
      const DifferentContentFormulaInitObj = this.getValueOrPropertyFromInitDataItem(DifferentContentFormula);
      const PrintNumberFormulaInitObj = this.getValueOrPropertyFromInitDataItem(PrintNumberFormula);
      this.LengthFormula = { ...this.LengthFormula, ...LengthFormulaInitObj };
      this.WidthFormula = { ...this.WidthFormula, ...WidthFormulaInitObj };
      this.DifferentContentFormula = { ...this.DifferentContentFormula, ...DifferentContentFormulaInitObj };
      this.PrintNumberFormula = { ...this.PrintNumberFormula, ...PrintNumberFormulaInitObj };
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-ctrl-size-number-panel-container {
  > .title {
    font-weight: 700;
    font-size: 14px;
    color: #585858;
  }
  > ul {
    padding-top: 10px;
    > li {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      height: 32px;
      line-height: 32px;
      .label {
        width: 12em;
        text-align: right;
      }
      .el-input {
        width: 100px;
        min-width: 100px;
        margin-right: 26px;
      }
      .value {
        min-width: 15em;
        margin-right: 26px;
        font-weight: 700;
        color: #585858;
        text-align: right;
        &.showInput {
          min-width: 6em;
        }
      }
      .blue-span {
        font-size: 12px;
        margin-left: 1em;
      }
    }
  }
  span {
    white-space: nowrap;
  }
}
</style>
