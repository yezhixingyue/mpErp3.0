export class FileItemClass {
  file:File

  percentage = 0

  key: string

  isPrintFile = false

  loading = true

  constructor(file: File) {
    this.file = file;
    this.key = Math.random().toString(32).slice(-10);
  }
}
