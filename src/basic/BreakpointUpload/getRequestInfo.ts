import api from '@/api';
import config from '@/assets/js/setup';

/** 获取上传文件服务器地址 */
export const getServerBaseUrl = async () => {
  const resp = await api.getFileServer(config.Position).catch(() => null);

  if (resp?.data.isSuccess) {
    return resp.data.Data as string;
  }

  throw new Error('获取服务器上传地址失败');
};

/** 获取文件已上传节点 */
export const getUploadedProgress = async (uniqueName: string, baseURL: string, fileSize: number) => {
  const resp = await api.getUploadedProgress(uniqueName, baseURL).catch(() => null);

  if (resp?.data.isSuccess) {
    const beginNode = +resp.data.Data;

    if (fileSize === beginNode && beginNode === 0) {
      throw new Error('文件找不到');
    }

    return beginNode;
  }

  throw new Error('查询上传进度失败');
};
