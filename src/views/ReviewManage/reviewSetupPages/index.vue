<template>
  <section class="mp-erp-review-manage-product-list-page-wrap">
    <Header
      :data="defaultWorkFlowData"
      :originData="defaultWorkFlowOriginData"
      :hasPermission="!!localPermission.Setup"
      @setDefaultFlow="setDefaultFlow"
      @outFileManage="outFileManage"
     />
    <main>
      <p>
        <span>产品名称</span>
        <span>设置</span>
        <span>操作</span>
      </p>
      <ReviewProductTable
        :list="reviewProductList"
        :hasPermission="!!localPermission.Setup"
        :loading="loading"
        @menuClick="onMenuClick"
        @OrderNameMustInputChange="onOrderNameMustInputChange"
       />
      <DefaultWorkFlowSetupDialog
        v-if="defaultWorkFlowData"
        :visible.sync="defaultWorkFlowVisible"
        :item="defaultWorkFlowData"
        @submit="onDefaultWorkFlowSubmit"
      />
      <ReviewPartSetupDialog :visible.sync="partSetupVisible" :item="curReviewProduct" @submited="onPartSubmited" />
    </main>
    <footer>
      <Count
       :watchPage='condition4ReviewProductList.Page'
       :handlePageChange='getReviewProductList'
       :count='reviewProductListNumber'
       center
       :pageSize='condition4ReviewProductList.PageSize'
       />
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import Header from '../../../components/ReviewComps/ReviewSetup/ListComps/Header.vue';
import ReviewProductTable from '../../../components/ReviewComps/ReviewSetup/ListComps/Table/ReviewProductTable.vue';
import DefaultWorkFlowSetupDialog from '../../../components/ReviewComps/ReviewSetup/ListComps/DefaultWorkFlowSetupDialog.vue';
import ReviewPartSetupDialog from '../../../components/ReviewComps/ReviewSetup/ListComps/ReviewPartSetupDialog.vue';
import Count from '../../../components/common/Count.vue';
import { PanelTypeEnums } from '../../../store/review/reviewEnums';
import ReviewFlowPanelClass from '../../../store/review/TypeClass/PanelClass/ReviewFlowPanelClass';

export default {
  name: 'reviewSetupListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-review-manage-product-list-page-wrap > main > ul')],
  components: {
    Header,
    ReviewProductTable,
    DefaultWorkFlowSetupDialog,
    ReviewPartSetupDialog,
    Count,
  },
  computed: {
    ...mapState('review', ['reviewProductListNumber', 'reviewProductList', 'loading', 'condition4ReviewProductList', 'curPanelData']),
    ...mapGetters('review', ['curReviewProduct', 'curReviewProductPart']),
    ...mapState('common', ['Permission']),
    localPermission() { // localPermission.Setup
      if (this.Permission?.PermissionList?.PermissionCheckFileSetup?.Obj) {
        return this.Permission.PermissionList.PermissionCheckFileSetup.Obj;
      }
      return {};
    },
  },
  data() {
    return {
      defaultWorkFlowVisible: false,
      defaultWorkFlowData: null,
      defaultWorkFlowOriginData: null,
      partSetupVisible: false,
    };
  },
  methods: {
    getReviewProductList(page = 1) { // 获取审稿产品列表数据
      this.$store.dispatch('review/getReviewProductList', page);
    },
    setDefaultFlow() { // 点击设置默认流程
      this.defaultWorkFlowVisible = true;
    },
    outFileManage() { // 管理输出文件
      this.$router.push('/outFileNameManage');
    },
    async getCheckFileDefaultProcess() { // 获取默认流程数据
      const resp = await this.api.getCheckFileDefaultProcess().catch(() => null);
      if (resp && resp.data.Status === 1000 && resp.data.Data) {
        this.defaultWorkFlowOriginData = resp.data.Data.Process;
        this.defaultWorkFlowData = new ReviewFlowPanelClass(resp.data.Data.Process);
      }
    },
    async onDefaultWorkFlowSubmit(data) { // 默认流程设置提交
      if (!data) return;
      const resp = await this.api.getDefaultProcessSetup(data).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.defaultWorkFlowData = new ReviewFlowPanelClass(data);
          this.defaultWorkFlowOriginData = this.defaultWorkFlowData;
          this.defaultWorkFlowVisible = false;
        };
        this.messageBox.successSingle('设置成功', cb, cb);
      }
    },
    onMenuClick(e) {
      if (!e || !e.panelType) return;
      this.$store.commit('review/setCurPanelData', e);
      const { ID } = e.panelType;
      switch (ID) {
        case PanelTypeEnums.part.ID:
          // 部件文件 -- 打开弹窗
          this.partSetupVisible = true;
          break;
        case PanelTypeEnums.other.ID:
          // 其它设置页面
          this.$router.push('/reviewOtherSetting');
          break;
        default:
          // 各个条件设置页面
          this.$router.push('/reviewPanelsList');
          break;
      }
    },
    onOrderNameMustInputChange(e) {
      this.$store.commit('review/setOrderNameMustInputChange', e);
    },
    onPartSubmited(data) { // 部件文件设置提交成功后的回调函数
      if (!data) return;
      this.$store.commit('review/setCheckFilePartSave', data);
    },
  },
  mounted() {
    this.getReviewProductList();
    this.getCheckFileDefaultProcess();
  },
};
</script>
<style lang='scss'>
.mp-erp-review-manage-product-list-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  // padding: 10px;
  background: #f5f5f5;
  overflow: hidden;
  // padding-right: 5px;
  > header, > footer {
    flex: none;
  }
  > header {
    padding-bottom: 17px;
    margin-left: 8px;
  }
  > main {
    flex: 1;
    margin-left: 8px;
    margin-right: 0px;
    margin-top:8px;
    background: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #e6e6e6;
    border-top: none;
    border-bottom: none;
    > p {
      flex: none;
      height: 38px;
      line-height: 36px;
      border: 1px solid #e6e6e6;
      border-left: none;
      border-right: none;
      font-weight: 700;
      font-size: 14px;
      color: #444;
      display: flex;
      background: #f5f5f5;
      > span {
        width: 33.33%;
        text-align: center;
        flex: none;
        box-sizing: border-box;
        &:not(:first-of-type) {
          padding-left: 1%;
          position: relative;
          &::before {
            content: '';
            position: absolute;
            width: 1px;
            height: 11px;
            background: rgba($color: #333, $alpha: 0.2);
            left: 0;
            top: 14px;
          }
          @media screen and (max-width: 1150px) {
            &::before {
              display: none;
            }
          }
        }
      }
    }
    > ul {
      flex: 1;
      box-sizing: border-box;
      overflow: auto;
      overflow: overlay;
      padding-top: 10px;
      > li {
        // min-width: 1280px;
        &.em {
          text-align: center;
          font-size: 12px;
          color: #989898;
          padding-top: 80px;
        }
      }
      &.loading {
        opacity: 0.2;
      }
    }
  }
  > footer {
    padding-top: 3px;
    padding-bottom: 5px;
    margin-left: 5px;
    margin-right: 0;
    background: #fff;
    // .count-wrap {
    //   padding-right: 0;
    //   &.is-center > .count {
    //     right: 0;
    //   }
    // }
  }
}
</style>
