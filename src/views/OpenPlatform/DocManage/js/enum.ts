/** 文章类型枚举值 */
export enum DocTypeEnum {
  /** 首创文档 */
  doc = 1,
  /** 引用文档 */
  link = 2,
}

export const DocTypeEnumList = [
  { ID: DocTypeEnum.doc, Name: '首创文档', className: 'blue' },
  { ID: DocTypeEnum.link, Name: '引用文档', className: 'orange' },
];
