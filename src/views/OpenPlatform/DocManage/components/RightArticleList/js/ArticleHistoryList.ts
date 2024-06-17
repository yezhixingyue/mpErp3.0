import { docApi } from '@/api/doc';
import { IArticle, IArticleHistory } from '../../../js/types';
import { formatDateForDisplay } from '@/assets/ts/filter';

export class ArticleHistoryList {
  articleID: string

  Page = 1

  Limit = 10

  list: IArticleHistory[] = []

  listNumber = 0

  loading = false

  constructor(data: IArticle) {
    this.articleID = data.id;

    this.getList();
  }

  async getList(Page = 1) {
    this.Page = Page;
    this.list = [];

    this.loading = true;
    const resp = await docApi.getLogGetArticleLogs(this.articleID, this.Page, this.Limit).catch(() => null);
    this.loading = false;

    if (resp?.data.Status === 1000) {
      const _list = resp.data.Data.map(it => ({ ...it, operateTime: formatDateForDisplay(it.operateTime) }));
      this.list = _list;
      this.listNumber = resp.data.DataNumber;
    }
  }
}
