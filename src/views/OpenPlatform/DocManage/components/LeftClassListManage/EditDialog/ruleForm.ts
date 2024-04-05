import { docApi } from '@/api/doc';
import { IClassEditData } from '../type';
import { MpMessage } from '@/assets/js/utils/MpMessage';

/** 新增|编辑分类 */
export class ClassSaveRuleForm {
  id: '' | number = ''

  Name = ''

  ParentID = -1

  _data: IClassEditData

  _sameLevelNames: string[] = [] // 同级别下的分类名称列表 - 判断重名使用

  constructor(data: IClassEditData) {
    this._data = data;

    let _level = 1;

    if (data.item) { // 编辑模式
      this.id = data.item.id;
      this.Name = data.item.categoryName;
      this.ParentID = data.item.categoryParentID;
      _level = data.item.categoryLevel;
    } else if (data.ParentItem) { // 创建模式
      this.ParentID = data.ParentItem.id;
      _level = data.ParentItem.categoryLevel + 1;
    }

    const _list = data.classList.filter(it => it.categoryLevel === _level && it.categoryParentID === this.ParentID && it.id !== this.id); // 同级非自身列表

    this._sameLevelNames = _list.map(it => it.categoryName);
  }

  async submit() {
    const params = { id: this.id, Name: this.Name, ParentID: this.ParentID };

    const resp = await docApi.getCategorySaveCategory(params).catch(() => null);
    if (resp?.data.Status === 1000) {
      if (this._data.item) { // 编辑
        const _index = this._data.classList.findIndex(it => it.id === this._data.item.id);
        if (_index > -1) this._data.classList.splice(_index, 1, resp.data.Data);
      } else { // 新增
        this._data.classList.push(resp.data.Data);
      }
      this._data.visible = false;
      MpMessage.dialogSuccess({ title: this._data.item ? '编辑成功' : '添加成功' });
    }
  }
}
