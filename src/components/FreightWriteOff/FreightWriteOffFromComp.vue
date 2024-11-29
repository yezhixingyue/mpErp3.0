<template>
  <section class="freight-write-off-from-comp">
    <ul>
      <li class="clients-requirement">
        <span class="label is-bold" style="line-height: 35px;">客户要求：</span><span class="value">
          <el-button size="medium" @click="userRequest(0)" :type="`${ruleForm.Type === 0 ? 'primary' : ''}`">更改快递信息</el-button>
          <el-button size="medium" @click="userRequest(1)" :type="`${ruleForm.Type === 1 ? 'primary' : ''}`">其他</el-button>
        </span>
      </li>
      <template v-if="ruleForm.Type === 0">
        <li>
          <span class="label is-bold">原运输方式：</span><span class="value">
            {{ OrderDetail.Address.ExpressText }}
          </span>
        </li>
        <li>
          <span class="label is-bold">原运费：</span><span class="value">
            {{ Number((OrderDetail.Funds.Freight - OrderDetail.Funds.RefundFreightAmount).toFixed(1)) }} 元
          </span>
        </li>
        <li v-if="ruleForm.Address.Address.ExpressArea">
          <span class="label is-bold" style="line-height: 30px;">地址：</span><span class="value">
            <p>
              <AreaAddressInfoSetupComp class="address-select" :disabled="ruleForm.Address.Express.Second === 1"
              v-model="ruleForm.Address.Address.ExpressArea" :allAreaDataList='allAdAreaTreeList'/>
            </p>
            <p style="margin-top: 20px;">
              <el-input v-model.trim="ruleForm.Address.Address.AddressDetail" maxlength="60" size="small"
              :disabled="ruleForm.Address.Express.Second === 1"
              class="detail-input" show-word-limit placeholder="在此输入详细地址"></el-input>
            </p>
          </span>
        </li>
        <li>
          <span class="label is-bold" style="line-height: 32px;">收货人：</span><span class="value">
            <span>
              <el-input size="small" v-model="ruleForm.Address.Address.Consignee" style="width: 120px;"
              :disabled="ruleForm.Address.Express.Second === 1"></el-input>
            </span>
            <span style="margin-left: 30px;">
              <i class="is-bold">手机号：</i>
              <el-input size="small" v-model="ruleForm.Address.Address.Mobile" style="width: 120px;"
              :disabled="ruleForm.Address.Express.Second === 1"></el-input>
            </span>
          </span>
        </li>
        <li v-if="isNotYetShipped">
          <span class="label is-bold" style="line-height: 25px;">更改后的运输方式：</span><span class="value">
            <select-comp
            :options='spreadExpressList'
            :defaultProps='{ label: "Name", value: "ID", }'
            :title='ruleForm.Address.Express.Second'
            @handleChange='handleChange'
            :filterable="true"
            :disabled="false"
          />
          </span>
        </li>
        <li>
          <span class="label is-bold" style="line-height: 32px;">差额：</span><span class="value">
            <el-input size="small" v-model="ruleForm.Amount"
            oninput="value=value.match(/^\d*(\.?\d{0,1})/g)[0]" :disabled="isNotYetShipped" style="width: 120px;"></el-input> 元
            <el-button size="small" type="primary" style="margin-left: 20px;" v-if="isNotYetShipped"
              @click="FreightCalculate">计算运费差额</el-button>
          </span>
        </li>
        <li>
          <span class="label is-bold">备注（选填）：</span><span class="value">
            <el-input
              type="textarea"
              placeholder="请输入备注"
              maxlength="100"
              show-word-limit
              v-model.trim="ruleForm.Remark">
            </el-input>
          </span>
        </li>
      </template>
      <template v-else>
        <li>
          <span class="label is-bold" style="line-height: 32px;">运费金额：</span><span class="value">
            <el-input size="small" v-model="ruleForm.Amount" style="width: 120px;"
            oninput="value=value.match(/^\d*(\.?\d{0,1})/g)[0]"></el-input> 元
            <p class="is-orgin" style="margin-top: 5px;">
              注：此处金额仅作说明用，记录运费的实际金额
            </p>
          </span>
        </li>
        <li>
          <span class="label is-bold">备注（必填）：</span><span class="value">
            <el-input
              type="textarea"
              placeholder="请输入备注"
              maxlength="100"
              show-word-limit
              v-model.trim="ruleForm.Remark">
            </el-input>
          </span>
        </li>
        <li>
          <span class="label is-bold">上传凭证（必填）：</span><span class="value" style="width: 400px;">
            <ImageUploadComp :ImgList="ruleForm.PicList" @UploadedSeccess="UploadedSeccess"
            @PictureDelete="PictureDelete" :limit='9'
            :beforeUploadFun="beforeUpload"></ImageUploadComp>
          </span>
        </li>
      </template>
    </ul>
    <PayCodeDialog :visible="PayCodeVisible" @close='PayCodeDialogClose' :CustomerName="CustomerName"
      :PayCodeData="PayCodeData" :ChangeID="PayCodeData?.ID" @seccess="PayCodeSeccess"/>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { MobileReg } from '@/assets/js/utils/regexp';
