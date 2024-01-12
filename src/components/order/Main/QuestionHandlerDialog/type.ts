export interface ICertificate {
  CertificateID: string
  CertificateName: string
  CertificatePics: string[]
  /** 证书类型枚举 */
  CertificateType: number
  // CheckStatus: // 使用时再补充
  /** 过期时间 */
  Expire: string
}
