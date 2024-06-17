import api from '@/api';
import { ResumeUploadoptions } from './type';
import { getNodePercent, uploadProgressHandler } from './utils';

const CHUNK_SIZE = 1024 * 1024 * 10; // 分切尺寸大小

export const upload = async ({ beginNode, baseURL, file, uniqueName, onUploadProgress }: ResumeUploadoptions) => {
  if (beginNode >= file.size) {
    onUploadProgress(100);
    return true;
  }

  const node = {
    start: beginNode,
    end: beginNode + CHUNK_SIZE > file.size ? file.size : beginNode + CHUNK_SIZE, // 当次分片结束节点位置
  };

  const percent = { // 当次上传开始|结束百分比
    start: getNodePercent(node.start, file.size),
    end: getNodePercent(node.end, file.size),
  };

  onUploadProgress(percent.start);

  const chunk = file.slice(node.start, node.end); // 切片

  const resp = await api.UploadFileBreakpointResume(
    chunk,
    uniqueName,
    node.start,
    node.end,
    file.size,
    (e) => uploadProgressHandler(e, percent.start, percent.end, onUploadProgress),
    baseURL,
  );

  if (resp.data.Status !== 1000) {
    throw new Error(resp.data.Message);
  }

  return upload({ beginNode: node.end, baseURL, file, uniqueName, onUploadProgress });
};
