<!--
 * @Author: your name
 * @Date: 2020-05-12 10:57:32
 * @LastEditTime: 2022-01-05 10:59:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/components/Finance/Main/index.vue
-->
<template>
  <main class="mp-finance-page-main">
    <TableFinance />
    <div class="mp-finance-conunt-wrap">
      <Count
        :watchPage='searchCondition4Finance.Page'
        :handlePageChange='handlePageChange'
        :count='count'
      />
      <normalBtn @click.native="onClick" class="export-wrap" title="导出Excel表格" v-if="localPermission.ExportExcel" />
    </div>
    <FinanceListSummary
      :UnPaidAmount='UnPaidAmount'
      :PaidAmount='PaidAmount'
      :TotalAmount='TotalAmount'
    />
  </main>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import Count from '@/components/common/Count.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import FinanceListSummary from './FinanceListSummary.vue';
import TableFinance from './TableFinance.vue';

export default {
  components: {
    TableFinance,
    Count,
    FinanceListSummary,
    normalBtn,
  },
  computed: {
    ...mapState('finance', ['count', 'UnPaidAmount', 'PaidAmount', 'TotalAmount', 'searchCondition4Finance', 'PackageList']),
    ...mapGetters('timeSelectModule', ['TodayDate']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionFinance?.Obj) {
        return this.Permission.PermissionList.PermissionFinance.Obj;
      }
      return {};
    },
  },
  methods: {
    ...mapActions('finance', ['getFinanceTableData', 'getAccountReceivableExcel']),
    handlePageChange(page) {
      this.getFinanceTableData(page);
    },
    onClick() {
      if (this.searchCondition4Finance.Page === 1
           && this.PackageList.length === 0
           && this.count === 0) {
        this.$message.error('当前条件没有可下载的列表数据!');
        return;
      }
      // const { First, Second } = this.searchCondition4Finance.OutstoreDate;
      // if (!First && !Second) {
      //   this.$message.error('筛选时间为全部时不能导出数据，请选择具体时间!');
      //   return;
      // }
      // if ((!First && Second) || (First && !Second)) {
      //   this.$message.error('[ 时间区间出现异常! ]');
      //   return;
      // }

      // let _second = '';
      // _second = Second && new Date(Second) > new Date() ? this.TodayDate.Second : Second;

      // const _firstTime = new Date(new Date(First)).getTime();
      // const _endTime = new Date(new Date(_second)).getTime();
      // const _maxDuration = 3 * 24 * 60 * 60 * 1000; // 最大区间100天
      // if (_endTime - _firstTime > _maxDuration) {
      //   // this.$message.error('导出数据时筛选时间间隔不能超过100天!');
      //   this.messageBox.warnSingleError('间隔时间不能超过3天,
      // 请使用今日、昨日或自定义时间进行区间选择!', undefined, undefined, '导出间隔时间过长!');
      //   return;
      // }
      // this.messageBox.warnCancelNullMsg('确定导出表格数据吗?', () => this.getAccountReceivableExcel());
      this.getAccountReceivableExcel();
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-finance-page-main {
  background-color: $--color-white;
  min-width: 1000px;
  height: 100%;
  > .mp-finance-conunt-wrap {
    height: 57px;
    display: flex;
    justify-content: flex-end;
    > .count-wrap {
      width: calc(100% - 200px);
      margin-top: 3px;
      padding-right: 50px;
      > .count {
        font-size: 14px;
        margin: 0;
        flex: none;
      }
      > .mp-pagination-wrap {
        @media screen and (min-width: 500px) {
          margin-right: 5vw;
        }
        @media screen and (min-width: 1250px) {
          margin-right: 8vw;
        }
        @media screen and (min-width: 1400px) {
          margin-right: 10vw;
        }
        @media screen and (min-width: 1500px) {
          margin-right: 15vw;
        }
      }
    }
    > .export-wrap {
      margin: 0;
      width: 150px;
      height: 30px;
      margin-right: 50px;
      margin-top: 10px;
      font-size: 14px;
      border-radius: 2px;
    }
  }
}
</style>
