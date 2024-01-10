import { MpMessage } from '@/assets/js/utils/MpMessage';
import { QuestionFileClass } from './QuestionFileClass';

/** 问题件处理相关类 */
export class QuestionManageCLass {
  CustomerID: string

  list: QuestionFileClass[]

  /** 旧的证书ID */
  oldCertificate: string

  /** 新选择的证书ID */
  newCertificate = ''

  loading = false

  constructor(fileList: File[], CustomerID: string, oldCertificate: string) {
    this.CustomerID = CustomerID;
    this.oldCertificate = oldCertificate;
    this.updateFileList(fileList);

    // 获取证书列表数据
  }

  /** 更新选择文件 */
  public updateFileList(fileList: File[]) {
    this.list = fileList.map(file => new QuestionFileClass(file, this.CustomerID));
  }

  /** 内部方法：执行文件上传 */
  private async upload() {
    if (this.list.length === 0) return false;

    const result = await Promise.all(this.list.map(item => item.upload()));

    if (result.findIndex(it => !it) > -1) return false;

    return true;
  }

  /** 内部方法：提交前的校验  */
  private validate() {
    if (!this.list.find(it => it.isPrintFile)) {
      MpMessage.error({ title: '请指定印刷文件' });
      return false;
    }

    return true;
  }

  /** 提交 */
  public async submit(handerFunc: (list: { UniqueName: string, isPrintFile: boolean }[]) => Promise<boolean>, closeDialog: () => void) {
    if (!this.validate()) return;

    this.loading = true;

    const bool = await this.upload().catch(() => null);

    if (!bool) {
      MpMessage.error({ title: '部分或全部文件上传失败' });
      this.loading = false;
      return;
    }

    // 需要获取上传结果 拿到文件名等信息
    const list = this.list.map(it => ({ UniqueName: it.UniqueName, isPrintFile: it.isPrintFile, FileSize: it.file.size }));

    // 提交
    const result = await handerFunc(list);

    this.loading = false;

    if (result) closeDialog();
  }
}
