<template>
  <section class="after-sales-list-page">
    <AfterSalesListHeader :dataList='AfterSalesList' :condition='condition' @getDataList='getDataList'
     @clearCondition='clearCondition' @setCondition='setCondition' />
    <div>
      <el-table stripe border fit :data="AfterSalesList" style="width: 100%" class="ft-14-table" :max-height="h" :height="h">
        <el-table-column prop="AfterSaleCode" label="售后单号" minWidth="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="OrderID" label="订单号" minWidth="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CustomerType" label="区域" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}====={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="客户类型" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}{{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="产品" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="金额" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="运费" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="客户诉求" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="申请时间" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="售后渠道" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="处理结果" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="额外支出" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="状态" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="处理人" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="最后操作时间" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}========={{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <div class="is-font-12 btn-wrap" slot-scope="scope">
            <span @click="onDetailClick(scope.row)" v-if="localPermission.Operate">
              <img src="@/assets/images/detail.png" alt />
              <span v-if="scope.row.Status === 0">开始处理</span>
              <span v-else-if="scope.row.IsHang">继续处理</span>
              <span v-else>查看详情</span>
            </span>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <footer>
      <Count
       :watchPage='condition.Page'
       :handlePageChange='handlePageChange'
       :count='dataNumber'
       :pageSize='20'
       />
    </footer>
  </section>
</template>

<script>
import AfterSalesListHeader from '@/components/AfterSalesComps/AfterSalesListHeader.vue';
import Count from '@/components/common/Count.vue';
import mixin from '@/assets/js/mixins/OrderList&FeedbackCommonDialogMixins/index';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapState, mapMutations } from 'vuex';
import ClassType from '@/store/CommonClassType';

export default {
  name: 'AfterSalesListPage',
  components: {
    Count,
    AfterSalesListHeader,
  },
  mixins: [mixin, tableMixin, recordScrollPositionMixin('.ft-14-table .el-table__body-wrapper')],
  data() {
    return {
      nowDate: null,
      dataNumber: 0,
      condition: {
        Product: {
          ClassID: '',
          TypeID: '',
          ProductID: '',
        },
        CustomerType: {
          First: '',
        },
        SellRegionalID: '',
        SellCityID: '',
        SellCountyID: '',
        KeyWords: '',
        Page: 1,
        PageSize: 20,
      },
    };
  },
  computed: {
    ...mapState('common', ['Permission', 'ServerApplyTypeList']),
    ...mapState('AfterSale', ['AfterSalesList']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionAfterSalesApply?.Obj) {
        return this.Permission.PermissionList.PermissionAfterSalesApply.Obj;
      }
      return {};
    },
  },
  methods: {
    ...mapMutations('AfterSale', ['setAfterSalesList', 'setAfterSalesDetail']),
    setHeight() {
      const tempHeight = this.getHeight('.mp-after-sales-page-header-wrap', 60);
      this.h = tempHeight;
    },
    async getDataList(page = 1) {
      this.condition.Page = page;
      ClassType.setDate(this.condition);
      const _obj = ClassType.filter(this.condition, true);
      if (_obj.Date) {
        _obj.ApplyTime = _obj.Date;
        delete _obj.Date;
      }
      let key = true;
      this.setAfterSalesList([]);
      const res = await this.api.getApplyQuestionApplyList(_obj).catch(() => { key = false; });
      if (key && res.data.Status === 1000) {
        this.setAfterSalesList(res.data.Data);
        this.dataNumber = res.data.DataNumber;
      }
    },
    clearCondition() {
    },
    setCondition() {
    },
    handlePageChange() {
    },
    onDetailClick(Detail) {
      this.setAfterSalesDetail(Detail);
      this.$router.push({ name: 'AfterSalesInfo' });
    },
  },
  mounted() {
    this.getDataList();
    this.$nextTick(() => this.setHeight());
    window.onresize = () => this.setHeight();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.after-sales-list-page{
  padding-left: 8px;
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .el-table__fixed-header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
}
</style>
