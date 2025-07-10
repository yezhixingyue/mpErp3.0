/* eslint-disable max-len */
// eslint-disable-next-line import/no-cycle
// import instance from '@/api/axios';
import { instance } from '@/basic/request';
import { IOrderFlowchartNode } from '@/components/common/NodePicDialog/js/types';
import { GetLogOptions } from '@/components/LogComp/types/LogConditionClass';
import { AssistMapItemClass } from '@/pinia/modules/transformer/map/AssistMapItemClass';
import { AssistInfoTypeEnum } from '@/pinia/modules/transformer/map/enum';
import { GeneralMapItemClass } from '@/pinia/modules/transformer/map/GeneralMapItemClass';
import { IAssistMapParams, IFactoryMaterialClass, IGeneralMapParams } from '@/pinia/modules/transformer/map/types';
import { TransformerListConditionClass } from '@/pinia/modules/transformer/TransformerListConditionClass';
import { IPartChangeParams, ISemiFinishedSaveParams, IGetWorkingProcedureParams, IGetPropertyListParams, IGetDefaultLineSetupParams } from '@/pinia/modules/transformer/types';
import { IFactoryAccount } from '@/views/BasicSetup/Factory/Account/types';
import { SaleAndProductionListItemPlainType } from '@/views/serverManage/utils/SaleAndProductionListItemClass';
import { baseSetupApis } from './modules/BaseSetup';

