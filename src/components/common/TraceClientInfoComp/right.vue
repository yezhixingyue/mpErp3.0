<template>
  <section class="trace-client-info-comp-right">
    <div class="content-item" v-if="quotation">
      <p class="common-item-title">当前报价单：</p>
      <p class="product-name">{{quotation.Product.Name}}<span> {{ quotation.CreateTime | format2MiddleLangTypeDate }}</span></p>
      <table class="price-sheet-table table-common-style">
        <tr>
          <td>原价：</td>
          <td>{{ quotation.Funds.OriginalPrice }}元</td>
          <td>成交价：</td>
          <td><span class="is-pink is-font-16">{{ quotation.Funds.FinalPrice }}</span>元</td>
        </tr>
        <tr>
          <td>原规格说明：</td>
          <td class="spec">
            <div>
              <el-tooltip :disabled="quotation.Product.Spec.length < 20" effect="dark" :content="quotation.Product.Spec" placement="top">
                <span>{{quotation.Product.Spec}}</span>
              </el-tooltip>
            </div>
            <!-- {{ quotation.Spec }} -->
            <!-- {{ quotation.ProductParams.Attributes.ProductAmount }}{{ quotation.ProductParams.Attributes.Unit }}
            {{ quotation.ProductParams.Attributes.KindCount }}款 {{ quotation.ProductParams.Size.DisplayContent }}
            {{ getCraftTextList(quotation.ProductParams.CraftList) }} -->
          </td>
          <td>
            <template v-if="!quotation.TrackStatus">
              规格说明：
            </template>
          </td>
          <td class="description">
            <template v-if="!quotation.TrackStatus">
              <el-input size="small" v-model="Spec" placeholder="请输入规格说明"></el-input>
            </template>
          </td>
        </tr>
      </table>
      <p class="handle-btns-box">
        <template v-if="!quotation.TrackStatus">
          <template v-if="localPermission.OperateTrackLog">
            <el-button @click="traceClick" class="linear-btn">追踪</el-button>
            <el-button @click="cancellationClick">作废</el-button>
          </template>
        </template>
        <template v-else>
          <span v-if="quotation.TrackStatus === 1" class="have-tracked"><img src="@/assets/images/have-tracked.png" alt="">已追踪</span>
          <span v-if="quotation.TrackStatus === 2" class="have-cancellation is-gray"><img src="@/assets/images/have-cancellation.png" alt="">已作废</span>
        </template>
      </p>
    </div>
    <div class="content-item trace-log" :style="`max-height: calc(100% - ${quotation?213:0}px);`">
      <p class="common-item-title">近30天追踪记录: <span class="add-trace" @click="addTraceClick">+添加追踪记录</span></p>
      <trackRecordTable :TrackStatusList="TrackStatusList"
      :customerID="customerID"
      :CustomerTrackLogs="CustomerTrackDetail?.CustomerTrackLogs||[]"/>
      <!-- <Count
       :watchPage='condition4RecordList.Page'
       :handlePageChange='handlePageChange'
       :count='RecordDataNumber'
       :pageSize='30'
       >
      </Count> -->
    </div>
    <addTraceDialogComp
    :customerID="customerID"
    :visible="addTraceVisible"
    :TrackStatusList="TrackStatusList"
    @cloce="addTraceVisible = false"/>
  </section>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import Count from '@/components/common/Count.vue';
import trackRecordTable from './trackRecordTable';
import addTraceDialogComp from './addTraceDialogComp';
import { formatListItemCraft } from '@/assets/js/filters/filters';

export default {
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
    // Count,
    trackRecordTable,
    addTraceDialogComp,
  },
  data() {
    return {
      addTraceVisible: false,
      Spec: '',
    };
  },
  computed: {
    ...mapState('TraceRecord', ['TrackStatusList']),
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionCalculateRecord?.Obj) {
        return this.Permission.PermissionList.PermissionCalculateRecord.Obj;
      }
      return {};
    },
  },
  methods: {
    ...mapActions('TraceClientInfo', ['getCustomerTrackDetail']),
    ...mapMutations('PriceRecord', ['setTrackStatus']),
    getCraftTextList(craftList) {
      if (craftList.length === 0) return '';
      const _list = craftList.map(it => it.Attributes.DisplayName);
      return _list.join(' ');
    },
    handlePageChange(page) {
      this.$store.dispatch('TraceClientInfo/getCustomerTrackDetail', page);
    },
    traceClick() {
      if (!this.Spec) {
        return;
      }
      const TrackLog = {
        CustomerID: this.customerID,
        QuotationNumber: this.quotation.QuotationNumber,
        Product: {
          ClassID: 0,
          TypeID: 0,
          ProductID: this.quotation.Product.ID,
          ProductName: '',
        },
        FinalPrice: this.quotation.Funds.FinalPrice,
        Spec: this.Spec,
        TrackRemark: '',
        TrackStatus: 0,
      };
      this.api.getCustomerTrackLogSave(TrackLog).then(res => {
        if (res.data.Status === 1000) {
          this.$emit('setTrackStatus', 1);
          this.setTrackStatus({
            QuotationNumber: this.quotation.QuotationNumber, Status: 1,
          });
          this.getCustomerTrackDetail(this.customerID);
        }
      });
    },
    addTraceClick() {
      this.addTraceVisible = true;
    },
    cancellationClick() {
      this.api.getCustomerTrackLogCancel(this.quotation.QuotationNumber).then(res => {
        if (res.data.Status === 1000) {
          this.$emit('setTrackStatus', 2);
          this.setTrackStatus({
            QuotationNumber: this.quotation.QuotationNumber, Status: 2,
          });
        }
      });
    },
  },
  mounted() {
    if (this.quotation) {
      this.Spec = this.quotation.Product.Spec;
      // this.Spec = `${this.quotation.ProductParams.Attributes.ProductAmount}${this.quotation.ProductParams.Attributes.Unit} ${
      //   this.quotation.ProductParams.Attributes.KindCount
      // }款 ${this.quotation.ProductParams.Size.DisplayContent} ${this.getCraftTextList(this.quotation.ProductParams.CraftList)}`;
    }
  },
};
</script>
<style lang='scss'>
.trace-client-info-comp-right{
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  .trace-log{
    flex: 1;
    display: flex;
    flex-direction: column;
    .track-record-table{
      flex: 1;
    }
  }
  .description{
    display: flex;
    align-items: center;
    .el-input{
      margin: 4px 0;
      height: 32px;
      display: flex;
    }
  }
  .price-sheet-table{
    margin-top: 10px;
    width: 900px;
    margin-left: 13px;
    >tr{
      td:nth-child(2){
        width: 310px;
      }
      .spec{
        >div{
          display: flex;
          align-items: center;
        }
        span{
          display: inline-block;
          line-height: 40px;
          width: 269px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
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
    cursor: pointer;
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
    height: 36px;
    >.el-button{
      width: 120px;
      height: 35px;
      padding: 0;
      line-height: 35px;
      border-color: #26BCF9;
      color: #26BCF9;
      &.el-button+.el-button{
        margin-left: 30px;
      }
    }
    >span{
      line-height: 36px;
      display: flex;
      align-items: center;
      font-size: 14px;
      img{
        margin-right: 10px;
      }
      &.have-tracked{
        color: #74CF47;
      }
    }
  }
}
</style>
