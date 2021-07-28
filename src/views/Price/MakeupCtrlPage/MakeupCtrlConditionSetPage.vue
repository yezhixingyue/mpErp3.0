<template>
  <section class="mp-erp-price-manage-makeup-ctrl-condition-set-page-wrap">
    <header>
      <span>当前产品：{{routeInfo.ProductName}}</span>
      <span>设置方案：{{routeInfo.SolutionName}}</span>
      <span v-if="routeInfo.PartName">设置部件：{{routeInfo.PartName}} {{routeInfo.isMixin ? '混拼条件' : ''}}</span>
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp" :ComparePropertyList='MakeupRightPropertyList' :PropertyList='MakeupLeftPropertyList'
       leftWidth='40%' :curEditData='curMakeupItemEditData' :rightTitle='rightTitle'>
        <template slot='title'>
          <template v-if="routeInfo.setType==='0' && !routeInfo.isMixin">
            <span class="intro" @click="drawer=true"> <i>?</i> 说明</span>
          </template>
        </template>
        <!-- 尺寸数量面板 -->
        <SizeNumberPanel
         v-if="routeInfo.setType==='0' && !routeInfo.isMixin"
         ref="oSizeNumberPanel"
         :Name='routeInfo.PartName || "产品"'
         :initData='curMakeupItemEditData'
         :drawerVisible.sync='drawer'
         :SizeNumberPropertyList='SizeNumberPropertyList'
         />
        <MakeupBreadthPaneL ref="oMakeupBreadthPaneL" :initData='curMakeupItemEditData' v-if="routeInfo.setType==='1'" /> <!-- 拼版幅面面板 -->
        <MakeupRulePanel ref="oMakeupRulePanel" v-if="routeInfo.setType==='2'" :initData='curMakeupItemEditData' /> <!-- 拼版规则面板 -->
        <!-- 拼版算法 切割规则 -->
        <CuttingRulePanel ref="oCuttingRulePanel" v-if="routeInfo.setType==='3'" :initData='curMakeupItemEditData' :partName='routeInfo.PartName' />
        <PrintTimesPanel ref="oPrintTimesPanel" v-if="routeInfo.setType==='4'" :initData='curMakeupItemEditData' /> <!-- 印刷次数 -->
        <MaterialWastagePanel ref="oMaterialWastagePanel" v-if="routeInfo.setType==='5'" :initData='curMakeupItemEditData' /> <!-- 物料损耗 -->
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
// import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp.vue';
import SizeNumberPanel from '@/components/PriceComps/MakeupCtrl/RightPanels/SizeNumberPanel';
import MakeupBreadthPaneL from '@/components/PriceComps/MakeupCtrl/RightPanels/MakeupBreadthPaneL';
import MakeupRulePanel from '@/components/PriceComps/MakeupCtrl/RightPanels/MakeupRulePanel';
import CuttingRulePanel from '@/components/PriceComps/MakeupCtrl/RightPanels/CuttingRulePanel';
import PrintTimesPanel from '@/components/PriceComps/MakeupCtrl/RightPanels/PrintTimesPanel';
import MaterialWastagePanel from '@/components/PriceComps/MakeupCtrl/RightPanels/MaterialWastagePanel';

export default {
  name: 'MakeupCtrlConditionSet',
  data() {
    return {
      drawer: false,
      visible: false,
    };
  },
  components: {
    ContionCommonComp,
    SizeNumberPanel,
    MakeupBreadthPaneL,
    MakeupRulePanel,
    CuttingRulePanel,
    PrintTimesPanel,
    MaterialWastagePanel,
  },
  computed: {
    ...mapState('priceManage', ['MakeupLeftPropertyList', 'MakeupRightPropertyList', 'SizeNumberPropertyList', 'curMakeupItemEditData']),
    rightTitle() {
      if (this.routeInfo.isMixin) return '则允许混拼';
      if (this.routeInfo.setType === '1') return '使用以下幅面';
      return '则';
    },
    routeInfo() {
      const { ProductID, PartID, ProductName, PartName, SolutionName, SolutionID, setType, isMixin } = this.$route.params;
      return {
        ProductID,
        PartID: PartID === 'null' ? '' : PartID,
        ProductName,
        PartName: PartName === 'null' ? '' : PartName,
        SolutionName,
        SolutionID,
        isMixin,
        setType,
      };
    },
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    onSubmitClick() { // 点击保存
      const condition = this.$refs.oLeftComp.getConditonResult();
      if (!condition) return;
      let result;
      if (this.routeInfo.setType === '0' && !this.routeInfo.isMixin) {
        result = this.$refs.oSizeNumberPanel.getSubmitInfo();
      } else if (this.routeInfo.isMixin) {
        result = {};
      }
      if (this.routeInfo.setType === '1') {
        result = this.$refs.oMakeupBreadthPaneL.getSubmitInfo();
      }
      if (this.routeInfo.setType === '2') {
        result = this.$refs.oMakeupRulePanel.getSubmitInfo();
      }
      if (this.routeInfo.setType === '3') {
        result = this.$refs.oCuttingRulePanel.getSubmitInfo();
      }
      if (this.routeInfo.setType === '4') {
        result = this.$refs.oPrintTimesPanel.getSubmitInfo();
      }
      if (this.routeInfo.setType === '5') {
        result = this.$refs.oMaterialWastagePanel.getSubmitInfo();
      }
      if (!result) return;
      const { SolutionID, ProductID, PartID } = this.routeInfo;
      const temp = { ...condition, ...result, SolutionID, ProductID, PartID };
      this.handleSubmit(temp);
    },
    async handleSubmit(data) {
      let requestApi = this.api.getMakeupSolutionItemSave; // 保存普通的方案条目
      if (this.routeInfo.isMixin) { // 添加的是混拼条目，此时调用不同的数据接口：getMixtureMakeupItemSave
        requestApi = this.api.getMixtureMakeupItemSave;
      }
      const resp = await requestApi(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.onGoBackClick();
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
  },
  mounted() {
  },
};
</script>
<style lang='scss'>
.mp-erp-price-manage-makeup-ctrl-condition-set-page-wrap {
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
    line-height: 20px;
    box-sizing: border-box;
    height: 15px;
    color: #21CAE3;
    flex: none;
    white-space: nowrap;
    > span {
      &:first-of-type {
        font-weight: bold;
        font-size: 15px;
        margin-left: 0;
        margin-right: 10px;
      }
      margin-left: 40px;
      font-size: 14px;
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    overflow: hidden;
    .blue-span {
      font-size: 13px;
    }
    .intro {
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
      padding: 0 40px;
      padding-top: 25px;
      > p {
        padding-bottom: 30px;
        font-size: 12px;
        line-height: 24px;
      }
      > div {
        font-size: 12px;
        > p {
          padding-bottom: 15px;
          > img {
            position: relative;
            top: 2px;
            margin-right: 10px;
          }
        }
        > ul {
          margin-bottom: 32px;
          > li {
            display: flex;
            &::before {
              content: '';
              width: 3px;
              height: 3px;
              flex: none;
              border-radius: 50%;
              background-color: #585858;
              margin: 11px 8px;
              margin-left: 0;
            }
            line-height: 24px;
            margin-bottom: 12px;
          }
        }
      }
    }
  }
}
</style>
