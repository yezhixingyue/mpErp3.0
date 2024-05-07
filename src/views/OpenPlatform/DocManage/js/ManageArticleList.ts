import { docApi } from '@/api/doc';
import { ManageArticleCondition } from './ManageArticleCondition';
import { IArticle, IDocClass } from './types';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { Message } from 'element-ui';

export class ManageArticleList {
  condition = new ManageArticleCondition()

  list: IArticle[] = []

  listNumber = 0

  loading = false

  currentArticle: null | IArticle = null

  setCurrentArticle(item: null | IArticle) {
    this.currentArticle = item;
  }

  async getList(CategoryID: number, Page = 1) {
    this.condition.CategoryID = CategoryID;
    this.condition.Page = Page;
    this.list = [];

    this.loading = true;
    const resp = await docApi.getArticleList(this.condition.CategoryID, this.condition.Page, this.condition.Limit).catch(() => null);
    this.loading = false;

    if (resp?.data.Status === 1000) {
      this.list = resp.data.Data || [];
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 文章删除 */
  async remove(articleID: string) {
    const resp = await docApi.getArticleDeleteArticle(articleID).catch(() => null);

    if (resp?.data.Status === 1000) {
      const cb = () => {
        const i = this.list.findIndex(it => it.id === articleID);
        if (i > -1) {
          this.list.splice(i, 1);
          this.listNumber -= 1;
        }
      };

      MpMessage.success({
        title: '删除成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /** 移动次序 */
  async moveIndex(articleID: string, index: number) {
    const resp = await docApi.getArticleAdjustArticleOrder(articleID, index).catch(() => null);

    if (resp?.data.Status === 1000) {
      const i = this.list.findIndex(it => it.id === articleID);
      if (i < 0) return;
      const item = this.list[i];

      this.list.splice(i, 1);

      // 移动到了其它页
      if (index >= this.condition.Page * this.condition.Limit || index < (this.condition.Page - 1) * this.condition.Limit) {
        Message({ showClose: true, message: '移动成功，已移动至其他页面', type: 'success' });
      } else {
        // 在当前页面内移动
        const _index = index - (this.condition.Page - 1) * this.condition.Limit;
        this.list.splice(_index, 0, item);
        Message({ showClose: true, message: '移动成功', type: 'success' });
      }
    }
  }

  /** 移动|复制文章 */
  async moveorcopy(targetClass: IDocClass, type: 'move' | 'copy', callback: () => void) {
    const _apiFunc = type === 'move' ? docApi.getArticleMoveArticleToCategory : docApi.getArticleCopyArticle;

    const resp = await _apiFunc(this.currentArticle.id, targetClass.id);

    if (resp?.data.Status === 1000) {
      const title = type === 'move' ? '移动成功' : '复制成功';
      const cb = () => {
        if (type === 'copy') { // 复制
          if (targetClass.id === this.currentArticle.categoryID) { // 在本分类内复制
            if (Math.ceil(this.listNumber / this.condition.Limit) === this.condition.Page) {
              this.list.push(resp.data.Data);
            }
            this.listNumber += 1;
          }
        } else { // 移动走了
          this.list = this.list.filter(it => it.id !== this.currentArticle.id);
          this.listNumber -= 1;
        }
        callback();
      };
      MpMessage.success({
        title,
        onOk: cb,
        onCancel: cb,
      });
    }
  }
}
