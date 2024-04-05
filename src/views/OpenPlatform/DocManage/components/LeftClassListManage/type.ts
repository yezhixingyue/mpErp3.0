import { IDocClass } from '../../js/types';

export interface IClassEditData {
  visible: boolean
  item: null | IDocClass
  ParentItem: null | IDocClass
  classList: IDocClass[]
}

export type CommandType = 'up' | 'down' | 'move' | 'edit' | 'remove' | 'switch' | 'create';
