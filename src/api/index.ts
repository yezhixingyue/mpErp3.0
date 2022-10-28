/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetLogOptions } from '@/components/LogComp/types/LogConditionClass';
import { AssistMapItemClass } from '@/store/modules/transformer/map/AssistMapItemClass';
import { AssistInfoTypeEnum } from '@/store/modules/transformer/map/enum';
import { GeneralMapItemClass } from '@/store/modules/transformer/map/GeneralMapItemClass';
import { IAssistMapParams, IFactoryMaterialClass, IGeneralMapParams } from '@/store/modules/transformer/map/types';
import { TransformerListConditionClass } from '@/store/modules/transformer/TransformerListConditionClass';
import {
  IGetFormulaParams, IGetPropertyListParams, IGetWorkingProcedureParams, IPartChangeParams, ISemiFinishedSaveParams,
} from '@/store/modules/transformer/types';
import { SaleAndProductionListItemPlainType } from '@/views/serverManage/utils/SaleAndProductionListItemClass';
import { SwitchListItemPlainType } from '@/views/serverManage/utils/SwitchListItemClass';
import { ServerTypeEnum } from '@/views/serverManage/utils/types';
import instance from './axios';

const api = {
  /* 用户相关
  ------------------------------- */
  getLogin(data: any) {
    return instance.post('/Api/Staff/Login', data, { withoutToken: true });
  },
  getUser<T = any>() {
    return instance.post<T>('/Api/Staff/Detail');
  },
  /* 销售端 & 生产端
  ------------------------------- */
  getServerList(type?: ServerTypeEnum) { // GET /Api/Server/List  获取服务器列表
    return instance.get('/Api/Server/List', { params: { type } });
  },
  getServerSave(data: Partial<SaleAndProductionListItemPlainType>) { // POST /Api/Server/Save  服务器(销售端/生产端)信息保存
    return instance.post<string>('/Api/Server/Save', data);
  },
  getServerRemove(id: number) { // DELETE /Api/Server/Remove   服务器(销售端/生产端)信息删除
    return instance.delete('/Api/Server/Remove', { params: { id } });
  },
  getServerGenerateSecretKey(id: number) { // PUT /Api/Server/GenerateSecretKey  服务器生成密钥
    return instance.put('/Api/Server/GenerateSecretKey', null, { params: { id } });
  },
  getLogList(data: GetLogOptions) { // POST /Api/Log/List   获取操作日志列表
    return instance.post('/Api/Log/List', data, { loading: false });
  },
  getConvertServerList() { // GET /Api/ConvertServer/List  获取转换服务器列表
    return instance.get('/Api/ConvertServer/List');
  },
  getConvertServerSave(data: Partial<SwitchListItemPlainType>) { // POST /Api/ConvertServer/Save   转换器信息保存
    return instance.post('/Api/ConvertServer/Save', data);
  },
  getConvertServerRemove(id: string) { // DELETE /Api/ConvertServer/Remove   转换服务器信息删除
    return instance.delete('/Api/ConvertServer/Remove', { params: { id } });
  },
  getConvertServerNotifyReceiveSetup(data: Partial<SwitchListItemPlainType>) { // POST /Api/ConvertServer/NotifyReceiveSetup  转换器转换失败通知设置
    return instance.post('/Api/ConvertServer/NotifyReceiveSetup', data);
  },
  /* 转换设置
  ------------------------------- */
  getFactoryIsConnect(serverID: string) { //  GET /Api/Factory/IsConnect   是否成功链接
    return instance.get('/Api/Factory/IsConnect', { params: { serverID } });
  },
  getProductClassList(serverID: string) { // GET /Api/ProductClass/List   获取产品分类列表
    return instance.get('/Api/ProductClass/List', { params: { serverID } });
  },
  getProductList(data: Partial<TransformerListConditionClass>) { // POST /Api/Product/List   获取产品列表
    return instance.post('/Api/Product/List', data);
  },
  getConvertServerPartSave(data: IPartChangeParams) { // POST /Api/ConvertServer/PartSave  部件保存
    return instance.post('/Api/ConvertServer/PartSave', data);
  },
  // GET /Api/File/List 获取输出文件列表 [审稿端]
  getFileList({ serverID, onlyShowPdf, onlyShowMakeupUsed }: { serverID: string, onlyShowPdf?:boolean, onlyShowMakeupUsed?:boolean }) {
    return instance.get('/Api/File/List', { params: { serverID, onlyShowPdf, onlyShowMakeupUsed } });
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
  getImpositionTemplateClassList(serverID: string) { // GET /Api/ImpositionTemplateClass/List   获取拼版模板分类列表 [生产端]
    return instance.get('/Api/ImpositionTemplateClass/List', { params: { serverID } });
  },
  getImpositionTemplateList(serverID: string) { // GET /Api/ImpositionTemplate/List  获取拼版模板列表 [生产端]
    return instance.get('/Api/ImpositionTemplate/List', { params: { serverID } });
  },
  getFactoryMaterialTypeList(serverID: string) { // GET /Api/FactoryMaterialType/List  获取物料类型列表 [生产端]
    return instance.get<IFactoryMaterialClass[]>('/Api/FactoryMaterialType/List', { params: { serverID } });
  },
  getFactoryMaterialList(serverID: string, typeID?: string) { // GET /Api/FactoryMaterial/List   获取物料列表 [生产端]  typeID： 二级物料分类id
    return instance.get('/Api/FactoryMaterial/List', { params: { serverID, typeID } });
  },
  getMaterialTypeList(serverID: string) { // GET /Api/MaterialType/List  获取物料类型列表 [销售端]
    return instance.get('/Api/MaterialType/List', { params: { serverID } });
  },
  getMaterialList(serverID: string, typeID?: string) { // GET /Api/Material/List   获取物料列表 [销售端]  typeID： 物料分类id
    return instance.get('/Api/Material/List', { params: { serverID, typeID } });
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
  getFormulaList(data: IGetFormulaParams) { // POST /Api/Formula/List   获取公式列表
    return instance.post('/Api/Formula/List', data);
  },
  getGeneralMappingList(data: IGeneralMapParams) { //  POST /Api/GeneralMapping/List 获取常规映射列表 [常规映射列表]
    return instance.post('/Api/GeneralMapping/List', data);
  },
  getGeneralMappingSave(data: Partial<GeneralMapItemClass>) { // POST /Api/GeneralMapping/Save  常规映射(生产线/组合生产线/工序/组合工序)
    return instance.post('/Api/GeneralMapping/Save', data);
  },
  getPropertyList(data: IGetPropertyListParams) { // POST /Api/Property/List  获取属性列表
    return instance.post('/Api/Property/List', data);
  },
};

export default api;
