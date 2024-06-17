import { MpMessage } from '@/assets/js/utils/MpMessage';
import { QuestionFileClass } from './QuestionFileClass';
import api from '@/api';
import { ICertificate } from './type';

/** 问题件处理相关类 */
export class QuestionManageCLass {
  CustomerID: string

  list: QuestionFileClass[]

  /** 旧的证书ID */
  oldCertificate: string

  /** 新选择的证书ID */
  newCertificate = ''

  CertificateList: ICertificate[] = [] // 全部证书列表数据

  refreshcb: (list: ICertificate[]) => void

  get oldCertificateItem() {
    return this.CertificateList.find(it => it.CertificateID === this.oldCertificate);
  }

  get oldCertificateName() {
    const t = this.oldCertificateItem;
    if (t) {
      let statusText = '';

      if (t.CertificateStatus === 0) statusText = '已过期';
      if (t.CheckStatus === 2) statusText = '未通过';

      return `${t.CertificateName}${statusText ? ` ( ${statusText} )` : ''}`;
    }
    return '--';
  }

  get newCertificateName() {
    return this.CertificateList.find(it => it.CertificateID === this.newCertificate)?.CertificateName || '';
  }

  loading = false

  constructor(fileList: File[], CustomerID: string, oldCertificate: string, CertificateList: ICertificate[], refreshcb: (list: ICertificate[]) => void) {
    this.CustomerID = CustomerID;
    this.oldCertificate = oldCertificate;
    this.updateFileList(fileList);
    this.refreshcb = refreshcb;

    // 获取证书列表数据
    if (CertificateList.length > 0) {
      this.CertificateList = CertificateList;
    } else {
      this.getCustomerCertificateAll();
    }
  }

  async getCustomerCertificateAll() { // 获取证书列表数据
    if (!this.oldCertificate) return;

    this.CertificateList = [];
    const resp = await api.getCustomerCertificateAll(this.CustomerID).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      this.CertificateList = resp.data.Data || [];
      this.refreshcb(this.CertificateList);
    }
  }

  /** 更新选择文件 */
  public updateFileList(fileList: File[]) {
    this.list = fileList.map(file => new QuestionFileClass(file, this.CustomerID));
  }

  /** 内部方法：执行文件上传 */
  private async _upload() {
    if (this.list.length === 0) return false;

    const result = await Promise.all(this.list.map(item => item.upload()));

    if (result.findIndex(it => !it) > -1) return false;

    return true;
  }

  /** 内部方法：提交前的校验  */
  private _validate() {
    if (this.list.length === 0 && !this.oldCertificate) {
      MpMessage.error({ title: '请上传文件' });
      return false;
    }

    if (this.list.length === 0 && !this.newCertificate) {
      MpMessage.error({ title: '请上传文件或选择证书' });
      return false;
    }

    if (this.list.length > 0 && !this.list.find(it => it.isPrintFile)) {
      MpMessage.error({ title: '请指定印刷文件' });
      return false;
    }

    // 未上传证书则校验旧证书是否可用
    if (!this.newCertificate && this.oldCertificate) {
      if (!this.oldCertificateItem || this.oldCertificateItem.CheckStatus === 2 || this.oldCertificateItem.CertificateStatus === 0) {
        MpMessage.error({ title: '请重新选择证书' });
        return false;
      }
    }

    return true;
  }

  /** 提交 */
  public async submit(handerFunc: (arg: unknown) => Promise<boolean>, closeDialog: () => void) {
    if (!this._validate()) return;

    this.loading = true;

    if (this.list.length > 0) {
      const bool = await this._upload().catch(() => null);

      if (!bool) {
        MpMessage.error({ title: '部分或全部文件上传失败' });
        this.loading = false;
        return;
      }
    }

    // 需要获取上传结果 拿到文件名等信息
    const list = this.list.map(it => ({ UniqueName: it.UniqueName, isPrintFile: it.isPrintFile, FileSize: it.file.size }));

    // 提交
    const result = await handerFunc({ FileList: list, Certificate: this.newCertificate });

    this.loading = false;

    if (result) closeDialog();
  }
}
