import { IMRCommonProperties, IMRCraft, IMRElement, IMRElementGroup, IMRPart, IMRProduct, IMRSizeGroup } from '../../../js/types';
import { SplitCharsRuleForm } from './SplitCharsRuleForm';

export class MRProductRuleForm extends SplitCharsRuleForm implements IMRPart {
  ID: string

  Material?: IMRCommonProperties;

  ElementList: IMRElement[];

  ElementGroupList: IMRElementGroup[];

  CraftList: IMRCraft[];

  SizeGroup?: IMRSizeGroup;

  Name = ''

  IsShowName = false

  CraftGroupList: IMRPart['CraftGroupList'] = []

  DisplayList: IMRPart['DisplayList'] = []

  /** 部件列表 */
  List: IMRPart[] = []

  constructor(item: IMRProduct) {
    super(item);

    this.ID = item.ID;
    this.Name = item.Name;
    this.IsShowName = item.IsShowName;

    this.ElementList = item.ElementList;
    this.ElementGroupList = item.ElementGroupList;
    this.CraftList = item.CraftList;

    if (item.Material) this.Material = item.Material;
    if (item.SizeGroup) this.SizeGroup = item.SizeGroup;

    if (item.CraftGroupList) this.CraftGroupList = item.CraftGroupList;
    if (item.DisplayList) this.DisplayList = item.DisplayList;

    if (item.List) this.List = item.List;
  }

  getParams() {
    if (!this.validChars()) return null;

    return { ...this };
  }
}
