/** 断点需要上传方法需要的参数类型 */
export type ResumeUploadoptions = {
  beginNode: number
  baseURL: string
  file: File
  uniqueName: string
  onUploadProgress: (percent: number) => void
}
