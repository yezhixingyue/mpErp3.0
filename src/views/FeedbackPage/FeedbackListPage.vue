<template>
  <section class="mp-feedback-page-main-wrap">
    <ListPageHeader :dataList='dataList' :condition='condition' @getDataList='getDataList'
     @clearCondition='clearCondition' @setCondition='setCondition' />
    <div>
      <el-table stripe border fit :data="dataList" style="width: 100%" class="ft-14-table" :max-height="h" :height="h">
        <el-table-column prop="AfterSaleCode" label="售后服务单号" minWidth="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="OrderID" label="订单号" minWidth="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CustomerName" label="客户名称" minWidth="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CustomerType" label="客户类型" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}{{scope.row.CustomerGrade}}</template>
        </el-table-column>
        <el-table-column label="产品名称" prop="ProductName" minWidth="115" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ProductName}}</template>
        </el-table-column>
        <el-table-column prop="Content" label="文件内容" minWidth="150" show-overflow-tooltip>
          <span slot-scope="scope">{{scope.row.OrderRemark}}</span>
        </el-table-column>
        <el-table-column label="售后原因" minWidth="115" show-overflow-tooltip>
          <template slot-scope="scope">{{getApplyText(scope.row.QuestionTypeTitleList)}}</template>
        </el-table-column>
        <el-table-column label="诉求意向" minWidth="80" show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.AppealType | formatAppealType }}</template> -->
          <template slot-scope="scope">{{ getAppealTypeText(scope.row.AppealType) }}</template>

        </el-table-column>
        <el-table-column prop="Remark" label="问题备注" minWidth="130" show-overflow-tooltip>
          <span slot-scope="scope">{{scope.row.QuestionRemark}}</span>
        </el-table-column>
        <el-table-column prop="SellArea" label="销售区域" minWidth="145" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Mobile" label="联系方式" minWidth="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="QQ" label="QQ号码" minWidth="100" show-overflow-tooltip>
          <span slot-scope="scope">{{ scope.row.QQ || '--' }}</span>
        </el-table-column>
        <el-table-column label="申请时间" show-overflow-tooltip minWidth="125">
          <span v-if="scope.row.CreateTime" slot-scope="scope">
            {{ scope.row.CreateTime | format2MiddleLangTypeDate}}
          </span>
        </el-table-column>
        <el-table-column label="最迟响应时间" show-overflow-tooltip minWidth="125">
          <span v-if="scope.row.LatestRespondTime" :class="{'is-pink': OverTime(scope.row)}" slot-scope="scope">
            {{ scope.row.LatestRespondTime | format2MiddleLangTypeDate}}
          </span>
          <span v-else>--</span>
        </el-table-column>
        <el-table-column label="下次处理时间" show-overflow-tooltip minWidth="125">
          <template slot-scope="scope">
            <template v-if="scope.row.IsHang && scope.row.NextOperateType === 0">
               不确定
            </template>
            <template v-else>
              <span v-if="scope.row.IsHang && scope.row.NextOperateTime">
                {{ scope.row.NextOperateTime | format2MiddleLangTypeDate}}
              </span>
              <span v-else></span>
            </template>
          </template>
          <!-- <span v-if="scope.row.NextOperateTime" slot-scope="scope">{{ scope.row.NextOperateTime | format2MiddleLangTypeDate }}</span>
          <span v-else>--</span> -->
        </el-table-column>
        <el-table-column label="服务单来源" show-overflow-tooltip minWidth="100">
          <span slot-scope="scope">{{ scope.row | formatSource(ServerApplyTypeList) }}</span>
          <!-- <span slot-scope="scope">{{ scope.row.Source === 2 ? '自助申请' : '代客申请' }}</span> -->
        </el-table-column>
        <el-table-column label="响应时间" show-overflow-tooltip minWidth="125">
          <span v-if="scope.row.RespondTime" slot-scope="scope">{{ scope.row.RespondTime | format2MiddleLangTypeDate }}</span>
          <span v-else>--</span>
        </el-table-column>
        <el-table-column label="操作时间" show-overflow-tooltip minWidth="125">
          <span v-if="scope.row.OperateTime" slot-scope="scope">{{ scope.row.OperateTime | format2MiddleLangTypeDate }}</span>
          <span v-else>--</span>
        </el-table-column>
        <el-table-column label="处理人" show-overflow-tooltip minWidth="90">
          <span slot-scope="scope">{{ scope.row.OperaterUserName }}</span>
        </el-table-column>
        <el-table-column prop="Content" label="进度" show-overflow-tooltip minWidth="90" fixed="right">
          <div slot-scope="scope">
            <span :class="getStatusClass(scope.row.Status)">{{ scope.row.IsHang ? '已挂起' : getStatusText(scope.row.Status) }}
            </span>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <div class="is-font-12 btn-wrap" slot-scope="scope">
            <span @click="onPhotoClick(scope.row)" v-if="localPermission.Operate">
              <img src="@/assets/images/detail.png" alt />
              <span v-if="scope.row.Status === 0">详情/处理</span>
              <span v-else-if="scope.row.IsHang">详情/解除挂起</span>
              <span v-else>查看详情</span>
            </span>
            <span @click="onPhotoClick(scope.row)" v-else>
              <img src="@/assets/images/detail.png" alt />
              <span>查看详情</span>
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
import mixin from '@/assets/js/mixins/OrderList&FeedbackCommonDialogMixins/index';
import ListPageHeader from '@/components/Feedback/ListPageHeader.vue';
import ClassType from '@/store/CommonClassType';
import Count from '@/components/common/Count.vue';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapState } from 'vuex';

