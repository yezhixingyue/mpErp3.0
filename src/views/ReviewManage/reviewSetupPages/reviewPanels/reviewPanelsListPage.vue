<template>
  <section class="mp-erp-review-common-with-condition-setting-manage-list-page-wrap" v-if="curPanel">
    <header>
      <Crumbs :list="crumbsList" />
      <p class="p-t">
        <span>{{title}}</span>
      </p>
      <p class="btn-box">
        <el-button type="primary" @click="onSaveClick(null)">添加{{curPanelTitle}}</el-button>
        <span class="tips-box" v-if="curPanel.tips"><i class="el-icon-warning"></i>{{curPanel.tips}}</span>
      </p>
    </header>
    <main>
      <PanelTable
       :panelList="reviewSetupPanelList"
       :loading="loading"
       :curPanel="curPanel"
       :PropertyList="ConditionPropList"
       @edit="onSaveClick"
       @remove="handleItemRemove"
       />
    </main>
    <footer>
      <el-button class="cancel-blue-btn" @click="$goback">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import Crumbs from '../../../../components/common/NewComps/Crumbs.vue';
import PropertyClass from '../../../../assets/js/TypeClass/PropertyClass';
import PanelTable from '../../../../components/ReviewComps/ReviewSetup/PanelTable/PanelTable.vue';

export default {
  name: 'reviewPanelsListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-review-common-with-condition-setting-manage-list-page-wrap > main')],
  components: {
    Crumbs,
    PanelTable,
  },
  computed: {
    ...mapState('review', ['curPanelData', 'reviewSetupPanelList', 'loading', 'ConditionPropList']),
    ...mapGetters('review', ['curReviewProduct', 'curReviewProductPart']),
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
    crumbsList() {
      const str = this.curPanelData?.panelType?.Name || '相关设置';
      return [
        { name: '审稿设置', path: '/reviewSetupList' },
        { name: str },
      ];
    },
  },
  methods: {
    onSaveClick(item) {
      this.$store.commit('review/setCurEditPanelItem', item);
      this.$router.push('/reviewPanelsSetup');
    },
    async getConditionPropList() {
      if (!this.curPanel) return;
      const temp = {
        ProductID: this.curReviewProduct?.ID || '',
        PartID: this.curReviewProductPart?.ID || '',
        UseModule: this.curPanel.UseModule,
      };
      if (!temp.PartID) delete temp.PartID;
      this.$store.commit('review/setConditionPropList', []);
      const list = await PropertyClass.getPropertyList(temp);
      this.$store.commit('review/setConditionPropList', list);
    },
    getDetailData() { // 获取内部详情列表数据
      if (!this.curPanel) return;
      const temp = {
        productID: this.curReviewProduct?.ID || '',
        partID: this.curReviewProductPart?.ID || '',
        type: this.curPanel.ID,
      };
      if (!temp.PartID) delete temp.PartID;
      this.$store.dispatch('review/getReviewSetupPanelList', temp);
    },
    handleItemRemove(item) {
      this.$store.dispatch('review/getCheckFileSetupRemove', { item });
    },
  },
  mounted() {
    this.getConditionPropList();
    this.getDetailData();
  },
};
</script>
<style lang='scss'>
.mp-erp-review-common-with-condition-setting-manage-list-page-wrap {
  padding-left: 30px;
  padding-right: 100px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
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
    > .btn-box {
      padding-top: 22px;
      white-space: nowrap;
      > .el-button {
        height: 30px;
        padding: 0 16px;
        min-width: 120px;
      }
      > .tips-box {
        display: inline-block;
        margin-left: 20px;
        width: auto;
        padding-right: 12px;
        font-size: 13px;
      }
    }
  }
  > main {
    flex: 1;
    overflow: auto;
    overflow: overlay;
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
