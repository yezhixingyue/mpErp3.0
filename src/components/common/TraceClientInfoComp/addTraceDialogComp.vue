<template>
  <CommonDialogComp
    width="530px"
    top='18vh'
    title="添加追踪记录："
    :visible="visible"
    cancelText='取消'
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    class="add-trace-dialog-comp"
   >
   <template>
    <el-form :model="TrackLogData" status-icon ref="ruleForm" label-width="127px" class="add-trace-ruleForm" label-position="right">
      <el-form-item label="产品：" required>
        <EpCascaderByProduct
          class="mr-12"
          title=""
          :showLine="false"
          :withEmpty="false"
          :getList="() => null"
          :setCondition="setRequestObj"
          :First="TrackLogData.Product.ClassID"
          :Second="TrackLogData.Product.TypeID"
          :ProductID="TrackLogData.Product.ProductID"
          :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
          />
      </el-form-item>
      <el-form-item label="规格说明：" required>
        <TextareaInput
        v-model.trim="TrackLogData.Spec" show-word-limit :maxlength="300" placeholder="请输入规格说明" autocomplete="off"></TextareaInput>
      </el-form-item>
      <el-form-item label="价格：" required class="final-price">
        <el-input oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0]" v-model="TrackLogData.FinalPrice" size="small"></el-input><span>元</span>
      </el-form-item>
      <el-form-item label="状态：" required>
        <el-select v-model="TrackLogData.TrackStatus" size="small" placeholder="请选择">
          <el-option
            v-for="item in TrackStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注（选填）：">
        <TextareaInput
        v-model.trim="TrackLogData.TrackRemark" show-word-limit :maxlength="100" placeholder="请输入备注" autocomplete="off"></TextareaInput>
      </el-form-item>
    </el-form>
   </template>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import TextareaInput from '@/components/common/TextareaInput';
import EpCascaderByProduct from '@/components/common/SelectorComps/EpCascaderWrap/EpCascaderByProduct.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    customerID: {
      type: String,
      default: '',
    },
    TrackStatusList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    EpCascaderByProduct,
    TextareaInput,
  },
  data() {
    return {
      loading: false,
      TrackLogData: {
        CustomerID: this.customerID,
        QuotationNumber: '',
        Product: {
          ClassID: 0,
          TypeID: 0,
          ProductID: '',
          ProductName: '',
        },
        FinalPrice: '',
        Spec: '',
        TrackRemark: '',
        TrackStatus: 0,
      },
    };
  },
  computed: {
    ...mapGetters('TraceRecord', ['getTraceRecordPage']),
    ...mapState('TraceClientList', ['condition4RecordList']),
  },
  methods: {
    ...mapActions('TraceClientInfo', ['getCustomerTrackDetail']),
    setRequestObj([[key1, key2], value]) {
      this.TrackLogData[key1][key2] = value;
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('cloce');
    },
    onSubmit() {
      const reg = /(^\d*[0-9]\d*(\.\d{1,2})?$)|0\.(\d?[0-9]|[0-9]\d?)$/;
      if (!this.TrackLogData.Product.ClassID && !this.TrackLogData.Product.TypeID && !this.TrackLogData.Product.ProductID) {
        this.messageBox.failSingleError('操作失败', '请选择产品');
      } else if (!this.TrackLogData.Spec) {
        this.messageBox.failSingleError('操作失败', '请输入规格说明');
      } else if (this.TrackLogData.FinalPrice === '' || this.TrackLogData.FinalPrice === null) {
        this.messageBox.failSingleError('操作失败', '请输入价格');
      } else if (!reg.test(this.TrackLogData.FinalPrice)) {
        this.messageBox.failSingleError('操作失败', '请输入正确的价格');
      } else {
        this.api.getCustomerTrackLogSave(this.TrackLogData).then(res => {
          if (res.data.Status === 1000) {
            this.onCancle();
            this.getCustomerTrackDetail(this.customerID);
            this.$store.dispatch('TraceRecord/getCustomerTrackLogList', this.getTraceRecordPage);
            this.$store.dispatch('TraceClientList/getTraceClientList', this.condition4RecordList.Page);
          }
        });
      }
    },
    onOpen() {
      this.TrackLogData = {
        CustomerID: this.customerID,
        // QuotationNumber: '',
        Product: {
          ClassID: 0,
          TypeID: 0,
          ProductID: '',
          ProductName: '',
        },
        FinalPrice: '',
        Spec: '',
        TrackRemark: '',
        TrackStatus: 0,
      };
    },
    onClosed() {
      this.onCancle();
    },
  },
};
</script>
<style lang='scss'>
.add-trace-dialog-comp{
  .el-dialog__body{
    padding: 0;
    padding-right: 42px;
  }
  .add-trace-ruleForm{
    margin-top: 10px;
    .el-form-item{
      margin-bottom: 15px;
    }
    .el-form-item__label{
      padding-right: 0;
    }
    .mpzj-sell-lib-comps-ep-cascader-comp-wrap{
       .title{
        display: none;
       }
    }
    .mp-textarea{
      .el-textarea, textarea{
        height: 80px;
      }
    }
    .final-price{
      .el-input{
        width: 120px;
        margin-right: 10px;
      }
    }
  }
}
</style>
