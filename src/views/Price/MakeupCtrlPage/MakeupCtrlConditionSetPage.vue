<template>
  <section class="mp-erp-price-manage-makeup-ctrl-condition-set-page-wrap">
    <header>
      <span>当前产品：{{routeInfo.ProductName}}</span>
      <span>设置方案：{{routeInfo.SolutionName}}</span>
      <span>设置部件：{{routeInfo.PartName}}部件1</span>
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp" :ComparePropertyList='MakeupRightPropertyList' :PropertyList='MakeupLeftPropertyList'
       leftWidth='40%' :curEditData='curInteractionData' :rightTitle='rightTitle'>
        <template slot='title'>
          <!-- <span class="blue-span" v-if="routeInfo.setType==='interaction' || routeInfo.setType==='subInteraction'" @click="visible=true">+ 添加结果</span> -->
          <template v-if="routeInfo.setType==='0'">
            <span class="intro" @click="drawer=true"> <i>?</i> 说明</span>
          </template>
        </template>
        <SizeNumberPanel
         v-if="routeInfo.setType==='0'"
         ref="oSizeNumberPanel"
         :Name='routeInfo.PartName || "产品"'
         :initData='null'
         :drawerVisible.sync='drawer'
         :leftPropertyList='[]'
         :rightPropertyList='[]'
         />
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
import SizeNumberPanel from '@/components/PriceComps/MakeupCtrl/RightPanels/SizeNumberPanel';

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
  },
  computed: {
    ...mapState('productManage', ['curInteractionData', 'ControlTypeList', 'subTargetData']),
    ...mapState('priceManage', ['MakeupLeftPropertyList', 'MakeupRightPropertyList']),
    rightTitle() {
      return '则';
    },
    routeInfo() {
      const { ProductID, PartID, ProductName, PartName, SolutionName, setType } = this.$route.params;
      return {
        ProductID,
        PartID: PartID === 'null' ? '' : PartID,
        ProductName,
        PartName: PartName === 'null' ? '' : PartName,
        SolutionName,
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
      if (this.routeInfo.setType === '0') {
        result = this.$refs.oSizeNumberPanel.getSubmitInfo();
      }
      if (!result) return;
      const ControlType = this.$utils.getIDFromListByNames(this.routeInfo.setType, this.ControlTypeList);
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
          this.$store.commit('productManage/setProductInteractionDataListChange', data);
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
