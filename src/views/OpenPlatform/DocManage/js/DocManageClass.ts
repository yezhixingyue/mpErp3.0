import { ManageClassList } from './ManageClassList';
import { ManageArticleList } from './ManageArticleList';

/** 帮助文档管理类 */
export class DocManageClass {
  curClassId: '' | number = ''

  class = new ManageClassList()

  article = new ManageArticleList()

  /** 切换文章分类 */
  switchClass(id: number) {
    if (this.curClassId === id) return;
    this.curClassId = id;
    this.article.getList(id);
  }

  async init() {
    await this.class.getList();

    if (this.class.classTreeList.length > 0) {
      this.switchClass(this.class.classTreeList[0].id);
    }
  }
}
