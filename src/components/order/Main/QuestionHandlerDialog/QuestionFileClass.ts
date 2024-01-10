import breakPointUpload, { getUniqueFileName } from '@/assets/js/upload/UploadFileByBreakPoint';

export class QuestionFileClass {
  file:File

  percentage = 0

  key: string

  isPrintFile = false

  loading = false

  uploadResult: null | { errMsg: string, isSuccess: boolean } = null

  UniqueName = ''

  CustomerID: string

  get status():'success' | 'exception' | undefined { // 进度条状态
    if (!this.loading) {
      if (this.uploadResult?.errMsg) return 'exception';
      if (this.uploadResult?.isSuccess) return 'success';
    }
    return undefined;
  }

  constructor(file: File, CustomerID: string) {
    this.file = file;
    this.key = Math.random().toString(32).slice(-10);
    this.CustomerID = CustomerID;
  }

  async upload() {
    if (this.uploadResult?.isSuccess) {
      return true;
    }

    this.loading = true;

    this.UniqueName = getUniqueFileName({ file: this.file, Terminal: 1, CustomerID: this.CustomerID });

    const onUploadProgressFunc = (percentage: string | number) => {
      if (typeof +percentage === 'number' && !Number.isNaN(+percentage)) {
        this.percentage = Math.round(+percentage);
        if (this.percentage > 100) this.percentage = 100;
      }
    };

    const uploadResult = await breakPointUpload(this.file, this.UniqueName, onUploadProgressFunc);

    this.loading = false;

    if (uploadResult && uploadResult.status === true) {
      this.uploadResult = { errMsg: '', isSuccess: true };
      this.percentage = 100;

      return true;
    }

    this.uploadResult = { errMsg: uploadResult.error || '文件上传失败', isSuccess: false };

    return false;
  }
}
