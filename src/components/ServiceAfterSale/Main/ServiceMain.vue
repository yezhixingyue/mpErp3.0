<template>
  <div class="mp-service-page-main-wrap">
      <ServiceTable
        @changeQuestion='handleChangeQuestion'
        @LossAssessment='handleLossAssessment'
        @seeEstimate='handleSeeEstimate' />
      <Count :watchPage='obj4RequestServiceList.Page'
       :handlePageChange='handlePageChange' :count='totalCount' :showLoading='isShowLoadingMore'>
        <!-- <span class="is-blue" @click="handleDownloadClick">
          导出Excel表格
          <i class="el-icon-download"></i>
        </span> -->
        <DownLoadExcelComp :configObj="configObj2" title="导出财务报表" v-if="localPermission.FinanceExportExcel" />
        <DownLoadExcelComp :configObj="configObj" v-if="localPermission.ExportExcel" />
      </Count>
      <ServiceDetailDialog />
      <ChangeQuestionDialog :visible.sync="changeQuestionVisible" :curData="curData" />
      <!-- 查看售后评价 -->
      <SeeEstimateDialogComp
      :AfterSaleData='AfterSaleData'
      :visible='seeEstimateVisible'
      @closed="seeEstimateVisible = false"
      @submit="seeEstimateVisible = false"></SeeEstimateDialogComp>
      <!-- 定损确认 -->
      <LossAssessmentDialogComp
      :AfterSaleData='AfterSaleData'
      :visible='LossAssessmentVisible'
      @closed="LossAssessmentVisible = false"
      @submit="LossAssessmentSubmit"></LossAssessmentDialogComp>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Count from '@/components/common/Count.vue';
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
import ServiceTable from './ServiceTable.vue';
import ServiceDetailDialog from './ServiceDetailDialog.vue';
import ChangeQuestionDialog from './ChangeQuestionDialog.vue';
import SeeEstimateDialogComp from './SeeEstimateDialogComp.vue';
import LossAssessmentDialogComp from './LossAssessmentDialogComp.vue';

export default {
  components: {
    ServiceTable,
    Count,
    ServiceDetailDialog,
    DownLoadExcelComp,
    ChangeQuestionDialog,
    SeeEstimateDialogComp,
    LossAssessmentDialogComp,
  },
  computed: {
    ...mapState('service', ['isShowLoadingMore', 'totalCount', 'obj4RequestServiceList', 'tableData']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManageAfterSales?.Obj) {
        return this.Permission.PermissionList.PermissionManageAfterSales.Obj;
      }
      return {};
    },
    configObj2() {
      return {
        condition: this.obj4RequestServiceList,
        count: this.totalCount,
        fileDefaultName: '售后单列表',
        fileDate: this.obj4RequestServiceList.OperateTime,
        downFunc: data => this.api.getServicesListData2Excel(data),
      };
    },
    configObj() {
      // 非财务使用导出需限制定损完成
      const _obj = { ...this.obj4RequestServiceList };
      _obj.LossConfirmStatus = 1;
      return {
        condition: _obj,
        count: this.totalCount,
        fileDefaultName: '售后单列表',
        fileDate: this.obj4RequestServiceList.OperateTime,
        downFunc: data => this.api.getServicesListData2Excel(data),
      };
    },
  },
  data() {
    return {
      changeQuestionVisible: false,
      curData: null,

      AfterSaleData: null,
      seeEstimateVisible: false,
      LossAssessmentVisible: false,
    };
  },
  methods: {
    ...mapActions('service', ['getServiceListData', 'getServiceListData2Excel']),
    handlePageChange(page) {
      this.getServiceListData({ page, type: 'get' });
    },
    handleDownloadClick() {
      if (this.obj4RequestServiceList.Page === 1
           && this.tableData.length === 0
           && this.totalCount === 0) {
        this.messageBox.warnSingleError('[ 当前条件没有可下载的列表数据! ]');
        return;
      }
      // const { First, Second } = this.obj4RequestServiceList.CreateTime;
      // if (!First && !Second) {
      //   this.messageBox.warnSingleError('[ 筛选时间为全部时不能导出数据，请选择具体时间! ]');
      //   return;
      // }
      // if ((!First && Second) || (First && !Second)) {
      //   this.messageBox.warnSingleError('[ 时间区间出现异常! ]');
      //   return;
      // }
      // let _second = '';
      // _second = Second && new Date(Second) > new Date() ? this.TodayDate.Second : Second;
      // const _firstTime = new Date(new Date(First)).getTime();
      // const _endTime = new Date(new Date(_second)).getTime();
      // const _maxDuration = 3 * 24 * 60 * 60 * 1000; // 最大区间100天
      // if (_endTime - _firstTime > _maxDuration) {
      //   this.messageBox.warnSingleError('间隔时间不能超过3天,
      // 请使用今日、昨日或自定义时间进行区间选择!', undefined, undefined, '导出间隔时间过长!');
      //   // this.messageBox.warnSingleError('[ 导出数据时筛选时间间隔不能超过100天! ]');
      //   return;
      // }
      // this.messageBox.warnCancelNullMsg('确定导出表格数据吗?', () => this.getServiceListData2Excel());
      this.getServiceListData2Excel();
    },
    handleChangeQuestion(item) {
      this.changeQuestionVisible = true;
      this.curData = item;
    },
    // 查看评价
    handleSeeEstimate(AfterSaleData) {
      this.seeEstimateVisible = true;
      this.AfterSaleData = AfterSaleData;
    },
    // 定损确认
    handleLossAssessment(AfterSaleData) {
      this.LossAssessmentVisible = true;
      this.AfterSaleData = AfterSaleData;
    },
    // 定损确认
    LossAssessmentSubmit() {
      this.LossAssessmentVisible = false;
      this.handlePageChange(this.obj4RequestServiceList.Page);
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-service-page-main-wrap{
  // border: 1px solid #e6e6e6;
  box-sizing: border-box;
  > .count-wrap {
    > .is-blue {
      margin-left: 60px;
      margin-right: -20px;
      cursor: pointer;
      &:hover {
        color: $--color-primary-light !important;
      }
    }
  }
}
</style>
