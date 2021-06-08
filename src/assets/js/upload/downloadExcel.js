import messageBox from '@/assets/js/utils/message';
// import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';

/**
 * @description: 清除网络请求中的无效参数
 * @param {*} filterObj
 * @return {*}
 */
export const filterObj = (obj) => {
  if (Object.prototype.toString.call(obj) !== '[object Object]') return obj;
  const temp = JSON.parse(JSON.stringify(obj));
  const keys = Object.keys(temp);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (!temp[key] && temp[key] !== 0) delete temp[key];
    else {
      const _o = filterObj(temp[key]);
      if (JSON.stringify(_o) === '{}') {
        delete temp[key];
      } else {
        temp[key] = _o;
      }
    }
  }
  return temp;
};
/**
 * @description: 用于导出excel
 * @param {*} handleExcelDownload 参数 下载函数的参数  下载函数  导出文件名称
 * @return {*}
 */
const handleExcelDownload = async (params, downApiFunc, fileName) => {
  const temp = JSON.parse(JSON.stringify(params));
  if (temp.Page) delete temp.Page;
  if (temp.PageSize) delete temp.PageSize;
  const config = filterObj(temp);

  const res = await downApiFunc(config);
  if (res.status !== 200) {
    messageBox.failSingleError('出错啦 ！', `[ 下载失败：${res.statusText} ]`);
    return;
  }

  const { data } = res;
  const blobData = new Blob([data], { type: 'application/vnd.ms-excel' });

  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blobData, fileName);
  } else {
    const url = window.URL.createObjectURL(blobData);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;

    link.setAttribute('download', `${fileName}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    link.onload = () => {
      window.URL.revokeObjectURL(url);
    };
  }
};

export default handleExcelDownload;
