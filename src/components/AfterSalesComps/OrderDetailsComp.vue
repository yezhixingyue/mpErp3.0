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
            <a @click="onDetailClick('order')">{{OrderDetail.AfterSaleNumber}}次（点击查看详情）</a>
          </span>
        </li>
        <li>
          <span class="label is-bold">订单号：</span><span class="value">{{OrderDetail.OrderID}}</span>
        </li>
        <li v-if="AfterSaleCode">
          <span class="label is-bold">售后单号：</span><span class="value">{{AfterSaleCode}}</span>
        </li>
        <li>
          <span class="label is-bold">产品：</span><span class="value">{{ProductShowData.Name}}</span>
        </li>
        <li>
          <span class="label is-bold">工厂：</span><span class="value">{{ProductShowData.FactoryName}}</span>
        </li>
        <li></li>
        <OrderDetailDisplayItem :ShowData='ProductShowData' :hiddenFactory="true" />
        <OrderDetailDisplayItem v-for="it in PartShowDataList" :ShowData='it' :key="it.Name" />
        <li></li>
        <li>
          <span class="label is-bold">下单方式：</span><span class="value">
            <i>{{OrderDetail.OrderType | formatOrderTypeToText}}</i>
            <i class="is-gray" v-if="OrderDetail.OrderTaker">（ {{OrderDetail.OrderTaker.Value}} ）</i>
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
        <li  v-if="[254, 255].indexOf(OrderDetail.Status) === -1
        && OrderDetail.ProducePeriod && OrderDetail.ProducePeriod.TotalTime">
          <span class="label is-bold">{{OrderDetail.ProducePeriod.IncludeDiliveryTime ? '预计送达：' : '预计发货：'}}</span><span class="value">
            <span class="text is-gray">{{getDayDate(OrderDetail.ProducePeriod.TotalTime)}}</span>
          </span>
        </li>
        <li>
          <span class="label is-bold">当前状态：</span><span class="value">
            {{OrderDetail.Status | formatStatus}} <a @click="orderProgressVisible = true">查看进度</a>
          </span>
        </li>
        <li v-if="OrderDetail.FilePath">
          <span class="label is-bold">文件下载：</span><span class="value">
            <a :href="OrderDetail.FilePath" target="_blank" class="link download">下载订单文件</a>
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
        </ul>
        <ul style="margin-top: 30px;">
          <li class="title is-bold">
            客户
          </li>
          <li>
            <span class="label is-bold">售后次数：</span>
            <span class="value">
              <a @click="onDetailClick('customer')">{{OrderDetail.Customer.AfterSaleNumber}}次（点击查看详情）</a>
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
            <span class="label is-bold">配送方式：</span><span class="value">{{OrderDetail.Customer.ExpressText}}</span>
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
        <el-table class="ft-14-table"
        :data="dialogTableData.AfterSaleRecords" max-height=487
        style="width: 100%">
          <el-table-column prop="AfterSaleCode" label="售后单" width="85"></el-table-column>
          <el-table-column prop="ID" label="问题" width="90" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.QuestionTypeTitles.join('、')}}
            </template>
          </el-table-column>
          <el-table-column prop="QuestionRemark" label="备注" width="115" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="SolutionResultRemark" label="解决方案" width="160" show-overflow-tooltip>
            <span class='is-gray' slot-scope="scope">{{ getSolution(scope.row) || '其他' }}</span>
          </el-table-column>
          <el-table-column prop="date" label="处理时间" width="130">
            <template slot-scope="scope">
              <span class='is-gray'>{{ scope.row.LastOperateTime | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="LossAmount" label="损失金额" width="80">
            <template slot-scope="scope">
              <span :class="{'is-pink': scope.row.LossAmount > 0}">{{getLossAmount(scope.row.LossAmount)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="OperaterUserName" label="处理人"></el-table-column>
        </el-table>
        <p style="margin-top: 6px;">{{curDialogType !== 'customer' ? "此单" : ''}}已售后<span class="is-origin">{{dialogTableData.AfterSaleNumber}}</span>次
          <template v-if="dialogTableData.AfterSaleNumber > 10"><i class="is-gray">( 只显示出最近10条记录）</i></template>
          <template v-if="dialogTableData.LossAmount > 0">，共损失<i class="is-pink is-font-size-14"> - {{dialogTableData.LossAmount}}元</i></template>
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
        :status='status' :orderProgressData='orderProgress' :index='i' />
    </ul>
    </CommonDialogComp>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ProgressItem from '@/components/common/ProgressItem.vue';
import CommonDialogComp from '@/packages/CommonDialogComp';
import normalBtn from '@/components/common/normalBtn.vue';
import OrderDetailDisplayItem from '@/packages/OrderDetailDisplayItem';
import ShowProductDetail from '@/assets/js/TypeClass/ShowProductDetail';

export default {
  props: {
    OrderDetail: {
      type: Object,
      default: () => null,
    },
    AfterSaleCode: {
      type: Number,
      default: () => 0,
    },
  },
  components: {
    normalBtn,
    OrderDetailDisplayItem,
    CommonDialogComp,
    ProgressItem,
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
      if (!this.showData) return [];
      if (!this.showData.ProductParams) return [];
      return this.showData.ProductParams.PartList;
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
    getSolution(solution) {
      const arr = [];
      if (solution.SolutionTypes.find(it => it === 2)) {
        arr.push('退款');
      }
      if (solution.SolutionTypes.find(it => it === 7)) {
        arr.push('补印');
      }
      if (solution.SolutionTypes.find(it => it === 8)) {
        arr.push('赠送优惠券');
      }
      if (solution.SolutionTypes.find(it => it === 255)) {
        arr.push('其他');
      }
      return arr.join('、');
    },
    getLossAmount(LossAmount) {
      if (LossAmount > 0) {
        return `-${LossAmount}元`;
      }
      if (LossAmount === 0) return `${LossAmount}元`;
      if (LossAmount < 0) return `${-LossAmount}元`;
      return '';
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
        this.orderProgress = res.data.Data;
      }
    },
  },
  mounted() {

  },
};
</script>

<style lang='scss'>
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
    >ul{
      width: 50%;
      flex: 1;
      padding-right: 20px;
      box-sizing: border-box;
    }
    >.box{
      flex: 1;
      width: 50%;
    }
  }
  .box{
    .mp-order-detail-item-comp-wrap{
      >li:first-of-type{
        display: none;
      }
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
