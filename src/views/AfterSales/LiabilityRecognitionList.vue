<template>
  <section class="after-sales-list-page">
    <LiabilityRecognitionListHeader :dataList='ResponsibilityConfirmList' :condition='condition' @getDataList='getDataList'
    @clearCondition='clearCondition' @setCondition='setCondition' :progressList='progressList'  />
    <div>
      <el-table stripe border fit :data="ResponsibilityConfirmList" style="width: 100%" class="ft-14-table" :max-height="h" :height="h">
        <el-table-column prop="AfterSaleCode" label="售后单号" minWidth="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="OrderID" label="订单号" minWidth="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SellArea" label="区域" minWidth="125" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CustomerType" label="客户类型" minWidth="125" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ProductName" label="产品" minWidth="125" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CustomerType" label="金额" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.OrderProductPrice }}元</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="运费" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.OrderFreight }}元</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="责任划分时间" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ResponsibilityDivideTime | format2MiddleLangTypeDate }}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="处理结果" minWidth="125" show-overflow-tooltip>
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
        <el-table-column prop="CustomerType" label="额外支出" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ExtraPayAmount}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="责任总金额" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ResponsibilityAmount}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="本中心责任" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.AfterSaleResponsibilities.find(it => it.Department===1)?.Proportion}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="问题类型" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.AfterSaleQuestions.map(it => `${it.FirstQuestionTypeTitle}-${it.SecondQuestionTypeTitle}`).join('、')}}
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="责任人" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ResponsibilityPersons ? scope.row.ResponsibilityPersons.join('、') : ''}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="状态" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{ progressList.find(it => scope.row.Status === it.ID)?.name}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="划分人" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ResponsibilityDivideOperater}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="确认时间" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.ResponsibilityConfirmTime | format2MiddleLangTypeDate}}
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="确认人" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.AfterSaleResponsibilities.find(it => it.Department===1)?.ConfirmerName }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <div class="is-font-12 operate" slot-scope="scope">
            <span @click="onDetailClick(scope.row)" v-if="localPermission.Confirm">
              <span><i style="color: #26BCF9;margin-left: 5px;" class="iconfont icon-querenzeren"></i>确认责任</span>
            </span>
            <span v-else>
              <span class="is-gray"> <i class="iconfont icon-xiangqing3"></i>查看详情</span>
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
       >
        <DownLoadExcelComp v-if="localPermission.ExportExcel" title="导出Excel表格" :configObj="configObj" />
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
import { mapState, mapMutations } from 'vuex';
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
      ResponsibilityConfirmList: [],
      dataNumber: 0,
      condition: {
        ProductClass: {
          ClassID: 0,
          TypeID: 0,
          ProductID: '',
        },
        DateType: 'today',
        SellArea: {
          RegionalID: 0,
          RegionalName: '',
          CityID: 0,
          CityName: '',
          CountyID: 0,
          CountyName: '',
        },
        CustomerType: {
          First: '',
        },
        Date: {
          First: '',
          Second: '',
        },
        SelectTime: {
          First: '',
          Second: '',
        },
        Status: '',
        IsAllowHandle: false,
        AfterSaleChannels: [],
        ID: '',
        FieldType: 1,
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
      if (this.Permission?.PermissionList?.PermissionResponsibilityConfirm?.Obj) {
        return this.Permission.PermissionList.PermissionResponsibilityConfirm.Obj;
      }
      return {};
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
      ClassType.setDate(this.condition);
      const _obj = ClassType.filter(this.condition, true);
      if (_obj.Date) {
        _obj.SelectTime = _obj.Date;
        delete _obj.Date;
      }
      return {
        condition: ClassType.filter(_obj, true),
        count: this.dataNumber,
        fileDefaultName: '责任确认表',
        // fileDate: '',
        showDateByFile: false,
        downFunc: data => this.api.getAfterSaleResponsibilityConfirmExcel(data),
      };
    },
  },
  methods: {
    ...mapMutations('AfterSale', ['setAfterSalesList', 'setAfterSalesDetail']),
    setHeight() {
      const tempHeight = this.getHeight('.mp-liability-recognition-page-header-wrap', 60);
      this.h = tempHeight;
    },
    async getDataList(page = 1) {
      this.condition.Page = page;
      ClassType.setDate(this.condition);
      const _obj = ClassType.filter(this.condition, true);
      if (_obj.Date) {
        _obj.SelectTime = _obj.Date;
        delete _obj.Date;
      }
      let key = true;
      const res = await this.api.getOrderAfterSaleResponsibilityConfirmList(_obj).catch(() => { key = false; });
      if (key && res.data.Status === 1000) {
        this.ResponsibilityConfirmList = res.data.Data;
        this.dataNumber = res.data.DataNumber;
      }
    },
    clearCondition() {
    },
    setCondition([[key1, key2], value]) {
      if (!key1) return;
      if (key2) {
        this.condition[key1][key2] = value;
      } else {
        this.condition[key1] = value;
      }
    },
    handlePageChange(page) {
      this.getDataList(page);
    },
    getQuestionClassList() {
      if (this.QuestionClassList.length === 0) {
        this.getOrderAfterSaleQuestionClassList({ searchType: 2 });
      }
    },
    onDetailClick(Detail) {
      this.$router.push({ name: 'LiabilityRecognitionInfo',
        query: {
          AfterSaleCode: Detail.AfterSaleCode,
          OrderID: Detail.OrderID,
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
