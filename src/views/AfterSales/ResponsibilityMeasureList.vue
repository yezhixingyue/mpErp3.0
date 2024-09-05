<template>
  <section class="responsibility-measure-list-page">
    <ResponsibilityMeasureListHeader :dataList='ResponsibilityMeasureList' :condition='ResponsibilityMeasureCondition' @getDataList='getDataList'
     @clearCondition='clearCondition' @setCondition='setCondition' :progressList='progressList' />
    <div>
      <el-table stripe border fit :data="ResponsibilityMeasureList" style="width: 100%" class="ft-14-table" :max-height="h" :height="h">
        <el-table-column prop="AfterSaleCode" label="售后单号" minWidth="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="OrderID" label="订单号" minWidth="86" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SellArea" label="区域" minWidth="148" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CustomerType" label="客户类型" minWidth="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ProductName" label="产品" minWidth="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CustomerType" label="金额" minWidth="60" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.OrderProductPrice }}元</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="运费" minWidth="60" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.OrderFreight }}元</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="处理结果" minWidth="170" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.IsReject">
              驳回{{scope.row.RejectReason}}
            </template>
            <template v-else>
              <template v-if="scope.row.SolutionResults[0]">
                {{ scope.row.SolutionResults[0] ? scope.row.SolutionResults[0].SolutionContent : '' }}
                <template v-if="scope.row.SolutionResults[0].CouponContents.length">
                  {{scope.row.CouponIsExtra?'额外':''}}赠送优惠券：
                  {{ scope.row.SolutionResults[0].CouponContents.join('、') }}
                </template>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="额外支出" minWidth="66" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.ExtraPayAmount" :disabled="!scope.row.ExtraPayRemark" effect="dark"
            :content="scope.row.ExtraPayRemark" placement="top">
              <span>{{scope.row.ExtraPayAmount}}元</span>
            </el-tooltip>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="责任金额" minWidth="66" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ResponsibilityAmount}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="售后完成时间" minWidth="124" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CompleteTime | format2MiddleLangTypeDate }}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="责任划分时间" minWidth="124" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ResponsibilityDivideTime | format2MiddleLangTypeDate }}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="责任占比" minWidth="126" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="it in scope.row.AfterSaleResponsibilities" :key="it.Department">
              <template v-if="it.Department === 1">
                业务中心
              </template>
              <template v-if="it.Department === 2">
                生产工厂
              </template>
              <template v-if="it.Department === 3">
                物流中心
              </template>
              <template v-if="it.Department === 4">
                配送中心
              </template>
              <template v-if="it.Department === 5">
                自动审稿软件
              </template>
              <template v-if="it.Department === 6">
                其他软件
              </template>:{{ it.Proportion }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="问题类型" minWidth="157" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.AfterSaleQuestions.map(it => `${it.FirstQuestionTypeTitle}-${it.SecondQuestionTypeTitle}`).join('、')}}
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="状态" minWidth="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="{'is-pink': scope.row.Status === 255}">{{progressList.find(it => it.ID === scope.row.Status)?.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="划分人" minWidth="60" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ResponsibilityDivideOperater}}</template>
        </el-table-column>
        <el-table-column label="操作" width="88" fixed="right">
          <div class="is-font-12 operate" slot-scope="scope">
            <span v-if="scope.row.Status === 0 || scope.row.Status === 1">
              <span v-if="staffDetailData.StaffID === scope.row.ResponsibilityDivideOperaterID" @click="onDetailClick(scope.row)">
                <i style="color: #26BCF9;margin-left: 5px;" class="iconfont icon-huafenzeren2"></i>划分责任
              </span>
              <span v-else class="is-gray" style="margin-left: 5px;"> <i class="iconfont icon-huafenzeren2"></i>划分责任</span>
            </span>
            <span v-else>
              <span v-if="localPermission.QueryDetail || staffDetailData.StaffID === scope.row.ResponsibilityDivideOperaterID"
              @click="onDetailClick(scope.row)">
                <i style="color: #26BCF9;margin-left: 5px;" class="iconfont icon-xiangqing3"></i>查看详情
              </span>
              <span v-else class="is-gray">
                <i style="margin-left: 5px;" class="iconfont icon-xiangqing3"></i>查看详情
              </span>
            </span>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <footer>
      <Count
       :watchPage='ResponsibilityMeasureCondition.Page'
       :handlePageChange='handlePageChange'
       :count='ResponsibilityMeasureDataNumber'
       :pageSize='20'
       >
        <DownLoadExcelComp v-if="localPermission.ExportExcel" title="导出Excel表格" :configObj="configObj" />
      </Count>
    </footer>
  </section>
