/* eslint-disable max-len */
// eslint-disable-next-line import/no-cycle
import instance from '@/api/axios';

const api = {
  /* 订单列表部分api
   ------------------------------------------------------------------------------------ */
  getVersionValid(data) { // 缓存版本对比 ---  暂用于获取企业类型    POST /Api/Constant/VersionValid
    return instance.post('/Api/Constant/VersionValid', data);
  },
  getStaffList(data) { // 获取接单员信息列表
    return instance.post('/Api/Staff/List', data);
  },
  getExpressList(data) { // 获取配送方式
    return instance.get('/Api/Express/List', data);
  },
  getOrderList(data) { // 获取客户订单列表（接单员）
    return instance.post('/Api/Order/List', data); // /Api/Customer/OrderList
  },
  getProductLists(data) { // 获取列表头部产品第三级列表
    return instance.post('/Api/Product/List', data);
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
    return instance.post('/Api/Order/ReCheckFile', { OrderID, FilePath });
  },

  /* 付款列表部分api
   ----------------------------------------------------------------------------------- */
  getPaymentOrderList(data) { // 获取付款单列表
    return instance.post('/Api/PaymentOrder/List', data);
  },
  cancelCustomerPay(payCode) { // 取消付款单 /Api/PaymentOrder/Cancle
    return instance.put(`/Api/PaymentOrder/Cancle?payCode=${payCode}`);
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
  getServiceListData2Excel(data) { // POST /Api/AfterSales/Excel
    return instance.post('/Api/AfterSales/Excel', data, { responseType: 'arraybuffer' });
  },

  /* 订单售后api
   ----------------------------------------------------------------------------------- */
  getQuestionList() { // 获取售后问题列表   GET /Api/AfterSales/QuestionList
    return instance.get('/Api/AfterSales/QuestionList');
  },
  saveServiceOrder(data) { // 售后单提交   POST /Api/AfterSales/Save
    return instance.post('/Api/AfterSales/Save', data);
  },
  getServiceList(data) { // 获取售后单列表   GET /Api/AfterSales/List
    return instance.post('/Api/AfterSales/List', data);
  },
  getServiceDetail(aferSalesID) { // 获取售后单详情   GET /Api/AfterSales/Detail
    return instance.get(`/Api/AfterSales/Detail?aferSalesID=${aferSalesID}`);
  },
  getServiceOrderHistory(orderID) { // 获取售后单已售后记录   GET /Api/Order/AfterSales/List
    return instance.get(`/Api/Order/AfterSales/List?orderID=${orderID}`);
  },
  getPayPackageByOrder(orderID) { // GET /Api/PayPackage/GetByOrder  根据订单查询相关合包信息
    return instance.get(`/Api/PayPackage/GetByOrder?orderID=${orderID}`);
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
  getUploadedProgress(uniqueName) { // 获取断点续传文件已上传的位置  GET /Api/FileNode
    return instance.get(`/Api/FileNode?uniqueName=${uniqueName}`);
  },
  UploadFileBreakpointResume(data, uniqueName, first, last, length, onUploadProgressFunc) { // 断点续传上传文件 /Api/Upload/File
    const formData = new FormData();
    formData.append('file', data);
    const config = {
      headers: {
        'Content-Range': `bytes ${first}-${last}/${length}`,
      },
      onUploadProgress: onUploadProgressFunc && onUploadProgressFunc,
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
  getPayResult(payCode) { // GET /Api/PaymentOrder/PayResult 查询付款结果
    return instance.get(`/Api/PaymentOrder/PayResult?payCode=${payCode}`);
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
    return instance.post('/Api/Product/List', { FieldType: 1 });
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
  getCustomerList(data) { // POST /Api/Customer/List   优惠券使用列表中获取绑定客户信息
    return instance.post('/Api/Customer/List', data);
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
  getCraftList(data) { // POST /Api/Craft/CraftList 获取产品分类工艺列表
    return instance.post('/Api/Craft/CraftList', { FieldType: 1, ...data });
  },
  getDistrictList(parentID) {
    if (!parentID && parentID !== 0) return instance.get('/Api/District/List');
    return instance.get(`/Api/District/List?parentID=${parentID}`);
  },
  /* 客户反馈api
  ----------------------------------------------------------------------------------- */
  getApplyQuestionList() { // GET /Api/AfterSales/ApplyQuestionList 获取客户申请问题列表
    return instance.get('/Api/AfterSales/ApplyQuestionList');
  },
  getAfterSalesApplyList(data) { // POST /Api/AfterSales/ApplyList 获取客户售后申请列表数据
    return instance.post('/Api/AfterSales/ApplyList', data);
  },
  getApplyReject(data) { // POST /Api/AfterSales/Reject  驳回申请
    return instance.post('/Api/AfterSales/Reject', data);
  },
  getAfterSalesDealApply(applyCode) { // PUT  开始处理
    return instance.put(`/Api/AfterSales/DealApply?applyCode=${applyCode}`);
  },
  getAfterSalesDepartmentList() { // GET /Api/AfterSales/DepartmentList 获取售后责任部门列表
    return instance.get('/Api/AfterSales/DepartmentList');
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
  getProductFormulasList(productID) { // GET /Api/ProductFormula/List 获取产品公式和子公式列表
    return instance.get('/Api/ProductFormula/List', { params: { productID } });
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
  getMakeupControlSolutionSetup(priceID, type, solutionID) { // PUT /Api/MakeupControl/Setup  拼版方案设置
    return instance.put('/Api/MakeupControl/Setup', '', { params: { priceID, type, solutionID } });
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
  /* 基础设置api
  ----------------------------------------------------------------------------------- */
  getFactoryList() { // /Api/Constant/VersionValid 获取生产工厂列表
    return instance.post('/Api/Constant/VersionValid', { key: 1, Value: -1 });
  },
  getFactorySave(data) { // /Api/Factory/Save 工厂信息保存:   添加 | 编辑
    return instance.post('/Api/Factory/Save', data);
  },
  getFactoryRemove(factoryID) { // 工厂删除
    return instance.delete(`/Api/Factory/Remove?factoryID=${factoryID}`);
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
  getElementGroupList(positionID) { // GET /Api/ElementGroup/List 元素组列表
    if (positionID) return instance.get(`/Api/ElementGroup/List?positionID=${positionID}`);
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
};

export default api;
