<template>
  <section class="order-details-comp">
    <header class="title is-bold">订单详情</header>
    <div class="box main" v-if="OrderDetail">
      <ul>
        <li class="title is-bold">
          订单信息
        </li>
        <li>
          <span class="label is-bold">售后次数：</span>
          <span class="value">
            <a @click="onDetailClick('order')" v-if="Number(OrderDetail.AfterSaleNumber)">{{OrderDetail.AfterSaleNumber}}次（点击查看详情）</a>
            <span v-else>{{OrderDetail.AfterSaleNumber}}次</span>
          </span>
        </li>
        <li>
          <span class="label is-bold">订单号：</span><span class="value">{{OrderDetail.OrderID}}</span>
        </li>
        <li v-if="AfterSaleCode">
          <span class="label is-bold">售后单号：</span><span class="value">{{AfterSaleCode}}</span>
        </li>
        <li>
          <span class="label is-bold">工厂：</span><span class="value">{{ProductShowData.FactoryName}}</span>
        </li>
        <li></li>
        <li class="product-info">
          <OrderDetailDisplayItem :ShowData='ProductShowData' :hiddenFactory="true" />
          <OrderDetailDisplayItem v-for="it in PartShowDataList" :ShowData='it' :key="it.Name" />
        </li>
        <li></li>
        <li v-if="OrderDetail.Weight">
          <span class="label is-bold">理论重量：</span><span class="value">
            <i>{{OrderDetail.Weight}} 千克</i>
          </span>
        </li>
        <li>
          <span class="label is-bold">下单方式：</span><span class="value">
            <i>{{OrderDetail.OrderType | formatOrderTypeToText}}</i>
            <i class="is-gray" v-if="OrderDetail.TakerName">（ {{OrderDetail.TakerName}} ）</i>
          </span>
        </li>
        <li>
          <span class="label is-bold">下单时间：</span><span class="value">
            <span class="text is-gray">{{getDayDate(OrderDetail.CreateTime)}} </span>
            <span class="text is-gray">{{getMiDate(OrderDetail.CreateTime)}}</span>
          </span>
        </li>
        <li>
          <span class="label is-bold">付款时间：</span><span class="value">
            <span class="text is-gray">{{getDayDate(OrderDetail.PayTime)}} </span>
            <span class="text is-gray">{{getMiDate(OrderDetail.PayTime)}}</span>
          </span>
        </li>
        <li v-if="[254, 255].indexOf(OrderDetail.Status) === -1
        && OrderDetail.ProducePeriod && OrderDetail.ProducePeriod.TotalTime">
          <span class="label is-bold">{{OrderDetail.ProducePeriod.IncludeDiliveryTime ? '预计送达：' : '预计发货：'}}</span><span class="value">
            <span class="text is-gray">{{getDayDate(OrderDetail.ProducePeriod.TotalTime)}}</span>
          </span>
        </li>
        <li>
          <span class="label is-bold">当前状态：</span><span class="value">
            <p> {{OrderDetail.Status | formatStatus}}</p>
          </span>
        </li>
        <li>
          <span class="label is-bold">其他信息：</span><span class="value">
            <a @click="OrderInfo(OrderDetail, 0)">查看进度</a> <a @click="OrderInfo(OrderDetail, 2)">包裹列表</a>
          </span>
        </li>
        <li v-if="showDownload && (OrderDetail.FilePath || OrderDetail.CheckedFileList?.length > 0) &&
        [0, 10, 25].findIndex(it => it === AfterSaleStatus) !== -1" class="download-box">
          <span class="label is-bold">文件下载：</span><span class="value">
            <a v-if="OrderDetail.FilePath" :href="OrderDetail.FilePath" target="_blank" class="link download">下载订单文件</a>
            <a v-if="OrderDetail.CheckedFileList?.length > 0" @click.prevent="onCheckFileDownloadClick(OrderDetail.CheckedFileList)"
              class="link download">下载审稿文件</a>
          </span>
        </li>
      </ul>
      <div class="box">
        <ul>
          <li class="title is-bold">
            价格
          </li>
          <li>
            <span class="label is-bold">原价：</span><span class="value">{{OrderDetail.OriginalPrice}}元</span>
          </li>
          <li>
            <span class="label is-bold">成交价：</span><span class="value is-pink is-bold">{{OrderDetail.FinalPrice}}元</span>
          </li>
          <li>
            <span class="label is-bold">已付：</span><span class="value">{{OrderDetail.PaidAmount}}元</span>
          </li>
          <li>
            <span class="label is-bold">未付：</span><span class="value">{{OrderDetail.UnPaidAmount}}元</span>
          </li>
          <li>
            <span class="label is-bold">退款：</span><span class="value">{{OrderDetail.RefundOrderAmount}}元</span>
          </li>
          <li>
            <span class="label is-bold">优惠券：</span><span class="value is-pink">{{OrderDetail.CouponAmount}}元</span>
          </li>
          <li>
            <span class="label is-bold">运费：</span><span class="value">{{OrderDetail.FreightAmount}}元</span>
          </li>
          <li v-if="OrderDetail.Reduced">
            <span class="label is-bold">减尾款：</span><span class="value">{{OrderDetail.Reduced}}元</span>
          </li>
        </ul>
        <ul style="margin-top: 30px;">
          <li class="title is-bold">
            客户
          </li>
          <li>
            <span class="label is-bold">售后次数：</span>
            <span class="value">
              <a @click="onDetailClick('customer')" v-if="Number(OrderDetail.Customer.AfterSaleNumber)">{{OrderDetail.Customer.AfterSaleNumber}}次（点击查看详情）</a>
              <span v-else>{{OrderDetail.Customer.AfterSaleNumber}}次</span>
            </span>
          </li>
          <li>
            <span class="label is-bold">客户编号：</span><span class="value">{{OrderDetail.Customer.CustomerNo}}</span>
          </li>
          <li>
            <span class="label is-bold">客户名称：</span><span class="value">{{OrderDetail.Customer.CustomerName}}</span>
          </li>
          <li>
            <span class="label is-bold">类型等级：</span><span class="value">{{OrderDetail.Customer.TypeName}}</span>
          </li>
          <li>
            <span class="label is-bold">销售区域：</span><span class="value">
              {{OrderDetail.Customer.SellArea.RegionalName}}
              {{OrderDetail.Customer.SellArea.CityName}}
              {{OrderDetail.Customer.SellArea.CountyName}}
            </span>
          </li>
          <li>
            <span class="label is-bold">配送方式：</span><span class="value">{{OrderDetail.Customer.DeliveryAddress.ExpressText}}</span>
          </li>
          <li>
            <span class="label is-bold">收件人：</span><span class="value">
              {{OrderDetail.Customer.DeliveryAddress.Consignee}}
              {{OrderDetail.Customer.DeliveryAddress.ConsigneeMobile}}
            </span>
          </li>
          <li>
            <span class="label is-bold">收件地址：</span><span class="value">
              {{OrderDetail.Customer.DeliveryAddress.ProvinceName}}
              {{OrderDetail.Customer.DeliveryAddress.CityName}}
              {{OrderDetail.Customer.DeliveryAddress.CountyName}}
              {{OrderDetail.Customer.DeliveryAddress.AddressDetail}}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <CommonDialogComp
      width="800px"
      top='15vh'
      :title="curDialogTitle"
      :visible="dialogVisible"
      cancelText='关闭'
      :showSubmit="false"
      @cancle="handleClose"
      @closed='handleClose'
      class="mp-service-detail-cord-dia"
    >
      <main>
        <el-table class="ft-14-table" border stripe fit
        :data="dialogTableData.AfterSaleRecords" max-height=487
        style="width: 100%">
          <el-table-column prop="AfterSaleCode" label="售后单号" min-width="80"></el-table-column>
          <el-table-column prop="ID" label="问题" min-width="110" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.QuestionTypeTitles.join('、')}}
            </template>
          </el-table-column>
          <el-table-column prop="SolutionResultRemark" label="解决方案" min-width="190" show-overflow-tooltip>
            <span class='is-gray' slot-scope="scope">
              <template v-if="scope.row.IsReject">
                <span class="is-pink">驳回</span>
              </template>
              <template v-else>
                <template v-if="scope.row.SolutionResults.length">
                  <template v-if="scope.row.SolutionResults[0]">
                    {{ scope.row.SolutionResults[0] ? scope.row.SolutionResults[0].SolutionContent : '' }}
                    <template v-if="scope.row.SolutionResults[0].CouponContents.length">
                      {{scope.row.CouponIsExtra?'额外':''}}赠送优惠券：
                      {{ scope.row.SolutionResults[0].CouponContents.join('、') }}
                    </template>
                  </template>
                </template>
                <template v-else>
                  -
                </template>
              </template>
            </span>
          </el-table-column>
          <el-table-column prop="LossAmount" label="额外支出" min-width="70">
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
          <el-table-column prop="date" label="处理时间" min-width="140">
            <template slot-scope="scope">
              <span class='is-gray'>{{ scope.row.LastOperateTime | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="OperaterUserName" label="处理人" min-width="80"></el-table-column>
        </el-table>
        <p style="margin-top: 6px;">{{curDialogType !== 'customer' ? "此单" : ''}}已售后<span class="is-origin">{{dialogTableData.AfterSaleNumber}}</span>次
          <template v-if="dialogTableData.AfterSaleNumber > 10"><i class="is-gray">( 只显示出最近10条记录）</i></template>
          <template v-if="dialogTableData.ExtraPayAmount > 0">，共额外支出<i class="is-pink is-font-size-14"> - {{dialogTableData.ExtraPayAmount}}元</i></template>
        </p>
      </main>
      <span slot="footer" class="dialog-footer">
        <normalBtn @click.native="handleClose" title="关闭" />
      </span>
    </CommonDialogComp>
    <CommonDialogComp
      width="800px"
      top='5vh'
      title="查看进度"
      :visible="orderProgressVisible"
      cancelText='关闭'
      :showSubmit="false"
      @open="orderProgressOpen"
      @cancle="cancle"
      @closed='closed'
      class="mp-order-progress-dia"
    >
    <ul class="order-list-progress-wrap mp-scroll-wrap">
      <ProgressItem
        v-for="(item, i) in orderProgress" :key='item.Status + "-" + i'
        :orderProgressData='orderProgress' :index='i' />
    </ul>
    </CommonDialogComp>
    <OrderListDialog IsAfterSales/>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import mixin from '@/assets/js/mixins/OrderList&FeedbackCommonDialogMixins/index';
import ProgressItem from '@/components/common/ProgressItem.vue';
import CommonDialogComp from '@/packages/CommonDialogComp';
import normalBtn from '@/components/common/normalBtn.vue';
import OrderDetailDisplayItem from '@/packages/OrderDetailDisplayItem';
import ShowProductDetail from '@/assets/js/TypeClass/ShowProductDetail';
import OrderListDialog from '@/components/order/Main/OrderListDialog.vue';

export default {
  mixins: [mixin],
  props: {
    OrderDetail: {
      type: Object,
      default: () => null,
    },
    AfterSaleCode: {
      type: Number,
      default: () => 0,
    },
    AfterSaleStatus: {
      type: Number,
      default: () => 255,
    },
    showDownload: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    normalBtn,
    OrderDetailDisplayItem,
    CommonDialogComp,
    ProgressItem,
    OrderListDialog,
  },
  computed: {
    ...mapState('common', ['userTypeList']),
    curDialogTitle() {
      if (this.curDialogType === 'customer') return '客户已售后详情';
      return '订单已售后详情';
    },
    ProductShowData() {
      let Name = this.OrderDetail?.ProductParams?.Attributes?.DisplayName || '产品名称';
      const FactoryName = this.OrderDetail?.ProductParams?.Attributes?.FactoryName || '';
      if (Array.isArray(this.OrderDetail?.ProductParams?.Attributes?.ClassList)) {
        const t = this.OrderDetail.ProductParams.Attributes.ClassList.find(it => it.Type === 1);
        if (t && t.SecondLevel?.Name) {
          Name = `${t.SecondLevel.Name}-${Name}`;
        }
      }
      if (this.OrderDetail?.ProductParams?.Attributes?.DisplayOrderList
      && this.OrderDetail.ProductParams.Attributes.DisplayOrderList.length > 0) {
        return {
          Name,
          FactoryName,
          ContentList: this.getPartShowList(this.OrderDetail.ProductParams.Attributes.DisplayOrderList, this.OrderDetail.ProductParams),
          Type: 'product',
        };
      }
      return {
        Name,
        FactoryName,
        ContentList: [],
        Type: 'product',
      };
    },
    PartList() {
      if (!this.OrderDetail) return [];
      if (!this.OrderDetail.ProductParams) return [];
      return this.OrderDetail.ProductParams.PartList;
    },
    PartShowDataList() {
      const arr = [];
      this.PartList.forEach(it => {
        if (Array.isArray(it.List)) {
          it.List.forEach((part, index) => {
            const ContentList = this.getPartShowList(it.Attributes.DisplayOrderList, part);
            const Name = it.List.length > 1 ? `${it.Attributes.Name}${index + 1}` : it.Attributes.Name;
            const temp = {
              Name,
              Type: 'Part',
              ContentList: ContentList || [],
            };
            arr.push(temp);
          });
        }
      });
      return arr;
    },
  },
  data() {
    return {
      curDialogType: '',
      dialogVisible: false,
      dialogTableData: [],
      CustomerServerCount: 0,
      orderProgressVisible: false,
      orderProgress: [],
    };
  },
  methods: {
    async OrderInfo(data, id) {
      const orderItem = { ...data };
      orderItem.ProductName = '';
      this.onMenuClick(orderItem, id);
    },
    getDayDate(time) {
      if (!time) return '';
      return time.split('.')[0].split('T')[0];
    },
    getMiDate(time) {
      if (!time) return '';
      return time.split('.')[0].split('T')[1];
    },
    getPartShowList(DisplayOrderList, ProductParams) {
      return ShowProductDetail.getDisplayContentFromPartDataByDetailData(DisplayOrderList, ProductParams);
    },
    async onDetailClick(type) {
      this.curDialogType = type;
      this.dialogVisible = true;
      if (type === 'customer') {
        const resp = await this.api.getCustomerApplyRecord(this.OrderDetail.Customer.CustomerID).catch(() => {});
        if (resp && resp.data.Status === 1000) {
          this.dialogTableData = resp.data.Data;
          this.CustomerServerCount = resp.data.DataNumber;
        }
      } else {
        const resp = await this.api.getOrderApplyRecord(this.OrderDetail.OrderID).catch(() => {});
        if (resp && resp.data.Status === 1000) {
          this.dialogTableData = resp.data.Data;
          this.CustomerServerCount = resp.data.DataNumber;
        }
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.dialogTableData = [];
    },
    cancle() {
      this.orderProgressVisible = false;
    },
    closed() {
      this.cancle();
    },
    async orderProgressOpen() {
      const res = await this.api.selectOrderProgress(this.OrderDetail.OrderID);
      if (!res) return;
      if (res.data.Status === 1000) {
        this.orderProgress = [...res.data.Data].reverse();
      }
    },
    onCheckFileDownloadClick(CheckedFileList) {
      const _download = (href) => {
        if (!href) return;

        const link = document.createElement('a');

        link.target = '_blank';
        link.style.display = 'none';
        link.href = href;

        document.body.appendChild(link);

        link.click();
      };

      CheckedFileList.forEach(it => _download(it.FilePath));
    },
  },
  mounted() {

  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-order-progress-dia{
  .el-dialog__body{
    padding: 0;
  }
  .order-list-progress-wrap {
    height: 645px;
    padding-top: 42px;
    padding-right: 218px;
    user-select: none;
    overflow-y: auto;
  }
}
  .mp-service-detail-cord-dia{
    .el-table{
      .el-table__header-wrapper thead tr th .cell {
        line-height: 36px;
        font-size: 14px;
      }
      .el-table__fixed-header-wrapper thead tr th .cell {
        line-height: 36px;
        font-size: 14px;
      }
    }
  }
.order-details-comp {
  padding-left: 38px;
  padding-right: 20px;
  box-sizing: border-box;
  width: 520px;
  background-color: #F4FCFF;
  padding-top: 10px;
  height: 608px;
  box-sizing: border-box;
  >.title{
    font-size: 16px;
    line-height: 20px;
    position: relative;
    margin-bottom: 20px;
    &::before{
      content: "";
      display: inline-block;
      height: 14px;
      width: 3px;
      position: absolute;
      left: -8px;
      top: 3px;
      background: linear-gradient( 180deg, #32DAF9 0%, #28C1F9 100%);
    }
  }
  >.main{
    display: flex;
    height: calc(100% - 40px);
    >ul{
      width: calc(50% - 20px);
      flex: 1;
      margin-right: 20px;
      box-sizing: border-box;
      overflow-y: auto;
      position: relative;
      max-height: calc(100% - 40px);
      .title{
        position: sticky;
        top: 0;
        padding-top: 10px;
        margin-top: 0;
        background-color: #F4FCFF;
        z-index: 2;
      }
      li{
        &.download-box{
          > button, .link {
            margin: 0;
            height: 16px;
            line-height: 13px;
            border: none;
            padding: 0;
            width: 6em;
            overflow: hidden;
            font-size: 12px;
            position: relative;
            text-align: center;
            left: 0;
            box-shadow: none;
            color: #26bcf9;
            text-decoration: none;
            cursor: pointer;
            &:hover {
              color: $--color-primary-light;
              font-size: 12px !important;
              text-decoration: underline;
            }
            & + .link {
              margin-left: 12px
            }
          }
        }
      }
    }
    >.box{
      flex: 1;
      width: 50%;
    }
  }
  .box{
    .mp-order-detail-item-comp-wrap{
      >li{
        line-height: 15px;
        >.label{
          font-size: 12px;
          color: #000;
          font-weight: 700;
        }
        >.text{
          color: #444;
          font-weight: 400;
          min-height: 15px;
          .craft-content-list{
            padding-top: 0;
            line-height: 15px
          }
        }
      }
    }
    >ul{
      >li{
        display: flex;
        font-size: 12px;
        margin-top: 10px;
        line-height: 15px;
        color: #000;
        &.product-info{
          display: block;
          // max-height: 200px;
          // overflow-y: auto;
        }
        &.title{
          font-size: 14px;
          color: #444;
        }
        >.value{
          color: #444;
          flex: 1;
          > a {
            color: #26BCF9;
            cursor: pointer;
          }
        }
        .image-list{
          display: flex;
          flex-wrap: wrap;
          img{
            width: 107px;
            height: 75px;
            border-radius: 4px;
            margin-right: 10px;
            margin-bottom: 10px;
            &:nth-child(3n){
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
</style>
