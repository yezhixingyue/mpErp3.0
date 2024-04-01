import { docApi } from '@/api/doc';
import { IDocClass } from './types';

/** 帮助文档管理类 */
export class DocManageClass {
  classList: IDocClass[] = []

  articleList = []

  loading = false

  async getClassList() {
    const resp = await docApi.getClassList().catch(() => null);

    console.log(resp);
  }

  async getArticleList() {
    console.log('getArticleList');
  }
}
