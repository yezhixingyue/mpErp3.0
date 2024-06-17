import sha1 from 'js-sha1';
import { ResumeUploadoptions } from './type';

/** 获取文件后缀名 */
export const extname = (filename: string) => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  const a = filename.split('').reverse().join('');
  const b = a.substring(0, a.search(/\./)).split('').reverse().join('');

  return b;
};

/** 获取节点百分比 */
export const getNodePercent = (node: number, size: number) => Number((node / size).toFixed(4)) * 100;

/** 断点上传中的进度处理函数 */
export const uploadProgressHandler = (e, startPercent: number, endPercent: number, onUploadProgress: ResumeUploadoptions['onUploadProgress']) => {
  const _percent = startPercent + Number(((e.loaded / e.total) * (endPercent - startPercent)).toFixed(2));
  onUploadProgress(_percent);
};

/** 解析文件，获取文件唯一标识名称 */
export const getUniqueFileName = ({ file, Terminal, TypeID, CustomerID }: { file: File; Terminal: number; TypeID?: string | number; CustomerID: string }) => {
  const ext = extname(file.name);
  const combineName = `${CustomerID}${Terminal}${TypeID || ''}${file.name}${file.lastModified}${file.size}`; // 按照规则进行组合

  return `${sha1(combineName)}.${ext}`;
};
