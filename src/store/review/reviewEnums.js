import getEnumList from '../../assets/js/utils/getEnumList';

export const FileHandleModeEnums = { // 文件处理方式枚举对象
  manual: {
    ID: 0,
    Name: '人工处理文件',
  },
  auto: {
    ID: 1,
    Name: '自动处理文件',
  },
  none: {
    ID: 2,
    Name: '不处理文件',
  },
};

export const ContentReviewModeEnums = { // 内容审核方式枚举对象
  review: {
    ID: true,
    Name: '审核内容',
  },
  notReview: {
    ID: false,
    Name: '不审核内容',
  },
};

export const PanelTypeEnums = {
  outFile: {
    ID: 0,
    Name: '输出文件',
    UseModule: 50, // 暂定
    withPart: true,
    width: 7,
    KeyOfCount: 'OutputFile',
    fullName: '输出文件规则',
    tips: '注：输出文件规则执行所有匹配项目，按优先级从高到低依次执行，全部通过审稿才能提交成功。',
  },
  sizeAndNumber: {
    ID: 1,
    Name: '尺寸数量',
    UseModule: 50, // 暂定
    withPart: true,
    width: 7,
    KeyOfCount: 'SizeNumber',
    fullName: '尺寸数量检查',
    tips: '注：文件尺寸检查规则仅匹配一条，优先级数字越小，越优先匹配。',
    canAdd: true,
  },
  filePageNumber: {
    ID: 2,
    Name: '文件页数',
    UseModule: 50, // 暂定
    withPart: true,
    width: 17,
    partWidth: 9,
    KeyOfCount: 'FilePages',
    fullName: '文件页数检查',
    tips: '注：文件页数检查规则仅匹配一条，优先级数字越小，越优先匹配。',
    canAdd: true,
  },
  part: {
    ID: 4,
    Name: '选择产品部件',
    withPart: false,
    width: 9,
    icon: 'el-icon-files',
    KeyOfCount: 'SelectedPartNumber',
  },
  other: {
    ID: 5,
    Name: '其它设置',
    withPart: true,
    width: 5.8,
    partWidth: 10,
    icon: 'el-icon-setting',
  },
  flow: {
    ID: 3,
    Name: '流程设置',
    UseModule: 50, // 暂定
    withPart: false,
    width: 7,
    KeyOfCount: 'Process',
    fullName: '流程设置',
    tips: '注：流程设置仅匹配一条，优先级数字越小，越优先匹配。',
  },
};

export const PrintSideTypeEnums = { // 其它设置 - 单双面设置 枚举对象
  singleSide: {
    ID: 0,
    Name: '只有单面',
  },
  doubleSide: {
    ID: 1,
    Name: '只有双面',
  },
  propMap: {
    ID: 2,
    Name: '属性映射',
  },
};

export const PagesNumberTypeEnums = {
  EveryKindPages: {
    ID: 0,
    Name: '每款页数',
  },
  TotalPages: {
    ID: 1,
    Name: '总页数',
  },
};

export const PrintColorTypeEnums = {
  C: {
    ID: 0,
    Name: 'C',
    remark: '青',
  },
  M: {
    ID: 1,
    Name: 'M',
    remark: '洋红',
  },
  Y: {
    ID: 2,
    Name: 'Y',
    remark: '黄',
  },
  K: {
    ID: 3,
    Name: 'K',
    remark: '黑',
  },
};

export const FileHandleModeEnumList = getEnumList(FileHandleModeEnums); // 文件处理方式枚举列表
export const ContentReviewModeEnumList = getEnumList(ContentReviewModeEnums); // 内容审核方式枚举列表
export const PanelTypeEnumList = getEnumList(PanelTypeEnums, true);
export const PrintSideTypeEnumList = getEnumList(PrintSideTypeEnums, true);
export const PagesNumberTypeEnumList = getEnumList(PagesNumberTypeEnums);
export const PrintColorTypeEnumList = getEnumList(PrintColorTypeEnums, true);