import { Message } from 'element-ui';
import SelectComp from '@/components/common/SelectComp.vue';
import ImageUploadComp from '@/components/common/UploadComp/ImageUploadComp.vue';
import AreaAddressInfoSetupComp from '@/components/common/SelectorComps/AreaAddressInfoSetupComp.vue';
import PayCodeDialog from '@/components/FreightWriteOff/PayCodeDialog.vue';

export default {
  props: {
    OrderDetail: {
      type: Object,
      default: () => null,
    },
  },
  components: {
    AreaAddressInfoSetupComp,
    SelectComp,
    ImageUploadComp,
    PayCodeDialog,
  },
  computed: {
    ...mapGetters('common', ['allAdAreaTreeList']),
    ...mapState('common', ['ExpressList']),
    ...mapState('orderModule', ['objForOrderList']),
    spreadExpressList() {
      let returnList = [];
      this.ExpressList.forEach(element => {
        if (element.Type !== 1) {
          returnList = [...returnList, ...element.List];
        } else {
          returnList = [...returnList, ...element.List.map(it => ({ ...it, disabled: true }))];
        }
      });
      return returnList;
    },
    ExpressArea() {
      return this.ruleForm.Address.Address.ExpressArea;
    },
    isNotYetShipped() { // 是否未发货
      return this.OrderDetail.Status < 80;
    },
  },
  data() {
    return {
      PayCodeVisible: false,
      CustomerName: null,
      ChangeID: null,
      PayCodeData: null,
      ruleForm: {
        ID: 0,
        Type: 0,
        OrderID: 0,
        Customer: {
          CustomerID: '',
          CustomerSN: '',
          CustomerName: '',
          Type: {
            First: 0,
            Second: '',
          },
          Mobile: '',
          QQ: '',
          Location: {
            RegionalID: 0,
            RegionalName: '',
            CityID: 0,
            CityName: '',
            CountyID: 0,
            CountyName: '',
          },
          SellArea: {
            RegionalID: 0,
            RegionalName: '',
            CityID: 0,
            CityName: '',
            CountyID: 0,
            CountyName: '',
          },
          Grade: {
            First: 0,
            Second: '',
            Third: 0,
          },
          GradeEndTime: '',
          Feature: {
            First: 0,
            Second: '',
          },
        },
        FirstLevel: {
          ID: 0,
          Name: '',
        },
        SecondLevel: {
          ID: 0,
          Name: '',
        },
        Product: {
          ID: '',
          Name: '',
        },
        Address: {
          Express: {
            First: '',
            Second: 0,
          },
          ExpressText: '',
          AddressID: '',
          Address: {
            CustomerID: '',
            AddressID: '',
            ExpressArea: null,
            ActualArea: {
              RegionalID: 0,
              RegionalName: '',
              CityID: 0,
              CityName: '',
              CountyID: 0,
              CountyName: '',
            },
            OutPlateSN: '',
            OutPlatType: 0,
            AddressDetail: '',
            Consignee: '',
            Mobile: '',
            IsDefault: true,
            Longitude: '',
            Latitude: '',
            HavePosition: true,
          },
          Delivery: {
            StationSN: '',
            StationName: '',
            DistrictSN: '',
            DistrictName: '',
            Sender: '',
          },
        },
        Funds: {
          OrderID: 0,
          OriginalPrice: 0,
          DiscountPrice: 0,
          FinalPrice: 0,
          Freight: 0,
          RefundFreightAmount: 0,
          PrePaid: 0,
          Deposit: 0,
          HavePaid: 0,
          PaidCashAmount: 0,
          PaidBeanNumber: 0,
          PaidBeanAmount: 0,
          Refund: 0,
          RefundCashAmount: 0,
          RefundBeanNumber: 0,
          RefundBeanAmount: 0,
          Unpaid: 0,
          Receivable: 0,
          CouponAmount: 0,
          Reduced: 0,
          IsChargeFreight: true,
          OutPrice: 0,
        },
        IsAuto: true,
        CurrentAmount: 0,
        Amount: 0,
        Remark: '',
        Status: 0,
        OperatorRemark: '',
        Operator: {
          ID: '',
          Name: '',
        },
        PicList: [],
        CreateTime: '',
        FinishTime: '',
      },
    };
  },
  methods: {
    ...mapActions('common', ['getExpressList']),
    ...mapActions('orderModule', ['getOrderTableData']),
    getOrderTableList() {
      this.getOrderTableData({ page: this.objForOrderList.Page, type: 'get' });
    },
    userRequest(type) {
      this.ruleForm.Type = type;
      this.ruleForm.Amount = '';
      this.ruleForm.Remark = '';
      this.ruleForm.CurrentAmount = 0;
    },
    handleChange(e) {
      const temp = this.spreadExpressList.find(it => it.ID === e);
      if (!temp) return;
      this.ruleForm.Address.Express.First = temp.Type;
      this.ruleForm.Address.Express.Second = temp.ID;
      this.ruleForm.Amount = '';
    },
    beforeUpload(file) {
      const isLt15M = file.size / 1024 / 1024 < 15;
      if (!isLt15M) {
        // 文件过大上传失败
        Message({
          showClose: true,
          message: '文件过大，上传失败',
          type: 'error',
        });
      }
      return isLt15M;
    },
    UploadedSeccess(Url) {
      this.ruleForm.PicList.push(Url);
    },
    PictureDelete(Url) {
      this.ruleForm.PicList = this.ruleForm.PicList.filter(it => it !== Url);
    },
    PayCodeDialogClose() {
      this.PayCodeVisible = false;
      setTimeout(() => {
        this.$goback();
      }, 10);
    },
    PayCodeSeccess() {
      const cb = () => {
        this.getOrderTableList();
        this.PayCodeDialogClose();
      };
      this.messageBox.successSingle('支付成功', cb, cb);
    },
    FreightCalculate() {
      const obj = {
        CustomerID: this.OrderDetail.Customer.CustomerID,
        ProductPrice: this.OrderDetail.Funds.FinalPrice,
        Address: this.ruleForm.Address,
        ProductID: this.OrderDetail.ProductParams.ProductID,
        Weight: this.OrderDetail.Weight,
      };
      this.api.getFreightCalculateClick(obj).then(res => {
        if (res.data.Status === 1000) {
          this.ruleForm.CurrentAmount = Number(res.data.Data);
          this.ruleForm.Amount = `${Number((this.ruleForm.OriginalAmount - this.ruleForm.CurrentAmount).toFixed(1))}`;
        }
      });
    },
    formValidator() {
      const oldData = {
        CountyID: this.OrderDetail.Address.Address.ExpressArea.CountyID,
        AddressDetail: this.OrderDetail.Address.Address.AddressDetail,
        Consignee: this.OrderDetail.Address.Address.Consignee,
        Mobile: this.OrderDetail.Address.Address.Mobile,
        Second: this.OrderDetail.Address.Express.Second,
        Amount: '0',
        Remark: '',
      };
      const newData = {
        CountyID: this.ruleForm.Address.Address.ExpressArea.CountyID,
        AddressDetail: this.ruleForm.Address.Address.AddressDetail,
        Consignee: this.ruleForm.Address.Address.Consignee,
        Mobile: this.ruleForm.Address.Address.Mobile,
        Second: this.ruleForm.Address.Express.Second,
        Amount: this.ruleForm.Amount,
        Remark: this.ruleForm.Remark,
      };
      if (this.ruleForm.Type === 0 && !this.ruleForm.Address.Address.ExpressArea.CountyID) {
        this.messageBox.failSingleError('操作失败', '请选择地址');
        return false;
      }
      if (this.ruleForm.Type === 0 && !this.ruleForm.Address.Address.AddressDetail) {
        this.messageBox.failSingleError('操作失败', '请输入详细地址');
        return false;
      }
      if (this.ruleForm.Type === 0 && !this.ruleForm.Address.Address.Consignee) {
        this.messageBox.failSingleError('操作失败', '请输入收货人');
        return false;
      }
      if (this.ruleForm.Type === 0 && !this.ruleForm.Address.Address.Mobile) {
        this.messageBox.failSingleError('操作失败', '请输入收货人手机号');
        return false;
      }
      if (this.ruleForm.Type === 0 && newData.Mobile !== oldData.Mobile && !MobileReg.test(this.ruleForm.Address.Address.Mobile)) {
        this.messageBox.failSingleError('操作失败', '请输入正确的手机号');
        return false;
      }
      if (this.ruleForm.Type === 0 && this.isNotYetShipped && this.ruleForm.Amount === '') {
        this.messageBox.failSingleError('操作失败', '请点击“计算运费差额”后提交');
        return false;
      }
      if (this.ruleForm.Type === 0 && !this.isNotYetShipped && this.ruleForm.Amount === '') {
        this.messageBox.failSingleError('操作失败', '请输入差额');
        return false;
      }
      if (this.ruleForm.Type === 0 && !this.isNotYetShipped
      && this.ruleForm.Amount > Number((this.OrderDetail.Funds.Freight - this.OrderDetail.Funds.RefundFreightAmount).toFixed(1))) {
        this.messageBox.failSingleError('操作失败', '需退差额超过原运费');
        return false;
      }
      if (this.ruleForm.Type === 1 && this.ruleForm.Amount === '') {
        this.messageBox.failSingleError('操作失败', '请输入运费金额');
        return false;
      }
      if (this.ruleForm.Type === 1 && this.ruleForm.Remark === '') {
        this.messageBox.failSingleError('操作失败', '请输入备注');
        return false;
      }
      if (this.ruleForm.Type === 1 && !this.ruleForm.PicList.length) {
        this.messageBox.failSingleError('操作失败', '请上传凭证');
        return false;
      }
      if (JSON.stringify(oldData) === JSON.stringify(newData)) {
        this.messageBox.failSingleError('操作失败', '数据无更改');
        return false;
      }
      return true;
    },
    submit() {
      if (this.formValidator()) {
        if (!this.isNotYetShipped) {
          this.ruleForm.CurrentAmount = this.ruleForm.OriginalAmount - this.ruleForm.Amount;
        }
        // 提交数据
        this.api.getOrderExpressChange(this.ruleForm).then(res => {
          if (res.data.Status === 1000) {
            const back = () => {
              this.getOrderTableList();
              this.$goback();
            };
            if (this.ruleForm.Type === 1) {
              this.messageBox.successSingle('提交成功', this.$goback, this.$goback);
            } else if (Number(this.ruleForm.Amount) === 0) {
              this.messageBox.successSingle('提交成功', back, back);
            } else if (this.ruleForm.Amount < 0 && !!res.data.Data.PayWay) {
              this.PayCodeVisible = true;
              this.PayCodeData = res.data.Data;
            } else if (this.ruleForm.Amount < 0 && !res.data.Data.PayWay) {
              this.messageBox.successSingle('扣款成功', back, back);
            } else {
              this.messageBox.successSingle('退款成功', back, back);
            }
            // 成功
          }
        });
      }
    },
  },
  created() {
    this.routeData = this.$route.params;
  },
  watch: {
    ExpressArea() {
      this.ruleForm.Amount = '';
    },
  },
  mounted() {
    this.$store.dispatch('common/fetchAdAreaList');
    this.getExpressList();
    this.ruleForm.OrderID = this.routeData.OrderID;
    this.ruleForm.Address.Address.ExpressArea = this.OrderDetail.Address.Address.ExpressArea;
    this.ruleForm.Address.Address.AddressDetail = this.OrderDetail.Address.Address.AddressDetail;
    this.ruleForm.Address.Address.Consignee = this.OrderDetail.Address.Address.Consignee;
    this.ruleForm.Address.Address.Mobile = this.OrderDetail.Address.Address.Mobile;
    this.ruleForm.Address.Express.Second = this.OrderDetail.Address.Express.Second;
    this.ruleForm.OriginalAmount = (this.OrderDetail.Funds.Freight - this.OrderDetail.Funds.RefundFreightAmount).toFixed(1);
    this.ruleForm.CurrentAmount = this.ruleForm.OriginalAmount;
    this.ruleForm.IsAuto = this.isNotYetShipped;
    setTimeout(() => { // 处理运费差额默认值（因省市区修改只能watch监听然后指控差额所以需要在回显之后再赋默认值）
      this.ruleForm.Amount = '0';
    }, 10);

    this.CustomerName = this.OrderDetail.Customer.CustomerName;
  },
};
</script>

