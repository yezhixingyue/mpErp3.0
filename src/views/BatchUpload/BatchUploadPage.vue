<template>
  <section class="mp-c-batch-upload-page-wrap">
    <header>
      <CustomerSelectComp
       :customer='customer'
       :disabled='canSelectList.length > 0'
       @setCustomer='handleCustomerChange'
       @paid="handlePaid"
       @getBalance='handleGetBalance'
      />
      <hr />
      <AddressChangeComp
       :customer='customer'
       :UseSameAddress='UseSameAddress'
       :switchUseSameAddDisabled='canSelectList.length > 0'
       @changeUseSameAddress='onChangeUseSameAddress'
       @change="handleAddressChange"
       @validAddChange='handleValidAddChange'
      />
    </header>
    <main>
      <div class="workbench" :class="{d: !showMultiple}">
        <div class="l" v-if="showMultiple">
          <p class="tips-box">
            <i class="el-icon-warning"></i>
            <span>上传说明：多产品上传文件名必须携带产品名称。   单产品上传不需要携带产品名称，所有上传文件视同选定产品。</span>
          </p>
          <ProductFilterComp v-model="Product" :disabled='canSelectList.length > 0' @change="onProductFilterChange" />
        </div>
        <!-- :disabled='!canSelectFile' -->
        <div class="select-box">
          <FileSelectComp @change="handleFileChange" v-show='canSelectFile' :accept='accept' :selectTitle='selectTitle' ref="oFileBox" />
          <FailListComp :failed-list="failedList" width="720" :offset='122' />
        </div>
      </div>
      <MainTableComp
       ref="oTableWrap"
       v-show="customer"
       :list='successedList'
       class="table"
       :multipleSelection='multipleSelection'
       :checkAllDisabled='canSelectList.length === 0'
       :accept='accept'
       :UseSameAddress='UseSameAddress'
       :subExpressList='subExpressList'
       :ShowProductDetail='ShowProductDetail'
       @itemRemove='handleItemRemove'
       @itemUpload='handleItemUpload'
       @multipleSelect='handleMultipleSelect'
       @droped='onDroped' />
      <QrCodeForPayDialogComp v-model="QrCodeVisible" :payInfoData="payInfoData" @success='handlePaidSuccess' payType='21' showPayGroup showPayDescription />
      <PreCreateDialog
        :visible.sync="preCreateVisible"
        :subExpressList='subExpressList'
        :PreCreateData="PreCreateData"
        :OriginList='preCreateOriginDataList'
        @submit="onOrderSubmit"
        />
    </main>
    <footer>
      <BatchUploadFooterComp
       :productCost='productCost'
       :expressCost='expressCost'
       :allCost='allCost'
       :canSelectList='canSelectList'
       :multipleSelection='multipleSelection'
       :count="successedList.length"
       @uploadSelected='handleUploadSelected'
       @removeSelected='handleRemoveSelected'
       @checkAll='handleCheckAll'
       @clearSuccess='handleClearSuccess'
       :address='address'
       />
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import CustomerSelectComp from '@/components/BatchUploadComps/Header/CustomerSelectComp.vue';
import ProductFilterComp from '@/components/BatchUploadComps/Main/ProductFilterComp.vue';
import FileSelectComp from '@/packages/FileSelectComp';
import MainTableComp from '@/components/BatchUploadComps/Main/MainTableComp/index.vue';
import BatchUploadClass from '@/assets/js/TypeClass/BatchUploadClass';
import ShowProductDetail from '@/assets/js/TypeClass/ShowProductDetail';
import BatchUploadFooterComp from '@/packages/BatchUploadComps/Footer/BatchUploadFooterComp.vue';
import QrCodeForPayDialogComp from '@/packages/QrCodeForPayDialogComp';
import AddressChangeComp from '@/packages/BatchUploadComps/Header/AddressChangeComp.vue';
import FailListComp from '@/packages/BatchUploadComps/Main/FailListComp';
import PreCreateDialog from '../../packages/PreCreateDialog';

