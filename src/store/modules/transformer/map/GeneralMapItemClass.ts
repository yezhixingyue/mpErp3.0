import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { GenerelMappingTypeEnum } from './enum';
import { IConstraint } from './types';

export class GeneralMapItemClass {
  ID = ''

  ServerID = ''

  InstanceID = ''

  ProductID = ''

  Type = GenerelMappingTypeEnum.UnionMakeupLimit // 枚举数值

  Priority: '' | number = ''

  Constraint: null | IConstraint = null

  List: { ID: string, Name: string }[] = []

  constructor(data: Partial<GeneralMapItemClass>) {
    if (data) {
      restoreInitDataByOrigin(this, data);
      if (data.Constraint) {
        this.Constraint = JSON.parse(JSON.stringify(data.Constraint)); // 暂简单处理一下，后续可能会做更细化处理
      }
    }
  }
}
