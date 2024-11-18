<template>
  <section class="freight-write-off-list-page">
    <header class="freight-write-off-list-page-header-wrap">
      <ul>
        <li>
          <div>
            <OrderChannelSelector
              :options="userTypeList"
              :requestFunc="getDataList"
              :changePropsFunc="setCondition4DataList"
              :typeList="[['CustomerType', 'First']]"
              :value="condition.CustomerType.First"
              :defaultProps="{ label: 'CategoryName', value: 'CategoryID' }"
              label="客户类型"
            />
            <EpCascaderByProduct
              style="margin-right: 30px"
              class="mr-12"
              :getList="getDataList"
              :setCondition="setCondition4DataList"
              :First="condition.Product.ClassID"
              :Second="condition.Product.TypeID"
              :ProductID="condition.Product.ProductID"
              :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
            />
            <OrderChannelSelector
              style="margin-right: 30px"
              :options="FreightWriteStatus"
              :requestFunc="getDataList"
              :changePropsFunc="setCondition4DataList"
              :typeList="[['Status', '']]"
              :value="condition.Status"
              :defaultProps="{ label: 'label', value: 'value' }"
              label="核销状态"
            />
            <OrderChannelSelector
              :filterable='true'
              :options='staffList'
              :requestFunc='getDataList'
              :changePropsFunc='setCondition4DataList'
              :typeList="[['Operator', '']]"
              :defaultProps="{ label: 'StaffName', value: 'StaffID' }"
              :value='condition.Operator'
              label="处理人"
            />
          </div>
        </li>
        <li>
          <LineDateSelectorComp
            :changePropsFunc='setCondition4DataList'
            :requestFunc='getDataList'
            :isFull="true"
            :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
            :dateValue='condition.DateType'
            :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
            minDate="2022-01-01 00:00:00"
            :dateList="dateList"
            label="时间筛选"
          />
          <SearchInputComp
            class="search-section"
            :typeList="[['KeyWords', '']]"
            title="关键词"
            placeholder='请输入搜索关键词'
            :requestFunc='getDataList'
            :changePropsFunc='setCondition4DataList'
            :word='condition.KeyWords'
            :searchWatchKey="[]"
            @reset='() => this.clearCondition()'
          />
        </li>
      </ul>
    </header>
    <main>
      <el-table stripe border fit :data="dataList" style="width: 100%" class="ft-14-table" :max-height="h" :height="h">
        <el-table-column prop="OrderID" label="订单编号" minWidth="76" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Customer.CustomerSN" label="客户编号" minWidth="96" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Customer.CustomerName" label="客户名称" minWidth="94" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SellArea" label="区域" minWidth="156" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.Customer.SellArea.RegionalName }}
            {{scope.row.Customer.SellArea.CityName }}
            {{scope.row.Customer.SellArea.CountyName }}
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="客户类型" minWidth="96" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.Customer.Grade.Second }}
            {{scope.row.Customer.Type.Second }}
          </template>
        </el-table-column>
        <el-table-column prop="ProductName" label="产品" minWidth="148" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.SecondLevel.Name }} - {{ scope.row.Product.Name }}</template>
        </el-table-column>
        <el-table-column prop="ProductName" label="产品金额" minWidth="76" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ProductAmount }}元</template>
        </el-table-column>
        <el-table-column prop="Amount" label="运费" minWidth="48" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="!scope.row.Type">
              {{scope.row.OriginalAmount }}元
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="实际运费" minWidth="76" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="!scope.row.Type">
              {{scope.row.CurrentAmount }}元
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="差额/运费金额" minWidth="110" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.Amount}}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="收取客户金额" minWidth="104" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="is-success" v-if="!scope.row.Type && scope.row.Amount < 0">{{`${Math.abs(scope.row.Amount)}元`}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="退回客户金额" minWidth="104" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="is-pink" v-if="!scope.row.Type && scope.row.Amount > 0">{{ `${scope.row.Amount}元` }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="客户要求" minWidth="116" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.Type ? '其他' : '更改快递信息'}}
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="申请时间" minWidth="136" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CreateTime | format2MiddleLangTypeDate}}</template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="核销状态" minWidth="76" show-overflow-tooltip>
          <template slot-scope="scope">
            {{FreightWriteStatus.find(it => it.value === scope.row.Status).label}}
          </template>
        </el-table-column>
        <el-table-column prop="CustomerType" label="处理人" minWidth="62" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.Operator.Name }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" v-if="localPermission.Setup">
          <div class="is-font-12 operate" slot-scope="scope">
            <span @click="onDetailClick(scope.row)">
              <span><i style="color: #26BCF9;margin-left: 5px;" class="iconfont icon-xiangqing3"></i>查看详情</span>
            </span>
            <span @click="onVerifyClick(scope.row)" v-if="scope.row.Status === 0">
              <span><img src="@/assets/images/运费核销.png" width="16px"/>核销</span>
            </span>
            <span v-else>
              <span class="is-gray"><img src="@/assets/images/运费核销.png" width="16px"/>核销</span>
            </span>
            <span @click="onCancelClick(scope.row.OrderID, scope.row.ID)" v-if="scope.row.Status === 0">
              <span><img src="@/assets/images/cancel.png" />取消</span>
            </span>
            <span v-else>
              <span class="is-gray"><img src="@/assets/images/cancelstop.png" />取消</span>
            </span>
          </div>
        </el-table-column>
      </el-table>
      <CommonDialogComp
        width="1250px"
        top='5vh'
        title="详情:"
        :visible="FreightWriteOffVisible"
        cancelText='关闭'
        :showSubmit="false"
        @cancle="onCancle"
        @open="() => null"
        @closed='onCancle'
        class="mp-erp-freight-write-off-dialog-comp-wrap"
      >
        <div class="mp-erp-freight-write-off-dialog-main">
          <OrderDetail :detailData="OrderDetailData"/>
          <div class="mp-erp-freight-write-off-dialog-right" v-if="FreightWriteOffDetailData">
            <header class="title is-bold">核销内容</header>
            <ul>
              <li>
                <span class="label is-bold">客户要求：</span><span class="value">
                  {{FreightWriteOffDetailData.Type ? '其他' : '更改快递信息'}}
                </span>
              </li>
              <template v-if="FreightWriteOffDetailData.Type === 0">
                <li v-if="FreightWriteOffDetailData.OperatorRemark">
                  <span class="label is-bold">更改信息：</span><span class="value">{{FreightWriteOffDetailData.OperatorRemark}}</span>
                </li>
                <li>
                  <span class="label is-bold">原运费：</span><span class="value">{{FreightWriteOffDetailData.OriginalAmount}}元</span>
                </li>
                <li>
                  <span class="label is-bold">差额：</span><span class="value">{{FreightWriteOffDetailData.Amount}}元</span>
                </li>
                <li v-if="FreightWriteOffDetailData.Amount > 0">
                  <span class="label is-bold">退款方式：</span><span class="value">{{ FreightWriteOffDetailData.IsRefundBalance ? '退回客户余额' : '原路退回'}}</span>
                </li>
                <li v-if="FreightWriteOffDetailData.Remark">
                  <span class="label is-bold">备注：</span><span class="value">{{FreightWriteOffDetailData.Remark}}</span>
                </li>
              </template>
              <template v-else>
                <li>
                  <span class="label is-bold">实际运费：</span><span class="value">{{FreightWriteOffDetailData.CurrentAmount}}元</span>
                </li>
                <li>
                  <span class="label is-bold">备注：</span><span class="value">{{FreightWriteOffDetailData.Remark}}</span>
                </li>
                <li style="display: block;">
                  <span class="label is-bold">凭证：</span><span class="value">
                    <p style="margin-top: 5px;">
                      <ImageUploadComp :ImgList="FreightWriteOffDetailData.PicList" disabled></ImageUploadComp>
                    </p>
                  </span>
                </li>
              </template>
              <li>
                <span class="label is-bold">操作人：</span><span class="value">{{FreightWriteOffDetailData?.Operator?.Name}}</span>
              </li>
              <li>
                <span class="label is-bold">核销状态：</span><span class="value" :class="{'is-success': FreightWriteOffDetailData.Status === 0}">
                  {{FreightWriteStatus.find(it => it.value === FreightWriteOffDetailData.Status).label}}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CommonDialogComp>
      <PayCodeDialog :visible="PayCodeVisible" @close='PayCodeDialogClose' :CustomerName="CustomerName"
        :PayCodeData="PayCodeData" :ChangeID="ChangeID" @seccess="PayCodeSeccess"/>
    </main>
    <footer>
      <Count
       :watchPage='condition.Page'
       :handlePageChange='handlePageChange'
       :count='dataNumber'
       :pageSize='20'
       center
       >
        <DownLoadExcelComp class="down-load-excel" v-if="localPermission.Excel" title="导出Excel表格" :configObj="configObj" />
      </Count>
    </footer>
  </section>