export default {
  name: 'FeedbackPage',
  components: {
    Count,
    ListPageHeader,
  },
  mixins: [mixin, tableMixin, recordScrollPositionMixin('.ft-14-table .el-table__body-wrapper')],
  filters: {
    formatSource(item, ServerApplyTypeList) {
      if (!item || !Array.isArray(ServerApplyTypeList)) return '';
      let str = '';
      const { ApplicantUserName, Source } = item;
      if (Source === 1) { // 代客申请
        str = ApplicantUserName || '';
      }
      if (!str) {
        const t = ServerApplyTypeList.find(it => it.ID === Source);
        if (t && t.name) str = t.name;
      }
      return str;
    },
  },
  data() {
    return {
      nowDate: null,
      dataList: [],
      dataNumber: 0,
      curItemData: null,
      h: 0,
      condition: {
        Page: 1,
        PageSize: 20,
        QuestionID: '',
        OperaterID: '',
        Status: '',
        Date: {
          First: '',
          Second: '',
        },
        DateType: 'today',
        AppealType: '',
        KeyWords: '',
        CustomerType: {
          First: '',
          Second: '',
        },
        Product: { // 产品
          ClassID: '',
          TypeID: '',
          ProductID: '',
        },
        SellRegionalID: '', // 销售区域
        SellCityID: '',
        SellCountyID: '',
        Source: '',
        SolutionType: '',
        RefundPayType: '',
        // initDateText: '今天',
      },
    };
  },
  computed: {
    ...mapState('common', ['Permission', 'ServerApplyTypeList']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionAfterSalesApply?.Obj) {
        return this.Permission.PermissionList.PermissionAfterSalesApply.Obj;
      }
      return {};
    },
    OverTime() {
      return (data) => {
        // 如果开始处理了
        if (data.Status !== 0) return false;
        return new Date(data.LatestRespondTime).getTime() <= new Date().getTime();
      };
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-feedback-page-main-wrap-header-wrap', 60);
      this.h = tempHeight;
    },
    clearCondition() {
      this.condition = {
        Page: 1,
        PageSize: 20,
        QuestionID: '',
        OperaterID: '',
        Status: '',
        Date: {
          First: '',
          Second: '',
        },
        DateType: 'today',
        AppealType: '',
        KeyWords: '',
        CustomerType: {
          First: '',
          Second: '',
        },
        Product: { // 产品
          ClassID: '',
          TypeID: '',
          ProductID: '',
        },
        SellArea: { // 销售区域
          RegionalID: '',
          CityID: '',
          CountyID: '',
        },
        // initDateText: '今天',
        SellRegionalID: '',
        SellCityID: '',
        SellCountyID: '',
        Source: '',
        SolutionType: '',
        RefundPayType: '',
        ApplyTime: {
          First: '',
          Second: '',
        },
        ID: '',
        FieldType: '',
        Order: {
          First: '',
          Second: '',
        },
      };
    },
    handlePageChange(page) {
      this.getDataList(page);
    },
    setCondition([[key1, key2], value]) {
      if (key2) this.condition[key1][key2] = value;
      else this.condition[key1] = value;
    },
    async getDataList(page = 1) { // 获取列表数据
      this.condition.Page = page;
      ClassType.setDate(this.condition);
      const _obj = ClassType.filter(this.condition, true);
      if (_obj.Date) {
        _obj.ApplyTime = _obj.Date;
        delete _obj.Date;
      }
      let key = true;
      this.dataList = [];
      const res = await this.api.getApplyQuestionApplyList(_obj).catch(() => { key = false; });
      if (key && res.data.Status === 1000) {
        this.dataList = res.data.Data;
        this.dataNumber = res.data.DataNumber;
      }
    },
    getStatusClass(status) {
      let str = '';
      switch (status) {
        case 0:
          str = 'is-cyan';
          break;
        case 10:
          str = 'is-cyan';
          break;
        case 20:
          str = 'is-pink';
          break;
        case 30:
          str = 'is-success';
          break;
        case 40:
          str = 'is-gray';
          break;
        case 255:
          str = 'is-gray';
          break;
        default:
          break;
      }
      return str;
    },
    getStatusText(status) {
      let str = '';
      switch (status) {
        case 0:
          str = '待处理';
          break;
        case 10:
          str = '处理中';
          break;
        case 20:
          str = '退款中';
          break;
        case 30:
          str = '处理完成';
          break;
        case 40:
          str = '已驳回';
          break;
        case 255:
          str = '已取消';
          break;
        default:
          break;
      }
      return str;
    },
    getAppealTypeText(status) {
      let str = '';
      switch (status) {
        case 2:
          str = '退款';
          break;
        case 7:
          str = '补印';
          break;
        case 255:
          str = '其他';
          break;
        default:
          break;
      }
      return str;
    },
    getApplyText(list) { // 获取售后原因
      // const _arr = list.map(it => it.Title);
      return list.join('、');
    },
    onPhotoClick(itemData) {
      this.$router.push({ name: 'FeedbackInfo', params: { paramsData: itemData } });
      this.curItemData = itemData;
    },

  },
  mounted() {
    sessionStorage.removeItem('FeedbackList');
    sessionStorage.removeItem('setCondition');
    this.getDataList();
    if (this.$route.query.AppyCode) this.$router.push({ query: {} });
    this.$nextTick(() => this.setHeight());
    window.onresize = () => this.setHeight();
  },
  async activated() { // 当从设置页面返回且保存员工设置的时候可以完整执行此处内部代码
    const bool = sessionStorage.getItem('FeedbackList') === 'true';
    if (!bool) return;
    sessionStorage.removeItem('FeedbackList');
    if (sessionStorage.getItem('setCondition')) {
      this.setCondition(JSON.parse(sessionStorage.getItem('setCondition')));
    }
    sessionStorage.removeItem('setCondition');
    this.getDataList();
  },
  beforeDestroy() {
    window.onresize = null;
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-feedback-page-main-wrap {
  padding-left: 8px;
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .mp-common-comps-order-channel-selector-wrap{
    >header{
      width: 6em;
    }
  }
  .mp-common-comps-area-select-wrap{
    >.text{
      width: 6em;
    }
  }
  .mp-line-date-selector-wrap{
    >.title{
      width: 6em;
    }
  }
  .mp-common-comps-search-box{
    >.text{
      width: 6em;
    }
  }
  .el-table{
    .el-table__fixed-right{
      tr:first-child{
        line-height: 36px;
        font-size: 14px;
      }
    }
  }
  // .img-num-box {
  //   color: #428dfa;
  //   cursor: pointer;
  //   display: inline-block;
  //   min-width: 45px;
  //   border-radius: 3px;
  //   &:hover {
  //     text-decoration: underline;
  //     font-weight: 700;
  //     font-size: 13px;
  //   }
  // }
  .btn-wrap {
    display: flex;
    justify-content: space-around;
    // padding: 0 10px;
    > span {
      width: 100px;
      text-align: left;
      > img {
        margin-right: 5px;
        vertical-align: -3px;
      }
      &:not(.disbaled) {
        color: #a2a2a2;
        transition: color 0.2s ease-in-out;
        cursor: pointer;
        &:hover {
          color: #444;
        }
      }
      &.disbaled {
        color: #cbcbcb;
      }
    }
  }

  .mp-el-del-btn {
    display: none;
  }
  > footer {
    padding-top: 8px;
  }
}
.RejectReason-tips-box {
  word-break: break-all;
  word-wrap: break-word;
}
</style>
