<template>
<!-- 界面交互 -->
  <section class="mp-erp-product-list-page-product-interaction-set-page-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main :class="{loading:loading}">
      <ContionCommonComp ref="oLeftComp" :ComparePropertyList='ComparePropertyList' :PropertyList='LeftPropertyList' v-if="!loading"
       leftWidth='40%' :curEditData='curInteractionData' :rightTitle='rightTitle'>
        <template slot='title'>
          <span class="blue-span" v-if="setType==='interaction' || setType==='subInteraction'" @click="visible=true">+ 添加结果</span>
          <template v-if="setType==='compare' || setType==='subCompare'">
            <span class="blue-span" @click="onCompareAddClick">+ 添加</span>
            <span class="intro" @click="drawer=true"> <i>?</i> 说明</span>
          </template>
        </template>
        <!-- 交互设置面板 -->
        <InteractionPanel
         v-if="setType==='interaction' || setType==='subInteraction'"
         ref="oInteraction"
         :initData='curInteractionData'
         :ComparePropertyList='RightSetupPropertyList'
         :visibleDialog.sync='visible' />
        <!-- 对比设置面板 -->
        <ComparePanel
         v-if="setType==='compare' || setType==='subCompare'"
         ref="oComparePanel"
         :initData='curInteractionData'
         :drawerVisible.sync='drawer'
         :leftPropertyList='RightSetupPropertyList'
         :rightPropertyList='RightSetupPropertyList' />
        <!-- 风险提示设置面板 -->
        <RiskPanel v-if="setType==='risk'" ref="oRisk" :initData='curInteractionData' />
      </ContionCommonComp>
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

export default {
  name: 'ProductInteractionSet',
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      setType: '',
      drawer: false,
      visible: false,
      loading: true,
      subTypeConditionPropertyList: [], // 属性列表 仅子对比或子交互时使用
      subTypeRightPropertyList: [],
    };
  },
  components: {
    ContionCommonComp,
    RiskPanel,
    ComparePanel,
    InteractionPanel,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList', 'curInteractionData', 'ControlTypeList',
      'subTargetData', 'subComparePropList',
      'InteractionLeftPropertyList', 'InteractionRightPropertyList', 'CompareLeftPropertyList', 'CompareRightPropertyList']),
    rightTitle() {
      if (this.setType === 'risk') return '则进行风险提示：';
      if (this.setType === 'compare') return '则必须满足';
      return '则';
    },
    ComparePropertyList() {
      if (this.setType === 'risk' || this.setType === 'compare' || this.setType === 'subCompare') return this.LeftPropertyList;
      return null;
    },
    LeftPropertyList() {
      if (this.setType === 'subCompare' || this.setType === 'subInteraction') return this.subTypeConditionPropertyList;
      if (this.setType === 'interaction') return this.InteractionLeftPropertyList;
      return this.CompareLeftPropertyList;
    },
    RightSetupPropertyList() {
      if (this.setType === 'subCompare' || this.setType === 'subInteraction') return this.subTypeRightPropertyList;
      if (this.setType === 'interaction') return this.InteractionRightPropertyList;
      return this.CompareRightPropertyList;
    },
  },
  methods: {
    getPositionID() {
      const { ProductID, PartID, name, type, setType } = this.$route.params;
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
      this.setType = setType;
    },
    onGoBackClick() {
      // this.$router.replace(`/ProductInteractionList/${this.ProductID}/${this.PartID || 'null'}/${this.ProductName}/${this.titleType}/${Date.now()}`);
      this.$goback();
    },
    async getSubPropList() {
      if (this.setType !== 'subCompare' && this.setType !== 'subInteraction') {
        this.loading = false;
        return;
      }
      const idsObj = PropertyClass.getPropIDsObj(this.subTargetData);
      let useModule;
      if (this.setType === 'subInteraction') useModule = 25;
      if (this.setType === 'subCompare') useModule = 26;
      this.loading = true;
      const [leftSubConditionList, rightSubList] = await Promise.all([
        PropertyClass.getPropertyList({ ...idsObj, useModule }), PropertyClass.getPropertyList({ ...idsObj, useModule: 38 }),
      ]);
      this.loading = false;
      if (leftSubConditionList && rightSubList) {
        this.subTypeConditionPropertyList = leftSubConditionList;
        this.subTypeRightPropertyList = rightSubList;
      } else this.$goback();
    },
    onSubmitClick() { // 点击保存
      const condition = this.$refs.oLeftComp.getConditonResult();
      if (!condition) return;
      let result;
      if (this.setType === 'risk') {
        result = this.$refs.oRisk.getSubmitInfo();
      }
      if (this.setType === 'interaction' || this.setType === 'subInteraction') {
        result = this.$refs.oInteraction.getSubmitInfo();
      }
      if (this.setType === 'compare' || this.setType === 'subCompare') {
        result = this.$refs.oComparePanel.getSubmitInfo();
      }
      if (!result) return;
      const ControlType = this.$utils.getIDFromListByNames(this.setType, this.ControlTypeList);
      if (!ControlType && ControlType !== 0) return;
      const idsObj = PropertyClass.getPropIDsObj(this.subTargetData);
      const temp = { ...condition, ...result, ProductID: this.ProductID, ControlType, ...idsObj };
      this.handleSubmit(temp);
    },
    async handleSubmit(data) {
      const resp = await this.api.getProductControlSave(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.onGoBackClick();
          this.$store.commit('productManage/setProductInteractionDataListChange', [data, resp.data.Data]);
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    onCompareAddClick() {
      this.$refs.oComparePanel.onItemAddClick();
    },
  },
  mounted() {
    this.getPositionID();
    this.getSubPropList();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-interaction-set-page-wrap {
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
    &.loading {
      opacity: 0.2;
    }
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
