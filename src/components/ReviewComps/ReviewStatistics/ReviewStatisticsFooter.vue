<template>
  <footer class="mp-erp-review-statistics-list-page-footer-wrap">
    <Count
       center
       :watchPage='condition.Page'
       :handlePageChange='getList'
       :count='dataNumber'
       :pageSize='condition.PageSize'
       >
       <DownLoadExcelComp v-if="localPermission.Excel" :configObj="configObj" />
      </Count>
  </footer>
</template>

<script>
import { mapState } from 'vuex';
import Count from '../../common/Count.vue';
import DownLoadExcelComp from '../../common/UploadComp/DownLoadExcelComp.vue';
import CommonClassType from '../../../store/CommonClassType';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    dataNumber: {
      type: Number,
      default: 0,
    },
    getList: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    Count,
    DownLoadExcelComp,
  },
  computed: {
    ...mapState('common', ['Permission']),
    localPermission() {
      return this.Permission?.PermissionList?.PermissionCheckFileStastics?.Obj || {};
    },
    configObj() {
      const filterConditon = CommonClassType.filter(this.condition, true);
      const fileDate = {
        First: this.condition.TimeRange.MinValue,
        Second: this.condition.TimeRange.MaxValue,
      };
      return {
        condition: filterConditon,
        count: this.dataNumber,
        fileDefaultName: '审稿统计',
        fileDate,
        downFunc: data => this.api.getCheckFileStatisticsExcel(data),
      };
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-statistics-list-page-footer-wrap {
  height: 60px;
  box-sizing: border-box;
  padding-top: 8px;
  .count-wrap {
    padding-right: 45px;
    padding-left: 12%;
    align-items: center;
    flex-wrap: nowrap;
    .mp-pagination-wrap {
      flex: 1;
      text-align: center;
    }
    .mp-common-download-to-excel-comp-wrap {
      flex: none;
      margin-left: 20px;
    }
    .count {
      position: relative !important;
      flex: none;
      margin-left: 25px;
      right: 0 !important;
    }
  }
}
</style>
