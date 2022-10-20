/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetLogOptions } from '@/components/LogComp/types/LogConditionClass';
import { IAssistMapParams } from '@/store/modules/transformer/map/types';
import { TransformerListConditionClass } from '@/store/modules/transformer/TransformerListConditionClass';
import { IPartChangeParams } from '@/store/modules/transformer/types';
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
  getProductClassList(serverID: string) { // GET /Api/ProductClass/List   获取产品分类列表
    return instance.get('/Api/ProductClass/List', { params: { serverID } });
  },
  getProductList(data: Partial<TransformerListConditionClass>) { // POST /Api/Product/List   获取产品列表
    return instance.post('/Api/Product/List', data);
  },
  getConvertServerPartSave(data: IPartChangeParams) { // POST /Api/ConvertServer/PartSave  部件保存
    return instance.post('/Api/ConvertServer/PartSave', data);
  },
  getAssistMappingList(data: IAssistMapParams) { //  POST /Api/AssistMapping/List   获取辅助映射列表 [辅助映射列表]
    return instance.post('/Api/AssistMapping/List', data);
  },
  // GET /Api/File/List 获取输出文件列表 [审稿端]
  getFileList({ serverID, onlyShowPdf, onlyShowMakeupUsed }: { serverID: string, onlyShowPdf?:boolean, onlyShowMakeupUsed?:boolean }) {
    return instance.get('/Api/File/List', { params: { serverID, onlyShowPdf, onlyShowMakeupUsed } });
  },
  getAssistantInfoList(serverID: string) { // GET /Api/AssistantInfo/List   获取文件辅助信息列表 [生产端]
    return instance.get('/Api/AssistantInfo/List', { params: { serverID } });
  },
};

export default api;
