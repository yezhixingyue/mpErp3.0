// 导入button组件
import _EpCascader from './EpCascader';
import _CommonDialogComp from './CommonDialogComp';
import _LRWidthDragAutoChangeComp from './LRWidthDragAutoChangeComp';
import _Pager from './Pager';
import _Button from './Button';

import _PropertyClass from './js/PropertyClass';
import _PropertyUtils from './js/PropertyClass/propertyUtils';
import _utils from './js/util';

import _FormulaPanelElementSelectDialog from './FormulaPanelElementSelectDialog';
import _ResultFormulaTableComp from './ResultFormulaTableComp';
import _ADAreaDialogSelector from './ADAreaDialogSelector';
import _ADAreaTreeContentComp from './ADAreaTreeContentComp';
import _ContionCommonComp from './ContionCommonComp';
import _SearchInputComp from './SearchInputComp';

// 组件列表
const components = [
  _EpCascader,
  _CommonDialogComp,
  _LRWidthDragAutoChangeComp,
  _FormulaPanelElementSelectDialog,
  _ResultFormulaTableComp,
  _ADAreaDialogSelector,
  _ADAreaTreeContentComp,
  _ContionCommonComp,
  _SearchInputComp,
  _Pager,
  _Button,
];

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，那么所有的组件都会被注册
const install = (Vue) => {
  // 判断是否安装
  if (install.installed) return;
  // 遍历注册全局组件
  components.map((component) => Vue.component(component.name, component));
};

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export const EpCascader = _EpCascader;

export const CommonDialogComp = _CommonDialogComp;
export const LRWidthDragAutoChangeComp = _LRWidthDragAutoChangeComp;
export const FormulaPanelElementSelectDialog = _FormulaPanelElementSelectDialog;
export const ResultFormulaTableComp = _ResultFormulaTableComp;
export const ADAreaDialogSelector = _ADAreaDialogSelector;
export const ADAreaTreeContentComp = _ADAreaTreeContentComp;
export const ContionCommonComp = _ContionCommonComp;
export const SearchInputComp = _SearchInputComp;

export const Pager = _Pager;

export const Button = _Button;

export const PropertyClass = _PropertyClass;

export const utils = _utils;

export const PropertyUtils = _PropertyUtils;

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  EpCascader,
  CommonDialogComp,
  LRWidthDragAutoChangeComp,
  FormulaPanelElementSelectDialog,
  ResultFormulaTableComp,
  ADAreaDialogSelector,
  ADAreaTreeContentComp,
  ContionCommonComp,
  SearchInputComp,
  Pager,
  Button,
  utils,
  PropertyClass,
  PropertyUtils,
};
