import { IConstraint } from '@/pinia/modules/transformer/map/types';
import { AddEmptyString4Number, ILightgoodsProductSolution, ILightgoodsProductSolutionTableItem, RemovePrivateAttr } from '../../types/types';
import { getAUUID } from '@/assets/js/utils/util';
import { MpMessage } from '@/assets/js/utils/MpMessage';

/** 容器规格表 设置数据弹窗提交数据格式类型 */
export interface IAxisSubmitData extends Pick<LeftRuleForm, 'InputContent' | 'Operator'> {
  list: { ID: string; Values: [number] | [number, number] }[]
}

export class LeftRuleForm {
  readonly ID: string

  readonly Name: string

  readonly Priority: number

  Constraint: null | IConstraint

  DataList: AddEmptyString4Number<ILightgoodsProductSolutionTableItem>[]

  InputContent: ILightgoodsProductSolution['InputContent']

  Operator: ILightgoodsProductSolution['Operator']

  constructor(row: ILightgoodsProductSolution) {
    this.ID = row.ID;
    this.Name = row.Name;
    this.Priority = row.Priority;
    this.Constraint = row.Constraint;

    this.InputContent = row.InputContent || '';
    this.Operator = {
      First: row.Operator && typeof row.Operator.First === 'number' ? row.Operator.First : 5,
      Second: row.Operator && typeof row.Operator.Second === 'number' ? row.Operator.Second : 6,
    };

    this.DataList = row.DataList?.map(it => ({ ...it })) || [];

    this._replenishDataList();
  }

  private _replenishDataList() {
    if (this.DataList.length === 0) {
      this.DataList.push({
        ID: getAUUID(),
        Length: '',
        Width: '',
        Height: '',
        MinValue: 0,
        MaxValue: -1,
      });
    }
  }

  onAxisChange(params: IAxisSubmitData) {
    this.InputContent = params.InputContent;
    this.Operator = params.Operator;

    this.DataList = params.list.map(it => {
      const temp: AddEmptyString4Number<ILightgoodsProductSolutionTableItem> = {
        ID: it.ID,
        MinValue: it.Values[0],
        MaxValue: it.Values[it.Values.length - 1],
        Length: '',
        Width: '',
        Height: '',
      };

      return temp;
    });

    this._replenishDataList();
  }

  getParams(Constraint: IConstraint) {
    if (!Constraint) return null;

    const temp = {
      ...this,
    };
    if (temp.InputContent === '' && temp.DataList.length === 1 && temp.DataList.find(it => it.Width === '' && it.Height === '' && it.Length === '')) {
      temp.DataList = [];
    }

    const t = temp.DataList.find(it => !it.Width || !it.Height || !it.Length);
    if (t) {
      MpMessage.error('保存失败', '表数据不完整或不正确(应为大于0的整数类型)');
      return null;
    }

    temp.Constraint = Constraint;
    this.Constraint = Constraint;

    return temp;
  }
}

export type TLeftRuleFormType = RemovePrivateAttr<LeftRuleForm>
