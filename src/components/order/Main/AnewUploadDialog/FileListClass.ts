import { FileItemClass } from './FileItemClass';

export class FileListClass {
  list: FileItemClass[]

  loading = false

  constructor(fileList: File[]) {
    this.list = fileList.map(file => new FileItemClass(file));
  }
}
