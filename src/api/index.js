/* eslint-disable max-len */
// eslint-disable-next-line import/no-cycle
import instance from '@/api/axios';

const api = {
  /* 订单列表部分api
   ------------------------------------------------------------------------------------ */
  getVersionValid(data) { // 缓存版本对比 ---  暂用于获取企业类型    POST
    return instance.post('/Api/Constant/VersionValid', data);
  },
  getExpressList(data) { // 获取配送方式
    return instance.get('/Api/Express/List', data);
  },
  getOrderList(data) { // 获取客户订单列表（后台）
    return instance.post('/Api/Order/List', data); // /Api/Customer/OrderList
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
  getOrderListData2Excel(data, type = 'normal') { // POST /Api/OrderList/Excel  ---- 财务用 [finance]   /Api/PackageList/Excel --- 普通方式 [normal]
    if (type === 'finance') {
      return instance.post('/Api/OrderList/Excel', data, { responseType: 'arraybuffer' }); // 财务
    }
    return instance.post('/Api/PackageList/Excel', data, { responseType: 'arraybuffer' }); // 普通方式
  },
  setOrderReCheckFile({ OrderID, FilePath = '' }) { // POST /Api/Order/ReCheckFile
    return instance.post('/Api/Order/ReCheckFile', { OrderID, UniqueName: FilePath });
  },
  getCalculatePriceRecordList(data) { // POST /Api/CalculatePrice/RecordList  获取报价记录
    return instance.post('/Api/CalculatePrice/RecordList', data);
  },
  getCalculatePriceRecordListExcel(data) { // POST /Api/CalculatePrice/Excel 导出报价记录Excel
    return instance.post('/Api/CalculatePrice/Excel', data, { responseType: 'arraybuffer' });
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
    return instance.get(`/Api/PaymentOrder/PayResult?payCode=${payCode}`);
  },
  // 已弃用
  // getServiceListData2Excel(data) { // POST /Api/AfterSales/Excel
  //   return instance.post('/Api/AfterSales/Excel', data, { responseType: 'arraybuffer' });
  // },
  getServicesListData2Excel(data) { // POST /Api/AfterSale/Excel
    return instance.post('/Api/AfterSale/Excel', data, { responseType: 'arraybuffer' });
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
  /* 包裹列表api
   ----------------------------------------------------------------------------------- */
  getPackageListByOrderID(orderID) { // GET /Api/Order/PackageList 通过订单号获取包裹列表
    return instance.get(`/Api/Order/PackageList?orderID=${orderID}`);
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
    return instance.get(`/Api/FileServer?Position=${Position}`);
  },
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
    return instance.get(`/Api/FileNode?uniqueName=${uniqueName}`, { baseURL });
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
    };
    return instance.post(`/Api/Upload/File?uniqueName=${uniqueName}`, formData, config);
  },
  getOrderFilePath2DownLoad(orderID) { // GET /Api/Order/GetFilePath
    return instance.get(`/Api/Order/GetFilePath?orderID=${orderID}`);
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
    return instance.post('/Api/AccountReceivable/Excel', data, { responseType: 'arraybuffer' });
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
    return instance.post('/Api/PaymentOrder/Create', data);
  },
  getPayResult(payCode, type = 11) { // GET /Api/PaymentOrder/PayResult 查询付款结果
    return instance.get('/Api/PaymentOrder/PayResult', { params: { payCode, type } });
  },
  getPaymentData2Excel(data) { // POST /Api/PaymentOrder/Excel
    return instance.post('/Api/PaymentOrder/Excel', data, { responseType: 'arraybuffer' });
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
    return instance.get(`/Api/Coupon/DownLoad?recordID=${recordID}`, { responseType: 'arraybuffer' });
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
    return instance.post('/Api/Staff/Login', data);
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
    return instance.post('/Api/CustomerBill/Excel', data, { responseType: 'arraybuffer' });
  },
  getOrderBillExcel(data) { // POST /Api/OrderBill/Excel 导出客户订单流水Excel
    return instance.post('/Api/OrderBill/Excel', data, { responseType: 'arraybuffer' });
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
  getConditionList4ProducePeriod({ Limits = [], positionID = '', type } = {}) { // GET /Api/Common/GetConditionList 获取条件列表 工期产品19 工期工艺20  Limits 产品ID | 工艺ID  positionID 二级类别ID
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
    return instance.get(`/Api/OrderAfterSale/EvaluateDetail?afterSaleCode=${afterSaleCode}`, { closeLoading: true });
  },
  /* 统计分析api
  ----------------------------------------------------------------------------------- */
  getStatisticConfigSave(data) { // POST /Api/StatisticConfig/Save 统计表保存
    return instance.post('/Api/StatisticConfig/Save', data);
  },
  getStatisticFormDataList({ Page, PageSize, Type }, closeLoading = false) { // GET /Api/StatisticsConfig/List 获取统计表列表数据
    return instance.get(`/Api/StatisticsConfig/List?page=${Page}&pageSize=${PageSize}&type=${Type}`, { closeLoading });
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
  getStatisticsSummaryList({ Page, PageSize }, closeLoading = false) { // GET /Api/StatisticsSummary/List 获取统计配置汇总列表数据
    return instance.get(`/Api/StatisticsSummary/List?page=${Page}&pageSize=${PageSize}`, { closeLoading });
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
    return instance.get('/Api/PriceTable/Export', { responseType: 'arraybuffer', params: { productID, tableID } });
  },
  /* 基础设置api
  ----------------------------------------------------------------------------------- */
  getFactoryList() { // 获取生产工厂列表
    return instance.post('/Api/Constant/VersionValid', { key: 1, Value: -1 });
  },
  getFactorySave(data) { // /Api/Factory/Save 工厂信息保存:   添加 | 编辑
    return instance.post('/Api/Factory/Save', data);
  },
  getFactoryRemove(factoryID) { // 工厂删除
    return instance.delete(`/Api/Factory/Remove?factoryID=${factoryID}`);
  },
  getFactoryProductPriceList(factoryID) { // GET /Api/Factory/ProductPrice/List 获取工厂产品价格列表
    return instance.get(`/Api/Factory/ProductPrice/List?factoryID=${factoryID}`);
  },
  getProductPriceList(productID) { // GET /Api/ProductPrice/List
    return instance.get(`/Api/ProductPrice/List?productID=${productID}`);
  },
  getFactoryProductPriceSave(data) { // POST /Api/Factory/ProductPrice/Save 工厂产品价格保存
    return instance.post('/Api/Factory/ProductPrice/Save', data);
  },
  getFactoryProductPriceRemove(ID) { // POST /Api/Factory/ProductPrice/Remove 工厂产品价格删除
    return instance.delete(`/Api/Factory/ProductPrice/Remove?id=${ID}`);
  },
  getElementSave(data) { // POST /Api/Element/Save  保存界面元素
    return instance.post('/Api/Element/Save', data);
  },
  getElementList(data = null, closeLoading = false) { // GET /Api/Element/List 获取元素列表
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
    return instance.get(`/Api/Element/List${hash}`, { closeLoading });
  },
  getElementRemove(id, module) { // DELETE /Api/Element/Remove 元素删除
    return instance.delete('/Api/Element/Remove', { params: { id, module } });
  },
  getElementGroupSave(data) { // POST /Api/ElementGroup/Save 元素组保存
    return instance.post('/Api/ElementGroup/Save', data);
  },
  getElementGroupList(positionID, closeLoading = false) { // GET /Api/ElementGroup/List 元素组列表
    if (positionID) return instance.get(`/Api/ElementGroup/List?positionID=${positionID}`, { closeLoading });
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
  getMaterialTypeList() { // GET /Api/MaterialType/List 获取物料类型列表
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
  getMaterialList(type, page = 1, pageSize = 30) { // GET /Api/Material/List  获取物料列表 type为物料类型
    let queryStr = type ? `?type=${type}&page=${page}&pageSize=${pageSize}` : `?page=${page}&pageSize=${pageSize}`;
    if (!type && !page && !pageSize) queryStr = '';
    return instance.get(`/Api/Material/List${queryStr}`);
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
    return instance.post('/Api/Express/ValidList', data, { closeLoading: true });
  },
  getExpressUseableCompanyList(data) { // POST /Api/Express/UseableCompanyList  获取可用快递和物流公司列表
    return instance.post('/Api/Express/UseableCompanyList', data, { closeLoading: true });
  },
  getAddressIDList(data) { // 查询地址ID
    return instance.get(`/Api/District/List?parentID=${data}`, { closeLoading: true });
  },
  getAnalysisOutPlateNo(outPlateNo) { // 解析电商平台单号收件人信息   GET /Api/Analysis/OutPlateNo
    return instance.get('/Api/Analysis/OutPlateNo', { params: { outPlateNo } });
  },
  getFileNameAnalysis(data) { // POST /Api/FileName/Analysis 文件名解析
    return instance.post('/Api/FileName/Analysis', data, { closeLoading: true, closeTip: true });
  },
  getFileSuffixList() { // /Api/File/SuffixList 获取批量上传支持的文件格式
    return instance.get('/Api/File/SuffixList');
  },
  getOrderCreate(data) { // POST /Api/Order/Create 提交下单
    return instance.post('/Api/Order/Create', data, { closeLoading: true });
  },
  getFreightCalculate(data) { // POST /Api/Freight/Calculate 有效地址或配送方式发生变化时重新计算解析条目的运费价格
    return instance.post('/Api/Freight/Calculate', data, { closeLoading: true, closeTip: true });
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
    return instance.get('/Api/RestDay/DetailByID', { params: { id }, closeLoading: true });
  },
  getRestDayDetailByMonth(yearMonth) { // GET GET /Api/RestDay/DetailByMonth  节假日详情2  非编辑时 切换年份月份时使用
    return instance.get('/Api/RestDay/DetailByMonth', { params: { yearMonth }, closeLoading: true });
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
    return instance.post('/Api/CustomerList/Excel', data, { responseType: 'arraybuffer' });
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
  /**
   * 关联第三方快递
   *
   * @param {*} id 物流快递ID
   * @param {*} type 第三方平台类型
   * @param {*} thirdID 第三方快递ID
   * @returns
   */
  getLogisticsBindExpress(data) { // POST /Api/Logistics/BindExpress  关联第三方快递
    return instance.post('/Api/Logistics/BindExpress', data);
  },
  getLogisticsBindStation(data) { // POST /Api/Logistics/BindStation  关联网点 -- 参数同保存参数 RelationList
    return instance.post('/Api/Logistics/BindStation', data);
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
    return instance.post('/Api/InvoiceManage/ExportExcel', condition, { responseType: 'arraybuffer' });
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
  getInvoiceManageComplete(invoiceID) { // GET /Api/InvoiceManage/Complete  开具完成
    return instance.get('/Api/InvoiceManage/Complete', { params: { invoiceID } });
  },
  getInvoiceManagePost(data) { // POST /Api/InvoiceManage/Post  邮寄
    return instance.post('/Api/InvoiceManage/Post', data);
  },
};

export default api;
