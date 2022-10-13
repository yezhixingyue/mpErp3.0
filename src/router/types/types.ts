export interface IRouteTreeItem {
  name: string
  children: IRouteTreeItem[]
}

export interface IRouteTree {
  name: string;
  isModuleRoot: boolean;
  children: IRouteTreeItem[];
}