</template>

<script>
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import LineDateSelectorComp from '@/components/common/SelectorComps/LineDateSelectorComp.vue';
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
import Count from '@/components/common/Count.vue';
import mixin from '@/assets/js/mixins/OrderList&FeedbackCommonDialogMixins/index';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import { mapState } from 'vuex';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import EpCascaderByProduct from '@/components/common/SelectorComps/EpCascaderWrap/EpCascaderByProduct.vue';
import ClassType from '@/store/CommonClassType';
import ImageUploadComp from '@/components/common/UploadComp/ImageUploadComp.vue';
import CommonDialogComp from '@/packages/CommonDialogComp';
import OrderDetail from '@/components/order/DialogContent/OrderDetail.vue';
import PayCodeDialog from '@/components/FreightWriteOff/PayCodeDialog.vue';

export default {
  name: 'freightWriteOffListPage',
  components: {
    Count,
    DownLoadExcelComp,
    OrderChannelSelector,
    LineDateSelectorComp,
    SearchInputComp,
    EpCascaderByProduct,
    CommonDialogComp,
    OrderDetail,
    ImageUploadComp,
    PayCodeDialog,
  },
  mixins: [mixin, tableMixin, recordScrollPositionMixin('.ft-14-table .el-table__body-wrapper')],
  data() {
    return {
      dateList: [
        { name: '今天', ID: 'today' },
        { name: '昨天', ID: 'yesterday' },
        { name: '前天', ID: 'beforeyesterday' },
        { name: '本月', ID: 'curMonth' },
        { name: '上月', ID: 'lastMonth' },
      ],
      FreightWriteStatus: [
        {
          value: '',
          label: '不限',
        },
        {
          value: 0,
          label: '待核销',
        },
        {
          value: 1,
          label: '已核销',
        },
        {
          value: 3,
          label: '无',
        },
        {
          value: 255,
          label: '已取消',
        },
      ],
      staffList: null,
      OrderDetailData: null,
      FreightWriteOffDetailData: null,
      PayCodeData: null,
      FreightWriteOffVisible: false,
      ChangeID: null,
      CustomerName: null,
      PayCodeVisible: false,
      dataList: [],
      dataNumber: 0,
      condition: {
        CustomerType: {
          First: '',
        },
        Product: {
          ClassID: '',
          TypeID: '',
          ProductID: '',
        },
        DateType: 'today',
        Date: {
          First: '',
          Second: '',
        },
        CreateTime: {
          First: '',
          Second: '',
        },
        Page: 1,
        PageSize: 20,
        KeyWords: '',
      },
    };
  },
  computed: {
    ...mapState('common', ['Permission', 'userTypeList']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManagePayExpress?.Obj) {
        return this.Permission.PermissionList.PermissionManagePayExpress.Obj;
      }
      return {};
    },
    UserDefinedTimeIsActive() {
      return this.condition.DateType === '' && !!this.condition.CreateTime.First && !!this.condition.CreateTime.Second;
    },
    configObj() { // 导出Excel条件对象
      const temp = JSON.parse(JSON.stringify(this.condition));
      ClassType.setDate(temp);
      const _obj = ClassType.filter(temp, true);
      if (_obj.Date) {
        _obj.CreateTime = _obj.Date;
        delete _obj.Date;
      }
      return {
        condition: ClassType.filter(_obj, true),
        count: this.dataNumber,
        fileDefaultName: '运费核销',
        // fileDate: '',
        showDateByFile: false,
        downFunc: data => this.api.getExpressChangeExcel(data),
      };
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.freight-write-off-list-page-header-wrap', 45);
      this.h = tempHeight;
    },
    async setCondition4DataList([[key1, key2], value]) {
      if (!key1) return;
      if (key2) {
        this.condition[key1][key2] = value;
      } else {
        this.condition[key1] = value;
      }
    },
    async PayCodeDialogClose() {
      this.PayCodeVisible = false;
    },
    PayCodeSeccess() {
      this.PayCodeVisible = false;
      const cb = () => {
        this.dataList.forEach((element, index) => {
          if (element.ID === this.ChangeID) {
            this.dataList[index].Status = 1;
          }
        });
      };
      this.messageBox.successSingle('支付成功', cb, cb);
    },
    async onCancle() {
      this.FreightWriteOffVisible = false;
    },
    async getDataList(page = 1) {
      this.condition.Page = page;
      ClassType.setDate(this.condition);
      const _obj = ClassType.filter(this.condition, true);
      if (_obj.Date) {
        _obj.CreateTime = _obj.Date;
        delete _obj.Date;
      }
      const res = await this.api.getExpressChangeList(_obj).catch(() => null);
      if (res.data.Status === 1000) {
        this.dataList = res.data.Data;
        this.dataNumber = res.data.DataNumber;
      }
    },
    clearCondition() {
      this.condition = {
        CustomerType: {
          First: '',
        },
        Product: {
          ClassID: '',
          TypeID: '',
          ProductID: '',
        },
        DateType: 'today',
        Date: {
          First: '',
          Second: '',
        },
        CreateTime: {
          First: '',
          Second: '',
        },
        Page: 1,
        PageSize: 20,
        KeyWords: '',
      };
    },
    handlePageChange(page) {
      this.getDataList(page);
    },
    onDetailClick(Detail) {
      this.FreightWriteOffDetailData = Detail;
      this.api.getOrderDetail(Detail.OrderID).then(res => {
        if (res.data.Status === 1000) {
          this.OrderDetailData = res.data.Data;
        }
      });
      this.FreightWriteOffVisible = true;
    },
    onVerifyClick(Detail) {
      this.ChangeID = Detail.ID;
      this.CustomerName = Detail.Customer.CustomerName;
      this.PayCodeData = {
        Amount: Detail.Amount,
        PayWay: Detail.PayWay,
      };
      this.PayCodeVisible = true;
    },
    onCancelClick(OrderID, changeID) {
      const cb = () => {
        this.api.getExpressChangeCancle(changeID).then(res => {
          if (res.data.Status === 1000) {
            const CanceCb = () => {
              this.dataList.forEach((element, index) => {
                if (element.ID === changeID) {
                  this.dataList[index].Status = 255;
                }
              });
            };
            this.messageBox.successSingle('取消成功', CanceCb, CanceCb);
          }
        });
      };
      this.messageBox.warnCancelBox('确定取消此运费核销吗 ?', `订单号：[ ${OrderID} ]`, cb, null);
    },
    async getStaffList() { // 获取客户数据
      this.api.getStaffList().then(res => {
        this.staffList = [{ StaffName: '不限', StaffID: '' }, ...res.data.Data];
      });
    },
  },
  mounted() {
    this.getDataList();
    this.getStaffList();
    this.$store.dispatch('common/getUserClassify');
    this.$nextTick(() => this.setHeight());
    window.onresize = () => this.setHeight();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.freight-write-off-list-page{
  padding-left: 8px;
  .freight-write-off-list-page-header-wrap{
    > ul {
      padding: 12px 20px;
      padding-top: 8px;
      > li {
        display: flex;
        // height: 48px;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        > div {
          margin-top: 9px !important;
          margin: 9px 0;
        }
        > section {
          margin: 11.5px 0;
        }
        &:first-of-type {
          justify-content: space-between;
          flex-wrap: wrap;
          >div{
            flex-wrap: wrap;
            display: flex;
          }
        }
      }
    }
  }
  .el-table {
    .el-table__body-wrapper{
      tbody{
        .el-table__row{
          .el-table__cell{
            .cell{
              padding: 0 1px;
            }
          }
        }
      }
    }
    .operate{
      display: flex;
      .iconfont{
        font-size: 12px;
        margin-right: 3px;
      }
      >span>span{
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-left: 10px;
        img{
          width: 13px;
          height: 13px;
          margin-right: 2px;
        }
        &.is-gray{
          cursor: not-allowed;
          img{
            filter: grayscale(100%);
          }
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
  .mp-erp-freight-write-off-dialog-comp-wrap{
    .el-dialog__body{
      padding: 0 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .mp-erp-freight-write-off-dialog-main{
      display: flex;
      .order-list-dialog-orderdetail-wrap{
        margin-top: 15px;
        margin-bottom: 0;
      }
      .mp-erp-freight-write-off-dialog-right {
        margin-top: 16px;
        padding-left: 20px;
        width: 362px;
        box-sizing: border-box;
        // padding-right: 10px;
        border-left: 1px solid #EEEEEE;
        margin-left: 20px;
        >.title{
          font-size: 16px;
          line-height: 20px;
          margin-top: 10px;
          position: relative;
          margin-bottom: 20px;
        }
        >ul{
          >li{
            display: flex;
            font-size: 14px;
            margin-top: 16px;
            line-height: 15px;
            >.value{
              flex: 1;
              .image-upload-comp > li{
                margin-right: 10px;
                &:nth-child(3n){
                  margin-right: 0px;
                }
              }
            }
          }
        }
      }
    }
  }
  footer{
    .down-load-excel{
      position: absolute;
      right: 240px;
    }
  }
}
</style>
