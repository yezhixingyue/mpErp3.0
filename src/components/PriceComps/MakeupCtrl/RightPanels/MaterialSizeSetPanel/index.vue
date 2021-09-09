<template>
  <section class="mp-erp-price-module-makeup-ctrl-page-material-size-set-panel-wrap">
    <header>
      <p>
        <span class="blue-span" @click="visible=true">选择物料尺寸</span>
      </p>
      <div>
        <span class="is-gray is-font-size-12" v-if="MaterialSizeList.length === 0">请选择物料尺寸!</span>
        <ul>
          <li v-for="it in MaterialSizeList" :key="it.First.ID">
            <span class="label" :title="it.First.Name">{{it.First.Name}}</span>
            <el-input v-model="it.Second" maxlength="9" size="small"></el-input>
            <span class="unit">元</span>
          </li>
        </ul>
      </div>
    </header>
    <main v-if="showFormula">
      <!-- 公式设置 -->
      <p>计算公式</p>
      <FormulaPanelComp
        ref="oRightFormulaPanel"
        class="mp-erp-product-module-formula-set-page-wrap"
        hiddenHeader
        isSingle
        :NowEditFormulaData='editFormulaData || {}'
        :Condition4getProperty='Condition4getFormulaProperty'
      >
      </FormulaPanelComp>
      <CheckboxDialogComp :visible.sync='visible' v-model="checkList" :list='AllMaterialSizeList' width='800px'
       title="选择物料尺寸" :defaultProps="{label: 'Name', value: 'ID'}" />
    </main>
  </section>
</template>

<script>
import FormulaPanelComp from '@/components/common/FormulaAndConditionComps/FormulaPanelComp.vue';
import CheckboxDialogComp from '@/components/common/NewComps/CheckboxDialogComp.vue';

export default {
  props: {
    initData: {
      type: Object,
      default: null,
    },
  },
  components: {
    FormulaPanelComp,
    CheckboxDialogComp,
  },
  data() {
    return {
      loading: true,
      AllMaterialSizeList: [],
      fetchingError: false,
      visible: false,
      MaterialSizeList: [],
      editFormulaData: {},
      showFormula: false,
    };
  },
  computed: {
    Condition4getFormulaProperty() {
      return {
        ProductID: this.$route.params.ProductID,
        PartID: this.$route.params.PartID === 'null' ? '' : this.$route.params.PartID,
        UseModule: 8,
      };
    },
    checkList: {
      get() {
        return this.MaterialSizeList.map(it => it.First.ID);
      },
      set(list) {
        this.MaterialSizeList = list.map(it => {
          let Name = '';
          let Second = '';
          const t = this.AllMaterialSizeList.find(_it => _it.ID === it.ID);
          if (t) Name = t.Name;
          const t2 = this.MaterialSizeList.find(_it => _it.First.ID === it.ID);
          if (t2) Second = t2.Second;
          return {
            First: { ...it, Name },
            Second,
          };
        });
      },
    },
  },
  methods: {
    getSubmitInfo() {
      const { MaterialSizeList } = this;
      if (MaterialSizeList.length === 0) {
        this.messageBox.failSingleError('保存失败', '请选择物料尺寸');
        return null;
      }
      let t = MaterialSizeList.find(it => !it.Second);
      if (t) {
        this.messageBox.failSingleError('保存失败', `${t.First.Name}未设置价格`);
        return null;
      }
      t = MaterialSizeList.find(it => !this.$utils.getValueIsOrNotNumber(it.Second, false) || it.Second <= 0);
      if (t) {
        this.messageBox.failSingleError('保存失败', `${t.First.Name}价格必须为大于0的数字类型`);
        return null;
      }
      const formulaData = this.$refs.oRightFormulaPanel.getFormulaData();
      if (!formulaData) return null;
      const { Content, PropertyList, Remark } = formulaData;
      return {
        MaterialSizeList,
        Formula: {
          Content,
          PropertyList,
          Remark,
          UseModule: 8,
        },
      };
    },
    async getMaterialSizeList() {
      const resp = await this.api.getMaterialSizeList(1, 9999).catch(() => {});
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.AllMaterialSizeList = resp.data.Data;
      } else {
        this.fetchingError = true;
      }
    },
    async setInitData() {
      if (this.initData) {
        if (Array.isArray(this.initData.MaterialSizeList)) {
          this.MaterialSizeList = this.initData.MaterialSizeList.map(it => ({ ...it, Second: `${it.Second}` }));
        }
        if (this.initData.Formula && this.initData.Formula.ID) {
          const resp = await this.api.getFormulaList({ ID: this.initData.Formula.ID, UseModule: 8 }).catch(() => {});
          if (resp && resp.data.Status === 1000 && resp.data.Data.length > 0) {
            const [editFormulaData] = resp.data.Data;
            this.editFormulaData = editFormulaData;
          }
        }
      }
      this.showFormula = true;
    },
  },
  mounted() {
    this.getMaterialSizeList();
    this.setInitData();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-ctrl-page-material-size-set-panel-wrap {
  > header {
    margin-top: -44px;
    padding-bottom: 30px;
    > p {
      padding-left: 160px;
      padding-bottom: 25px;
    }
    > div {
      > span {
        display: inline-block;
        margin-bottom: 20px;
      }
      > ul {
        display: flex;
        width: 800px;
        flex-wrap: wrap;
        padding-top: 6px;
        > li {
          display: flex;
          align-items: center;
          width: 320px;
          margin-bottom: 15px;
          .el-input {
            width: 130px;
            margin-right: 6px;
          }
          > span {
            font-size: 12px;
            color: #989898;
            &.label {
              width: 155px;
              text-align: right;
              margin-right: 15px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
  > main {
    min-width: 800px;
    > p {
      font-weight: 700;
      color: #444;
      padding-bottom: 30px;
      font-size: 15px;
    }
    .left.mp-scroll-wrap {
      overflow-x: hidden;
    }
  }
}
</style>
