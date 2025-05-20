<template>
  <section class="after-sales-list-page">
    <LiabilityRecognitionListHeader :dataList='ResponsibilityConfirmList' :condition='ResponsibilityConfirmCondition' @getDataList='getDataList'
    @clearCondition='clearCondition' @setCondition='setCondition' :progressList='progressList'  />
    <div>
      <el-table stripe border fit :data="ResponsibilityConfirmList" style="width: 100%" class="ft-14-table" :max-height="h" :height="h">
        <el-table-column prop="AfterSaleCode" label="售后单号" minWidth="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="OrderID" label="订单号" minWidth="86" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SellArea" label="区域" minWidth="127" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CustomerType" label="客户类型" minWidth="70" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ProductName" label="产品" minWidth="130" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CustomerType" label="金额" minWidth="60" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.OrderProductPrice }}元</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="运费" minWidth="60" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.OrderFreight }}元</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="责任划分时间" minWidth="124" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ResponsibilityDivideTime | format2MiddleLangTypeDate }}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="处理结果" minWidth="136" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.IsReject">
              驳回
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
        <el-table-column prop="CustomerType" label="责任总金额" minWidth="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ResponsibilityAmount}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="本中心责任" minWidth="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip  :disabled="scope.row.AfterSaleResponsibilities.length === 1" effect="dark"
            :content="getAfterSaleResponsibilities(scope.row.AfterSaleResponsibilities)" placement="top">
              <span>{{scope.row.AfterSaleResponsibilities.find(it => it.Department===ResponsibilityConfirmCondition.DepartmentID)?.Proportion}}%</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="问题类型" minWidth="135" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.AfterSaleQuestions.map(it => `${it.FirstQuestionTypeTitle}-${it.SecondQuestionTypeTitle}`).join('、')}}
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="责任人" minWidth="82" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ResponsibilityPersons ? scope.row.ResponsibilityPersons.join('、') : ''}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="状态" minWidth="60" show-overflow-tooltip>
          <template slot-scope="scope">{{ progressList.find(it => scope.row.Status === it.ID)?.name}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="划分人" minWidth="60" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ResponsibilityDivideOperater}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="确认时间" minWidth="124" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.ResponsibilityConfirmTime | format2MiddleLangTypeDate}}
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="确认人" minWidth="60" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.AfterSaleResponsibilities.find(it => it.Department===ResponsibilityConfirmCondition.DepartmentID)?.ConfirmerName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="88" fixed="right">
          <div class="is-font-12 operate" slot-scope="scope">
            <span v-if="scope.row.Status === 0">
              <span v-if="PermissionData.Confirm || ResponsibilityConfirmCondition.DepartmentID !== 1" @click="onDetailClick(scope.row)">
                <i style="color: #26BCF9;margin-left: 5px;" class="iconfont icon-querenzeren"></i>确认责任
              </span>
              <span v-else class="is-gray"><i class="iconfont icon-querenzeren"></i>确认责任</span>
            </span>
            <span v-else @click="onDetailClick(scope.row)">
              <span><i style="color: #26BCF9;margin-left: 5px;" class="iconfont icon-xiangqing3"></i>查看详情</span>
            </span>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <footer>
      <Count
       :watchPage='ResponsibilityConfirmCondition.Page'
       :handlePageChange='handlePageChange'
       :count='ResponsibilityConfirmDataNumber'
       :pageSize='20'
       >
        <DownLoadExcelComp v-if="PermissionData.ExportExcel || ResponsibilityConfirmCondition.DepartmentID !== 1" title="导出Excel表格" :configObj="configObj" />
      </Count>
    </footer>
  </section>
</template>

<script>
import LiabilityRecognitionListHeader from '@/components/AfterSalesComps/LiabilityRecognitionListHeader.vue';
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
import Count from '@/components/common/Count.vue';
import mixin from '@/assets/js/mixins/OrderList&FeedbackCommonDialogMixins/index';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapState, mapMutations, mapActions } from 'vuex';
import ClassType from '@/store/CommonClassType';

