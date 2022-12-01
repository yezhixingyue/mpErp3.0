<template>
  <section class="mp-erp-review-allocation-setup-page-wrap">
    <header>
      <Crumbs :list="crumbsList" />
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp" :PropertyList='allocationConditionPropList' showName
       leftWidth='45%' :curEditData='curAllocationEditItem'
       :adAreaList="adAreaList" :areaList="areaList" :allAdAreaTreeList="allAdAreaTreeList"
       :allProductClassify="allProductClassify" :allProductAndLevelList="allProductAndLevelList" :allAreaTreeList="allAreaTreeList">
        <!-- 右侧面板 -->
        <RightPanel ref="oPanel" :item="curAllocationEditItem" :reviewGroupList="reviewGroupList" />
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
import Crumbs from '../../../components/common/NewComps/Crumbs.vue';
import RightPanel from '../../../components/ReviewComps/ReviewAllocation/Setup/RightPanel.vue';

export default {
  name: 'reviewAllocationSetupPage',
  components: {
    Crumbs,
    ContionCommonComp,
    RightPanel,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('review', ['allocationConditionPropList', 'curAllocationEditItem', 'reviewGroupList']),
    ...mapState('common', ['adAreaList', 'areaList']),
    ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allProductAndLevelList', 'allAreaTreeList']),
    crumbsList() {
      const curType = this.curAllocationEditItem ? '编辑策略' : '添加策略';
      return [
        { name: '分配策略', path: '/reviewSetupList' },
        { name: curType },
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
      };
      const callback = () => {
        this.$goback();
      };
      this.$store.dispatch('review/getDistributionStrategySave', { data: temp, callback });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-allocation-setup-page-wrap {
  padding-left: 30px;
  padding-right: 100px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    flex: none;
    padding-bottom: 15px;
    padding-top: 8px;
    > .mp-erp-common-comps-crumbs-comp-wrap {
      display: block;
      margin-bottom: 6px;
    }
  }
  > main {
    flex: 1;
    overflow: hidden;
    .left > .left-content > header > .name > .el-input {
      width: 330px;
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
