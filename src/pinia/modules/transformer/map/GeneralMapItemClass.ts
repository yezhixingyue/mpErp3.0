import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { FeedEdgePosition, GenerelMappingTypeEnum, MoveTypeEnum } from './enum';
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

  Position: '' | FeedEdgePosition = ''

  Formula: null | { ID: string, Name: string } = null

  Value: '' | number = ''

  MoveOutFormula: null | { ID: string, Name: string } = null

  MoveOutValue: '' | number = ''

  MoveType: '' | MoveTypeEnum = ''

  NeedSetPlateSize = false

  constructor(data: Partial<GeneralMapItemClass>) {
    if (data) {
      restoreInitDataByOrigin(this, data);
      if (data.Constraint) {
        this.Constraint = JSON.parse(JSON.stringify(data.Constraint)); // 暂简单处理一下，后续可能会做更细化处理
      }
      if (data.Formula) this.Formula = data.Formula;
      if (data.MoveOutFormula) this.MoveOutFormula = data.MoveOutFormula;
    }
  }
}