</template>

<script>
import ResponsibilityMeasureListHeader from '@/components/AfterSalesComps/ResponsibilityMeasureListHeader.vue';
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
import Count from '@/components/common/Count.vue';
import mixin from '@/assets/js/mixins/OrderList&FeedbackCommonDialogMixins/index';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapState, mapMutations, mapActions } from 'vuex';
import ClassType from '@/store/CommonClassType';

export default {
  name: 'ResponsibilityMeasureListPage',
  components: {
    Count,
    ResponsibilityMeasureListHeader,
    DownLoadExcelComp,
  },
  mixins: [mixin, tableMixin, recordScrollPositionMixin('.ft-14-table .el-table__body-wrapper')],
  data() {
    return {
      nowDate: null,
    };
  },
  computed: {
    ...mapState('common', ['Permission', 'ServerApplyTypeList']),
    ...mapState('AfterSale', ['QuestionClassList', 'ResponsibilityMeasureList', 'ResponsibilityMeasureDataNumber', 'ResponsibilityMeasureCondition']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionResponsibilityDivide?.Obj) {
        return this.Permission.PermissionList.PermissionResponsibilityDivide.Obj;
      }
      return {};
    },
    progressList() {
      const arr = [
        { name: '不限', ID: '' },
        { name: '未划分', ID: 0 },
        { name: '未确认', ID: 1 },
        { name: '已完结', ID: 2 },
        { name: '已超时', ID: 255 },
      ];
      return arr;
    },
    staffDetailData() {
      const _detailData = localStorage.getItem('staffDetailData');
      return JSON.parse(_detailData);
    },
    configObj() { // 导出Excel条件对象
      const temp = JSON.parse(JSON.stringify(this.ResponsibilityMeasureCondition));
      ClassType.setDate(temp);
      const _obj = ClassType.filter(temp, true);
      if (_obj.Date) {
        _obj.SelectTime = _obj.Date;
        delete _obj.Date;
      }
      return {
        condition: ClassType.filter(_obj, true),
        count: this.ResponsibilityMeasureDataNumber,
        fileDefaultName: '责任划分表',
        // fileDate: '',
        showDateByFile: false,
        downFunc: data => this.api.getAfterSaleResponsibilityDivideExcel(data),
      };
    },
  },
  methods: {
    ...mapActions('AfterSale', ['getOrderAfterSaleQuestionClassList', 'getOrderAfterSaleResponsibilityDivideList']),
    ...mapMutations('AfterSale', ['setResponsibilityMeasureCondition', 'setClearResponsibilityMeasureCondition']),
    setHeight() {
      const tempHeight = this.getHeight('.mp-responsibility-measure-page-header-wrap', 60);
      this.h = tempHeight;
    },
    async getDataList(page = 1) {
      this.getOrderAfterSaleResponsibilityDivideList(page);
    },
    clearCondition() {
      this.setClearResponsibilityMeasureCondition();
    },
    setCondition(Condition) {
      this.setResponsibilityMeasureCondition(Condition);
    },
    getQuestionClassList() {
      if (this.QuestionClassList.length === 0) {
        this.getOrderAfterSaleQuestionClassList({ searchType: 2 });
      }
    },
    handlePageChange(page) {
      this.getDataList(page);
    },
    onDetailClick(Detail) {
      this.$router.push({ name: 'ResponsibilityMeasureInfo',
        query: {
          AfterSaleCode: Detail.AfterSaleCode,
          OrderID: Detail.OrderID,
          Status: Detail.Status,
        },
      });
    },
  },
  mounted() {
    this.getDataList();
    this.getQuestionClassList();
    this.$nextTick(() => this.setHeight());
    window.onresize = () => this.setHeight();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.responsibility-measure-list-page{
  padding-left: 8px;
  .el-table {
    .operate{
      .iconfont{
        font-size: 12px;
        margin-right: 3px;
      }
      >span>span{
        cursor: pointer;
        &.is-gray{
          cursor: not-allowed;
        }
      }
    }
  }
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .el-table__fixed-header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  footer{
    height: 57px;
    display: flex;
    justify-content: flex-end;
    > .count-wrap {
      flex: 1;
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
}
</style>
