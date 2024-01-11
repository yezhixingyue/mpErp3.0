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

  get oldCertificateName() {
    return this.CertificateList.find(it => it.CertificateID === this.oldCertificate)?.CertificateName || '';
  }

  get newCertificateName() {
    return this.CertificateList.find(it => it.CertificateID === this.newCertificate)?.CertificateName || '';
  }

  loading = false

  constructor(fileList: File[], CustomerID: string, oldCertificate: string) {
    this.CustomerID = CustomerID;
    this.oldCertificate = oldCertificate;
    this.updateFileList(fileList);

    // 获取证书列表数据
    this.getCustomerCertificateAll();
  }

  async getCustomerCertificateAll() { // 获取证书列表数据
    this.CertificateList = [];
    const resp = await api.getCustomerCertificateAll(this.CustomerID).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      this.CertificateList = resp.data.Data || [];
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
