import { docApi } from '@/api/doc';
import { IDocClass, IClassTreeItem } from './types';
import { MpMessage } from '@/assets/js/utils/MpMessage';

export class ManageClassList {
  /** 分类列表数据 */
  list: IDocClass[] = []

  loading = false

  /** 分类列表树形结构 */
  get classTreeList() {
    return ManageClassList.getClassTreeList(this.list);
  }

  /** 获取分类数据 */
  async getList() {
    this.list = [];

    this.loading = true;
    const resp = await docApi.getClassList().catch(() => null);
    this.loading = false;

    if (resp?.data.Status === 1000) {
      this.list = resp.data.Data;
    }
  }

  /** 删除分类 */
  async remove(item: IDocClass) {
    const resp = await docApi.getCategoryDeleteCategory(item.id).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      const cb = () => {
        this.list = this.list.filter(it => it.id !== item.id);
      };

      MpMessage.success({
        title: '删除成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /** 移动分类 交换分类 上移-1 下移1  */
  async exchange(item: IDocClass, direction: 1 | -1) {
    const resp = await docApi.getCategoryMoveCategory(item.id, direction).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      const target = this.list.find(it => it.id === resp.data.Data);
      if (target) {
        const _order = target.categoryOrder;
        target.categoryOrder = item.categoryOrder;

        const temp1 = { ...item, categoryOrder: _order };
        const temp2 = { ...target };

        const _list = this.list.filter(it => it.id !== temp1.id && it.id !== temp2.id);

        this.list = [..._list, temp1, temp2];
      }
    }
  }

  /** 移动到其他分类 */
  async move2Other(item: IDocClass, parentId: number) {
    const resp = await docApi.getCategoryMoveCategoryToParent(item.id, parentId).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      const i = this.list.findIndex(it => it.id === item.id);
      if (i > -1) {
        this.list.splice(i, 1, resp.data.Data);
      }

      MpMessage.dialogSuccess({ title: '移动成功' });

      return true;
    }

    return false;
  }

  static config = {
    maxLevel: 2, // 最大目录层级
  }

  /** 获取分类列表树形结构  excludedId：需要被排除的分类及其下属子分类 */
  static getClassTreeList(classList: IDocClass[], excludedId?: number) {
    if (classList.length > 0) {
      let _classList = classList;

      if (typeof excludedId === 'number') {
        // 对_classList 进行筛选
        _classList = _classList.filter(it => it.id !== excludedId && it.categoryParentID !== excludedId); // 较简单处理 - 未递归筛选子分类 - 不影响多层次使用 - 有优化空间
      }

      const _getChildren = (list: IClassTreeItem[], level = 1, parentId = -1) => {
        if (_classList.length === 0 || level > this.config.maxLevel) return [];

        const _list: IClassTreeItem[] = _classList.filter(it => it.categoryLevel === level && it.categoryParentID === parentId)
          .sort((a, b) => a.categoryOrder - b.categoryOrder)
          .map(it => ({ ...it, children: [], deep: 0 }));

        const _ids = _list.map(it => it.id);

        _classList = _classList.filter(it => !_ids.includes(it.id));

        _list.forEach(_it => _getChildren(_it.children, level + 1, _it.id));

        list.push(..._list);

        return list;
      };

      const list = _getChildren([]);

      const _getDeep = (it: IClassTreeItem) => {
        let _deep = 1;
        if (it.children.length > 0) {
          _deep = Math.max(...it.children.map(child => (_getDeep(child) + 1)));
        }

        const _it = it;
        _it.deep = _deep;

        return _deep;
      };

      list.forEach(it => _getDeep(it));

      return list;
    }

    return [];
  }
}
