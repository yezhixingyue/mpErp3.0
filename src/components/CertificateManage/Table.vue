<template>
  <el-table
    stripe
    border
    fit
    :data="CertificateList"
    style="width: 100%"
    :max-height="h"
    :height="h"
    class="mp-erp-certificate-manage-list-page-table ft-14-table"
  >
    <el-table-column
      prop="CertificateName"
      label="名称"
      minWidth="138"
      show-overflow-tooltip
    >
      <span slot-scope="scope">
        {{scope.row.CertificateName || ''}}
      </span>
    </el-table-column>
    <el-table-column
      label="类型"
      minWidth="128"
      show-overflow-tooltip
    >
      <span slot-scope="scope">
        {{ CertificateType.find(it => it.value === scope.row.CertificateType).label }}
      </span>
    </el-table-column>
    <el-table-column
      prop="Expire"
      label="有效期"
      minWidth="163"
      show-overflow-tooltip
    >
      <span slot-scope="scope">{{
        scope.row.Expire.split('T')[0]
      }}</span>
    </el-table-column>
    <el-table-column
      prop="CertificateStatus"
      label="证书状态"
      minWidth="108"
      show-overflow-tooltip
      >
      <span slot-scope="scope">{{
        CertificateStatus.find(it => it.value === scope.row.CertificateStatus).label
      }}</span>
    </el-table-column>
    <el-table-column
      label="缩略图"
      width="182">
      <template slot-scope="scope">
        <div style="display: flex; justify-content: center;">
          <el-image :preview-src-list="scope.row.CertificatePics" style="width: 40px; height: 40px;"
            v-for="item in scope.row.CertificatePics" :key="item" :src="item" fit="cover" ></el-image>
        </div>
        <!-- {{ scope.row.CertificatePics }} -->
      </template>
    </el-table-column>
    <el-table-column
      prop="CheckStatus"
      label="审核状态"
      width="236"
      show-overflow-tooltip
    >
      <span slot-scope="scope">{{
        CheckStatus.find(it => it.value === scope.row.CheckStatus).label
      }}</span>
    </el-table-column>
    <el-table-column label="添加时间" show-overflow-tooltip width="176">
      <span slot-scope="scope">{{
        scope.row.CreateTime | format2MiddleLangTypeDate
      }}</span>
    </el-table-column>
    <el-table-column label="所属用户" show-overflow-tooltip width="176">
      <span slot-scope="scope">{{scope.row.Customer.CustomerName}}（{{scope.row.Customer.CustomerSN}}）</span>
    </el-table-column>
    <el-table-column
      prop="Customer.Mobile"
      label="审核人"
      width="102"
      show-overflow-tooltip
    >
      <span slot-scope="scope">
        {{scope.row.Checker ? scope.row.Checker.CheckerName : ''}}
      </span>
    </el-table-column>
    <el-table-column
      label="审核时间"
      prop="Customer.QQ"
      width="142"
      show-overflow-tooltip
    >
      <span slot-scope="scope">
        {{scope.row.CheckTime | format2MiddleLangTypeDate}}
      </span>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  props: {
    CertificateList: {
      type: Array,
      default: () => [],
    },
    CheckStatus: {
      type: Array,
      default: () => [],
    },
    CertificateStatus: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState('common', ['CertificateType']),
  },
  mixins: [tableMixin, recordScrollPositionMixin('.ft-14-table .el-table__body-wrapper')],
  filters: {
  },
  methods: {
    setHeight() {
      // const tempHeight = this.getHeight('.mp-erp-certificate-manage-list-page-main', 0);
      const oDom = document.querySelector('.mp-erp-certificate-manage-list-page-main-comp-wrap'); // 未使用通用方式获取高度
      if (oDom) this.h = oDom.offsetHeight;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-certificate-manage-list-page-table {
  width: 100%;
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .el-image + .el-image{
    margin-left: 10px;
  }
}
</style>
