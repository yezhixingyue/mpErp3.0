import { RawLocation } from 'vue-router';

export interface IEditableTabItem {
  title: string
  name: string
  path: RawLocation
  closable: boolean
  isNew?: boolean
  pageName?: string
}
