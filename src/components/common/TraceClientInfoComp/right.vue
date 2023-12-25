<template>
  <section class="trace-client-info-comp-right">
    <div class="content-item" v-if="quotation">
      <p class="common-item-title">当前报价单：</p>
      <p class="product-name">{{quotation.ProductParams.Attributes | getProductName}}<span>{{ quotation.CreateTime | format2MiddleLangTypeDate }}</span></p>
      <table class="price-sheet-table table-common-style">
        <tr>
          <td>原价：</td>
          <td>{{ quotation.Funds.OriginalPrice }}元</td>
          <td>成交价：</td>
          <td><span class="is-pink is-font-16">{{ quotation.Funds.FinalPrice }}</span>元</td>
        </tr>
        <tr>
          <td>原规格说明：</td>
          <td>
            {{ quotation.ProductParams.Attributes.ProductAmount }}{{ quotation.ProductParams.Attributes.Unit }}
            {{ quotation.ProductParams.Attributes.KindCount }}款 {{ quotation.ProductParams.Size.DisplayContent }}
            {{ quotation.ProductParams.Attributes.DisplayName }}
          </td>
          <td>
            <template>
              规格说明：
            </template>
          </td>
          <td>
            <template>
              <el-input v-model="Spec"></el-input>
            </template>
          </td>
        </tr>
      </table>
      <p class="handle-btns-box">
        <el-button @click="traceClick">追踪</el-button>
        <el-button @click="cancellationClick">作废</el-button>
      </p>
    </div>
    <div class="content-item">
      <p class="common-item-title">近30天追踪记录: <span class="add-trace" @click="addTraceClick">+添加追踪记录</span></p>
      <trackRecordTable :CustomerTrackLogs="CustomerTrackDetail?.CustomerTrackLogs||[]"/>
    </div>
    <addTraceDialogComp
    :customerID="customerID"
    :visible="addTraceVisible"
    :TrackStatusList="TrackStatusList"
    @cloce="addTraceVisible = false"/>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import trackRecordTable from './trackRecordTable';
import addTraceDialogComp from './addTraceDialogComp';
import { formatListItemCraft } from '@/assets/js/filters/filters';

export default {
  filters: {
    getProductName(Attributes) {
      if (!Attributes) return '';
      const { DisplayName, ClassList } = Attributes;
      if (!ClassList) return DisplayName;
      const t = ClassList.find(it => it.Type === 1);
      if (t) {
        const { FirstLevel, SecondLevel } = t;
        return `${FirstLevel.Name}-${SecondLevel.Name}-${DisplayName}`;
      }
      return DisplayName;
    },
    getCraftTextList(craftList) {
      if (craftList.length === 0) return '';
      const _list = craftList.map(it => it.Attributes.DisplayName);
      return _list.join(' ');
    },
  },
  props: {
    CustomerTrackDetail: {
      type: Object,
      default: null,
    },
    quotation: {
      type: Object,
      default: null,
    },
    customerID: {
      type: String,
      default: '',
    },
  },
  components: {
    trackRecordTable,
    addTraceDialogComp,
  },
  data() {
    return {
      addTraceVisible: false,
      Spec: '',
      TrackStatusList: [
        {
          label: '未知',
          value: 0,
        },
        {
          label: '未定稿',
          value: 10,
        },
        {
          label: '比价中',
          value: 20,
        },
        {
          label: '对接给市场',
          value: 30,
        },
        {
          label: '已下单',
          value: 50,
        },
        {
          label: '单已飞',
          value: 255,
        },
      ],
    };
  },
  computed: {
  },
  methods: {
    traceClick() {
      if (!this.Spec) {
        return;
      }
      const TrackLog = {
        CustomerID: this.customerID,
        QuotationNumber: 0,
        Product: {
          ClassID: 0,
          TypeID: 0,
          ProductID: this.quotation.ProductParams.ProductID,
          ProductName: '',
        },
        FinalPrice: this.quotation.Funds.FinalPrice,
        Spec: this.Spec,
        TrackRemark: '',
        TrackStatus: 0,
      };
      this.api.getCustomerTrackLogSave(TrackLog).then(res => {
        if (res.data.Status) {
          console.log(res);
        }
      });
    },
    addTraceClick() {
      this.addTraceVisible = true;
    },
    cancellationClick() {
      this.api.getCustomerTrackLogCancel().then(res => {
        if (res.data.Status) {
          console.log(res);
        }
      });
    },
  },
  mounted() {
    if (this.quotation) {
      this.Spec = `${this.quotation.ProductParams.Attributes.ProductAmount}${this.quotation.ProductParams.Attributes.Unit}
      ${this.quotation.ProductParams.Attributes.KindCount}款
      ${this.quotation.ProductParams.Size.DisplayContent}
      ${this.quotation.ProductParams.Attributes.DisplayName}`;
    }
  },
};
</script>
<style lang='scss'>
.trace-client-info-comp-right{
  .price-sheet-table{
    margin-top: 10px;
    width: 900px;
    margin-left: 13px;
  }
  .product-name{
    font-size: 12px;
    font-weight: 700;
    margin-top: 10px;
    margin-left: 13px;
    margin-bottom: 10px;
    span{
      font-weight: 400;
    }
  }
  .add-trace{
    font-weight: 400;
    font-size: 12px;
    color: #26BCF9;
    margin-left: 10px;
  }
  .record-communication-table{
    margin-top: 10px;
    margin-left: 13px;
  }
  .handle-btns-box{
    width: 640px;
    // text-align: right;
    margin-left: 13px;
    margin-top: 20px;
    margin-bottom: 30px;
  }
}
</style>
