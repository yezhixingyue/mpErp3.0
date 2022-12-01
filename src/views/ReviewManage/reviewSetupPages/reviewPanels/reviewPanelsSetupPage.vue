<template>
  <section class="mp-erp-review-common-with-condition-setting-manage-setup-page-wrap" v-if="curPanel">
    <header>
      <Crumbs :list="crumbsList" />
      <p class="p-t">
        <span>{{title}}</span>
      </p>
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp" :PropertyList='ConditionPropList'
       v-if="ConditionPropList.length > 0"
       leftWidth='42%' :curEditData='curEditPanelItem'
       :adAreaList="adAreaList" :areaList="areaList" :allAdAreaTreeList="allAdAreaTreeList"
       :allProductClassify="allProductClassify" :allProductAndLevelList="allProductAndLevelList" :allAreaTreeList="allAreaTreeList">
        <!-- 右侧面板 -->
        <span slot="title" v-if="curPanel && curPanel.canAdd" class="blue-span" style="position: relative;top:1px" @click="onAddClick">+ 添加</span>
        <RightPanelAdapter ref="oPanel" :curPanel="curPanel" :curEditData='curEditPanelItem' />
      </ContionCommonComp>
    </main>
    <footer>
      <el-button type="primary" @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="$goback">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ContionCommonComp } from '@/components/common/mpzj-sell-lib/lib';
import Crumbs from '../../../../components/common/NewComps/Crumbs.vue';
import RightPanelAdapter from '../../../../components/ReviewComps/ReviewSetup/Panels/RightPanelAdapter';

export default {
  name: 'reviewPanelsSetupPage',
  components: {
    Crumbs,
    ContionCommonComp,
    RightPanelAdapter,
  },
  computed: {
    ...mapState('review', ['curPanelData', 'curEditPanelItem', 'ConditionPropList']),
    ...mapGetters('review', ['curReviewProduct', 'curReviewProductPart']),
    ...mapState('common', ['adAreaList', 'areaList']),
    ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allProductAndLevelList', 'allAreaTreeList']),
    title() {
      const label = this.curReviewProductPart ? '当前部件：' : '当前产品：';
      let content = '';
      if (this.curReviewProduct) {
        const { ProductClass, Name } = this.curReviewProduct;
        const { FirstLevelName, SecondLevelName } = ProductClass || {};
        const productName = [FirstLevelName, SecondLevelName, Name].filter(it => it).join('-');
        const partName = this.curReviewProductPart?.Name || '';
        content = [productName, partName].filter(it => it).join(' ');
      }

      return `${label}${content}`;
    },
    curPanel() {
      return this.curPanelData?.panelType || null;
    },
    curPanelTitle() {
      return this.curPanel?.fullName || '';
    },
    pageTitle() {
      const o = this.curEditPanelItem ? '编辑' : '添加';
      const str2 = `${o}${this.curPanelTitle}`;
      return str2;
    },
    crumbsList() {
      const str1 = this.curPanel?.Name || '上一级';
      return [
        { name: '审稿设置', path: '/reviewSetupList' },
        { name: str1, path: '/reviewPanelsList' },
        { name: this.pageTitle },
      ];
    },
  },
  methods: {
    onSubmitClick() {
      const condition = this.$refs.oLeftComp.getConditonResult();
      if (!condition) return;
      const panelResult = this.$refs.oPanel.getInfo();
      if (!panelResult) return;
      const temp = {
        ...condition,
        ...panelResult,
        ProductID: this.curReviewProduct?.ID || '',
        Type: this.curPanel?.ID,
      };
      if (this.curReviewProductPart) {
        temp.PartID = this.curReviewProductPart.ID;
      }
      const callback = () => {
        this.$goback();
      };
      this.$store.dispatch('review/getCheckFileSetupSave', { data: temp, callback });
    },
    onAddClick() {
      if (this.$refs.oPanel?.add) this.$refs.oPanel.add(null);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-common-with-condition-setting-manage-setup-page-wrap {
  padding-left: 30px;
  padding-right: 60px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    flex: none;
    padding-bottom: 25px;
    > .mp-erp-common-comps-crumbs-comp-wrap {
      display: block;
      margin-bottom: 6px;
    }
    > .p-t {
      padding-top: 2px;
      color: #21CAE3;
      font-weight: 700;
    }
  }
  > main {
    flex: 1;
    .mp-erp-new-comps-condtion-set-common-comp-wrap > .right > .right-content {
      padding-left: 55px;
    }
    .right-content-main-wrap {
      min-width: 520px;
    }
  }
  > footer {
    flex: none;
    height: 80px;
    padding-top: 30px;
    text-align: center;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      border-radius: 3px;
      & + .el-button {
        margin-left: 40px;
      }
    }
  }
}
</style>
