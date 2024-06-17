export interface ICertificate {
  CertificateID: string
  CertificateName: string
  CertificatePics: string[]
  /** 证书类型枚举 */
  CertificateType: number
  /** 0 1 2 未审核 已审核 未通过 */
  CheckStatus: 0 | 1 | 2// 使用时再补充
  /** 0 1 已过期 有效 */
  CertificateStatus: 0 | 1
  /** 过期时间 */
  Expire: string
}
