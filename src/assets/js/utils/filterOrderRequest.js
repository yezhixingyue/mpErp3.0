/*
 * @Author: your name
 * @Date: 2020-03-21 14:53:48
 * @LastEditTime: 2021-05-05 15:43:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /src/assets/js/utils/filterOrderRequest.js
 */
export default function filterOrderRequest(config) {
  const obj = {};
  if (config.SellArea.RegionalID) { // 销售区域
    obj.SellArea = {};
    obj.SellArea.RegionalID = config.SellArea.RegionalID;
    if (config.SellArea.CityID) obj.SellArea.CityID = config.SellArea.CityID;
    if (config.SellArea.CountyID) obj.SellArea.CountyID = config.SellArea.CountyID;
  }
  if (config.ProductClass.First) { // 产品类型
    obj.ProductClass = {};
    obj.ProductClass.First = config.ProductClass.First;
    if (config.ProductClass.Second) obj.ProductClass.Second = config.ProductClass.Second;
  }
  if (config.ProductID) obj.ProductID = config.ProductID; // 产品ID
  if (config.CustomerType.First) { // 客户类型
    obj.CustomerType = {};
    obj.CustomerType.First = config.CustomerType.First;
    if (config.CustomerType.Second) obj.CustomerType.Second = config.CustomerType.Second;
  }
  if (!config.CustomerType.First && config.CustomerType.Second) { // 客户类型
    obj.CustomerType = {};
    obj.CustomerType.Second = config.CustomerType.Second;
  }
  if (config.Status) obj.Status = config.Status; // 订单状态
  if (config.ExpressType) obj.ExpressType = config.ExpressType; // 快递类型
  if (config.KeyWords) obj.KeyWords = config.KeyWords; // 搜索关键字
  if (config.PlaceDate.First && config.PlaceDate.Second) { // 时间期间
    obj.PlaceDate = config.PlaceDate;
  }
  if (config.Page || config.Page === 0) obj.Page = config.Page; // 搜索关键字
  if (config.PageSize) obj.PageSize = config.PageSize; // 搜索关键字
  if (config.OrderTaker) obj.OrderTaker = config.OrderTaker; // 接单员
  if (config.OrderType) obj.OrderType = config.OrderType; // 下单方式
  if (config.Terminal || config.Terminal === 0) obj.Terminal = config.Terminal; // 下单方式
  obj.FieldType = 2;
  // console.log(config.Terminal, '-----', obj);
  return obj;
}
