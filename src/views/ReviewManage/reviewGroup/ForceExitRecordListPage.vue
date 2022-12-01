<template>
  <section class="mp-erp-force-exit-record-list-page-wrap">
    <header>
      <Crumbs :list="crumbsList" />
      <span class="tips-box"> <i class="el-icon-warning"></i> 注：此表不显示已离职员工，1年以上数据会被清空</span>
    </header>
    <main>
      <ForceExitTable :list="ForcedExitList" :loading="loading" @detail="onDetailClick" />
      <ForceExitDetailDialog :visible.sync="visible" :item="curItem" />
    </main>
    <footer>
      <el-button class="cancel-blue-btn" @click="$goback">返回</el-button>
      <Count
       :watchPage='condition.Page'
       :handlePageChange='getForcedExitList'
       :count='ForcedExitListNumber'
       :pageSize='condition.PageSize'
       />
    </footer>
  </section>
</template>

<script>
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import Crumbs from '../../../components/common/NewComps/Crumbs.vue';
import ForceExitTable from '../../../components/ReviewComps/ReviewGroup/ForceExitPage/ForceExitTable.vue';
import ForceExitDetailDialog from '../../../components/ReviewComps/ReviewGroup/ForceExitPage/ForceExitDetailDialog.vue';
import Count from '../../../components/common/Count.vue';
// 表格 及 分页

export default {
  name: 'ForceExitRecordListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-force-exit-record-list-page-wrap .el-table__body-wrapper')],
  components: {
    Crumbs,
    ForceExitTable,
    ForceExitDetailDialog,
    Count,
  },
  data() {
    return {
      crumbsList: [
        { name: '人员分组', path: '/reviewGroupManage' },
        { name: '强退人员名单' },
      ],
      condition: {
        Page: 1,
        PageSize: 30,
      },
      loading: false,
      ForcedExitList: [],
      ForcedExitListNumber: 0,
      visible: false,
      curItem: null,
    };
  },
  methods: {
    async getForcedExitList(Page = 1) {
      this.condition.Page = Page;
      this.ForcedExitList = [];
      this.loading = true;
      const resp = await this.api.getForcedExitList(this.condition).catch(() => null);
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.ForcedExitList = resp.data.Data;
        this.ForcedExitListNumber = resp.data.DataNumber;
      }
    },
    onDetailClick(item) {
      if (!item) return;
      this.curItem = item;
      this.visible = true;
    },
  },
  mounted() {
    this.getForcedExitList();
  },
};
</script>
<style lang='scss'>
.mp-erp-force-exit-record-list-page-wrap {
  padding-left: 30px;
  padding-right: 30px;
  > header {
    padding: 8px 0;
    > .tips-box {
      margin-left: 20px;
    }
  }
  > footer {
    padding-top: 13px;
    padding-right: 0px;
    text-align: right;
    padding-bottom: 10px;
    .el-button {
      width: 120px;
      height: 35px;
      padding: 0;
    }
    .count-wrap {
      display: inline-block;
      min-width: calc(50% - 60px);
      padding-right: 0;
      vertical-align: middle;
      width: auto;
      > .count {
        display: none;
      }
    }
  }
}
</style>
