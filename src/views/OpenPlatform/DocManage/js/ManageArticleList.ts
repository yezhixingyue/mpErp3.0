import { docApi } from '@/api/doc';
import { ManageArticleCondition } from './ManageArticleCondition';
import { IArticle } from './types';

export class ManageArticleList {
  condition = new ManageArticleCondition()

  list: IArticle[] = []

  listNumber = 0

  loading = false

  async getList(CategoryID: number, Page = 1) {
    this.condition.CategoryID = CategoryID;
    this.condition.Page = Page;
    this.list = [];

    this.loading = true;
    const resp = await docApi.getArticleList(this.condition.CategoryID, this.condition.Page, this.condition.Limit).catch(() => null);
    this.loading = false;

    if (resp?.data.Status === 1000) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }
}
