<template>
  <section class="after-sales-list-page">
    <AfterSalesListHeader :dataList='AfterSalesList' :condition='condition' @getDataList='getDataList'
     @clearCondition='clearCondition' @setCondition='setCondition' :progressList="progressList" :AfterSaleChannel=AfterSaleChannel />
    <div>
      <el-table stripe border fit :data="AfterSalesList" style="width: 100%" class="ft-14-table" :max-height="h" :height="h">
        <el-table-column prop="AfterSaleCode" label="售后单号" minWidth="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="OrderID" label="订单号" minWidth="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CustomerType" label="区域" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.SellArea}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="客户类型" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CustomerType}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="产品" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ProductName}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="金额" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.OrderProductPrice}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="运费" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.OrderFreight}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="客户诉求" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.AppealContent || '-'}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="申请时间" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CreateTime | format2MiddleLangTypeDate}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="售后渠道" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ AfterSaleChannel.find(it => it.ID === scope.row.AfterSaleChannel)?.name }}
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="处理结果" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.SolutionResults.length">
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
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="额外支出" minWidth="125" show-overflow-tooltip>
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
        <el-table-column prop="CustomerType" label="状态" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{ progressList.find(it => scope.row.Status === it.ID)?.name}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="处理人" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.Operater || '-'}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="最后操作时间" minWidth="125" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.OperateTime">
              {{scope.row.OperateTime | format2MiddleLangTypeDate}}
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <div class="is-font-12 operate" slot-scope="scope">
            <span @click="onDetailClick(scope.row)"
            v-if="scope.row.Status === 0 || staffDetailData.StaffID === scope.row.OperaterID || localPermission.QueryDetail">
              <span v-if="scope.row.Status === 0"> <i style="color: #52C41A;" class="iconfont icon-kaishichuli"></i>  开始处理</span>
              <span v-if="staffDetailData.StaffID === scope.row.OperaterID && (scope.row.Status === 10 || scope.row.Status === 25)">
                <i style="color: #F4A307;" class="iconfont icon-a-zu16852"></i>  继续处理
              </span>
              <span v-if="[30, 255].find(it => it === scope.row.Status)"> <i style="color: #26BCF9;" class="iconfont icon-xiangqing3"></i>查看详情</span>
            </span>
            <span v-if="[10, 25].find(it => it === scope.row.Status) && staffDetailData.StaffID !== scope.row.OperaterID">
              <span class="is-gray"> <i class="iconfont icon-xiangqing3"></i>查看详情</span>
            </span>
            <span style="color: #FF3E6A;margin-left: 5px;" @click="removeAfterSales(scope.row)" v-if="localPermission.RemoveAfterSale">
              <i class="iconfont icon-delete"></i>删除
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
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
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
    DownLoadExcelComp,
  },
  mixins: [mixin, tableMixin, recordScrollPositionMixin('.ft-14-table .el-table__body-wrapper')],
  data() {
    return {
      progressList: [
        { name: '不限', ID: '' },
        { name: '未处理', ID: 0 },
        { name: '处理中', ID: 10 },
        { name: '已挂起', ID: 25 },
        { name: '已完成', ID: 30 },
        { name: '已取消', ID: 255 },
      ],
      AfterSaleChannel: [
        { name: '网页端', ID: 0 },
        { name: '移动端', ID: 1 },
        { name: '人工客服', ID: 2 },
      ],
      nowDate: null,
      dataNumber: 0,
      condition: {
        ProductClass: {
          ClassID: '',
          TypeID: '',
          ProductID: '',
        },
        DateType: 'today',
        SellArea: {
          RegionalID: '',
          RegionalName: '',
          CityID: '',
          CityName: '',
          CountyID: '',
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
        IsAllowHandle: false,
        Source: 1,
        ChannelType: 0,
        OperaterID: '',
        ID: '',
        FieldType: 1,
        Status: '',
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
      if (this.Permission?.PermissionList?.PermissionManageAfterSales?.Obj) {
        return this.Permission.PermissionList.PermissionManageAfterSales.Obj;
      }
      return {};
    },
    staffDetailData() {
      const _detailData = localStorage.getItem('staffDetailData');
      return JSON.parse(_detailData);
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
        fileDefaultName: '售后处理表',
        // fileDate: '',
        showDateByFile: false,
        downFunc: data => this.api.getOrderAfterSaleManageListExcel(data),
      };
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
        _obj.SelectTime = _obj.Date;
        delete _obj.Date;
      }
      let key = true;
      this.setAfterSalesList([]);
      const res = await this.api.getOrderAfterSaleManageList(_obj).catch(() => { key = false; });
      if (key && res.data.Status === 1000) {
        this.setAfterSalesList(res.data.Data);
        this.dataNumber = res.data.DataNumber;
      }
    },
    clearCondition() {
      this.condition = {
        ProductClass: {
          ClassID: '',
          TypeID: '',
          ProductID: '',
        },
        DateType: 'today',
        SellArea: {
          RegionalID: '',
          RegionalName: '',
          CityID: '',
          CityName: '',
          CountyID: '',
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
        IsAllowHandle: false,
        Source: 1,
        ChannelType: 0,
        OperaterID: '',
        ID: '',
        FieldType: 1,
        Status: '',
        KeyWords: '',
        Page: 1,
        PageSize: 20,
      };
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
    async onDetailClick(Detail) {
      const cb = () => {
        this.$router.push({ name: 'AfterSalesInfo',
          query: {
            AfterSaleCode: Detail.AfterSaleCode,
            OrderID: Detail.OrderID,
            Status: Detail.Status,
          },
        });
      };
      if (Detail.Status === 0) {
        const res = await this.api.getOrderAfterSaleDealApply(Detail.AfterSaleCode).catch(() => null);
        if (res.data.Status === 1000) {
          this.setAfterSalesDetail(Detail);
          cb();
        }
      } else {
        this.setAfterSalesDetail(Detail);
        cb();
      }
    },
    async removeAfterSales(item) {
      this.messageBox.warnCancelBox('确定删除该条售后单吗？', `售后单号：${item.AfterSaleCode}`, () => {
        this.api.getOrderAfterSaleRemove(item.AfterSaleCode).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              this.getDataList(this.condition.Page);
            };
            this.messageBox.successSingle('删除成功', cb, cb);
          }
        });
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
