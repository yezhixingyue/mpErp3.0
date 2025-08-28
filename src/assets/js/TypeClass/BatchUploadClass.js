import api from '@/api';
import { Loading, Message } from 'element-ui';
import { getIsOrNotHasRepeatItemInArray } from '@/assets/js/utils/util';
import messageBox from '@/assets/js/utils/message';
// import breakPointUpload, { getUniqueFileName } from '../upload/UploadFileByBreakPoint';
import { breakPointUpload, getUniqueFileName } from '@/basic/BreakpointUpload';

/**
 * 文件批量上传使用类
 *
 * @export
 * @class BatchUpload
 */
export default class BatchUpload {
  static getErrorMsg(resp, defaultMsg = '请求失败') {
    if (resp && resp.data && resp.data.Message && resp.data.Status !== 1000) return resp.data.Message;

    if (resp && resp.message === 'Network Error') {
      return '网络错误';
    }
    if (resp && resp.message && resp.message.includes('timeout')) {
      return '网络超时';
    }

    return defaultMsg;
  }

  /**
   * 单个文件解析
   *
   * @static
   * @param {*} file
   * @param {*} basicObj
   * @memberof BatchUpload
   */
  static async getFileParingResultBySingle(file, basicObj, existingObj) {
    const { successedList, failedList } = existingObj;
    let t = successedList.find(it => it.file.name === file.name);
    if (t) {
      return {
        file,
        result: '',
        error: '已在列表中，无法重复下单',
        errorStatus: 0,
        existing: true, // 标明其的错误原因为已有存在的文件
      };
    }
    t = failedList.find(it => it.file.name === file.name && !it.existing);
    if (t) {
      return {
        ...t,
        error: `${t.error} [ 重复下单 ]`,
      };
    }
    const temp = {
      ...basicObj,
      FileList: [{ Second: file.name }],
    };
    const resp = await api.getFileNameAnalysis(temp).catch((err) => err);
    if (resp && resp.data && resp.data.Status === 1000
       && resp.data.Data.length === 1 && resp.data.Data[0]?.IsAnalysisSucceed && resp.data.Data[0]?.HavePrice === true) {
      return {
        file,
        result: resp.data.Data[0],
        error: '',
        uploadStatus: 'ready', // ready | fail | success | uploading
        percentage: 0,
        key: Math.random().toString(16).slice(-10),
        orderStatus: 'ready', // ready | fail | success | submitting
        uniqueName: '',
        PrintFileID: resp.data.Data[0].PrintFileID,
        isParsing: false, // 是否正在解析文件唯一名中
        parseStatus: 'ready', // ready | success | parsing
        Express: {
          First: '',
          Second: '',
        },
      };
    }
    let error = this.getErrorMsg(resp, '文件解析失败');
    if (resp && resp.data.Status === 1000 && resp.data.Data.length === 1 && resp.data.Data[0]?.Message) error = resp.data.Data[0].Message;
    const errorStatus = resp && resp.data && resp.data.Status && resp.data.Status !== 1000 ? resp.data.Status : 0;
    return {
      file,
      result: '',
      error,
      errorStatus,
    };
  }