export default {
  name: 'OrderBatchUploadPage',
  components: {
    /**
     * 页面头部组件
     */
    CustomerSelectComp, // 客户选择组件(后台)
    AddressChangeComp, // 配送信息修改组件
    /**
     * 页面主体组件
     */
    ProductFilterComp, // 产品筛选组件
    FileSelectComp, // 文件上传选择组件
    MainTableComp, // 主体表格组件
    PreCreateDialog,
    FailListComp,
    /**
     * 页面底部组件
     */
    BatchUploadFooterComp, // 底部组件
    QrCodeForPayDialogComp,
  },
  data() {
    return {
      Terminal: 1,
      OrderType: 1, // 2 是自助
      Position: 0, // 255 是自助上传
      customer: null,
      address: null,
      accept: '.cdr,.jpg,.jpeg,.tiff,.tif,.rar,.zip,.pdf, .7z',
      failedList: [], // 解析失败的文件列表 -- 错误信息展示尚未完成  后续处理 ！！！
      successedList: [], // 解析成功的文件列表
      multipleSelection: [], // 文件选中列表
      QrCodeVisible: false,
      payInfoData: null,
      IsBatchUpload: true,
      // PayInFull: false, // 是否支付全款
      // UsePrintBean: false,
      Product: {
        isSingle: false,
        ClassID: '',
        TypeID: '',
        ProductID: '',
      },
      showMultiple: false, // 是否展示多产品文件上传|单产品文件  --- 后面取消该功能 所以不再显示
      UseSameAddress: false,
      preCreateVisible: false,
      preCreateOriginDataList: [], // 预下单原始列表数据，预下单确认后使用该列表数据生成订单
      PreCreateData: null, // 预下单数据（服务器返回数据）
      ShowProductDetail,
    };
  },
  computed: {
    ...mapState('common', ['RiskWarningTipsTypes']),
    ...mapGetters('common', ['subExpressList']),
    canSelectFile() { // 是否允许选择产品（）
      if (!this.Product.ProductID && this.Product.isSingle) return false;
      if (!this.customer || !this.customer.CustomerID || !this.address || !this.address.Address) return false;
      const { Address, AddressID, Express } = this.address.Address;
      if (!Express || (!Express.First && Express.First !== 0) || (!Express.Second && Express.Second !== 0)) return false;
      if (!AddressID) {
        if (!Address) return false;
        const { Latitude, Longitude, Mobile, AddressDetail, Consignee, ExpressArea } = Address;
        if (!Latitude || !Longitude || !Mobile || !AddressDetail || !Consignee || !ExpressArea) return false;
        const { RegionalID, CityID, CountyID } = ExpressArea;
        if ((!RegionalID && RegionalID !== 0) || (!CityID && CityID !== 0) || (!CountyID && CountyID !== 0)) return false;
      }
      return true;
    },
    selectTitle() {
      if (!this.canSelectFile) {
        return '选择条件：\r\n1. 选中客户且已设置收货地址与配送方式，\r\n2. 单产品上传时必须选中具体产品。';
      }
      return '';
    },
    productCost() { // 产品总费用
      return this.getPrice('CurrentCost', this.successedList);
    },
    expressCost() { // 运费总费用
      // return this.getPrice('ExpressCost', this.successedList);
      return 0;
    },
    allCost() { // 全部总费用
      return +((+this.productCost + +this.expressCost).toFixed(2));
    },
    basicObj() { // 基础对象信息
      const temp = {
        CustomerID: this.customer.CustomerID,
        Address: BatchUploadClass.getAddress4SubmitFromEditObj(this.address),
        Terminal: this.Terminal,
        ProductID: this.Product.ProductID && this.Product.isSingle ? this.Product.ProductID : '',
        // PayInFull: this.PayInFull,
        // UsePrintBean: this.UsePrintBean,
        OrderType: this.OrderType, // 2 是自助
        Position: this.Position, // 255 是自助上传
        IsBatchUpload: this.IsBatchUpload,
        IgnoreRiskLevel: this.RiskWarningTipsTypes.All,
        UseSameAddress: this.UseSameAddress,
      };
      return temp;
    },
    canSelectList() { // 可选上传列表
      if (this.successedList && this.successedList.length > 0) {
        return this.successedList.filter(it => it.orderStatus !== 'success');
      }
      return [];
    },
  },
  methods: {
    // 初始化数据
    async getAccept() {
      const accept = await BatchUploadClass.getFileSuffixList();
      if (accept) this.accept = accept;
    },
    /**
     * 顶部区域： 客户信息与地址相关
     */
    handleCustomerChange(data) { // 选中客户 --- 此时应清空已解析订单列表
      // if (!this.customer || !data || this.customer.CustomerID !== data.CustomerID) {
      //   this.PayInFull = false;
      //   this.UsePrintBean = false;
      // }
      // if (data?.PermissionInfo?.BatchUpload === false) {
      //   this.messageBox.failSingleError('客户选择失败', '该客户无批量上传权限');
      //   return;
      // }
      if (this.customer && data && this.customer.CustomerID !== data.CustomerID) {
        this.getCustomerBalance();
      }
      this.customer = data;
      this.handleCheckAll(false);
      this.successedList = [];
      this.failedList = [];
    },
    onProductFilterChange([key, val]) { // 产品筛选发生改变 -- 同上：清空已解析订单列表
      if (!key) return;
      this.Product[key] = val;
      this.handleCheckAll(false);
      this.successedList = [];
      this.failedList = [];
    },
    handlePaid(allAmount) { // 完成充值处理
      if (this.customer && this.customer.FundInfo) {
        this.customer.FundInfo.Amount = allAmount;
      }
    },
    handleGetBalance(funds) {
      if (this.customer && this.customer.FundInfo && funds) {
        const { Cash, PrintBean } = funds;
        this.customer.FundInfo.Amount = Cash;
        this.customer.FundInfo.BeanNumber = PrintBean;
      }
    },
    async getCustomerBalance() {
      if (this.customer && this.customer.CustomerID) {
        const resp = await this.api
          .getCustomerBalance(this.customer.CustomerID)
          .catch(() => null);
        if (resp && resp.data.Status === 1000) {
          this.handleGetBalance(resp.data.Data);
        }
      }
    },
    handleAddressChange(address) { // 设置地址信息 --- 检查是否已有解析过的文件（解析成功且待上传） 如果有根据特定改变内容去改变列表价格 -- 待定
      this.address = address;
    },
    // eslint-disable-next-line no-unused-vars
    handleValidAddChange(onlyAddChange) { // 处理当地址发生改变时运费重新计算的问题 -- 已废弃注释（添加预下单后不再在主页面显示运费）
      // if (!this.successedList || this.successedList.length === 0) return;
      // BatchUploadClass.getFreightCalculateAfterValidAddressChange(this.successedList, this.basicObj, onlyAddChange);
    },
    onChangeUseSameAddress(val) { // 切换使用相同和不同地址
      this.handleCheckAll(false);
      this.successedList = [];
      this.failedList = [];
      this.UseSameAddress = val;
    },
    /**
     * 中上部区域： 文件选择相关
     */
    handleFileChange(fileList) { // 选中文件 并对其后续进行处理 （注：每次选中文件都清空掉上次选中文件）
      if (!this.canSelectFile) return;
      this.handleFileParing(fileList);
    },
    async handleFileParing(fileList) { // 处理文件解析 并生成处理成功列表 及 处理失败列表
      const temp = {
        successedList: this.successedList,
        failedList: this.failedList,
      };
      const result = await BatchUploadClass.getFileParingResult(fileList, this.basicObj, temp);
      if (!result) {
        // this.failedList = [];
        // this.successedList = [];
        return;
      }
      const { failedList, successedList } = result;
      if (failedList.length > 0) {
        if (successedList.length === 0 && failedList.length === 1) {
          this.messageBox.failSingleError('解析失败', failedList[0].error);
        } else {
          const text = temp.failedList.length > 0 || temp.successedList.length > 0 ? '本次' : '';
          this.messageBox.failSingle(`${text}共有${failedList.length}个文件报价失败`);
        }
      }
      this.failedList.push(...failedList);
      this.successedList.push(...successedList);
    },
    /**
     * 下部区域： 文件上传、删除、选择等操作
     */
    handleMultipleSelect(val) { // 表格中复选框选中文件
      this.multipleSelection = val;
    },
    onDroped(e) {
      if (this.$refs.oFileBox?.$refs?.onFileSelector?.onDrop) {
        this.$refs.oFileBox.$refs.onFileSelector.onDrop(e);
      }
    },
    handleCheckAll(bool) { // 处理底部复选框选中事件
      if (this.$refs.oTableWrap && this.$refs.oTableWrap.$refs.multipleTable) {
        if (bool) { // 全选
          this.$refs.oTableWrap.$refs.multipleTable.toggleAllSelection();
        } else { // 清空
          this.$refs.oTableWrap.$refs.multipleTable.clearSelection();
        }
      }
    },
    handleUploadSelected() { // 上传选中文件
      if (this.successedList.length === 0 || this.multipleSelection.length === 0) return;
      // 需要筛选掉已上传成功的文件（已失败文件待定）
      this.handleBatchUploadFiles(this.multipleSelection);
    },
    handleClearSuccess() { // 清除已上传订单
      const list = this.successedList.filter(it => it.orderStatus === 'success').map(it => it.key);
      if (list.length > 0) {
        list.forEach(it => {
          const i = this.successedList.findIndex(_it => _it.key === it);
          if (i > -1) {
            this.successedList.splice(i, 1);
          }
        });
        // this.$message.success('已清除');
      }
      this.failedList = [];
    },
    handleRemoveSelected() { // 删除选中文件
      if (this.successedList.length === 0 || this.multipleSelection.length === 0) return;
      this.messageBox.warnCancelBox('确定删除选中订单吗 ?', '删除后不可恢复', () => {
        this.successedList = this.successedList.filter(it => !this.multipleSelection.includes(it));
      }, null);
    },
    handleItemRemove(item) { // 单个文件删除
      let msg = '删除后不可恢复';
      if (item && item.result && item.result.ProductParams?.Attributes?.DisplayName) {
        msg = `产品：[ ${item.result.ProductParams.Attributes.DisplayName} ]`;
      }
      this.messageBox.warnCancelBox('确定删除该订单吗 ?', msg, () => {
        const i = this.successedList.findIndex(_it => _it.key === item.key);
        if (i > -1) {
          this.successedList.splice(i, 1);
        }
      }, null);
    },
    handleItemUpload(item) { // 单个文件上传 this.basicObj
      this.handleBatchUploadFiles([item]);
    },
    // handleBatchUploadFiles(list) { // 中间添加过渡页面弹窗 - 已加
    //   BatchUploadClass.BatchUploadFiles(list, this.basicObj, this.handleSubmitSuccess);
    // },
    async handleBatchUploadFiles(list) { // 执行单个文件上传或批量上传 （使用同一个方法） -- 在最终下单前 在客户界面 需进行预下单弹窗确认
      // 预下单
      this.preCreateOriginDataList = [];
      const _PreData = await BatchUploadClass.getPreOrderCreate(list, this.basicObj);
      if (!_PreData) return;
      this.handleBalance(_PreData);
      this.PreCreateData = _PreData;
      this.preCreateOriginDataList = list;
      this.preCreateVisible = true;
    },
    handleBalance(obj) {
      const { FundBalance, FundBeanNumber } = obj;
      if (typeof FundBalance === 'number') {
        this.customer.FundInfo.Amount = FundBalance;
      }
      if (typeof FundBeanNumber === 'number') {
        this.customer.FundInfo.BeanNumber = FundBeanNumber;
      }
    },
    onOrderSubmit({ OriginList, PayInFull, UsePrintBean }) { // 最终确认下单
      this.preCreateVisible = false;
      const temp = {
        ...this.basicObj,
        PayInFull,
        UsePrintBean,
      };
      BatchUploadClass.BatchUploadFiles(OriginList, temp, this.handleSubmitSuccess);
    },
    cbToClearSuccessItem(list) { // 上传成功后从已选列表中删除上传成功选项
      if (this.$refs.oTableWrap && this.$refs.oTableWrap.$refs.multipleTable && this.multipleSelection.length > 0) {
        list.forEach(it => {
          this.$refs.oTableWrap.$refs.multipleTable.toggleRowSelection(it, false);
        });
      }
    },
    handleSubmitSuccess(list, resp) { // 创建订单成功后的回调函数，打开支付窗口
      this.cbToClearSuccessItem(list);
      this.getCustomerBalance();
      if (resp) {
        this.payInfoData = resp;
        this.QrCodeVisible = true;
      } else {
        this.messageBox.successSingle('下单成功');
      }
    },
    handlePaidSuccess() {
      this.messageBox.successSingle('下单并支付成功');
    },
    /**
     * 辅助函数
     */
    getPrice(key, list) { // 获取产品费用或运费的总和
      if (list && list.length > 0) {
        const num = list.map(it => (it.result && it.result[key] ? it.result[key] : 0)).filter(it => it).reduce((prev, next) => +prev + +next, 0);
        return +(num.toFixed(2));
      }
      return '';
    },
  },
  async created() {
    this.getAccept();
    this.$store.dispatch('common/getExpressList');
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-wrap {
  background-color: #f5f5f5;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-left: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #585858;
  min-width: 1250px;
  position: relative;
  > header {
    flex: none;
    height: 218px;
    background-color: #fff;
    padding: 0px 20px;
    padding-top: 30px;
    box-sizing: border-box;
    > hr {
      margin-right: 82px;
      border: none;
      border-bottom: 1px solid #eee;
    }
    .mp-pc-place-order-address-show-and-change-wrap > .content.isBatchUploadUse > ul {
      margin-top: 10px;
      margin: 0;
      margin-top: 7px;
      > li {
        margin-top: 0px;
        margin-bottom: 1px;
        input {
          border-radius: 4px;
        }
      }
    }
    // &.s {
    //   height: 120px;
    // }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    > div.workbench {
      flex: none;
      display: flex;
      height: 65px;
      align-items: center;
      justify-content: space-between;
      padding-right: 48px;
      padding-left: 20px;
      overflow: hidden;
      width: 100%;
      box-sizing: border-box;
      > .l {
        display: flex;
        align-items: center;
        overflow: hidden;
        flex: 1;
        > .tips-box {
          max-width: 700px;
          margin-right: 40px;
          padding-left: 20px;
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: center;
          > i {
            flex: none;
          }
          > span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 10px;
          }
        }
        > section {
          flex: none;
        }
      }
      > span {
        flex: none;
        margin-left: 30px;
      }
      &.d {
        > span {
          margin-left: 0px;
        }
      }
      .select-box {
        display: flex;
        align-items: center;
        > .upload-btn {
          margin-right: 20px;
        }
      }
    }
    > .table {
      flex: 1;
    }
    .page-pay-info-box {
      .customer {
        padding-bottom: 15px;
        > p {
          padding-bottom: 16px;
        }
      }
      .item {
        font-size: 14px;
        padding-bottom: 15px;
        > span {
          display: inline-block;
          width: 50%;
          &.k {
            text-align: right;
          }
          &.v {
            text-align: left;
          }
        }
        &.amount {
          .is-origin {
            font-size: 15px;
          }
        }
        &.bean .v{
          text-indent: 1em;
        }
      }
    }
  }
  > footer {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 0;
    flex: none;
    background-color: #fff;
    height: 60px;
    padding-top: 13px;
    box-sizing: border-box;
    box-shadow: 0px 9px 38px 0px rgba(211, 211, 211, 0.54);
  }
}
</style>
