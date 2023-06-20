import { MpMessage } from '@/assets/js/utils/MpMessage';
import { GeneralMapItemClass } from '@/pinia/modules/transformer/map/GeneralMapItemClass';
import { FeedEdgePosition, GenerelMappingTypeEnum, MoveTypeEnum } from '@/pinia/modules/transformer/map/enum';

/**
 * 其它设置 - 右侧面板提交数据类
 *
 * @export
 * @class RightPanelRuleForm
 */
export class RightPanelRuleForm {
  Type: GenerelMappingTypeEnum

  /** 爬移类型  */
  MoveType: MoveTypeEnum | '' = ''

  _MoveInChecked = false // 是否勾选使用内爬移

  _MoveOutChecked = false // 是否勾选使用外爬移

  Formula: null | { ID: string, Name: string } = null

  Value: '' | number = ''

  MoveOutFormula: null | { ID: string, Name: string } = null

  MoveOutValue: '' | number = ''

  /** 叼口类型 */
  Position: '' | FeedEdgePosition = ''

  getParams() {
    const temp: Partial<RightPanelRuleForm> = {};
    // if (this.Type === GenerelMappingTypeEnum.SheetIndex) { // 帖标
    //   return {};
    // }
    if (this.Type === GenerelMappingTypeEnum.Move) { // 爬移
      if (!this.MoveType && (this.MoveType as number) !== 0) {
        MpMessage.error({ title: '保存失败', msg: '请设置爬移类型' });
        return null;
      }
      if (!/^\d+$/.test(`${this.MoveType}`)) {
        MpMessage.error({ title: '保存失败', msg: '爬移类型设置不正确' });
        return null;
      }
      temp.MoveType = this.MoveType;
      if (!this._MoveInChecked && !this._MoveOutChecked) {
        MpMessage.error({ title: '保存失败', msg: '爬移量未设置' });
        return null;
      }
      if (this._MoveInChecked) { // 勾选了内爬移
        if (this.Formula && this.Formula.ID) {
          temp.Formula = this.Formula;
          temp.Value = null;
        } else {
          if (!this.Value && this.Value !== 0) {
            MpMessage.error({ title: '保存失败', msg: '内爬移量未设置' });
            return null;
          }
          if (!/^\d+$/.test(`${this.Value}`) || this.Value === 0) {
            MpMessage.error({ title: '保存失败', msg: '内爬移常数设置不正确' });
            return null;
          }
          temp.Formula = null;
          temp.Value = this.Value;
        }
      }
      if (this._MoveOutChecked) { // 勾选了外爬移
        if (this.MoveOutFormula && this.MoveOutFormula.ID) {
          temp.MoveOutFormula = this.MoveOutFormula;
          temp.MoveOutValue = null;
        } else {
          if (!this.MoveOutValue && this.MoveOutValue !== 0) {
            MpMessage.error({ title: '保存失败', msg: '外爬移量未设置' });
            return null;
          }
          if (!/^\d+$/.test(this.MoveOutValue.toString()) || this.MoveOutValue === 0) {
            MpMessage.error({ title: '保存失败', msg: '外爬移常数设置不正确' });
            return null;
          }
          temp.MoveOutFormula = null;
          temp.MoveOutValue = this.MoveOutValue;
        }
      }
    }

    if (this.Type === GenerelMappingTypeEnum.FeedEdge) { // 叼口
      if (!this.Position && (this.Position as number) !== 0) {
        MpMessage.error({ title: '保存失败', msg: '请选择叼口类型' });
        return null;
      }
      if (!/^\d+$/.test(`${this.Position}`)) {
        MpMessage.error({ title: '保存失败', msg: '叼口类型设置不正确' });
        return null;
      }
      temp.Position = this.Position;

      if (this.Formula && this.Formula.ID) {
        temp.Formula = this.Formula;
        temp.Value = null;
      } else {
        if (!this.Value && this.Value !== 0) {
          MpMessage.error({ title: '保存失败', msg: '叼口空白尺寸不能为空' });
          return null;
        }
        if (!/^\d+$/.test(`${this.Value}`) || this.Value === 0) {
          MpMessage.error({ title: '保存失败', msg: '叼口空白尺寸设置不正确' });
          return null;
        }
        temp.Formula = null;
        temp.Value = this.Value;
      }
    }

    if (this.Type === GenerelMappingTypeEnum.Milling) { // 铣背
      if (this.Formula && this.Formula.ID) {
        temp.Formula = this.Formula;
        temp.Value = null;
      } else {
        if (!this.Value && this.Value !== 0) {
          MpMessage.error({ title: '保存失败', msg: '铣背值不能为空' });
          return null;
        }
        if (!/^\d+$/.test(`${this.Value}`) || this.Value === 0) {
          MpMessage.error({ title: '保存失败', msg: '铣背深度设置不正确' });
          return null;
        }
        temp.Formula = null;
        temp.Value = this.Value;
      }
    }

    return temp;
  }

  constructor(Type: GenerelMappingTypeEnum, item: GeneralMapItemClass | null) {
    this.Type = Type;

    if (!item) return;

    const data = item as unknown as RightPanelRuleForm;

    this.MoveType = data.MoveType;
    this.Formula = data.Formula;
    this.Value = data.Value;
    this.MoveOutFormula = data.MoveOutFormula;
    this.MoveOutValue = data.MoveOutValue;
    this.Position = data.Position;

    if (this.Type === GenerelMappingTypeEnum.Move) {
      if (this.Formula || this.Value) {
        this._MoveInChecked = true;
      }
      if (this.MoveOutFormula || this.MoveOutValue) {
        this._MoveOutChecked = true;
      }
    }
  }
}