const api = {
  ...baseSetupApis,
  /* 订单列表部分api
   ------------------------------------------------------------------------------------ */
  getVersionValid(data) { // 缓存版本对比 ---  暂用于获取企业类型    POST
    return instance.post('/Api/Constant/VersionValid', data);
  },
  getExpressList(data) { // 获取配送方式
    return instance.get('/Api/Express/List', data);
  },
  // /Api/Address/Search GET请求，参数address
  getAddressSearch(address) {
    return instance.get('/Api/Address/Search', { params: { address } });
  },
  getOrderList(data) { // 获取客户订单列表（后台）
    return instance.post('/Api/Order/List', data); // /Api/Customer/OrderList
  },
  /** 销售端获取订单生产流程接口：/Api/Order/ProduceProcess  GET 参数：orderID */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getOrderProduceProcess(orderID, targetType = 2) {
    return instance.get<IOrderFlowchartNode[]>('/Api/Order/ProduceProcess', { params: { orderID, targetType } });
  },
  getCustomerInfo(customerID) { // 获取客户信息
    return instance.get(`/Api/OrderAfterSale/CustomerInfo?customerID=${customerID}`);
  },
  selectOrderProgress(data) { // 查询订单进度
    return instance.get(`/Api/Order/Progress?orderID=${data}`);
  },
  getOrderDetail(orderID) { // 查询订单详情       GET /Api/Order/Detail
    return instance.get(`/Api/Order/Detail?orderID=${orderID}`);
  },
  cancelStaffOrder({ OrderID, closeTip = false }) { // 取消客户订单(接单员)
    return instance.delete(`/Api/Order/Cancle?OrderID=${OrderID}`, { closeTip });
  },

  getOrderProductionInfo(OrderID) { // 获取订单生产信息
    return instance.get(`/Api/Order/ProductionInfo?orderID=${OrderID}`, { closeTip: true });
  },
  getOrderProductionStopQuery(data) { // POST /Api/Order/ProductionStop/Query
    return instance.post('/Api/Order/ProductionStop/Query', data);
  },
  getPayExpressPayResult(changeID) { // 运费结算支付结果查询
    return instance.get(`/Api/PayExpress/PayResult?changeID=${changeID}`, { closeTip: true, loading: false });
  },
  getOrderExpressChange(data) { // POST /Api/Order/ExpressChange 修改订单配送
    return instance.post('/Api/Order/ExpressChange', data);
  },
  getFreightCalculateClick(data) { // POST /Api/Freight/Calculate 运费（差额）计算
    return instance.post('/Api/Freight/Calculate', data);
  },
  getExpressChangeList(data) { // POST /Api/ExpressChange/List 运费结算列表
    return instance.post('/Api/ExpressChange/List ', data);
  },
  getExpressChangeExcel(data) { // POST /Api/ExpressChange/Excel 运费结算列表导出
    return instance.post('/Api/ExpressChange/Excel ', data, { responseType: 'arraybuffer', closeTip: true });
  },
  getExpressChangeCancle(changeID) { // POST /Api/ExpressChange/Cancle 运费结算取消
    return instance.delete(`/Api/ExpressChange/Cancle?changeID=${changeID}`);
  },
  getExpressChangeDetail(changeID) { // POST /Api/ExpressChange/Detail 运费结算详情
    return instance.get(`/Api/ExpressChange/Detail?changeID=${changeID}`);
  },
  getOrderProductionStopSave(data) { // POST /Api/Order/ProductionStop/Save
    return instance.post('/Api/Order/ProductionStop/Save', data, { closeTip: true });
  },
  getOrderProductionStopCancelPay(OrderID, payCode) { // 生产中止取消支付
    return instance.put(`/Api/Order/ProductionStop/CancelPay?orderID=${OrderID}&payCode=${payCode}`, null, { closeTip: true });
  },
  getOrderProductionStopPay(data) { // POST /Api/Order/ProductionStop/Pay
    return instance.post('/Api/Order/ProductionStop/Pay', data);
  },

  getOrderListData2Excel(data, type = 'normal') { // POST /Api/OrderList/Excel  ---- 财务用 [finance]   /Api/PackageList/Excel --- 普通方式 [normal]
    if (type === 'finance') {
      return instance.post('/Api/OrderList/Excel', data, { responseType: 'arraybuffer', closeTip: true }); // 财务
    }
    return instance.post('/Api/PackageList/Excel', data, { responseType: 'arraybuffer', closeTip: true }); // 普通方式
  },
  setOrderReCheckFile(data) { // POST /Api/Order/ReCheckFile
    return instance.post('/Api/Order/ReCheckFile', data);
  },
  getCalculatePriceRecordList(data) { // POST /Api/CalculatePrice/RecordList  获取报价记录
    return instance.post('/Api/CalculatePrice/RecordList', data);
  },
  getCalculatePriceRecordListExcel(data) { // POST /Api/CalculatePrice/Excel 导出报价记录Excel
    return instance.post('/Api/CalculatePrice/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },
  getCustomerTrackList(data) { // POST /Api/CustomerTrack/List  追踪客户列表
    return instance.post('/Api/CustomerTrack/List', data);
  },
  getCustomerCommunicateLogList(data) { // POST /Api/CustomerCommunicateLog/List  沟通记录列表
    return instance.post('/Api/CustomerCommunicateLog/List', data);
  },
  getCustomerCommunicateLogListExcel(data) { // POST /Api/CustomerCommunicateLog/Excel 导出沟通记录Excel
    return instance.post('/Api/CustomerCommunicateLog/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },
  getCustomerTrackLogList(data) { // POST /Api/CustomerTrackLog/List  追踪记录列表
    return instance.post('/Api/CustomerTrackLog/List', data);
  },
  getCustomerTrackLogListExcel(data) { // POST /Api/CustomerTrackLog/Excel 导出追踪记录Excel
    return instance.post('/Api/CustomerTrackLog/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },
  getCustomerTrackDetail(customerID) { // 客户追踪信息
    return instance.get(`/Api/CustomerTrack/Detail?customerID=${customerID}`);
  },
  getCustomerTrackLogSave(data) { // 添加客户追踪记录
    return instance.post('/Api/CustomerTrackLog/Save', data);
  },
  getCustomerTrackLogCancel(quotationNumber) { // 报价单作废
    return instance.get(`/Api/CustomerTrackLog/Cancel?quotationNumber=${quotationNumber}`);
  },
  getCustomerCommunicateLogSave(data) { // 添加客户沟通记录
    return instance.post('/Api/CustomerCommunicateLog/Save', data);
  },
  getCustomerTrackLogChangeStatus(data) { // 添加客户追踪记录改变状态
    return instance.post('/Api/CustomerTrackLog/ChangeStatus', data);
  },

  /* 付款列表部分api
   ----------------------------------------------------------------------------------- */
  getPaymentOrderList(data) { // 获取付款单列表
    return instance.post('/Api/PaymentOrder/List', data);
  },
  cancelCustomerPay({ PayCode, isAddPrepare }) { // 取消付款单 /Api/PaymentOrder/Cancle
    return instance.put(`/Api/PaymentOrder/Cancle?payCode=${PayCode}&isAddPrepare=${isAddPrepare}`);
  },
  transferToPrepareOrder(payCode) { // 付款单转待下单
    return instance.put(`/Api/PaymentOrder/TransferToPrepareOrder?payCode=${payCode}`);
  },
  getPaymentOrderDetail(payCode) { // 付款单信息查询   -------------- 暂时没用到 可能会删除
    return instance.get(`/Api/Pay/Query?payCode=${payCode}`);
  },
  getPaymentOrderDetailByPayCode(payCode) { // 根据付款单号获取付款单详情
    return instance.get(`/Api/PaymentOrder/Detail?payCode=${payCode}`);
  },
  // 付款二维码界面--轮询付款结果 GET /Api/PaymentOrder/PayResult  参数付款单号payCode
  PollingPayStatus(payCode) {
    return instance.get(`/Api/PaymentOrder/PayResult?payCode=${payCode}`, { loading: false });
  },
  // 已弃用
  // getServiceListData2Excel(data) { // POST /Api/AfterSales/Excel
  //   return instance.post('/Api/AfterSales/Excel', data, { responseType: 'arraybuffer' });
  // },
  getServicesListData2Excel(data) { // POST /Api/AfterSale/Excel
    return instance.post('/Api/AfterSale/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },

  /* 订单售后api
   ----------------------------------------------------------------------------------- */
  getQuestionList() { // 获取售后问题列表   GET /Api/AfterSales/QuestionList
    return instance.get('/Api/OrderAfterSale/SolutionQuestionList');
  },
  // saveServiceOrder(data) { // 售后单提交   POST /Api/AfterSales/Save
  //   return instance.post('/Api/AfterSales/Save', data);
  // },
  // getServiceList(data, config = {}) { // 获取售后单列表   GET /Api/AfterSales/List
  //   return instance.post('/Api/AfterSales/List', data, config);
  // },
  // getServiceDetail(aferSalesID) { // 获取售后单详情   GET /Api/AfterSales/Detail
  //   return instance.get(`/Api/AfterSales/Detail?aferSalesID=${aferSalesID}`);
  // },
  // getServiceQuestionChange(data) { // 修改售后单问题、备注及责任部门  POST /Api/AfterSales/ChangeQuestion
  //   return instance.post('/Api/AfterSales/ChangeQuestion', data);
  // },
  // getServiceOrderHistory(orderID) { // 获取售后单已售后记录   GET /Api/Order/AfterSales/List
  //   return instance.get(`/Api/Order/AfterSales/List?orderID=${orderID}`);
  // },

  getPayPackageByOrder(orderID) { // GET /Api/PayPackage/GetByOrder  根据订单查询相关合包信息
    return instance.get(`/Api/PayPackage/GetByOrder?orderID=${orderID}`);
  },
  getApplyQuestionApply(data) { // POST /Api/AfterSaleOrder/List  售后申请
    return instance.post('/Api/OrderAfterSale/Apply', data);
  },
  getOperateStaff() { // POST /Api/AfterSaleOrder/OperateStaff  转交人列表
    return instance.get('/Api/OrderAfterSale/OperateStaff');
  },
  getApplyQuestionApplyList(data) { // POST /Api/OrderAfterSale/ApplyList  售后申请列表
    return instance.post('/Api/OrderAfterSale/ApplyList', data);
  },
  getOrderAfterSaleManageList(data) { // POST /Api/OrderAfterSale/ManageList  售后管理列表
    return instance.post('/Api/OrderAfterSale/ManageList', data);
  },
  getOrderAfterSaleManageListExcel(data) { // POST /Api/OrderAfterSale/ManageList/Excel  售后管理列表导出
    return instance.post('/Api/OrderAfterSale/ManageList/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },
  getOrderAfterSaleDealApply(code) { // POST /Api/OrderAfterSale/DealApply  开始处理售后申请
    return instance.put(`/Api/OrderAfterSale/DealApply?applyCode=${code}`);
  },
  getOrderAfterSaleHang(data) { // POST /Api/OrderAfterSale/Hang  挂起售后申请
    return instance.post('/Api/OrderAfterSale/Hang', data);
  },
  getOrderAfterSaleCancelHang(data) { // POST Api/OrderAfterSale/CancelHang  解除挂起售后申请
    return instance.post(`/Api/OrderAfterSale/CancelHang?afterSaleCode=${data}`);
  },
  getOrderAfterSaleTransfer(data) { // POST /Api/OrderAfterSale/Transfer  转交售后申请
    return instance.post('/Api/OrderAfterSale/Transfer', data);
  },
  getOrderAfterSaleReject(data) { // POST /Api/OrderAfterSale/Reject  驳回售后申请
    return instance.post('/Api/OrderAfterSale/Reject', data);
  },
  getHandleDetail(data) { // POST /Api/OrderAfterSale/HandleDetail  售后申请详情
    return instance.get(`/Api/OrderAfterSale/HandleDetail?afterSaleCode=${data}`);
  },
  getComplete(data) { // POST /Api/OrderAfterSale/Complete
    return instance.post('/Api/OrderAfterSale/Complete', data);
  },
  getSaveDetailAsync(afterSaleCode) { // POST /Api/OrderAfterSale/SaveDetailAsync  获取保存的售后服务详情
    return instance.get(`/Api/OrderAfterSale/SaveDetail?afterSaleCode=${afterSaleCode}`);
  },
  getResultDetail(afterSaleCode) { // POST /Api/OrderAfterSale/ResultDetail
    return instance.get(`/Api/OrderAfterSale/ResultDetail?afterSaleCode=${afterSaleCode}`);
  },
  getSuccessDetail(afterSaleCode) { // POST /Api/OrderAfterSale/SuccessDetail
    return instance.get(`/Api/OrderAfterSale/SuccessDetail?afterSaleCode=${afterSaleCode}`);
  },
  getSaveResult(data) { // POST /Api/OrderAfterSale/SaveResult
    return instance.post('/Api/OrderAfterSale/SaveResult', data);
  },
  getOrderApplyRecord(orderID) { // POST /Api/OrderAfterSale/OrderApplyRecord 订单已售后列表
    return instance.get(`/Api/OrderAfterSale/OrderApplyRecord?orderID=${orderID}`);
  },
  getCustomerApplyRecord(customerID) { // POST /Api/OrderAfterSale/CustomerApplyRecord 客户已售后列表
    return instance.get(`/Api/OrderAfterSale/CustomerApplyRecord?customerID=${customerID}`);
  },
  getOrderDetailUseOrderID(orderID) { // POST /Api/AfterSaleOrder/Detail 订单详情
    return instance.get(`/Api/AfterSaleOrder/Detail?orderID=${orderID}`);
  },
  getAfterSaleOrderHangReasonList() { // POST /Api/OrderAfterSale/HangReasonList 售后挂起原因
    return instance.get('/Api/OrderAfterSale/HangReasonList');
  },
  getAfterSaleOrderTransferReasonList() { // POST /Api/OrderAfterSale/TransferReasonList 售后转交原因
    return instance.get('/Api/OrderAfterSale/TransferReasonList');
  },
  getAfterSaleOrderSolutionQuestionList() { // POST /Api/OrderAfterSale/SolutionQuestionList 售后解决方案问题分类列表
    return instance.get('/Api/OrderAfterSale/SolutionQuestionList');
  },
  getOrderAfterSaleResponsibilityDivideList(data) { // POST /Api/OrderAfterSale/ResponsibilityDivide/List 责任划分列表
    return instance.post('/Api/OrderAfterSale/ResponsibilityDivide/List', data);
  },
  getOrderAfterSaleResponsibilityDivideDetail(afterSaleCode) { // POST /Api/OrderAfterSale/ResponsibilityDivide/Detail 责任划分详情
    return instance.get(`/Api/OrderAfterSale/ResponsibilityDivide/Detail?afterSaleCode=${afterSaleCode}`);
  },
  getAfterSaleResponsibilityDivideExcel(data) { // POST /Api/AfterSale/ResponsibilityDivide/Excel  责任划分列表导出
    return instance.post('/Api/AfterSale/ResponsibilityDivide/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },
  getOrderAfterSaleResponsibilityDivide(data) { // POST /Api/OrderAfterSale/ResponsibilityDivide 划分责任
    return instance.post('/Api/OrderAfterSale/ResponsibilityDivide', data);
  },
  getOrderAfterSaleResponsibilityConfirmList(data) { // POST /Api/OrderAfterSale/ResponsibilityConfirm/List 责任确定列表
    return instance.post('/Api/OrderAfterSale/ResponsibilityConfirm/List', data);
  },
  getOrderAfterSaleResponsibilityConfirmDetail(afterSaleCode, departmentID) { // POST /Api/OrderAfterSale/ResponsibilityConfirm/Detail 责任确定详情
    return instance.get(`/Api/OrderAfterSale/ResponsibilityConfirm/Detail?afterSaleCode=${afterSaleCode}&departmentID=${departmentID}`);
  },
  getAfterSaleResponsibilityConfirmExcel(data) { // POST /Api/AfterSale/ResponsibilityConfirm/Excel  责任划分列表导出
    return instance.post('/Api/AfterSale/ResponsibilityConfirm/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },
  getOrderAfterSaleResponsibilityConfirm(data) { // POST /Api/OrderAfterSale/ResponsibilityConfirm 责任确定
    return instance.post('/Api/OrderAfterSale/ResponsibilityConfirm', data);
  },
  getOrderAfterSaleSupplementalPicAdd(data) { // POST /Api/OrderAfterSale/SupplementalPic/Add 售后客服补充图片
    return instance.post('/Api/OrderAfterSale/SupplementalPic/Add', data);
  },
  getOrderAfterSaleSupplementalPicRemove(data) { // POST /Api/OrderAfterSale/SupplementalPic/Remove 售后客服补充图片删除
    return instance.post('/Api/OrderAfterSale/SupplementalPic/Remove', data);
  },
  getOrderAfterSaleRemove(afterSaleCode) { // POST /Api/OrderAfterSale/Remove 售后删除
    return instance.delete(`/Api/OrderAfterSale/Remove?afterSaleCode=${afterSaleCode}`);
  },
  getOrderAfterSaleExtraPay(data) { // POST /Api/OrderAfterSale/ExtraPay 售后补充额外支付
    return instance.post('/Api/OrderAfterSale/ExtraPay', data);
  },
  getOrderAfterSaleRelevantPerson(orderID) { // POST /Api/OrderAfterSale/RelevantPerson 售后相关人
    return instance.get(`/Api/OrderAfterSale/RelevantPerson?orderID=${orderID}`);
  },
  getRemoveAfterSaleIsAllow() { // POST /Api/OrderAfterSale/RelevantPerson 售后是否可以删除
    return instance.get('/Api/RemoveAfterSale/IsAllow');
  },
  /* 包裹列表api
   ----------------------------------------------------------------------------------- */
  getPackageListByOrderID(orderID) { // GET /Api/Order/PackageList 通过订单号获取包裹列表
    return instance.get(`/Api/Order/PackageList?orderID=${orderID}`);
  },
  getPackagesByOrderID(orderID) { // GET Api/Order/Packages 通过订单号获取包裹列表（新）
    return instance.get(`/Api/Order/Packages?orderID=${orderID}`);
  },
  getPackageListByExressID(expressID) { // GET /Api/Express/PackageList 通过运单号获取包裹列表
    return instance.get(`/Api/Express/PackageList?expressID=${expressID}`);
  },
  getTransportList(data) { // POST /Api/Express/WaybillList  获取运单主列表表格数据
    return instance.post('/Api/Express/WaybillList', data);
  },
  getExpressProgress(expressID) { // POST /Api/Express/Progress // 获取包裹配送进度
    return instance.get(`/Api/Express/Progress?expressID=${expressID}`);
  },

  /* 图片与文件上传api
   ----------------------------------------------------------------------------------- */
  getFileServer(Position) {
    return instance.get<string>('/Api/FileServer', { params: { Position }, loading: false });
  },
  // type 图片类型 为1时为营业执照会打水印
  uploadImage(data, type = 1) { // 图片上传  POST /Api/Upload/Image
    const formData = new FormData();
    formData.append('file', data);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return instance.post(`/Api/Upload/Image?type=${type}`, formData, config);
  },
  UploadBigImgNormal(data, uniqueName, onUploadProgressFunc) { // 非断点上传方式上传文件
    const formData = new FormData();
    formData.append('file', data);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onUploadProgressFunc && onUploadProgressFunc,
    };
    return instance.post(`/Api/Upload/WholeFile?uniqueName=${uniqueName}`, formData, config);
  },
  getUploadedProgress(uniqueName, baseURL) { // 获取断点续传文件已上传的位置  GET /Api/FileNode
    return instance.get(`/Api/FileNode?uniqueName=${uniqueName}`, { baseURL, loading: false });
  },
  UploadFileBreakpointResume(data, uniqueName, first, last, length, onUploadProgressFunc, baseURL) { // 断点续传上传文件 /Api/Upload/File
    const formData = new FormData();
    formData.append('file', data);
    const config = {
      headers: {
        'Content-Range': `bytes ${first}-${last}/${length}`,
      },
      onUploadProgress: onUploadProgressFunc && onUploadProgressFunc,
      baseURL,
      loading: false,
    };
    return instance.post(`/Api/Upload/File?uniqueName=${uniqueName}`, formData, config);
  },

  /* 财务模块api
   ----------------------------------------------------------------------------------- */
  getFinanceListData(data) { // 获取财务列表数据 -- 暂时不再使用该接口    POST /Api/Order/SignList
    return instance.post('/Api/Order/SignList', data);
  },
  getAccountReceivableList(data) { // POST /Api/AccountReceivable/List 获取订单签收列表
    return instance.post('/Api/AccountReceivable/List', data);
  },
  getAccountReceivableExcel(data) { // POST /Api/AccountReceivable/Excel  导出财务订单表格数据
    return instance.post('/Api/AccountReceivable/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },
  setWriteOffAll(data) { // POST /Api/WriteOff/All 全部订单进行销账
    return instance.post('/Api/WriteOff/All', data);
  },
  setWriteOffChecked(ids) { // POST /Api/WriteOff/Checked 销账选中订单
    return instance.post('/Api/WriteOff/Checked', ids);
  },

  /* 未付款订单api
   ----------------------------------------------------------------------------------- */
  getUnpayList(data) { // 获取未付款订单列表
    return instance.post('/Api/Order/List', data);
  },
  getPrePayData(data) { // POST /Api/Order/PrePay  预下单
    return instance.post('/Api/Order/PrePay', data);
  },
  createPaymentOrder(data) { // POST /Api/PaymentOrder/Create 生成付款单 使用返回值中的阿里支付码
    return instance.post('/Api/PaymentOrder/Create', data, { loading: false });
  },
  getPayResult(payCode, type = 11) { // GET /Api/PaymentOrder/PayResult 查询付款结果
    return instance.get('/Api/PaymentOrder/PayResult', { params: { payCode, type }, loading: false });
  },
  getPayResultExtend(payCode, orderID) { // GET /Api/ProductionStop/PayResult 查询付款结果 (取消生产扫码用)
    return instance.get('/Api/ProductionStop/PayResult', { params: { payCode, orderID }, loading: false, closeTip: true });
  },
  getPaymentData2Excel(data) { // POST /Api/PaymentOrder/Excel
    return instance.post('/Api/PaymentOrder/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },

  /* 获取权限信息api
   ----------------------------------------------------------------------------------- */
  getStaffDetail() { // 获取当前登录用户信息详情  POST /Api/Staff/Detail
    return instance.post('/Api/Staff/Detail');
  },

  /* 活动促销api
   ----------------------------------------------------------------------------------- */
  getPromoteList(data) { // POST /Api/Promote/List   获取促销活动列表
    return instance.post('/Api/Promote/List', data);
  },
  savePromote(data) { // POST /Api/Promote/Save  添加和编辑活动
    return instance.post('/Api/Promote/Save', data);
  },
  getAllProductLists() { // 获取列表头部产品第三级列表
    return instance.post('/Api/Product/List', { FieldType: 1, ShowAllClassify: true });
  },
  getConditionList(type, positionID) { // GET /Api/Common/GetConditionList 获取条件列表
    let query;
    if (positionID) query = `type=${type}&positionID=${positionID}`;
    else if (!positionID) query = `type=${type}`;
    return instance.get(`/Api/Common/GetConditionList?${query}`);
  },
  PausePromote(PromoteID) { // PUT /Api/Promote/Pause  促销中止
    return instance.put('/Api/Promote/Pause', PromoteID);
  },
  cancelPromote(promoteID) { // DELETE /Api/Promote/Remove
    return instance.delete(`/Api/Promote/Remove?promoteID=${promoteID}`);
  },

  /* 优惠券api
  ----------------------------------------------------------------------------------- */
  submitAndEditCoupon(data) { // POST /Api/Coupon/Save
    return instance.post('/Api/Coupon/Save', data);
  },
  getCouponList(data) { // POST /Api/Coupon/List   获取优惠券活动列表
    return instance.post('/Api/Coupon/List', data);
  },
  generateCoupons(data) { // POST /Api/GenerateCoupon/Record  手动生成优惠券
    return instance.post('/Api/GenerateCoupon/Record', data);
  },
  getGeneratedCoupons(couponID) { // get /Api/GenerateCoupon/Record  优惠券生成记录
    return instance.get(`/Api/GenerateCoupon/List?couponID=${couponID}`);
  },
  downloadGeneratedCoupons2Excel(recordID) { // GET /Api/Coupon/DownLoad  导出优惠券码
    return instance.get(`/Api/Coupon/DownLoad?recordID=${recordID}`, { responseType: 'arraybuffer', closeTip: true });
  },
  removeCoupon(couponID) { // DELETE /Api/Coupon/Remove  删除优惠券
    return instance.delete(`/Api/Coupon/Remove?couponID=${couponID}`);
  },
  getCouponUseList(data) { // POST /Api/CouponCode/List   获取优惠券使用列表
    return instance.post('/Api/CouponCode/List', data);
  },

  /* 定金设置api
  ----------------------------------------------------------------------------------- */
  SaveDeposit(data) { // POST /Api/Deposit/Save 保存定金
    return instance.post('/Api/Deposit/Save', data);
  },
  getDepositList(data) { // GET /Api/Deposit/List 获取定金设置列表
    const { classID, typeID } = data.Product;
    let query;
    if (!classID && !typeID) query = '';
    if (classID && !typeID) query = `?classID=${classID}`;
    if (!classID && typeID) query = `?typeID=${typeID}`;
    if (classID && typeID) query = `?classID=${classID}&typeID=${typeID}`;

    return instance.get(`/Api/Deposit/List${query}`);
  },
  removeDepositSetting(id) { // DELETE /Api/Deposit/Remove  删除定金设置
    return instance.delete(`/Api/Deposit/Remove?id=${id}`);
  },
  /* 登录api
  ----------------------------------------------------------------------------------- */
  getLogin(data) { // POST /Api/Staff/Login
    return instance.post('/Api/Staff/Login', data, { withoutToken: true });
  },
  // POST /Api/Staff/ChangePassword 修改密码
  getStaffChangePassword(data) {
    return instance.post('/Api/Staff/ChangePassword', data);
  },
  /* 客户流水api
  ----------------------------------------------------------------------------------- */
  getCustomerBill(data) { // POST /Api/Customer/Bill  获取客户余额流水
    return instance.post('/Api/Customer/Bill', data);
  },
  getCustomerOrderBill(data) { // POST /Api/Customer/Order/Bill  获取客户订单流水
    return instance.post('/Api/Customer/Order/Bill', data);
  },
  getCustomerBillExcel(data) { // POST /Api/CustomerBill/Excel 导出客户余额流水Excel
    return instance.post('/Api/CustomerBill/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },
  getOrderBillExcel(data) { // POST /Api/OrderBill/Excel 导出客户订单流水Excel
    return instance.post('/Api/OrderBill/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },
  /* 工期相关api
  ----------------------------------------------------------------------------------- */
  getProducePeriodList(classID) { // GET /Api/ProducePeriod/List   获取工期列表
    return instance.get(`/Api/ProducePeriod/List?classID=${classID}`);
  },
  getProducePeriodDetail(periodID) { // GET /Api/ProducePeriod/Detail   获取工期详情
    return instance.get(`/Api/ProducePeriod/Detail?periodID=${periodID}`);
  },
  getProducePeriodSave(data) { // POST /Api/ProducePeriod/Save    生产工期保存
    return instance.post('/Api/ProducePeriod/Save', data);
  },
  getProducePeriodRemove(periodID) { // DELETE /Api/ProducePeriod/Remove   生产工期删除
    return instance.delete(`/Api/ProducePeriod/Remove?periodID=${periodID}`);
  },
  getConditionList4ProducePeriod({ Limits = [], positionID = '', type = 19 } = {}) { // GET /Api/Common/GetConditionList 获取条件列表 工期产品19 工期工艺20  Limits 产品ID | 工艺ID  positionID 二级类别ID
    return instance.post('/Api/Common/ConditionList', { UsePosition: type, Position: `${positionID}`, Limits });
  },
  getCraftList(data) { // POST /Api/ProductCraft/List 获取产品分类工艺列表
    let classID = '';
    let typeID = '';
    if (data && data.ProductClass) {
      const { First, Second } = data.ProductClass;
      if (First || First === 0) classID = First;
      if (Second || Second === 0) typeID = Second;
    }
    return instance.get('/Api/ProductCraft/List', { params: { classID, typeID } });
  },
  getDistrictList(parentID) {
    if (!parentID && parentID !== 0) return instance.get('/Api/District/List');
    return instance.get(`/Api/District/List?parentID=${parentID}`);
  },
  /* 客户反馈api
  ----------------------------------------------------------------------------------- */
  getApplyQuestionList() { // GET /Api/AfterSales/ApplyQuestionList 获取客户申请问题列表
    return instance.get('/Api/OrderAfterSale/ApplyQuestionList');
    // return instance.get('/Api/AfterSales/ApplyQuestionList');
  },

  /* 已废弃
  getAfterSalesApplyList(data) { // POST /Api/AfterSales/ApplyList 获取客户售后申请列表数据
    return instance.post('/Api/AfterSales/ApplyList', data);
  },
  getApplyReject(data) { // POST /Api/AfterSales/Reject  驳回申请
    return instance.post('/Api/AfterSales/Reject', data);
  },
  getAfterSalesDealApply(applyCode) { // PUT  开始处理
    return instance.put(`/Api/AfterSales/DealApply?applyCode=${applyCode}`);
  },
  */

  getAfterSalesDepartmentList() { // GET /Api/AfterSale/DepartmentList 获取售后责任部门列表
    return instance.get('/Api/OrderAfterSale/DepartmentList');
  },
  getOrderAfterSaleEvaluateDetail(afterSaleCode) { // POST /Api/OrderAfterSale/EvaluateDetail  获取售后评价
    return instance.get(`/Api/OrderAfterSale/EvaluateDetail?afterSaleCode=${afterSaleCode}`, { loading: false });
  },
  /* 统计分析api
  ----------------------------------------------------------------------------------- */
  getStatisticConfigSave(data) { // POST /Api/StatisticConfig/Save 统计表保存
    return instance.post('/Api/StatisticConfig/Save', data);
  },
  getStatisticFormDataList({ Page, PageSize, Type }, loading = true) { // GET /Api/StatisticsConfig/List 获取统计表列表数据
    return instance.get(`/Api/StatisticsConfig/List?page=${Page}&pageSize=${PageSize}&type=${Type}`, { loading });
  },
  getStatisticsConfigDetail(id) { // GET /Api/StatisticsConfig/Detail 获取统计表详情信息
    return instance.get(`/Api/StatisticsConfig/Detail?id=${id}`);
  },
  getStatisticConfigRemove(id) { // DELETE /Api/StatisticConfig/Remove 删除统计表
    return instance.delete(`/Api/StatisticConfig/Remove?id=${id}`);
  },
  getStatisticSummarySave(data) { // // POST /Api/StatisticSummary/Save 保存汇总面板
    return instance.post('/Api/StatisticSummary/Save', data);
  },
  getStatisticsSummaryList({ Page, PageSize }, loading = true) { // GET /Api/StatisticsSummary/List 获取统计配置汇总列表数据
    return instance.get(`/Api/StatisticsSummary/List?page=${Page}&pageSize=${PageSize}`, { loading });
  },
  getStatisticSummaryRemove(id) { // DELETE /Api/StatisticSummary/Remove 删除汇总面板
    return instance.delete(`/Api/StatisticSummary/Remove?id=${id}`);
  },
  getStatisticInitialData(id) { // PUT /Api/Statistic/InitialData 初始化数据
    return instance.put(`/Api/Statistic/InitialData?id=${id}`);
  },
  /* 产品管理api
  ----------------------------------------------------------------------------------- */
  getManageProductLists(data) { //  POST /Api/Product/List  获取产品列表数据
    return instance.post('/Api/Product/List', data);
  },
  getProductBaseInfoSave(data) { // POST /Api/Product/BaseInfoSave  产品保存
    return instance.post('/Api/Product/BaseInfoSave', data);
  },
  getProductRemove(id) { // DELETE /Api/Product/Remove 产品删除
    return instance.delete(`/Api/Product/Remove?id=${id}`);
  },
  getProductPartSave(data) { // POST /Api/Part/Save  产品部件保存
    return instance.post('/Api/Part/Save', data);
  },
  getProductPartRemove(id) { // DELETE /Api/Part/Remove 产品部件删除
    return instance.delete(`/Api/Part/Remove?id=${id}`);
  },
  getValetOrderStatusChange(productID) { // PUT /Api/Product/ChangeValetOrderStatus  改变产品代客下单状态
    return instance.put(`/Api/Product/ChangeValetOrderStatus?productID=${productID}`);
  },
  getCustomOrderStatusChange(productID) { // PUT /Api/Product/ChangeCustomOrderStatus 改变产品自助上传状态
    return instance.put(`/Api/Product/ChangeCustomOrderStatus?productID=${productID}`);
  },
  getMaterialDisplayNameChange(id, name, isProduct) { // PUT /Api/Product/SetMaterialDisplayName  设置物料显示名称( 产品 | 部件 )
    return instance.post('/Api/Product/SetMaterialDisplayName', { id, name, isProduct });
  },
  getProductModuleData(data) { // 根据不同ID序号获取产品上不同数据类型 POST /Api/Product/DataModules
    return instance.post('/Api/Product/DataModules', data);
  },
  getPartModuleData(data) { // 根据不同ID序号获取部件上不同数据类型 POST /Api/ProductPart/DataModules
    return instance.post('/Api/ProductPart/DataModules', data);
  },
  getProductMaterialSave(data) { // POST /Api/ProductMaterial/Save 设置产品或部件物料
    return instance.post('/Api/ProductMaterial/Save', data);
  },
  getProductMaterialRemove({ productID, partID, typeID }) { // delete /Api/ProductMaterial/Remove 根据物料类型删除物料
    let queryStr = `?productID=${productID}&typeID=${typeID}`;
    if (partID) queryStr += `&partID=${partID}`;
    return instance.delete(`/Api/ProductMaterial/Remove${queryStr}`);
  },
  getProductMaterialOrder(data) { // POST /Api/ProductMaterial/Order 设置物料排序
    return instance.post('/Api/ProductMaterial/Order', data);
  },
  getProductMaterialHiddenSet(data) { // POST /Api/ProductMaterial/SetHidden 设置物料对客户隐藏
    return instance.post('/Api/ProductMaterial/SetHidden', data);
  },
  getGeneralSizeSave(data) { // POST /Api/ProductSize/GeneralSizeSave 设置固定尺寸
    return instance.post('/Api/ProductSize/GeneralSizeSave', data);
  },
  getGeneralSizeRemove(id) { // DELETE /Api/ProductSize/Remove  删除固定尺寸
    return instance.delete(`/Api/ProductSize/Remove?id=${id}`);
  },
  getProductGroupSizeSet(data) { // POST /Api/ProductSize/SetGroup 设置产品尺寸组
    return instance.post('/Api/ProductSize/SetGroup', data);
  },
  getProductCraftUsableSet(data) { // POST /Api/ProductCraft/SetUsable 设置产品或部件可用工艺
    return instance.post('/Api/ProductCraft/SetUsable', data);
  },
  getProductCraftOrder(data) { // POST /Api/ProductCraft/Order 设置可用工艺排序
    return instance.post('/Api/ProductCraft/Order', data);
  },
  getProductCraftConditionSave(data) { // POST /Api/ProductCraft/ConditionSave 编辑产品工艺条件 -- 设置单选工艺
    return instance.post('/Api/ProductCraft/ConditionSave', data);
  },
  getProductCraftConditionRemove(id) { // DELETE /Api/ProductCraft/ConditionRemove 删除单选工艺
    return instance.delete(`/Api/ProductCraft/ConditionRemove?id=${id}`);
  },
  getProductCraftSetHidden(data) { // POST /Api/ProductCraft/SetHidden  设置工艺对客户隐藏
    return instance.post('/Api/ProductCraft/SetHidden', data);
  },
  getProductCraftSetGroup(data) { // POST /Api/ProductCraft/GroupSave  设置工艺分组
    return instance.post('/Api/ProductCraft/GroupSave', data);
  },
  getProductSetDisplayOrder(data) { // POST /Api/Product/SetDisplayOrder  设置产品或部件排序
    return instance.post('/Api/Product/SetDisplayOrder', data);
  },
  getProductFactoryAddSave(data) { // POST /Api/ProductFactory/Add  设置产品工厂
    return instance.post('/Api/ProductFactory/Add', data);
  },
  getProductFactoryRemove(id) { // DELETE /Api/ProductFactory/Remove 删除产品工厂
    return instance.delete(`/Api/ProductFactory/Remove?id=${id}`);
  },
  getProductFileSave(data) { // POST /Api/ProductFile/Add  设置产品文件关联
    return instance.post('/Api/ProductFile/Add', data);
  },
  getProductFileRemove(id) { // DELETE /Api/ProductFile/Remove 删除产品文件关联
    return instance.delete(`/Api/ProductFile/Remove?id=${id}`);
  },
  getSubformulaUseableProperty(productID) { // GET /Api/Formula/SubformulaUseableProperty 获取可使用子公式的属性列表
    return instance.get(`/Api/Formula/SubformulaUseableProperty?productID=${productID}`);
  },
  getProductSetFalseWords(data) { // POST /Api/Product/SetFalseWords 设置通假字 文件名设置
    return instance.post('/Api/Product/SetFalseWords', data);
  },
  getProductControlSave(data) { // POST /Api/Product/ControlSave  产品交互/对比/风险提示保存
    return instance.post('/Api/Product/ControlSave', data);
  },
  getProductControlRemove(id) { // delete /Api/Product/ControlRemove 产品交互/对比/风险提示删除
    return instance.delete(`/Api/Product/ControlRemove?id=${id}`);
  },
  getProductStockSave(data) { // POST /Api/ProductStock/Save  产品库存规格保存
    return instance.post('/Api/ProductStock/Save', data);
  },
  getProductStockSetWarning(data) { // POST /Api/ProductStock/SetWarning  设置库存预警
    return instance.post('/Api/ProductStock/SetWarning', data);
  },
  getProductStockUpdate(id, number) { // PUT /Api/ProductStock/Update   更新库存数量
    return instance.put(`/Api/ProductStock/Update?id=${id}&number=${number}`);
  },
  getProductStockRemove(id) { // DELETE /Api/ProductStock/Remove   删除库存信息
    return instance.delete(`/Api/ProductStock/Remove?id=${id}`);
  },
  getProductBindElementType(data) { // POST /Api/Product/BindElementType 绑定产品元素类型
    return instance.post('/Api/Product/BindElementType', data);
  },
  /* 产品价格管理api
  ----------------------------------------------------------------------------------- */
  getMakeupRuleList() { // GET /Api/MakeupRule/List    获取拼版规则列表
    return instance.get('/Api/MakeupRule/List');
  },
  getMakeupRuleSave(data) { //  POST /Api/MakeupRule/Save  拼版规则保存
    return instance.post('/Api/MakeupRule/Save', data);
  },
  getMakeupRuleRemove(id) { // DELETE /Api/MakeupRule/Remove    拼版规则删除
    return instance.delete('/Api/MakeupRule/Remove', { params: { id } });
  },
  getApplyRangeTemplateList() { // GET /Api/ApplyRangeTemplate/List 获取使用范围模板列表
    return instance.get('/Api/ApplyRangeTemplate/List');
  },
  getApplyRangeTemplateSave(data) { // POST /Api/ApplyRangeTemplate/Save 使用范围模板保存
    return instance.post('/Api/ApplyRangeTemplate/Save', data);
  },
  getApplyRangeTemplateRemove(id) { // DELETE /Api/ApplyRangeTemplate/Remove  使用范围模板删除
    return instance.delete('/Api/ApplyRangeTemplate/Remove', { params: { id } });
  },
  getProductPriceSave(data) { // POST /Api/ProductPrice/Save  保存产品价格
    return instance.post('/Api/ProductPrice/Save', data);
  },
  getProductPriceRemove(id) { // DELETE /Api/ProductPrice/Remove 产品价格删除
    return instance.delete('/Api/ProductPrice/Remove', { params: { id } });
  },
  getPriceModeSetup(data) { // POST /Api/PriceMode/Setup  设置报价方式
    return instance.post('/Api/PriceMode/Setup', data);
  },
  getMakeupSolutionList(productID) { // GET /Api/MakeupSolution/List  获取拼版规则方案列表
    return instance.get('/Api/MakeupSolution/List', { params: { productID } });
  },
  getMakeupSolutionSave(data) { // POST /Api/MakeupSolution/Save   拼版控制方案保存
    return instance.post('/Api/MakeupSolution/Save', data);
  },
  getMakeupSolutionRemove(id) { // DELETE /Api/MakeupSolution/Remove   删除拼版控制方案
    return instance.delete('/Api/MakeupSolution/Remove', { params: { id } });
  },
  getMakeupSolutionItemSave(data) { // POST /Api/MakeupSolutionItem/Save 拼版控制方案条目保存 如设置拼版尺寸数量等
    return instance.post('/Api/MakeupSolutionItem/Save', data);
  },
  getMakeupSolutionItemRemove(id) { // DELETE /Api/MakeupSolutionItem/Remove 拼版控制方案条目删除 如设置拼版尺寸数量等
    return instance.delete('/Api/MakeupSolutionItem/Remove', { params: { id } });
  },
  getMakeupRuleItemList(solutionID) { // GET /Api/MakeupRuleItem/List 获取拼版规则条目列表
    return instance.get('/Api/MakeupRuleItem/List', { params: { solutionID } });
  },
  getMixtureMakeupList(id) { // GET /Api/MixtureMakeup/List // 获取混拼信息列表
    return instance.get('/Api/MixtureMakeup/List', { params: { id } });
  },
  getMixtureMakeupItemSave(data) { // POST /Api/MixtureMakeupItem/Save  混拼信息条目保存 --- 设置混拼条件
    return instance.post('/Api/MixtureMakeupItem/Save', data);
  },
  getMixtureMakeupItemRemove(id) { // DELETE /Api/MixtureMakeupItem/Remove  混拼条目删除 传入混拼条目ID
    return instance.delete('/Api/MixtureMakeupItem/Remove', { params: { id } });
  },
  getMixtureMakeupChangeDefault(solutionID, partID) { // PUT /Api/MixtureMakeup/ChangeDefault 混拼默认选中设置
    return instance.put('/Api/MixtureMakeup/ChangeDefault', '', { params: { solutionID, partID } });
  },
  getMixtureMakeupSamePropertySetup(data) { // POST /Api/MixtureMakeup/SamePropertySetup 混拼相同条件设置
    return instance.post('/Api/MixtureMakeup/SamePropertySetup', data);
  },
  getMixtureMakeupExcludeNumberSetup(solutionID, partID, formularID) { // PUT /Api/MixtureMakeup/ExcludeNumberSetup  混拼数量排除公式设置
    return instance.put('/Api/MixtureMakeup/ExcludeNumberSetup', '', { params: { solutionID, partID, formularID } });
  },
  getProductFormulasList(productID, isIncludeCalculate = false) { // GET /Api/ProductFormula/List 获取产品公式和子公式列表
    return instance.get('/Api/ProductFormula/List', { params: { productID, isIncludeCalculate } });
  },
  getProductChildConditionList(productID) { // GET /Api/ChildCondition/List  获取产品子条件列表
    return instance.get('/Api/ChildCondition/List', { params: { productID } });
  },
  getPartChildConditionSave(data) { // POST /Api/ChildCondition/Save  子条件保存
    return instance.post('/Api/ChildCondition/Save', data);
  },
  getPartChildConditionRemove(id) { // DELETE /Api/ChildCondition/Remove 子条件删除
    return instance.delete('/Api/ChildCondition/Remove', { params: { id } });
  },
  getMakeupControlSolutionSetup(params) { // PUT /Api/MakeupControl/Setup  拼版方案设置
    return instance.put('/Api/MakeupControl/Setup', '', { params });
  },
  getPriceSolutionSave(data) { // POST /Api/PriceSolution/Save  价格方案保存
    return instance.post('/Api/PriceSolution/Save', data);
  },
  getPriceSolutionRemove(id) { // DELETE /Api/PriceSolution/Remove  价格方案删除
    return instance.delete('/Api/PriceSolution/Remove', { params: { id } });
  },
  getCraftPriceTagID(productID, priceID, craftID, partID) { // GET /Api/CraftPrice/Tag  获取工艺费列表中单个工艺对应条目ID
    return instance.get('/Api/CraftPrice/Tag', { params: { productID, priceID, craftID, partID } });
  },
  getAllCraftPriceList(priceID) { // GET /Api/CraftPrice/List  获取价格条目中产品所有工艺费列表
    return instance.get('/Api/CraftPrice/List', { params: { priceID } });
  },
  getPriceTableList(solutionID) { // GET /Api/PriceTable/List  获取价格表的费用列表
    return instance.get('/Api/PriceTable/List', { params: { solutionID } });
  },
  getPriceTableSave(data) { // POST /Api/PriceTable/Save 价格表保存
    return instance.post('/Api/PriceTable/Save', data);
  },
  getPriceTableRemobe(id) { // DELETE /Api/PriceTable/Remove  价格表删除
    return instance.delete('/Api/PriceTable/Remove', { params: { id } });
  },
  getPriceTableSetCondition(data) { // POST /Api/PriceTable/SetCondition  价格表设置条件
    return instance.post('/Api/PriceTable/SetCondition', data);
  },
  getPriceResultSetup(data) { // POST /Api/PriceResult/Setup 保存报价结果
    return instance.post('/Api/PriceResult/Setup', data);
  },
  getPriceResultList(priceID) { // GET /Api/PriceResult/List 获取报价结果列表
    return instance.get('/Api/PriceResult/List', { params: { priceID } });
  },
  getPriceResultRemove(id) { // DELETE /Api/PriceResult/Remove 报价结果删除
    return instance.delete('/Api/PriceResult/Remove', { params: { id } });
  },
  getNumberSwapList(priceID) { // GET /Api/NumberSwap/List  获取数值转换列表
    return instance.get('/Api/NumberSwap/List', { params: { priceID } });
  },
  getNumberSwapSetup(data) { // POST /Api/NumberSwap/Setup  数值转换保存
    return instance.post('/Api/NumberSwap/Setup', data);
  },
  getNumberSwapRemove(id) { // DELETE /Api/NumberSwap/Remove 数值转换删除
    return instance.delete('/Api/NumberSwap/Remove', { params: { id } });
  },
  getProductPriceCopy(data) { // POST /Api/ProductPrice/Copy  复制价格
    return instance.post('/Api/ProductPrice/Copy', data);
  },
  getPriceTableImport(file, solutionID, onUploadProgressFunc) { // POST /Api/PriceTable/Import  价格表导入
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onUploadProgressFunc && onUploadProgressFunc,
    };
    return instance.post(`/Api/PriceTable/Import?solutionID=${solutionID}`, formData, config);
  },
  getPriceTableExport({ productID, tableID }) { // GET /Api/PriceTable/Export  价格表导出
    return instance.get('/Api/PriceTable/Export', { responseType: 'arraybuffer', params: { productID, tableID }, closeTip: true });
  },
  /* 基础设置api
  ----------------------------------------------------------------------------------- */
  getFactoryList(includeConvertServer = false) { // 获取生产工厂列表
    return instance.get('/Api/Factory/List', { params: { includeConvertServer } });
  },
  getFactorySave(data) { // /Api/Factory/Save 工厂信息保存:   添加 | 编辑
    return instance.post('/Api/Factory/Save', data);
  },
  getFactoryRemove(factoryID) { // 工厂删除
    return instance.delete(`/Api/Factory/Remove?factoryID=${factoryID}`);
  },
  // getFactoryProductPriceList(factoryID) { // GET /Api/Factory/ProductPrice/List 获取工厂产品价格列表
  //   return instance.get(`/Api/Factory/ProductPrice/List?factoryID=${factoryID}`);
  // },
  getProductPriceList(productID) { // GET /Api/ProductPrice/List
    return instance.get(`/Api/ProductPrice/List?productID=${productID}`);
  },
  getFactoryProductPriceSave(data) { // POST /Api/Factory/ProductPrice/Save 工厂产品价格保存
    return instance.post('/Api/Factory/ProductPrice/Save', data);
  },
  getFactoryProductPriceRemove(ID) { // POST /Api/Factory/ProductPrice/Remove 工厂产品价格删除
    return instance.delete(`/Api/Factory/ProductPrice/Remove?id=${ID}`);
  },
  // POST /Api/Factory/ProductPrice/List  获取工厂产品价格列表
  getFactoryProductPriceList(condition) {
    return instance.post('/Api/Factory/ProductPrice/List', condition);
  },
  /** GET /Api/Factory/Account/List  获取工厂账号列表 */
  getFactoryAccountList(factoryID: number) {
    return instance.get<IFactoryAccount[]>('/Api/Factory/Account/List', { params: { factoryID } });
  },
  /** POST /Api/Factory/Account/Save  工厂账号保存 */
  getFactoryAccountSave(data) {
    return instance.post('/Api/Factory/Account/Save', data);
  },
  /** DELETE /Api/Factory/Account/Remove  删除工厂账号 */
  getFactoryAccountRemove(id: string) {
    return instance.delete('/Api/Factory/Account/Remove', { params: { id } });
  },
  getElementSave(data) { // POST /Api/Element/Save  保存界面元素
    return instance.post('/Api/Element/Save', data);
  },
  getElementList(data = null, loading = true) { // GET /Api/Element/List 获取元素列表
    let hash = '';
    if (data) {
      const { groupID, positionID } = data;
      if (groupID) hash = `groupID=${groupID}`;
      if (positionID) {
        const separate = hash ? '&' : '';
        hash += `${separate}positionID=${positionID}`;
      }
      hash = hash ? `?${hash}` : '';
    }
    return instance.get(`/Api/Element/List${hash}`, { loading });
  },
  getElementRemove(id, module) { // DELETE /Api/Element/Remove 元素删除
    return instance.delete('/Api/Element/Remove', { params: { id, module } });
  },
  getElementGroupSave(data) { // POST /Api/ElementGroup/Save 元素组保存
    return instance.post('/Api/ElementGroup/Save', data);
  },
  getElementGroupList(positionID, loading = true) { // GET /Api/ElementGroup/List 元素组列表
    if (positionID) return instance.get(`/Api/ElementGroup/List?positionID=${positionID}`, { loading });
    return instance.get('/Api/ElementGroup/List');
  },
  getElementGroupRemove(id, module) { // DELETE /Api/ElementGroup/Remove 元素组删除
    return instance.delete('/Api/ElementGroup/Remove', { params: { id, module } });
  },
  getElementGroupElementSort(data) { // POST /Api/ElementGroup/ElementSort 元素组排序
    return instance.post('/Api/ElementGroup/ElementSort', data);
  },
  getElementGroupCopy(data) { // POST /Api/ElementGroup/Copy 元素组模板复制
    return instance.post('/Api/ElementGroup/Copy', data);
  },
  getFileTypeList() { // GET /Api/FileType/List 文件类型列表
    return instance.get('/Api/FileType/List');
  },
  getFileInfoSave(data) { // POST /Api/FileInfo/Save  文件类目保存
    return instance.post('/Api/FileInfo/Save', data);
  },
  getFileInfoList() { // GET /Api/FileInfo/List  获取文件类目列表数据
    return instance.get('/Api/FileInfo/List');
  },
  getFileInfoRemove(id) { // DELETE /Api/FileInfo/Remove 文件类目删除
    return instance.delete(`/Api/FileInfo/Remove?id=${id}`);
  },
  getProductClassSave(data) { // /Api/ProductClass/Save 保持销售区域使用到 -- 一级大区排序|编辑|新增
    return instance.post('/Api/ProductClass/Save', data);
  },
  getAreaRemoveRange({ ids, type }) { // /Api/RemoveRange?ID=1020&ID=1019&ID=1018&type=3  销售区域一级大区删除
    const queryStr = `${ids.map(ID => `ID=${ID}`).join('&')}&type=${type}`;
    return instance.delete(`/Api/RemoveRange?${queryStr}`);
  },
  /* 印刷幅面api
  ----------------------------------------------------------------------------------- */
  getBreadthClassList() { // GET /Api/BreadthClass/List 印刷幅面分类列表
    return instance.get('/Api/BreadthClass/List');
  },
  getBreadthClassSave(data) { // POST /Api/BreadthClass/Save 印刷幅面分类保存
    return instance.post('/Api/BreadthClass/Save', data);
  },
  getBreadthClassRemove(id) { // DELETE /Api/BreadthClass/Remove 印刷幅面分类删除
    return instance.delete(`/Api/BreadthClass/Remove?id=${id}`);
  },
  getBreadthList(classID) { // GET /Api/Breadth/List 印刷幅面列表
    if (classID || classID === 0) return instance.get(`/Api/Breadth/List?classID=${classID}`);
    return instance.get('/Api/Breadth/List');
  },
  getBreadthSave(data) { // POST /Api/Breadth/Save  印刷幅面保存
    return instance.post('/Api/Breadth/Save', data);
  },
  getBreadthRemove(id) { // DELETE /Api/Breadth/Remove 印刷幅面删除
    return instance.delete(`/Api/Breadth/Remove?id=${id}`);
  },
  /* 物料尺寸api
  ----------------------------------------------------------------------------------- */
  getMaterialSizeList(page = 1, pageSize = 30) { // GET /Api/MaterialSize/List 获取物料尺寸列表
    return instance.get(`/Api/MaterialSize/List?page=${page}&pageSize=${pageSize}`);
  },
  getMaterialSizeSave(data) { // POST /Api/MaterialSize/Save 物料尺寸保存
    return instance.post('/Api/MaterialSize/Save', data);
  },
  getMaterialSizeRemove(id) { // DELETE /Api/MaterialSize/Remove 物料尺寸删除
    return instance.delete(`/Api/MaterialSize/Remove?id=${id}`);
  },
  /* 物料类型api
  ----------------------------------------------------------------------------------- */
  getMaterialTypeList() { // GET /Api/MaterialType/List  获取物料类型列表 [销售端]
    return instance.get('/Api/MaterialType/List');
  },
  getMaterialTypeSave(data) { // POST /Api/MaterialType/Save  物料类型保存
    return instance.post('/Api/MaterialType/Save', data);
  },
  getMaterialTypeRemove(id) { // DELETE /Api/MaterialType/Remove 物料类型删除
    return instance.delete(`/Api/MaterialType/Remove?id=${id}`);
  },
  getMaterialTypeElementUnionShowSetup(data) { // POST /Api/MaterialType/ElementUnionShowSetup 设置物料类型元素组合显示
    return instance.post('/Api/MaterialType/ElementUnionShowSetup', data);
  },
  /* 物料列表api
  ----------------------------------------------------------------------------------- */
  getMaterialList(params: {type?: number, page?: number, pageSize?: number, typeID?: string } = {}) { // GET /Api/Material/List type为物料类型   获取物料列表 [销售端]  typeID： 物料分类id
    return instance.get('/Api/Material/List', { params });
  },
  getMaterialSave(data) { // POST /Api/Material/Save  物料保存
    return instance.post('/Api/Material/Save', data);
  },
  getMaterialRemove(id) { // DELETE /Api/Material/Remove 物料删除
    return instance.delete(`/Api/Material/Remove?id=${id}`);
  },
  /* 计算公式相关api
  ----------------------------------------------------------------------------------- */
  getFormulaPropertyList(data) { // post /Api/Property/List  获取公式属性列表
    return instance.post('/Api/Property/List', data);
  },
  getFormulaSave(data) { // POST /Api/Formula/Save 公式保存
    return instance.post('/Api/Formula/Save', data);
  },
  getFormulaCalculate(data) { // POST /Api/Formula/Calculate 公式测试计算
    return instance.post('/Api/Formula/Calculate', data);
  },
  getFormulaList(data) { // POST /Api/Formula/List 获取公式列表
    return instance.post('/Api/Formula/List', data);
  },
  getFormulaRemove(id) { // DELETE /Api/Formula/Remove    公式删除
    return instance.delete(`/Api/Formula/Remove?id=${id}`);
  },
  getFormulaFilterSave(data) { // POST /Api/Formula/FilterSave 子公式筛选条件保存
    return instance.post('/Api/Formula/FilterSave', data);
  },
  /* 二级分类列表api
  ----------------------------------------------------------------------------------- */
  getClassSave(data) { // POST /Api/Class/Save  多级分类保存
    return instance.post('/Api/Class/Save', data);
  },
  getClassOrder(data) { // POST /Api/Class/Order  多级分类排序
    return instance.post('/Api/Class/Order', data);
  },
  /* 工艺相关api
  ----------------------------------------------------------------------------------- */
  getCraftSave(data) { // POST /Api/Craft/Save 工艺保存
    return instance.post('/Api/Craft/Save', data);
  },
  getCraftListData(data) { // POST /Api/Craft/List  获取工艺列表
    return instance.post('/Api/Craft/List', data);
  },
  getCraftRemove(id) { // DELETE /Api/Craft/Remove 工艺删除
    return instance.delete(`/Api/Craft/Remove?id=${id}`);
  },
  /* 客户相关api
  ----------------------------------------------------------------------------------- */
  getCustomerFundBalance(customerID, config = {}) { // get /Api/Customer/FundBalance 获取客户余额信息
    return instance.get('/Api/Customer/FundBalance', { ...config, params: { customerID } });
  },
  getCustomerBalance(customerID, config = {}) { // get 获取余额及印豆余额  /Api/Customer/Balance
    return instance.get('/Api/Customer/Balance', { ...config, params: { customerID } });
  },
  getCustomerRecharge(data) { // POST /Api/Customer/Recharge  客户充值
    return instance.post('/Api/Customer/Recharge', data);
  },
  /* 文件批量上传api
  ----------------------------------------------------------------------------------- */
  getExpressValidList(data) { // POST /Api/Express/ValidList 查询可用物流列表
    return instance.post('/Api/Express/ValidList', data, { loading: false });
  },
  getExpressUseableCompanyList(data) { // POST /Api/Express/UseableCompanyList  获取可用快递和物流公司列表
    return instance.post('/Api/Express/UseableCompanyList', data, { loading: false });
  },
  getExpressTip() { // POST /Api/Express/Tip  获取物流公司可用快递
    return instance.get('/Api/Express/Tip');
  },
  getAddressIDList(data) { // 查询地址ID
    return instance.get(`/Api/District/List?parentID=${data}`, { loading: false });
  },
  getAnalysisOutPlateNo(outPlateNo) { // 解析电商平台单号收件人信息   GET /Api/Analysis/OutPlateNo
    return instance.get('/Api/Analysis/OutPlateNo', { params: { outPlateNo } });
  },
  getFileNameAnalysis(data) { // POST /Api/FileName/Analysis 文件名解析
    return instance.post('/Api/FileName/Analysis', data, { loading: false, closeTip: true });
  },
  getFileSuffixList() { // /Api/File/SuffixList 获取批量上传支持的文件格式
    return instance.get('/Api/File/SuffixList');
  },
  getOrderCreate(data) { // POST /Api/Order/Create 提交下单
    return instance.post('/Api/Order/Create', data, { loading: false });
  },
  getFreightCalculate(data) { // POST /Api/Freight/Calculate 有效地址或配送方式发生变化时重新计算解析条目的运费价格
    return instance.post('/Api/Freight/Calculate', data, { loading: false, closeTip: true });
  },
  getOrderPreCreate(data) { // POST /Api/Order/PreCreate  直接下单 - 预下单
    const { closeTip } = data;
    return instance.post('/Api/Order/PreCreate', data, { closeTip });
  },
  /* 新工期管理api
  ----------------------------------------------------------------------------------- */
  // 1. 付款时间管理
  getPayTimeSave(data) { // POST /Api/PayTime/Save  付款时间保存
    return instance.post('/Api/PayTime/Save', data);
  },
  getPayTimeList(data) { // POST /Api/PayTime/List  付款时间列表
    return instance.post('/Api/PayTime/List', data);
  },
  getPayTimeRemove(id) { // DELETE /Api/PayTime/Remove  付款时间删除
    return instance.delete('/Api/PayTime/Remove', { params: { id } });
  },
  getPayTimeDetail(id) { // GET /Api/PayTime/Detail 付款时间详情
    return instance.get('/Api/PayTime/Detail', { params: { id } });
  },
  // 2. 生产工期设置
  getWorkPeriodProducePeriodList(typeID) { // GET /Api/WorkPeriod/ProducePeriodList  获取生产工期列表
    return instance.get('/Api/WorkPeriod/ProducePeriodList', { params: { typeID } });
  },
  getWorkPeriodProducePeriodSave(data) { // POST /Api/WorkPeriod/ProducePeriodSave  工期组成保存
    return instance.post('/Api/WorkPeriod/ProducePeriodSave', data);
  },
  getWorkPeriodProducePeriodRemove(id) { // DELETE /Api/WorkPeriod/ProducePeriodRemove  工期组成删除
    return instance.delete('/Api/WorkPeriod/ProducePeriodRemove', { params: { id } });
  },
  // 3. 发货班次管理
  getShiftTimeSave(data) { // POST /Api/ShiftTime/Save 发货班次保存
    return instance.post('/Api/ShiftTime/Save', data);
  },
  getShiftTimeList(data) { // POST /Api/ShiftTime/List  发货班次列表
    return instance.post('/Api/ShiftTime/List', data);
  },
  getShiftTimeRemove(id) { // DELETE /Api/ShiftTime/Remove  发货班次删除
    return instance.delete('/Api/ShiftTime/Remove', { params: { id } });
  },
  getShiftTimeDetail(id) { // GET /Api/ShiftTime/Detail  发货班次详情
    return instance.get('/Api/ShiftTime/Detail', { params: { id } });
  },
  // 4. 派件时间管理
  getDispatchTimeSave(data) { // POST /Api/DispatchTime/Save  派件时间保存
    return instance.post('/Api/DispatchTime/Save', data);
  },
  getDispatchTimeList(data) { // POST /Api/DispatchTime/List  派件时间列表
    return instance.post('/Api/DispatchTime/List', data);
  },
  getDispatchTimeRemove(id) { // DELETE /Api/DispatchTime/Remove  派件时间删除
    return instance.delete('/Api/DispatchTime/Remove', { params: { id } });
  },
  getDispatchTimeDetail(id) { // GET /Api/DispatchTime/Detail  派件时间详情
    return instance.get('/Api/DispatchTime/Detail', { params: { id } });
  },
  // 5. 添加节假日管理
  getRestDaySave(data) { // POST /Api/RestDay/Save  节假日保存
    return instance.post('/Api/RestDay/Save', data);
  },
  getRestDayDetailByID(id) { // GET /Api/RestDay/DetailByID  节假日详情
    return instance.get('/Api/RestDay/DetailByID', { params: { id }, loading: false });
  },
  getRestDayDetailByMonth(yearMonth) { // GET GET /Api/RestDay/DetailByMonth  节假日详情2  非编辑时 切换年份月份时使用
    return instance.get('/Api/RestDay/DetailByMonth', { params: { yearMonth }, loading: false });
  },
  getRestDayRemove(id) { // DELETE /Api/RestDay/Remove  节假日删除
    return instance.delete('/Api/RestDay/Remove', { params: { id } });
  },
  getRestDayList(data) { // POST /Api/RestDay/List  节假日列表
    return instance.post('/Api/RestDay/List', data);
  },
  // 6. 运输特殊情况管理
  getSpecialDaySave(data) { // POST /Api/TransportSpecialDay/Save  特殊日期保存
    return instance.post('/Api/TransportSpecialDay/Save', data);
  },
  getSpecialDayList(data) { // POST /Api/TransportSpecialDay/List  特殊日期列表
    return instance.post('/Api/TransportSpecialDay/List', data);
  },
  getSpecialDayRemove(id) { // DELETE /Api/TransportSpecialDay/Remove  特殊日期删除
    return instance.delete('/Api/TransportSpecialDay/Remove', { params: { id } });
  },
  getSpecialDayDetail(id) { // GET /Api/TransportSpecialDay/Detail  特殊日期详情
    return instance.get('/Api/TransportSpecialDay/Detail', { params: { id } });
  },
  // 7. 生产特殊情况管理
  getProduceSpecialDaySave(data) { // POST /Api/ProduceSpecialDay/Save  生产特殊日期保存
    return instance.post('/Api/ProduceSpecialDay/Save', data);
  },
  getProduceSpecialDayList(data) { // POST /Api/ProduceSpecialDay/List  生产特殊日期列表
    return instance.post('/Api/ProduceSpecialDay/List', data);
  },
  getProduceSpecialDayRemove(id) { // DELETE /Api/ProduceSpecialDay/Remove  生产特殊日期删除
    return instance.delete('/Api/ProduceSpecialDay/Remove', { params: { id } });
  },
  getProduceSpecialDayDetail(id) { // GET /Api/ProduceSpecialDay/Detail  生产特殊日期详情
    return instance.get('/Api/ProduceSpecialDay/Detail', { params: { id } });
  },
  // 8. 新工期特殊情况
  getPeriodSpecialSituationSave(data) { // POST /Api/PeriodSpecialSituation/Save  工期特殊情况保存
    return instance.post('/Api/PeriodSpecialSituation/Save', data);
  },
  getPeriodSpecialSituationList(data) { // POST /Api/PeriodSpecialSituation/List 工期特殊情况列表 Page PageSize
    return instance.post('/Api/PeriodSpecialSituation/List', data);
  },
  getPeriodSpecialSituationLogList(data) { // POST /Api/PeriodSpecialSituationLog/List   工期特殊情况 - 操作记录列表  LogType：3为删除记录  4为操作记录  SituationID（操作记录需要传）  分页
    return instance.post('/Api/PeriodSpecialSituationLog/List', data);
  },
  // getPeriodSpecialSituationDetail(id) { // GET /Api/PeriodSpecialSituation/Detail   工期特殊情况详情
  //   return instance.get('/Api/PeriodSpecialSituation/Detail', { params: { id } });
  // },
  getPeriodSpecialSituationRemove(id) { // DELETE /Api/PeriodSpecialSituation/Remove   工期特殊情况删除
    return instance.delete('/Api/PeriodSpecialSituation/Remove', { params: { id } });
  },
  /* 企业管理api
  ----------------------------------------------------------------------------------- */
  getJobPermissionsList() { // 获取岗位管理权限数据列表
    return instance.post('/Api/Constant/VersionValid', { key: 82, value: -1 });
  },
  getJobPermissionsDetail(PositionID) { // POST /Api/Job/Info  PositionID=a77203ba-c769-4fdd-9220-aa2400b3b8f1  获取岗位权限详情 POST /Api/Job/Save
    return instance.post('/Api/Job/Info', { PositionID });
  },
  getJobSave(data) { // POST /Api/Job/Save  岗位保存
    return instance.post('/Api/Job/Save', data);
  },
  getRosterDataList() { // POST /Api/Roster/List  获取花名列表
    return instance.post('/Api/Roster/List');
  },
  getRosterCanUseDataList() { // POST /Api/Roster/List  获取能用花名列表
    return instance.post('/Api/Roster/CanUseList');
  },
  getRosterDataSave(data) { // POST /Api/Roster/Save  花名保存
    return instance.post('/Api/Roster/Save', data);
  },
  getRosterDataRemove(id) { // POST /Api/Roster/Remove  花名删除
    return instance.post(`/Api/Roster/Remove?id=${id}`);
  },
  getJobPermissionSave(data) { // POST /Api/JobPermission/Save 岗位权限保存
    return instance.post('/Api/JobPermission/Save', data);
  },
  getStaffList(data) { // 获取员工信息列表
    return instance.post('/Api/Staff/List', data);
  },
  getStaffBaseInfoSave(data) { // /Api/StaffBaseInfo/Save 保存员工信息
    return instance.post('/Api/StaffBaseInfo/Save', data);
  },
  getStaffRemove(staffID) { // delete /Api/Staff/Remove 员工删除
    return instance.delete('/Api/Staff/Remove', { params: { staffID } });
  },
  getStaffChangeStatus(data) { // PUT /Api/Staff/ChangeStatus  员工离职|取消离职
    return instance.put('/Api/Staff/ChangeStatus', data);
  },
  getCheckStaffPassed(data) { // POST /Api/CheckStaff/Passed  审核员工或修改员工岗位部门信息
    return instance.post('/Api/CheckStaff/Passed', data);
  },
  getDepartmentList() { //  获取部门列表数据
    return instance.post('/Api/Constant/VersionValid', { key: 81, Value: -1 });
  },
  getDepartmentSave(data) { //  部门保存
    return instance.post('/Api/Department/Save', data);
  },
  getDepartmentOrder(data) { //  部门排序保存
    return instance.post('/Api/Department/Order', data);
  },
  getIntranetContent() { // /Api/Intranet  获取当前内网IP数据
    return instance.get('/Api/Intranet');
  },
  getIntranetSetup(data) { // /Api/Intranet/Setup  设置网络访问IP { Content: '' }
    return instance.post('/Api/Intranet/Setup', data);
  },

  /* 客户管理api
  ----------------------------------------------------------------------------------- */
  getCustomerList(data, config) { // POST /Api/Customer/List   优惠券使用列表中获取绑定客户信息 // POST /Api/Customer/List  获取客户列表  列表FieldType传2  详情传3 + ID
    return instance.post('/Api/Customer/List', data, config);
  },
  // getScopeArrayDataList() { // 获取主营产品原始数据列表 --- 和获取客户产品分类结果相同
  //   return instance.post('/Api/Constant/VersionValid', { key: 2, Value: -1 });
  // },
  getCustomerCreate(data) { // POST  /Api/Customer/Create  客户信息保存
    return instance.post('/Api/Customer/Create', data);
  },
  getCustomerList2Excel(data) { // POST /Api/CustomerList/Excel
    return instance.post('/Api/CustomerList/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },
  getCustomerRemove(customerID) { // DELETE /Api/Customer/Remove  customerID  删除客户
    return instance.delete('/Api/Customer/Remove', { params: { customerID } });
  },
  getCustomerChangeStatus(data) { // Post /Api/Customer/ChangeStatus  修改用户状态 ：  冻结及解冻
    return instance.post('/Api/Customer/ChangeStatus', data);
  },
  getManualRecharge(data) { // POST /Api/Manual/Recharge  手动充值|扣款
    return instance.post('/Api/Manual/Recharge', data);
  },
  getCustomerSetPrice(data) { // POST  /Api/Customer/SetPrice  设置单独定价的客户的价格
    return instance.post('/Api/Customer/SetPrice', data);
  },
  getThirdPartyShopList() { // GET /Api/ThirdParty/ShopList 获取第三方店铺列表 用于关联店铺
    return instance.get('/Api/ThirdParty/ShopList');
  },
  getCustomerShopSetup(customerID, shopID) { // PUT /Api/Customer/ShopSetup  设置客户关联店铺
    return instance.put('/Api/Customer/ShopSetup', null, { params: { customerID, shopID } });
  },
  getCustomerCategoryList() { // POST /Api/Category/List 客户设置 - 获取客户设置列表数据
    return instance.post('/Api/Category/List', {});
  },
  getPriceGradeSaveRange(data) { // POST  /Api/PriceGrade/SaveRange  客户设置 - 保存价格等级
    return instance.post('/Api/PriceGrade/SaveRange', data);
  },
  getCustomerCategorySave(data) { // POST /Api/Customer/Category/Save  客户设置 - 编辑|新增客户分类
    return instance.post('/Api/Customer/Category/Save', data);
  },
  getCustomerCategoryRemove(categoryID, type) { // DELETE /Api/Customer/Category/Remove?categoryID=13&type=1  客户设置 - 客户分类删除
    return instance.delete('/Api/Customer/Category/Remove', { params: { categoryID, type } });
  },
  getPermissionList() { // 客户设置 - 功能分类权限
    return instance.get('/Api/Customer/Feature/Permission');
  },
  getPermissionSetting(data) { // 客户设置 - 设置客户功能分类权限
    return instance.post('/Api/Customer/Category/SetPermission', data);
  },
  /* 价格策略api
  ----------------------------------------------------------------------------------- */
  getCustomerPricePolicy(data) { // POST /Api/CustomerPricePolicy 获取价格策略价格列表
    return instance.post('/Api/CustomerPricePolicy', data);
  },
  getPricePolicyCoverage(data) { // POST /Api/PricePolicy/Coverage 获取价格策略生效日期列表数据
    return instance.post('/Api/PricePolicy/Coverage', data);
  },
  getCustomerPricePolicySetup(data) { // POST /Api/CustomerPricePolicy/Setup 保存价格策略
    return instance.post('/Api/CustomerPricePolicy/Setup', data);
  },
  /* 印豆管理api
  ----------------------------------------------------------------------------------- */
  getPrintBeanList(data) { // POST /Api/PrintBean/List   获取印豆列表数据
    return instance.post('/Api/PrintBean/List', data);
  },
  getPrintBeanSave(data) { // POST /Api/PrintBean/Save  印豆编辑保存
    return instance.post('/Api/PrintBean/Save', data);
  },
  getPrintBeanRemove(id) { // DELETE /Api/PrintBean/Remove  印豆删除
    return instance.delete('/Api/PrintBean/Remove', { params: { id } });
  },

  /* 消费返现api
  ----------------------------------------------------------------------------------- */
  getConsumeReturnCashList(data) { // POST /Api/ConsumeReturnCash/List  获取消费返现列表
    return instance.post('/Api/ConsumeReturnCash/List', data);
  },
  getConsumeReturnCashDetail(id) { // GET /Api/ConsumeReturnCash/Detail 消费返现详情
    return instance.get('/Api/ConsumeReturnCash/Detail', { params: { id } });
  },
  getConsumeReturnCashSave(data) { // POST /Api/ConsumeReturnCash/Save  消费返现编辑保存
    return instance.post('/Api/ConsumeReturnCash/Save', data);
  },
  getConsumeReturnCashRemove(id) { // DELETE /Api/ConsumeReturnCash/Remove  消费返现删除
    return instance.delete('/Api/ConsumeReturnCash/Remove', { params: { id } });
  },

  /* 物流费用api
  ----------------------------------------------------------------------------------- */
  getLogisticsList() { // GET /Api/Logistics/List   物流快递列表
    return instance.get('/Api/Logistics/List');
  },
  getLogisticsSave(data) { // POST /Api/Logistics/Save  物流快递保存
    return instance.post('/Api/Logistics/Save', data);
  },
  getLogisticsRemove(id) { // DELETE /Api/Logistics/Remove  物流快递删除
    return instance.delete('/Api/Logistics/Remove', { params: { id } });
  },
  /**
   * 物流快递排序
   *
   * @param {*} ids 物流快递ID列表
   * @returns
   */
  getLogisticsSetOrder(ids) { // POST /Api/Logistics/SetOrder 物流快递排序
    return instance.post('/Api/Logistics/SetOrder', ids);
  },
  getThirdPlatExpressList() { // GET /Api/ThirdPlat/Express/List  获取第三方物流快递列表
    return instance.get('/Api/ThirdPlat/Express/List');
  },
  getExpressProductList() { // GET /Api/ExpressPrint/Product  获取快印仓快递产品列表
    return instance.get('/Api/ExpressPrint/Product');
  },
  /**
   * 关联第三方快递
   *
   * @param {*} id 物流快递ID
   * @param {*} type 第三方平台类型
   * @param {*} thirdID 第三方快递ID
   * @returns
   */
  // getLogisticsBindExpress(data) { // POST /Api/Logistics/BindExpress  关联第三方快递
  //   return instance.post('/Api/Logistics/BindExpress', data);
  // },
  getLogisticsBindExpressPrint(data) { // POST /Api/Logistics/BindExpressPrint  关联第三方快递(快印仓)
    return instance.post('/Api/Logistics/BindExpressPrint', data);
  },
  getLogisticsBindStation(data) { // POST /Api/Logistics/BindStation  关联网点 -- 参数同保存参数 RelationList
    return instance.post('/Api/Logistics/BindStation', data);
  },

  /* 审稿管理 api
  ----------------------------------------------------------------------------------- */
  // -------------人员分组相关
  getMemberGroupSave(data) { // POST /Api/MemberGroup/Save 人员分组保存
    return instance.post('/Api/MemberGroup/Save', data);
  },
  getMemberGroupList() { // GET /Api/MemberGroup/List  人员分组列表
    return instance.get('/Api/MemberGroup/List');
  },
  getMemberGroupRemove(id) { // DELETE /Api/MemberGroup/Remove  人员分组删除
    return instance.delete('/Api/MemberGroup/Remove', { params: { id } });
  },
  getForcedExitList(data) { // GET /Api/ForcedExit/List   获取强退列表信息
    return instance.post('/Api/ForcedExit/List', data);
  },
  getForcedExitChangeRemark(id, remark) { // PUT /Api/ForcedExit/ChangeRemark  修改强退备注
    return instance.put('/Api/ForcedExit/ChangeRemark', null, { params: { id, remark } });
  },
  getMemberGroupMemberList(id) { // GET /Api/MemberGroup/MemberList  获取人员分组中审稿人员列表
    return instance.get('/Api/MemberGroup/MemberList', { params: { id } });
  },
  getMemberGroupAddMember(data) { // POST /Api/MemberGroup/AddMember  人员分组添加成员
    return instance.post('/Api/MemberGroup/AddMember', data);
  },
  getMemberGroupRemoveMember(groupID, staffID) { // DELETE /Api/MemberGroup/RemoveMember  人员分组删除成员
    return instance.delete('/Api/MemberGroup/RemoveMember', { params: { groupID, staffID } });
  },
  // -------------审稿设置相关
  getCheckFileProductList(condition) { // POST /Api/CheckFile/ProductList   获取审稿设置产品列表
    return instance.post('/Api/CheckFile/ProductList', condition);
  },
  getDefaultProcessSetup(data) { // POST /Api/DefaultProcess/Setup   默认流程设置
    return instance.post('/Api/DefaultProcess/Setup', data);
  },
  getCheckFileDefaultProcess() { // GET /Api/CheckFile/DefaultProcess   获取审稿设置默认流程
    return instance.get('/Api/CheckFile/DefaultProcess');
  },
  getOutputFileSave(data) { // POST /Api/OutputFile/Save  输出文件保存
    return instance.post('/Api/OutputFile/Save', data);
  },
  // getOutputFileList() { // GET /Api/OutputFile/List  获取输出文件列表
  //   return instance.get('/Api/OutputFile/List');
  // },
  getOutputFileRemove(id) { // DELETE /Api/OutputFile/Remove   输出文件删除
    return instance.delete('/Api/OutputFile/Remove', { params: { id } });
  },
  getCheckFilePartSave(data) { // POST /Api/CheckFile/PartSave    部件保存
    return instance.post('/Api/CheckFile/PartSave', data);
  },
  getCheckFileSetupList(type, productID, partID) { // GET /Api/CheckFile/SetupList   获取审稿设置列表
    return instance.get('/Api/CheckFile/SetupList', { params: { type, productID, partID } });
  },
  getCheckFileOtherSetup(data) { // POST /Api/CheckFile/OtherSetup  审稿时填写名称是否必须设置
    return instance.post('/Api/CheckFile/OtherSetup', data);
  },
  getCheckFilePrintSideSetup(data) { // POST /Api/CheckFile/PrintSideSetup   印面设置
    return instance.post('/Api/CheckFile/PrintSideSetup', data);
  },
  getCheckFileDefaultPrintColorSetup(data) { // POST /Api/CheckFile/DefaultPrintColorSetup   默认印色设置
    return instance.post('/Api/CheckFile/DefaultPrintColorSetup', data);
  },
  getCheckFilePrintColorSetup(data) { // POST /Api/CheckFile/PrintColorSetup  印色设置
    return instance.post('/Api/CheckFile/PrintColorSetup', data);
  },
  getCheckFilePrintColorRemove(id) { // DELETE /Api/CheckFile/PrintColorRemove   删除印色设置条目
    return instance.delete('/Api/CheckFile/PrintColorRemove', { params: { id } });
  },
  getCheckFileSetupSave(data) { // POST /Api/CheckFile/SetupSave   审稿设置保存
    return instance.post('/Api/CheckFile/SetupSave', data);
  },
  getCheckFileSetupRemove(id) { // DELETE /Api/CheckFile/SetupRemove  审稿设置删除
    return instance.delete('/Api/CheckFile/SetupRemove', { params: { id } });
  },
  getDistributionStrategyList(condition) { // POST /Api/DistributionStrategy/List   获取分配策略信息列表
    return instance.post('/Api/DistributionStrategy/List', condition);
  },
  getDefaultDistrubutionSetup(groupID) { // PUT /Api/DefaultDistrubution/Setup   默认审稿分配组
    return instance.put('/Api/DefaultDistrubution/Setup', null, { params: { groupID } });
  },
  getDistributionStrategySave(data) { // POST /Api/DistributionStrategy/Save   分配策略信息保存
    return instance.post('/Api/DistributionStrategy/Save', data);
  },
  getDistributionStrategyRemove(id) { // DELETE /Api/DistributionStrategy/Remove   分配策略信息删除
    return instance.delete('/Api/DistributionStrategy/Remove', { params: { id } });
  },
  getCheckFileStatistics(condition) { // POST /Api/CheckFile/Statistics   审稿统计
    return instance.post('/Api/CheckFile/Statistics', condition);
  },
  getCheckFileStatisticsExcel(data) { // POST /Api/CheckFile/Statistics/Excel   审稿统计导出
    return instance.post('/Api/CheckFile/Statistics/Excel', data, { responseType: 'arraybuffer', closeTip: true });
  },
  /* 转换服务器 api
  ----------------------------------------------------------------------------------- */
  getConvertList(id) { // GET /Api/Convert/List    获取转换器列表
    return instance.get('/Api/Convert/List', { params: { id } });
  },
  /* 手动外购 api
  ----------------------------------------------------------------------------------- */
  getOutOrderList(condition) { // POST /Api/OutOrder/List   外购订单列表
    return instance.post('/Api/OutOrder/List', condition);
  },
  /** /Api/Factory/Order/OrderExcel 导出表格 */
  getFactoryOrderOrderExcel(condition) {
    return instance.post('/Api/Factory/Order/OrderExcel', condition, { closeTip: true, responseType: 'arraybuffer' });
  },
  getOutOrderChangeFactory(data) { // POST /Api/OutOrder/ChangeFactory    修改外购工厂
    return instance.post('/Api/OutOrder/ChangeFactory', data);
  },
  getOutOrderChangePrice(orderID, price) { // PUT /Api/OutOrder/ChangePrice   修改订单价格
    return instance.put('/Api/OutOrder/ChangePrice', null, { params: { orderID, price }, closeTip: true });
  },
  getOutOrderProgress(orderID) { // GET /Api/OutOrder/Progress   外购订单状态
    return instance.get('/Api/OutOrder/Progress', { params: { orderID } });
  },
  getOutOrderComfirm(data) { // POST /Api/OutOrder/Comfirm  确认外购
    return instance.post('/Api/OutOrder/Comfirm', data);
  },
  getOutOrderReceive(data) { // POST /Api/OutOrder/Receive  确认接单
    return instance.post('/Api/OutOrder/Receive', data);
  },
  getOutOrderComfirmCancle(data) { // POST /Api/OutOrder/ComfirmCancle  取消外购
    return instance.post('/Api/OutOrder/ComfirmCancle', data);
  },
  /** 文件下载 */
  getOutOrderDownload(data: object) { // POST /Api/OutOrder/Download  手动外购下载
    return instance.post('/Api/OutOrder/Download', data);
  },
  /* 发票管理 api
  ----------------------------------------------------------------------------------- */
  // ----- 发票类别管理 ↓
  getInvoiceCategoryList(condition) { // POST /Api/InvoiceCategory/List   获取发票分类列表
    return instance.post('/Api/InvoiceCategory/List', condition);
  },
  getInvoiceCategorySave(data) { // POST /Api/InvoiceCategory/Save   发票分类保存
    return instance.post('/Api/InvoiceCategory/Save', data);
  },
  getInvoiceCategoryRemove(categoryID) { // DELETE /Api/InvoiceCategory/Remove  发票分类删除
    return instance.delete('/Api/InvoiceCategory/Remove', { params: { categoryID } });
  },
  // ----- 发票资质管理 ↓
  getInvoiceEnterpriseList(condition) { // POST /Api/InvoiceEnterprise/List    获取发票资质列表
    return instance.post('/Api/InvoiceEnterprise/List', condition);
  },
  getInvoiceEnterpriseSave(data) { // POST /Api/InvoiceEnterprise/Save    发票资质保存
    return instance.post('/Api/InvoiceEnterprise/Save', data);
  },
  // ----- 发票开具管理 ↓
  getInvoiceManageList(condition) { // POST /Api/InvoiceManage/List    发票开具管理列表
    return instance.post('/Api/InvoiceManage/List', condition);
  },
  getInvoiceManageExportExcel(condition) { // POST /Api/InvoiceManage/ExportExcel   发票开具列表导出Excel
    return instance.post('/Api/InvoiceManage/ExportExcel', condition, { responseType: 'arraybuffer', closeTip: true });
  },
  getInvoiceManageMakeUpInfo(invoiceID) { // GET /Api/InvoiceManage/MakeUpInfo  获取发票开票信息
    return instance.get('/Api/InvoiceManage/MakeUpInfo', { params: { invoiceID } });
  },
  getInvoiceManageHandleDetail(invoiceID) { // GET /Api/InvoiceManage/HandleDetail  获取发票开具详情  GET /Api/InvoiceManage/InvoiceInfo
    return instance.get('/Api/InvoiceManage/InvoiceInfo', { params: { invoiceID } });
  },
  getInvoiceManagePass(invoiceID) { // GET /Api/InvoiceManage/Pass  审核通过
    return instance.get('/Api/InvoiceManage/Pass', { params: { invoiceID } });
  },
  getInvoiceManageReject(data) { // POST /Api/InvoiceManage/Reject  驳回
    return instance.post('/Api/InvoiceManage/Reject', data);
  },
  getInvoiceManageCancel(data) { // POST /Api/InvoiceManage/Cancel  取消
    return instance.post('/Api/InvoiceManage/Cancel', data);
  },
  getInvoiceManageComplete(invoiceIDS) { // GET /Api/InvoiceManage/Complete  开具完成
    return instance.post('/Api/InvoiceManage/Complete', invoiceIDS);
  },
  getInvoiceManagePost(data) { // POST /Api/InvoiceManage/Post  邮寄
    return instance.post('/Api/InvoiceManage/Post', data);
  },
  // ---------------企业认证api
  getChangeAuthStatus(data) { // POST /Api/Company/Authentication/ChangeAuthStatus  企业认证审核
    return instance.post('/Api/Company/Authentication/ChangeAuthStatus', data);
  },
  getAuthenticationEdit(data) { // POST /Api/Company/Authentication/Edit  企业认证编辑
    return instance.post('/Api/Company/Authentication/Edit', data);
  },

  // /Api/Heartbeat
  getHeartbeat() {
    return instance.get('/Api/Heartbeat', { loading: false });
  },
  /* 销售端 & 生产端
  ------------------------------- */
  // getServerList(type?: ServerTypeEnum) { // GET /Api/Server/List  获取服务器列表
  //   return instance.get('/Api/Server/List', { params: { type } });
  // },
  // getServerSave(data: Partial<SaleAndProductionListItemPlainType>) { // POST /Api/Server/Save  服务器(销售端/生产端)信息保存
  //   return instance.post<string>('/Api/Server/Save', data);
  // },
  // getServerRemove(id: number) { // DELETE /Api/Server/Remove   服务器(销售端/生产端)信息删除
  //   return instance.delete('/Api/Server/Remove', { params: { id } });
  // },
  getServerGenerateSecretKey(id: string) { // PUT /Api/Server/GenerateSecretKey  服务器生成密钥
    return instance.put('/Api/Server/GenerateSecretKey', null, { params: { id } });
  },
  getLogList(data: GetLogOptions) { // POST /Api/Log/List   获取操作日志列表
    return instance.post('/Api/Log/List', data, { loading: false });
  },
  getConvertServerList() { // post /Api/ConvertServer/List  获取转换服务器列表
    return instance.post('/Api/ConvertServer/List');
  },
  getConvertServerSave(data: Partial<SaleAndProductionListItemPlainType>) { // POST /Api/ConvertServer/Save   转换器信息保存
    return instance.post('/Api/ConvertServer/Save', data);
  },
  getConvertServerRemove(id: string) { // DELETE /Api/ConvertServer/Remove   转换服务器信息删除
    return instance.delete('/Api/ConvertServer/Remove', { params: { id } });
  },
  getConvertServerNotifyReceiveSetup(data: Partial<SaleAndProductionListItemPlainType>) { // POST /Api/ConvertServer/NotifyReceiveSetup  转换器转换失败通知设置
    return instance.post('/Api/ConvertServer/NotifyReceiveSetup', data);
  },
  /* 转换异常订单列表
  ------------------------------- */
  getConvertExceptionOrderList(data) { // POST /Api/ConvertException/List  排程异常列表
    return instance.post('/Api/ConvertException/List', data);
  },
  // POST /Api/ConvertException/Deal  订单转换异常处理
  getConvertExceptionDeal(List: number[]) {
    return instance.post('/Api/ConvertException/Deal', { List });
  },
  /* 转换设置
  ------------------------------- */
  getFactoryIsConnect(serverID: string) { //  GET /Api/Factory/IsConnect   是否成功链接
    return instance.get('/Api/Factory/IsConnect', { params: { serverID } });
  },
  // getProductClassList(serverID: string) { // GET /Api/ProductClass/List   获取产品分类列表
  //   return instance.get('/Api/ProductClass/List', { params: { serverID } });
  // },
  getConvertServerProductList(data: Partial<TransformerListConditionClass>) { // POST /Api/ConvertServer/Product/List   获取产品列表
    return instance.post('/Api/ConvertServer/Product/List', data);
  },
  getConvertServerPartSave(data: IPartChangeParams) { // POST /Api/ConvertServer/PartSave  部件保存
    return instance.post('/Api/ConvertServer/PartSave', data);
  },
  // GET /Api/OutputFile/List 获取输出文件列表 [审稿端]
  getOutputFileList({ onlyShowPdf, onlyShowMakeupUsed, includeUseTimes }: { onlyShowPdf?:boolean, onlyShowMakeupUsed?:boolean, includeUseTimes?: boolean } = {}) {
    return instance.get('/Api/OutputFile/List', { params: { onlyShowPdf, onlyShowMakeupUsed, includeUseTimes: includeUseTimes !== false } });
  },
  getAssistantInfoList(serverID: string, type: AssistInfoTypeEnum) { // GET /Api/AssistantInfo/List   获取文件辅助信息列表 [生产端]
    return instance.get('/Api/AssistantInfo/List', { params: { serverID, type } });
  },
  getAssistMappingList(data: IAssistMapParams) { //  POST /Api/AssistMapping/List   获取辅助映射列表 [辅助映射列表]
    return instance.post('/Api/AssistMapping/List', data);
  },
  getAssistMappingSave(data: Partial<AssistMapItemClass>) { // POST /Api/AssistMapping/Save  辅助映射保存
    return instance.post('/Api/AssistMapping/Save', data);
  },
  getColorList(serverID: string) { // GET /Api/Color/List   获取专色列表 [生产端]
    return instance.get('/Api/Color/List', { params: { serverID } });
  },
  // getImpositionTemplateClassList(serverID: string) { // GET /Api/ImpositionTemplateClass/List   获取拼版模板分类列表 [生产端]
  //   return instance.get('/Api/ImpositionTemplateClass/List', { params: { serverID } });
  // },
  getImpositionTemplateList(serverID: string) { // GET /Api/ImpositionTemplate/List  获取拼版模板列表 [生产端]
    return instance.get('/Api/ImpositionTemplate/List', { params: { serverID } });
  },
  getFactoryMaterialTypeList(serverID: string) { // GET /Api/FactoryMaterialType/List  获取物料类型列表 [生产端]
    return instance.get<IFactoryMaterialClass[]>('/Api/FactoryMaterialType/List', { params: { serverID } });
  },
  getFactoryMaterialList(serverID: string, typeID?: string) { // GET /Api/FactoryMaterial/List   获取物料列表 [生产端]  typeID： 二级物料分类id
    return instance.get('/Api/FactoryMaterial/List', { params: { serverID, typeID } });
  },
  getSemiFinishedProductList(serverID: string) { // GET /Api/SemiFinished/List  获取半成品列表 [生产端]
    return instance.get('/Api/SemiFinished/List', { params: { serverID } });
  },
  getSemiFinishedSetup(data: ISemiFinishedSaveParams) { // PUT /Api/SemiFinished/Setup  生成半成品设置
    return instance.put('/Api/SemiFinished/Setup', data);
  },
  getSellProductProperty(serverID: string, productID: string, partID?: string) { // GET /Api/ProductProperty/List  获取产品属性列表  [销售端 - 文字信息映射]
    return instance.get('/Api/ProductProperty/List', { params: { serverID, productID, partID } });
  },
  getWorkingProcedureList(data: IGetWorkingProcedureParams) { // POST /Api/WorkingProcedure/List   获取工序列表
    return instance.post('/Api/WorkingProcedure/List', data);
  },
  getGeneralMappingList(data: IGeneralMapParams) { //  POST /Api/GeneralMapping/List 获取常规映射列表 [常规映射列表]
    return instance.post('/Api/GeneralMapping/List', data);
  },
  getGeneralMappingSave(data: Partial<GeneralMapItemClass>) { // POST /Api/GeneralMapping/Save  常规映射(生产线/组合生产线/工序/组合工序)
    return instance.post('/Api/GeneralMapping/Save', data);
  },
  getGeneralMappingRemove(serverID: string, id: string) { // DELETE /Api/GeneralMapping/Remove  常规映射删除
    return instance.delete('/Api/GeneralMapping/Remove', { params: { serverID, id } });
  },
  getPropertyList(data: IGetPropertyListParams) { // POST /Api/Property/List  获取属性列表
    return instance.post('/Api/Property/List', data);
  },
  // get /Api/GetCraftResolveList/List  获取工艺分解列表
  getGetCraftResolveList(serverID: string, productID: string) {
    return instance.get('/Api/GetCraftResolveList/List', { params: { serverID, productID } });
  },
  // post /Api/CraftResolve/Save 工艺分解保存
  getCraftResolveSave(data) {
    return instance.post('/Api/CraftResolve/Save', data);
  },
  // delete /Api/CraftResolve/Remove  工艺分解删除
  getCraftResolveRemove(serverID: string, productID: string, constraintID: string) {
    return instance.delete('/Api/CraftResolve/Remove', { params: { serverID, productID, constraintID } });
  },
  getProduceLineList(serverID: string, isUnionLine: boolean) { // GET /Api/ProduceLine/List   获取生产线列表
    return instance.get('/Api/ProduceLine/List', { params: { serverID, isUnionLine } });
  },
  getDefaultLineSetup(data: IGetDefaultLineSetupParams) { // PUT /Api/DefaultLine/Setup  设置默认生产线
    return instance.put('/Api/DefaultLine/Setup', data);
  },
  /** POST /Api/WorkingProcedure/WordAssistantList  获取工序所含文字辅助信息列表 */
  getWorkingProcedureWordAssistantList(data: IGetWorkingProcedureParams) {
    return instance.post('/Api/WorkingProcedure/WordAssistantList', data);
  },
  /** PUT /Api/Folding/Setup  设置折手 */
  getFoldingSetup(data) {
    return instance.put('/Api/Folding/Setup', data);
  },
  // getProductFormulaList(data: IGetFormulaParams) { // POST /Api/ProductFormula/List 获取公式列表  - 转换设置
  //   return instance.post('/Api/ProductFormula/List', data);
  // },
  getPackageProgress(packageID, expressID) { // GET /Api/Package/ExpressProgress 通过包裹号查询包裹配送进度
    return instance.get(`/Api/Package/ExpressProgress?packageID=${packageID}&expressID=${expressID}`, { loading: false });
  },
  // 售后问题相关
  // searchType 0责任ID,1产品ID
  getOrderAfterSaleQuestionClassList({ searchType, ID }) { // GET /Api/OrderAfterSale/QuestionClass/List 售后问题分类查询
    return instance.get(`/Api/OrderAfterSale/QuestionClass/List?searchType=${searchType}&id=${ID}`);
  },
  getOrderAfterSaleQuestionClassSave(data) { // GET //Api/OrderAfterSale/QuestionClass/Save 售后问题分类保存
    return instance.post('/Api/OrderAfterSale/QuestionClass/Save', data);
  },
  // 售后责任划分相关
  getOrderAfterSaleDivideSave(data) { // GET /Api/OrderAfterSale/Divide/Save 售后责任划分标准保存
    return instance.post('/Api/OrderAfterSale/Divide/Save', data);
  },
  getOrderAfterSaleDivideList(data) { // GET /Api/OrderAfterSale/Divide/List 售后责任划分标准查询
    return instance.post('/Api/OrderAfterSale/Divide/List', data);
  },
  getOrderAfterSaleDivideRemove(ID) { // GET /Api/OrderAfterSale/Divide/Remove 售后责任划分标准删除
    return instance.delete(`/Api/OrderAfterSale/Divide/Remove?id=${ID}`);
  },
  // 复核
  getOrderAfterSaleLossConfirmInfo(afterSaleCode) { // GET /Api/OrderAfterSale/LossConfirmInfo 复核详情
    return instance.get(`/Api/OrderAfterSale/LossConfirmInfo?afterSaleCode=${afterSaleCode}`);
  },
  getOrderAfterSaleLossConfirm(data) { // GET /Api/OrderAfterSale/LossConfirm 复核
    return instance.post('/Api/OrderAfterSale/LossConfirm', data);
  },
  // 证书审核
  getCustomerCertificateCheck(data) { // GET /Api/Customer/Certificate/Check 证书审核
    return instance.post('/Api/Customer/Certificate/Check', data);
  },
  getCustomerCertificateUnCheck() { // GET /Api/Customer/Certificate/UnCheck 未审核证书
    return instance.get('/Api/Customer/Certificate/UnCheck');
  },
  getCustomerCertificateManageList(data) { // GET /Api/Customer/Certificate/ManageList 证书管理列表
    return instance.post('/Api/Customer/Certificate/ManageList', data);
  },
  getCustomerCertificateAll(customerID: string) { // /Api/Customer/Certificate/All 获取客户证书列表
    return instance.get('/Api/Customer/Certificate/All', { params: { customerID } });
  },
  getCustomerCertificateInfo(certificateID: string) { // Api/Customer/Certificate/Info get请求 参数certificateID  获取证书信息 包括过期已拒绝等状态
    return instance.get('/Api/Customer/Certificate/Info', { params: { certificateID } });
  },
  getCustomerCertificateNoPassReason() { // GET /Api/Customer/Certificate/NoPassReason 审核不通过原因模板
    return instance.get('/Api/Customer/Certificate/NoPassReason');
  },
  /* 开发平台
  ------------------------------- */
  /** POST /Api/Developer/List  开发者列表 */
  getDeveloperList(data) {
    return instance.post('/Api/Developer/List', data);
  },
  /** PUT /Api/Developer/Checked  开发者账号审核通过 */
  getDeveloperChecked(developerID: string) {
    return instance.put('/Api/Developer/Checked', null, { params: { developerID } });
  },
  /** POST /Api/Developer/Refuse  开发者账号审核不通过 */
  getDeveloperRefuse(data: object) {
    return instance.post('/Api/Developer/Refuse', data);
  },
  /** PUT /Api/Developer/Lock   锁定/解锁开发者账号 */
  getDeveloperLock(developerID: string, isLock: boolean) {
    return instance.put('/Api/Developer/Lock', null, { params: { developerID, isLock } });
  },
  /** POST /Api/Developer/NoticeList  开发者消息列表 */
  getDeveloperNoticeList(data) {
    return instance.post('/Api/Developer/NoticeList', data);
  },
  /** POST /Api/Developer/NoticeSend  发送消息 */
  getDeveloperNoticeSend(data) {
    return instance.post('/Api/Developer/NoticeSend', data);
  },
  /** GET /Api/Developer/Find  获取开发者信息 */
  getDeveloperFind(mobile: string) {
    return instance.get('/Api/Developer/Find', { params: { mobile } });
  },
  /** DELETE /Api/Developer/NoticeRemove  删除消息 */
  getDeveloperNoticeRemove(noticeID: string) {
    return instance.delete('/Api/Developer/NoticeRemove', { params: { noticeID } });
  },
  /** POST /Api/Application/List 应用列表 */
  getApplicationList(data) {
    return instance.post('/Api/Application/List', data);
  },
  /** PUT /Api/Developer/ResetPassword  重置开发者密码 */
  getDeveloperResetPassword(developerID: string) {
    return instance.put('/Api/Developer/ResetPassword', null, { params: { developerID } });
  },
  /** post /Api/Developer/BindCustomer 绑定ip和客户 */
  getDeveloperBindCustomer(data) {
    return instance.post('/Api/Developer/BindCustomer', data);
  },
};

export default api;