  /**
   * 进行文件解析并获取到文件解析结果（返回特定格式）
   *
   * @static
   * @param {*} fileList  传入文件列表
   * @memberof BatchUpload
   */
  static async getFileParingResult(fileList, basicObj, existingObj) {
    if (!fileList || fileList.length === 0 || !basicObj) return null;
    const loadingInstance = Loading.service({
      lock: true,
      text: '正在解析中，请稍候...',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.3)',
    });
    const resultList = await Promise.all(fileList.map(file => this.getFileParingResultBySingle(file, basicObj, existingObj))).catch(() => null);
    loadingInstance.close();
    if (resultList) {
      const failedList = resultList.filter(it => it && it.error);
      const successedList = resultList.filter(it => it && !it.error);
      return {
        failedList, // 解析失败的文件列表
        successedList, // 解析成功的文件列表
      };
    }
    return null;
  }

  /**
   * 转换地址格式为接口提交格式
   *
   * @static
   * @param {*} addressInfo4PlaceOrder
   * @returns
   * @memberof BatchUpload
   */
  static getAddress4SubmitFromEditObj(addressInfo4PlaceOrder) {
    const Address = {};
    if (addressInfo4PlaceOrder && addressInfo4PlaceOrder.Address) {
      Address.Express = addressInfo4PlaceOrder.Address.Express;
      if (addressInfo4PlaceOrder.Address.AddressID) {
        Address.AddressID = addressInfo4PlaceOrder.Address.AddressID;
      } else {
        Address.Address = addressInfo4PlaceOrder.Address.Address;
      }
    }
    return Address;
  }

  /**
   * 获取批量上传中允许上传的文件格式
   *
   * @static
   * @returns
   * @memberof BatchUpload
   */
  static async getFileSuffixList() {
    const resp = await api.getFileSuffixList().catch(() => null);
    if (resp && resp.data.Status === 1000) {
      return resp.data.Data.join(',');
    }
    return '';
  }

  /**
   * 处理单个文件上传
   *
   * @static
   * @param {*} item 单个成功解析项目
   * @memberof BatchUpload
   */
  static async getFileUploadBySingle(item) {
    if (!item || !item.file) return false;
    const _item = item;
    _item.orderStatus = 'ready';
    if (_item.uploadStatus === 'success' || (!_item.PrintFileID && _item.PrintFileID !== 0)) {
      _item.uploadStatus = 'success';
      return true;
    }
    _item.uploadStatus = 'uploading';
    const onUploadProgressFunc = percentage => {
      if (typeof +percentage === 'number' && !Number.isNaN(+percentage)) {
        _item.percentage = +percentage;
      }
    };
    const uploadResult = await breakPointUpload(item.file, item.uniqueName, onUploadProgressFunc);

    if (uploadResult && uploadResult.status === true) {
      _item.uploadStatus = 'success'; // 上传成功 继续向后面进行
    } else {
      _item.uploadStatus = 'fail';
      _item.error = uploadResult.error || '文件上传失败';
      _item.percentage = 0;
    }
    return uploadResult;
  }

  static setUniqueNameForItemList(list, { CustomerID }) {
    const getUniqueName = it => {
      const _it = it;
      if (_it.uniqueName) return _it.uniqueName;
      // 判断一下该产品文件是否需要上传，如果不需要则直接设置为空串
      _it.parseStatus = 'parsing';
      const uniqueName = getUniqueFileName({ file: _it.file, Terminal: 1, CustomerID });
      _it.uniqueName = uniqueName;
      _it.parseStatus = 'success';
      return uniqueName;
    };
    const uniqueNameList = list.map(it => getUniqueName(it));
    return uniqueNameList;
  }

  static generateCommitData(list, basicObj, isFromPreCreate) { // 生成下单提交数据
    const {
      CustomerID, Address, Terminal, UsePrintBean, PayInFull, OrderType, Position, IsBatchUpload, IgnoreRiskLevel, UseSameAddress, FileAuthorMobile,
    } = basicObj;
    const List = list.map(it => {
      const { ProductParams, Content, PrintFileID, AnalysisID } = it.result;
      const FileList = !isFromPreCreate && (PrintFileID || PrintFileID === 0) ? [{
        ID: PrintFileID,
        List: [{
          FileName: it.file.name,
          FileSize: it.file.size,
          UniqueName: it.uniqueName,
          FilePath: it.uniqueName,
        }],
      }] : [];
      const Customer = { CustomerID };
      let add = Address;
      if (!UseSameAddress) {
        add = {};
        if (it.Express) add.Express = it.Express;
        if (it.result.Address) add.Address = it.result.Address;
      }
      const temp = {
        ProductParams,
        Content,
        AnalysisID,
        FileList,
        Terminal,
        Address: add,
        Customer,
        Position,
        key: it.key,
        IgnoreRiskLevel,
        FileAuthorMobile,
      };
      if (it.result.Address?.OutPlateSN) {
        let First = 1;
        const jd = /(^\d{12}$)/;
        const taobao = /(^\d{19}$)/;
        const pdd = /(^\d{6}-\d{15}$)/;
        if (taobao.test(it.result.Address.OutPlateSN)) {
          First = 1;
        }
        if (jd.test(it.result.Address.OutPlateSN)) {
          First = 2;
        }
        if (pdd.test(it.result.Address.OutPlateSN)) {
          First = 3;
        }
        temp.OutPlate = { First, Second: it.result.Address.OutPlateSN };
      }
      return temp;
    });
    return {
      PayInFull,
      Terminal,
      OrderType,
      List,
      IsBatchUpload,
      UsePrintBean,
      UseSameAddress,
    };
  }

  /**
   * 批量上传文件
   *
   * @static
   * @memberof BatchUpload
   */
  static async BatchUploadFiles(list, basicObj, handleSuccessFunc) {
    // if (basicObj?.Address?.Express?.First === 1 && basicObj?.Address?.Express?.Second === 1 && basicObj?.UseSameAddress) {
    //   const t = list.find(it => it.result.Address?.OutPlateSN);
    //   if (t) {
    //     messageBox.failSingleError('上传失败', '选中订单中含有平台单号，不能使用名片之家配送，请切换配送方式');
    //     return;
    //   }
    // }
    const loadingInstance = Loading.service({
      lock: true,
      text: '正在读取文件（文件大小会影响读取速度）...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.05)',
      // customClass: 'mp-general-loading-hidden-box',
    });
    list.forEach(it => {
      const _it = it;
      _it.isParsing = true;
    });
    const uniqueNameList = this.setUniqueNameForItemList(list, basicObj);
    list.forEach(it => {
      const _it = it;
      _it.isParsing = false;
    });
    // 1. 获取列表中文件唯一名，查看是否有重复文件，如果有则予以报错处理
    const hasRepeat = getIsOrNotHasRepeatItemInArray(uniqueNameList.filter(it => it));
    if (hasRepeat) {
      messageBox.failSingleError('上传失败', '已选列表中存在重复文件（可能不同名），请检查');
      loadingInstance.close();
      return;
    }
    // 2. 开始文件上传 -- 设置蒙层
    loadingInstance.text = '文件正在上传...';
    const uploadedList = await Promise.all(list.map(it => this.getFileUploadBySingle(it)));
    // 3. 判断文件上传结果中是否存在不成功的项目，如果有则return
    // const i = uploadedList.findIndex(it => !it || (typeof it === 'object' && it.status === false));
    // if (i > -1) {
    //   const msg = uploadedList.length === 1 ? '文件上传失败' : '部分文件上传失败，请检查';
    //   messageBox.failSingleError('上传失败', msg);
    //   loadingInstance.close();
    //   return;
    // }

    const failList = uploadedList.filter(it => !it || (typeof it === 'object' && it.status === false));
    if (failList.length > 0) {
      // eslint-disable-next-line no-param-reassign
      list = list.filter(it => it.uploadStatus === 'success');

      if (list.length === 0) {
        const msg = uploadedList.length === 1 ? '文件上传失败' : '全部文件上传失败，请检查';
        messageBox.failSingleError('上传失败', msg);
        loadingInstance.close();
        return;
      }
    }

    // 4. 生成提交数据列表
    loadingInstance.text = '正在提交，请稍候...';
    const temp = this.generateCommitData(list, basicObj);
    // 5. 调用接口提交 在调用前修改订单上传状态
    list.forEach(it => {
      const _it = it;
      _it.orderStatus = 'submitting';
    });
    const resp = await api.getOrderCreate(temp).catch(() => {});
    // 6. 提交完成后修改列表状态
    const isSuccess = resp && resp.data.Status === 1000; // 成功
    list.forEach(it => {
      const _it = it;
      _it.orderStatus = isSuccess ? 'success' : 'fail';
    });
    // 7. 清除已选列表中已上传文件
    if (isSuccess) {
      const cb = () => {
        if (handleSuccessFunc) handleSuccessFunc(list, resp.data.Data, failList.length);
      };
      // messageBox.successSingle('下单成功', cb, cb);
      cb();
    }
    loadingInstance.close();
  }

  static async getPreOrderCreate(list, basicObj) {
    if (basicObj?.Address?.Express?.First === 1 && basicObj?.Address?.Express?.Second === 1 && basicObj?.UseSameAddress) {
      const t = list.find(it => it.result.Address?.OutPlateSN);
      if (t) {
        messageBox.failSingleError('上传失败', '选中订单中含有平台单号，不能使用名片之家配送，请切换配送方式');
        return null;
      }
    }
    if (!basicObj?.UseSameAddress
       && list.some(it => !it.Express || (!it.Express.First && it.Express.First !== 0) || (!it.Express.Second && it.Express.Second !== 0))) {
      messageBox.failSingleError('上传失败', '配送方式必须选择');
      return null;
    }
    list.forEach(it => {
      const _it = it;
      _it.error = '';
    });
    const temp = this.generateCommitData(list, basicObj, true);
    const resp = await api.getOrderPreCreate(temp).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      return resp.data.Data;
    }
    return null;
  }

  static async getFreightCalculateAfterValidAddressChange(list, basicObj, onlyAddChange) {
    if (!Array.isArray(list) || list.length === 0 || !basicObj) return;
    const { CustomerID, Address } = basicObj;
    if (!CustomerID || !Address) return;
    list.forEach(async it => {
      if (it.result.Address?.OutPlateSN && onlyAddChange) return; // ? 是否要跳过有平台单号的订单 - 仅地址发生改变时进行跳过，配送方式改变时仍需计算
      const _it = it;
      _it.result.ExpressCost = '-';
      const { Weight, ProductParams } = _it.result;
      const ProductID = ProductParams && ProductParams.ProductID ? ProductParams.ProductID : '';
      if (!ProductID) return;
      const temp = {
        CustomerID,
        Address,
        ProductID,
        Weight,
      };
      const resp = await api.getFreightCalculate(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        if (resp.data.Data && typeof +resp.data.Data === 'number' && !Number.isNaN(+resp.data.Data)) {
          _it.result.ExpressCost = +resp.data.Data;
        }
      } else if (resp) {
        _it.result.HaveFreight = false;
        Message({
          showClose: true,
          message: resp.data?.Message ? resp.data.Message : '计算运费出错',
          type: 'error',
        });
      }
    });
  }
}
