import { getServerBaseUrl, getUploadedProgress } from './getRequestInfo';
import { upload } from './upload';

export { getUniqueFileName } from './utils';

/** 断点续传 */
export const breakPointUpload = async (
  file: File,
  uniqueName: string,
  onUploadProgress: (percent: number) => void,
) => {
  try {
    const baseURL = await getServerBaseUrl();

    const beginNode = await getUploadedProgress(uniqueName, baseURL, file.size);

    if (beginNode === file.size) return { status: true, error: '' }; // 之前已上传完成

    await upload({ beginNode, baseURL, file, uniqueName, onUploadProgress }); // 上传文件

    const finallyNode = await getUploadedProgress(uniqueName, baseURL, file.size);
    if (finallyNode === file.size) {
      return { status: true, error: '' };
    }

    throw new Error('文件上传失败');
  } catch (error) {
    const msg = error?.message as string || '文件上传失败';

    return { status: false, error: msg };
  }
};
