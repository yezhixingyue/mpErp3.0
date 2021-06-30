<template>
<!-- 界面交互 -->
  <section class="mp-erp-product-list-page-product-factory-set-comp-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <ContionCommonComp ref="oLeftCondition" :PropertyList='PropertyList' leftWidth='40%' :curEditData='curInteractionData' :rightTitle='rightTitle'>
        <template slot='title'>
          <span class="blue-span" v-if="setType==='interaction'" @click="visible=true">+ 添加结果</span>
          <template v-if="setType==='compare'">
            <span class="blue-span" @click="visible=true">+ 添加</span>
            <span class="intro" @click="drawer=true"> <i>?</i> 说明</span>
          </template>
        </template>
        <!-- 交互设置面板 -->
        <InteractionPanel v-if="setType==='interaction'" :ComparePropertyList='ComparePropertyList' />
        <!-- 对比设置面板 -->
        <ComparePanel v-if="setType==='compare'" :drawerVisible.sync='drawer' />
        <!-- 风险提示设置面板 -->
        <RiskPanel v-if="setType==='risk'" ref="oRisk" />
      </ContionCommonComp>
      <FormulaPanelElementSelectDialog  :visible.sync='visible' :list='ComparePropertyList' @submit='onElementSelect' :selectedElementIDs='selectedElementIDs'/>
    </main>
    <footer>
      <el-button @click="onSubmitClick" type="primary">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp.vue';
import RiskPanel from '@/components/ProductManageComps/Interaction/RightPanels/RiskPanel.vue';
import ComparePanel from '@/components/ProductManageComps/Interaction/RightPanels/ComparePanel.vue';
import InteractionPanel from '@/components/ProductManageComps/Interaction/RightPanels/InteractionPanel.vue';
import FormulaPanelElementSelectDialog from '@/components/common/FormulaAndConditionComps/FormulaPanelElementSelectDialog.vue';

export default {
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      setType: '',
      PropertyList: [],
      ComparePropertyList: [], // 右侧属性选择弹窗中使用到的属性列表
      drawer: false,
      visible: false,
      selectedElementIDs: [], // 后面改为计算属性
    };
  },
  components: {
    ContionCommonComp,
    RiskPanel,
    ComparePanel,
    InteractionPanel,
    FormulaPanelElementSelectDialog,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList', 'curInteractionData', 'ControlTypeList']),
    curProduct() {
      if (!this.ProductID) return null;
      return this.ProductManageList.find(it => it.ID === this.ProductID);
    },
    curPart() {
      if (!this.PartID || !this.curProduct) return null;
      return this.curProduct.PartList.find(it => it.ID === this.PartID);
    },
    rightTitle() {
      if (this.setType === 'risk') return '则进行风险提示：';
      if (this.setType === 'compare') return '则必须满足';
      return '则';
    },
  },
  methods: {
    getPositionID() {
      if (!this.$route.params) {
        this.onGoBackClick();
        return;
      }
      const { ProductID, PartID, name, type, setType } = this.$route.params;
      if (!ProductID || !PartID || !name || !type || !setType) {
        this.onGoBackClick();
        return;
      }
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
      this.setType = setType;
      this.getLeftPropertyList();
      this.getRightPropertyList();
    },
    async getLeftPropertyList() {
      const list = await PropertyClass.getPropertyList({ UseModule: 14, ProductID: this.ProductID });
      if (list) this.PropertyList = list;
    },
    async getRightPropertyList() {
      let UseModule;
      switch (this.setType) {
        case 'interaction':
          UseModule = 18;
          break;
        case 'compare':
          // UseModule = 18; // 不确定
          break;
        default:
          break;
      }
      if (!UseModule && UseModule !== 0) return;
      const list = await PropertyClass.getPropertyList({ UseModule, ProductID: this.ProductID });
      if (list) this.ComparePropertyList = list;
    },
    onGoBackClick() {
      this.$router.replace(`/ProductInteractionList/${this.ProductID}/${this.PartID || 'null'}/${this.ProductName}/${this.titleType}/${Date.now()}`);
    },
    onSubmitClick() { // 点击保存
      const condition = this.$refs.oLeftCondition.getConditonResult();
      if (!condition) return;
      let result;
      if (this.setType === 'risk') {
        result = this.$refs.oRisk.getSubmitInfo();
      }
      if (!result) return;
      const ControlType = this.$utils.getIDFromListByNames(this.setType, this.ControlTypeList);
      if (!ControlType && ControlType !== 0) return;
      const temp = { ...condition, ...result, ProductID: this.ProductID, ControlType };
      this.handleSubmit(temp);
    },
    async handleSubmit(data) {
      const resp = await this.api.getProductControlSave(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.onGoBackClick();
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    onElementSelect(e) {
      console.log('onElementSelect', e);
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-factory-set-comp-wrap {
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
    .blue-span {
      font-size: 13px;
      & + .intro {
        font-size: 12px;
        display: inline-block;
        color: #A2A2A2;
        margin-left: 35px;
        > i {
          display: inline-block;
          width: 13px;
          height: 13px;
          border: 1px solid #FF3769;
          border-radius: 50%;
          color: #FF3769;
          text-align: center;
          font-size: 12px;
          margin-right: 5px;
        }
        position: relative;
        padding-left: 15px;
        cursor: pointer;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: -2px;
          height: 20px;
          width: 1px;
          background-color: #eee;
        }
        &:hover {
          color: #444;
          > i {
            background-color: #ff376911;
          }
        }
      }
    }
    .mp-erp-new-comps-condtion-set-common-comp-wrap .right .right-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      .right-content-main-wrap {
       flex: 1;
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
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
  .el-drawer__container {
    .drawer-title {
      color: #888E99;
      font-size: 15px;
      cursor: pointer;
      &:hover {
        color: #585858;
      }
    }
    .drawer-content {
      color: #585858;
      font-size: 14px;
      padding-left: 105px;
      padding-top: 25px;
      > div {
        font-size: 15px;
        font-weight: 700;
        padding-bottom: 35px;
      }
      > p {
        padding-bottom: 20px;
      }
    }
  }
}
</style>
