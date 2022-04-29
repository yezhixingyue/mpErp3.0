<template>
    <main class="feed-tables">
      <div>
        <header>
          <p class="mp-common-title-wrap">商品信息</p>
        </header>
        <!-- 商品信息 -->

        <el-table v-if="dataInfo" stripe border fit :data="[dataInfo.Order.Product]" style="width: 800px" class="ft-14-table">
          <el-table-column prop="ProductName" label="商品名称" minWidth="192" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Content" label="文件内容" minWidth="194" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CustomerType" label="数量" minWidth="108" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.ProductAmount}}{{scope.row.Unit}}/{{scope.row.KindCount}}款</template>
          </el-table-column>
          <el-table-column label="尺寸" prop="ProductName" minWidth="103" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.SizeList.join('，')}}</template>
          </el-table-column>
          <el-table-column prop="Order" label="工艺" minWidth="103" show-overflow-tooltip>
            <span class="is-gray" slot-scope="scope">{{scope.row.CraftList.join('，')}}</span>
          </el-table-column>
          <el-table-column label="价格合计" minWidth="90" show-overflow-tooltip>
            <template><span class="is-pink">￥{{dataInfo.Order.FinalPrice}}</span></template>
          </el-table-column>
        </el-table>
        <header>
          <p class="mp-common-title-wrap">订单信息</p>
        </header>
        <!-- 订单信息 -->
        <table class="order table info-common" v-if="dataInfo">
          <tr>
            <td>订单编号</td>
            <td>{{dataInfo.Order.OrderID}}
              <span class="details" @click="OrderInfo">查看</span>已售后
              <span class="number">{{dataInfo.Order.OrderAfterSaleNumber}} </span>次
              <span class="details" @click="onDetailClick('order')">详情</span></td>
            <td>下单时间</td>
            <td>{{dataInfo.Order.CreateTime | formatDate}}</td>
          </tr>
          <tr>
            <td>订单状态</td>
            <td>{{dataInfo.Order.Status}}</td>
            <td>配送方式</td>
            <td>{{dataInfo.Order.DistrictName}}</td>
          </tr>
          <tr>
            <td>收件人</td>
            <td>{{dataInfo.Order.Consignee}} &nbsp; &nbsp; {{dataInfo.Order.ConsigneeMobile}}</td>
            <td>收件地址</td>
            <td><p class="textarea">
              {{dataInfo.Order.ProvinceName}}{{dataInfo.Order.CityName}}{{dataInfo.Order.CountyName}}{{dataInfo.Order.AddressDetail}}
              </p></td>
          </tr>
          <tr>
            <td>客户编号</td>
            <td>{{dataInfo.Order.CustomerAfterSaleNumber}}</td>
            <td>客户名称</td>
            <td>{{dataInfo.Order.CustomerName}}
              已售后 <span class="number">{{dataInfo.Order.CustomerAfterSaleNumber}} </span> 次
              <span class="details" @click="onDetailClick('customer')">详情</span></td>
          </tr>
          <!-- <tr>
            <td>联系方式</td>
            <td>{{dataInfo.Order.ConsigneeMobile}}</td>
            <td>QQ号</td>
            <td>
              <a :href="`tencent://message/?uin=${dataInfo.AfterSale.QQ}&Site=SuperNic&Menu=yes`" class="details" style="padding:0">
              {{dataInfo.AfterSale.QQ}}
              </a>
            </td>
          </tr> -->
          <tr>
            <td>总金额</td>
            <td>￥{{dataInfo.Order.PaidAmount}}元</td>
            <td>已付</td>
            <td>￥{{dataInfo.Order.PaidAmount}}元（印豆抵扣{{'==='}}元）</td>
          </tr>
          <tr>
            <td>运费</td>
            <td>￥{{dataInfo.Order.Freight}}元（含{{'==='}}个订单）</td>
            <td>订单备注</td>
            <td> <p class="textarea">{{dataInfo.Order.Product.Content}}</p></td>
          </tr>
        </table>

        <header>
          <p class="mp-common-title-wrap">服务单信息</p>
        </header>
        <!-- 服务单信息 -->
        <table class="serve table info-common" v-if="dataInfo">
          <tr>
            <td>服务单号</td>
            <td>{{dataInfo.AfterSale.AfterSaleCode}}</td>
            <td>处理进度</td>
            <td>{{dataInfo.AfterSale.Status}}</td>
          </tr>
          <tr>
            <td>申请时间</td>
            <td>{{dataInfo.AfterSale.CreateTime | formatDate}}</td>
            <td>联系人名称</td>
            <td>{{dataInfo.AfterSale.ContactName}}</td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{dataInfo.AfterSale.Mobile}}</td>
            <td>QQ号</td>
            <td>
              <a :href="`tencent://message/?uin=${dataInfo.AfterSale.QQ}&Site=SuperNic&Menu=yes`" class="details" style="padding:0">
                {{dataInfo.AfterSale.QQ}}
              </a>
            </td>
          </tr>
          <tr>
            <td>问题类型</td>
            <td>{{dataInfo.AfterSale.QuestionTypeTitleList.join(',')}}</td>
            <td>问题描述</td>
            <td><p class="textarea">{{dataInfo.AfterSale.QuestionRemark}}</p></td>
          </tr>
          <tr>
            <td>诉求意向</td>
            <td>
              <span v-if="dataInfo.AfterSale.AppealType === 0">退款</span>
              <span v-if="dataInfo.AfterSale.AppealType === 1">补印</span>
              <span v-if="dataInfo.AfterSale.AppealType === 255">其它</span>
            </td>
            <td>{{dataInfo.AfterSale.AppealType === 0 ? '退款金额' : dataInfo.AfterSale.AppealType === 1 ? '补印数量' : ''}}</td>
            <td>
              <span v-if="dataInfo.AfterSale.AppealType === 0">￥{{dataInfo.AfterSale.AppealRefundAmount}}元</span>
              <span v-if="dataInfo.AfterSale.AppealType === 1">
                {{dataInfo.AfterSale.AppealNumber}}{{dataInfo.Order.Product.Unit}}/{{dataInfo.AfterSale.AppealKindCount}}款
              </span>
              <span v-if="dataInfo.AfterSale.AppealType === 255"></span>
            </td>
          </tr>
          <tr>
            <td>上传照片</td>
            <td colspan="3">
              <div class="img">
                <el-image v-for="item in dataInfo.AfterSale.QuestionPicList" :key="item" :src="item" fit="cover" ></el-image>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <template v-if="DeliverToList && DeliverToList.length">
        <!--  转交记录 -->
        <header>
          <p class="mp-common-title-wrap"> 转交记录</p>
        </header>
        <el-table v-if="dataInfo" stripe border fit :data="DeliverToList" style="width: 642px" class="ft-14-table">
          <el-table-column prop="ProductName" label="操作时间" width="160" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.CreateTime | formatDate}}</template>
          </el-table-column>
          <el-table-column prop="ParentOperaterUserName" label="操作人" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="OperaterRemark" label="转交原因" width="161" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="转交人" prop="OperaterUserName" width="160" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </template>


      <template v-if="PostponeList && PostponeList.length">
        <!--  挂起记录 -->
        <header>
          <p class="mp-common-title-wrap"> 挂起记录</p>
        </header>
        <el-table v-if="dataInfo" stripe border fit :data="PostponeList" style="width: 642px" class="ft-14-table">
          <el-table-column prop="ProductName" label="挂起时间" width="177" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.CreateTime | formatDate}}</template>
          </el-table-column>
          <el-table-column prop="OperaterUserName" label="操作人" width="196" show-overflow-tooltip></el-table-column>
          <el-table-column prop="OperaterRemark" label="挂起原因" width="268" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </template>
      <template v-if="RejectList && RejectList.length">
        <!--  驳回记录 -->
        <header>
          <p class="mp-common-title-wrap"> 驳回记录</p>
        </header>
        <el-table v-if="dataInfo" stripe border fit :data="RejectList" style="width: 642px" class="ft-14-table">
          <el-table-column prop="ProductName" label="驳回时间" width="177" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.CreateTime | formatDate}}</template>
          </el-table-column>
          <el-table-column prop="OperaterUserName" label="操作人" width="196" show-overflow-tooltip></el-table-column>
          <el-table-column prop="OperaterRemark" label="驳回原因" width="268" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </template>

      <template v-if="CancelList && CancelList.length">
        <!--  取消记录 -->
        <header>
          <p class="mp-common-title-wrap"> 取消记录</p>
        </header>
        <el-table v-if="dataInfo" stripe border fit :data="CancelList" style="width: 642px" class="ft-14-table">
          <el-table-column prop="ProductName" label="取消时间" width="320" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.CreateTime | formatDate}}</template>
          </el-table-column>
          <el-table-column prop="OperaterUserName" label="操作人" width="321" show-overflow-tooltip></el-table-column>
        </el-table>
      </template>

      <!-- 查看订单详情 -->
    <OrderListDialog @DialogHide='orderListDialogData.orderListDialogShow=false' :orderListDialogData="orderListDialogData"/>

    <el-dialog :title="curDialogTitle" :visible.sync="dialogVisible" width="800px" append-to-body top="10vh" :modal='false'
      custom-class="mp-service-detail-cord-dia mp-img-style-header" :before-close="handleClose">
      <main>
        <el-table
         :data="dialogTableData.AfterSaleRecord" max-height=487
         style="width: 100%">
          <el-table-column prop="AfterSaleCode" label="售后单" width="85"></el-table-column>
          <el-table-column prop="ID" label="问题" width="90" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.QuestionTypeTitleList.join('、')}}
            </template>
          </el-table-column>
          <el-table-column prop="QuestionRemark" label="备注" width="115" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="SolutionResultRemark" label="解决方案" width="160" show-overflow-tooltip>
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
        <p>{{curDialogType !== 'customer' ? "此单" : ''}}已售后<span class="is-origin">{{dialogTableData.AfterSaleNumber}}</span>次
          <template v-if="dialogTableData.AfterSaleNumber > 10"><i class="is-gray">( 只显示出最近10条记录）</i></template>
          <template v-if="dialogTableData.LossAmount > 0">，共损失<i class="is-pink is-font-size-14"> - {{dialogTableData.LossAmount}}元</i></template>
        </p>
      </main>
      <span slot="footer" class="dialog-footer">
        <normalBtn @click.native="handleClose" title="关闭" />
      </span>
    </el-dialog>
    </main>
</template>

<script>
import mixin from '@/assets/js/mixins/OrderList&FeedbackCommonDialogMixins/index';
import OrderListDialog from '@/components/Feedback/OrderListDialog.vue';
import normalBtn from '@/components/common/normalBtn.vue';

export default {
  mixins: [mixin],
  name: 'tables',
  components: {
    OrderListDialog,
    normalBtn,
  },
  props: {
    dataInfo: {
      type: Object,
    },
    paramsData: {
      type: Object,
    },
  },
  data() {
    return {
      orderListDialogData: {
        orderListDialogShow: false,
        OrderID: null,
      },
      curDialogType: '',
      dialogVisible: false,
      dialogTableData: [],
      CustomerServerCount: 0,
      CustomerServerAmount: 0,
    };
  },
  computed: {
    // 挂起记录
    PostponeList() {
      return this.dataInfo?.AfterSaleLog?.filter(item => item.LogType === 1);
    },
    // 转交记录
    DeliverToList() {
      return this.dataInfo?.AfterSaleLog?.filter(item => item.LogType === 2);
    },
    // 取消记录
    CancelList() {
      return this.dataInfo?.AfterSaleLog?.filter(item => item.LogType === 3);
    },
    // 驳回记录
    RejectList() {
      return this.dataInfo?.AfterSaleLog?.filter(item => item.LogType === 4);
    },
    // imgUrl() {
    //   return (url) => (process.env.NODE_ENV === 'development' ? `http://192.168.1.92:8050/${url}` : url);
    // },
    curDialogTitle() {
      if (this.curDialogType === 'customer') return '客户已售后详情';
      return '订单已售后详情';
    },
    count() {
      if (this.curDialogType === 'customer') return this.CustomerServerCount;
      return this.dialogTableData.length;
    },
    amount() {
      if (this.curDialogType === 'customer') return this.CustomerServerAmount;
      return 0;
    },
  },
  methods: {
    OrderInfo() {
      this.orderListDialogData.orderListDialogShow = true;
      this.orderListDialogData.OrderID = this.dataInfo.Order.OrderID;
    },
    // 售后详情
    async onDetailClick(type) {
      this.curDialogType = type;
      this.dialogVisible = true;
      if (type === 'customer') {
        const resp = await this.api.getCustomerApplyRecord(this.paramsData.CustomerID).catch(() => {});
        if (resp && resp.data.Status === 1000) {
          this.dialogTableData = resp.data.Data;
          this.CustomerServerCount = resp.data.DataNumber;
        }
      } else {
        const resp = await this.api.getOrderApplyRecord(this.dataInfo.Order.OrderID).catch(() => {});
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
    getRemark(data) {
      const { QuestionTypeTitleList } = data;
      if (QuestionTypeTitleList && QuestionTypeTitleList.length > 0) {
        const list = QuestionTypeTitleList.map(it => it.Remark);
        if (list.length > 0) {
          return list.join('、');
        }
      }
      return '';
    },
    getSolution(solution) {
      const arr = [];
      if (solution.Type === 2) {
        arr.push(`订单减款${solution.Refund}元`);
        arr.push(`运费减款${solution.RefundFreight}元`);
      } else if (solution.Type === 7) {
        arr.push('补印');
        arr.push(`${solution.KindCount}款`);
        arr.push(`${solution.Number}${this.dataInfo.Order.Product.Unit}`);
      } else if (solution.Type === 8) {
        arr.push('赠送优惠券');
        const { CouponList } = solution;
        if (CouponList && CouponList.length > 0) {
          CouponList.forEach(it => {
            const { Number, CouponInfo } = it;
            if (Number && CouponInfo.Data) {
              const { MinPayAmount, Amount } = CouponInfo.Data;
              if (Amount && MinPayAmount) {
                const text = `满${MinPayAmount}减${Amount}券${Number}张`;
                arr.push(text);
              }
            }
          });
        }
      }
      return arr.join('--');
    },
    getLossAmount(LossAmount) {
      if (LossAmount > 0) {
        return `-${LossAmount}元`;
      }
      if (LossAmount === 0) return `${LossAmount}元`;
      if (LossAmount < 0) return `${-LossAmount}元`;
      return '';
    },
  },
  mounted() {
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/common/var.scss";
  .feed-tables {
    flex: 1;
    box-sizing: border-box;
    padding: 0 40px;
    background-color: #fff;
    min-width: 900px;
    .el-table{
      .has-gutter{
        height: 36px;
      }
      .el-table__row{
        height: 60px;
      }
    }
    header{
      padding: 20px 0 15px 0;
    }
    .table{
      width: 800px;
      border: 1px solid #e6e6e6;
      color: #444;
      font-size: 14px;
      td{
        border: 1px solid #e6e6e6;
        box-sizing: border-box;
        padding: 0 10px;
        line-height: 3em;
      }
      .details{
        color: #26BCF9;
        padding: 0 10px;
      }
      .details:hover{
        cursor: pointer;
      }
      .number{
        color: #FEB829;
      }
      .textarea{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .product-info{
      tr:nth-child(1){
        background-color: #f5f5f5;
      }
      td{
        text-align: center;
      }
    }
    .info-common{
        text-align: left;
        >tr{
          td{
            display:table-cell; vertical-align:middle;
            line-height: 50px;
            color: #444444;
            p{
              line-height: 2em;
              padding: .5em 0;
            }
            .img{
              display: flex;
              .el-image{
                display: inline-block;
                width: 50px;
                height: 50px;
                margin: 10px 0;
              }
            }
          }
          td:nth-child(1),td:nth-child(3){
            // background-color: #f5f5f5;
            max-width: 96px;
            min-width: 96px;
            width: 96px;
            text-align: center;
            font-size: 14px;
            font-weight: 700;
          }
          td:nth-child(2),td:nth-child(4){
            max-width: 302px;
            width: 302px;
            font-weight: 400;
            font-size: 13px;
            padding: 0 20px;
          }
        }
    }
    // 挂起驳回
    .postpone{
      width: 642px;
      tr{
        td:nth-child(1){
          width: 177px;
        }
        td:nth-child(2){
          width: 195px;
        }
        td:nth-child(3){
          width: 268px;
        }
      }
    }
    // 取消
    .cancel{
      width: 642px;
      tr{
        td:nth-child(1){
          width: 321px;
        }
        td:nth-child(2){
          width: 321px;
        }
      }
    }
    .deliver-to{
      width: 642px;
      tr{
        td:nth-child(1){
          width: 157px;
        }
        td:nth-child(2){
          width: 157px;
        }
        td:nth-child(3){
          width: 157px;
        }
        td:nth-child(4){
          width: 157px;
        }
      }
    }
  }
.mp-service-detail-cord-dia{
  .el-dialog__header {
    > span::before {
      background: url(../../assets/images/detail.png) no-repeat center;
    }
    border-radius: 3px;
  }
  min-height: 320px;
  .el-dialog__body{
    min-height: 230px;
    padding: 25px 20px;
    box-sizing: border-box;
    > main {
      .el-table{
        border: 1px solid $--border-color-light;
        &::before{
          display: none;
        }
        .el-table__header-wrapper{
          tr{
            th{
              padding: 3px 0;
              border: none;
              .cell{
                line-height: 24px;
              }
            }
          }
        }
        .el-table__body-wrapper{
          tr{
            td{
              padding: 5px 0;
              border-top: 1px solid $--border-color-light;
              .cell{
                line-height: 24px;
              }
            }
          }
        }
      }
      > p {
        color: $--color-text-regular;
        font-size: 12px;
        margin-top: 14px;
        > span {
          margin: 0 3px;
          font-size: 14px;
        }
      }
    }
  }
  .el-dialog__footer{
    padding-top: 0;
    .dialog-footer{
      width: 100%;
      display: inline-block;
      > button {
        margin: 0 auto;
        display: block;
      }
    }
  }
}
</style>
