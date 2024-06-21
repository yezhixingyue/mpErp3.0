<template>
  <section class="order-details-comp">
    <header class="title is-bold">订单详情</header>
    <div class="box main">
      <ul>
        <li class="title is-bold">
          订单信息
        </li>
        <li>
          <span class="label is-bold">售后次数：</span>
          <span class="value">
            <a @click="onDetailClick">0次（点击查看详情）</a>
          </span>
        </li>
        <li>
          <span class="label is-bold">订单号：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">售后单号：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">产品：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">工厂：</span><span class="value">订单详情</span>
        </li>
        <li></li>
        <li>
          <span class="label is-bold">物料：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">数量：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">款数：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">尺寸：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">印面：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">印色：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">是否带R标：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">其他工艺：</span><span class="value">订单详情</span>
        </li>
        <li></li>
        <li>
          <span class="label is-bold">下单方式：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">下单时间：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">付款时间：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">付款时间：</span><span class="value">订单详情</span>
        </li>
        <li>
          <span class="label is-bold">当前状态：</span><span class="value">订单详情</span>
        </li>
      </ul>
      <div class="box">
        <ul>
          <li class="title is-bold">
            价格
          </li>
          <li>
            <span class="label is-bold">原价：</span><span class="value">湿货、生产质量问题、材料质量问题、晚货</span>
          </li>
          <li>
            <span class="label is-bold">成交价：</span><span class="value is-pink is-bold">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">已付：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">未付：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">退款：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">优惠券：</span><span class="value is-pink">sasss</span>
          </li>
          <li>
            <span class="label is-bold">运费：</span><span class="value">bbbb</span>
          </li>
        </ul>
        <ul style="margin-top: 30px;">
          <li class="title is-bold">
            客户
          </li>
          <li>
            <span class="label is-bold">售后次数：</span>
            <span class="value">
              <a @click="onDetailClick">aaaaaaaaaaa</a>
            </span>
          </li>
          <li>
            <span class="label is-bold">客户编号：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">客户名称：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">类型等级：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">销售区域：</span><span class="value">订单详情</span>
          </li>
          <li>
            <span class="label is-bold">配送方式：</span><span class="value">aaaaaa</span>
          </li>
          <li>
            <span class="label is-bold">收件人：</span><span class="value">bbbbbbbb</span>
          </li>
          <li>
            <span class="label is-bold">收件地址：</span><span class="value">bbbbbbbb</span>
          </li>
        </ul>
      </div>
    </div>

    <el-dialog :title="curDialogTitle" :visible.sync="dialogVisible" width="800px" append-to-body top="10vh" :modal='false'
      custom-class="mp-service-detail-cord-dia mp-img-style-header" :before-close="handleClose">
      <main>
        <el-table
         :data="dialogTableData" max-height=487
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
        <p>{{curDialogType !== 'customer' ? "此单" : ''}}已售后<span class="is-origin">{{dialogTableData.AfterSaleNumber}}</span>次
          <template v-if="dialogTableData.AfterSaleNumber > 10"><i class="is-gray">( 只显示出最近10条记录）</i></template>
          <template v-if="dialogTableData.LossAmount > 0">，共损失<i class="is-pink is-font-size-14"> - {{dialogTableData.LossAmount}}元</i></template>
        </p>
      </main>
      <span slot="footer" class="dialog-footer">
        <normalBtn @click.native="handleClose" title="关闭" />
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    dataList: {
      type: Array,
      default: () => ([]),
    },
  },
  components: {
  },
  computed: {
    ...mapState('common', ['userTypeList']),
    curDialogTitle() {
      if (this.curDialogType === 'customer') return '客户已售后详情';
      return '订单已售后详情';
    },
  },
  data() {
    return {
      curDialogType: '',
      dialogVisible: false,
      dialogTableData: [],
      CustomerServerCount: 0,
    };
  },
  methods: {
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
  },
  mounted() {

  },
};
</script>

<style lang='scss'>
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
    >ul{
      li{
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
