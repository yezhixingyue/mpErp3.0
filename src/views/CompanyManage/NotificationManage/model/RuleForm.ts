import { IMessageMember } from '../types';
import { SystemMessageTypeEnum } from '../types/enum';

export class RuleForm implements IMessageMember {
  ID = ''

  Types: SystemMessageTypeEnum[] = []

  constructor(item: null | IMessageMember) {
    if (item) {
      this.ID = item.ID;
      this.Types = [...item.Types];
    }
  }

  getParams():IMessageMember {
    return {
      ID: this.ID,
      Types: [...this.Types],
    };
  }
}
