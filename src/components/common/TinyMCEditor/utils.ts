import { docApi } from '@/api/doc';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { docBaseURL } from '@/config';

/** 图片、视频、文件上传 */
export const upload = async (file: File, apiKey: 'getImgUpload' | 'getMediaUpload' | 'getFileUpload', accept: string, maxSize: number) => {
  const extname = file.name.match(/\.\w*$/)?.[0];
  if (!extname || !accept.toLocaleLowerCase().includes(extname.toLocaleLowerCase())) {
    MpMessage.error({ title: '文件格式不正确' });
    return null;
  }

  if (file.size > maxSize) {
    MpMessage.error({ title: '尺寸超出限制' });
    return null;
  }

  const resp = await docApi[apiKey](file).catch(() => null);

  if (resp?.data.Status === 1000) {
    return docBaseURL + resp.data.Data;
  }

  return null;
};