export default {
  name: 'LiabilityRecognitionListPage',
  components: {
    Count,
    LiabilityRecognitionListHeader,
    DownLoadExcelComp,
  },
  mixins: [mixin, tableMixin, recordScrollPositionMixin('.ft-14-table .el-table__body-wrapper')],
  data() {
    return {
      nowDate: null,
    };
  },
  computed: {
    ...mapState('AfterSale', ['ResponsibilityConfirmList', 'ResponsibilityConfirmDataNumber', 'ResponsibilityConfirmCondition']),
    ...mapState('common', ['Permission', 'ServerApplyTypeList']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionResponsibilityConfirm?.Obj) {
        return this.Permission.PermissionList.PermissionResponsibilityConfirm.Obj;
      }
      return {};
    },
    PermissionData() {
      const temp = {
        Confirm: false,
        ExportExcel: false,
      };
      if (this.ResponsibilityConfirmCondition.DepartmentID === 1) {
        temp.Confirm = this.localPermission.BusinessConfirm;
        temp.ExportExcel = this.localPermission.BusinessExportExcel;
      }
      if (this.ResponsibilityConfirmCondition.DepartmentID === 5) {
        temp.Confirm = this.localPermission.AutoSoftManage;
        temp.ExportExcel = this.localPermission.AutoSoftManage;
      }
      if (this.ResponsibilityConfirmCondition.DepartmentID === 6) {
        temp.Confirm = this.localPermission.OtherSoftManage;
        temp.ExportExcel = this.localPermission.OtherSoftManage;
      }
      return temp;
    },
    progressList() {
      const arr = [
        { name: '不限', ID: '' },
        { name: '未确认', ID: 0 },
        { name: '已确认', ID: 1 },
      ];
      return arr;
    },
    configObj() { // 导出Excel条件对象
      const temp = JSON.parse(JSON.stringify(this.ResponsibilityConfirmCondition));
      ClassType.setDate(temp);
      const _obj = ClassType.filter(temp, true);
      if (_obj.Date) {
        _obj.SelectTime = _obj.Date;
        delete _obj.Date;
      }
      return {
        condition: ClassType.filter(_obj, true),
        count: this.ResponsibilityConfirmDataNumber,
        fileDefaultName: '责任确认表',
        // fileDate: '',
        showDateByFile: false,
        downFunc: data => this.api.getAfterSaleResponsibilityConfirmExcel(data),
      };
    },
  },
  methods: {
    ...mapActions('AfterSale', ['getOrderAfterSaleResponsibilityConfirmList', 'getOrderAfterSaleResponsibilityConfirmList']),
    ...mapMutations('AfterSale', ['setResponsibilityConfirmCondition', 'setClearResponsibilityConfirmCondition']),
    getAfterSaleResponsibilities(list) {
      const temp = list.map(it => {
        let title = '';
        switch (it.Department) {
          case 1:
            title = '业务中心';
            break;
          case 2:
            title = '生产工厂';
            break;
          case 3:
            title = '物流中心';
            break;
          case 4:
            title = '配送中心';
            break;
          case 5:
            title = '自动审稿软件';
            break;
          case 6:
            title = '其他软件';
            break;
          default:
            title = '业务中心';
            break;
        }
        return `${title}:${it.Proportion}%`;
      });
      return temp.join('、');
    },
    setHeight() {
      const tempHeight = this.getHeight('.mp-liability-recognition-page-header-wrap', 60);
      this.h = tempHeight;
    },
    async getDataList(page = 1) {
      this.getOrderAfterSaleResponsibilityConfirmList(page);
    },
    clearCondition() {
      this.setClearResponsibilityConfirmCondition();
    },
    setCondition(Condition) {
      this.setResponsibilityConfirmCondition(Condition);
    },
    handlePageChange(page) {
      this.getDataList(page);
    },
    onDetailClick(Detail) {
      this.$router.push({ name: 'LiabilityRecognitionInfo',
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
    this.$nextTick(() => this.setHeight());
    window.onresize = () => this.setHeight();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.after-sales-list-page{
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
}
</style>