<style lang='scss'>
.freight-write-off-from-comp {
  padding-left: 60px;
  min-width: 650px;
  width: 650px;
  box-sizing: border-box;
  padding-right: 30px;
  border-left: 1px solid #E5E5E5;
  >ul{
    >li{
      display: flex;
      font-size: 12px;
      margin-bottom: 20px;
      line-height: 15px;
      &.clients-requirement{
        .el-button{
          width: 120px;
          padding: 0;
          line-height: 35px;
        }
        .el-button + .el-button{
          margin-left: 50px;
        }
      }
      .detail-input{
        width: 492px;
      }
      .address-select{
        .el-select {
          margin-right: 20px;
          width: 150px;
          .el-input{
            input{
              border-top: none;
              border-left: none;
              border-right: none;
            }
            &::after {
              content: "";
              position: absolute;
              top: 14px;
              right: 4px;
              background: none;
              border: 5px solid #eee;
              width: 0;
              height: 0;
              border-top-width: 6px;
              border-bottom-width: 0px;
              border-color: rgba($color: #000000, $alpha: 0);
              border-top-color: rgba($color: #000000, $alpha: 0.3);
              border-radius: 2px;
            }
            .el-select__caret{
              display: none;
            }
          }
        }
      }
      .el-textarea, textarea{
        width: 290px;
        height: 174px;
      }
      >.label{
        position: relative;
      }
      >.value{
        flex: 1;
        .image-upload-comp{
          width: 400px;
        }
      }
    }
  }
}
</style>
