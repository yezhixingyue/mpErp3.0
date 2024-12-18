import { wikiServerURL } from '@/config';

const WIKI_ADDRESS = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5173' : wikiServerURL;

export class WikiHandler {
  static generateQueryString(query: { [key: string]: string | number }) {
    const queryString = Object.entries(query).map(([key, val]) => `${key}=${val?.toString()}`).join('&');
    return queryString;
  }

  static getJumpUrl(query: { [key: string]: string | number }) { // 获取要跳转的wiki页面地址
    const { token, siteType, target } = query;
    if (!token || (!siteType && siteType !== 0) || !target) return '';

    const queryString = this.generateQueryString(query);

    return `${WIKI_ADDRESS}/init?${queryString}`;
  }

  static toWikiPageWithToken(query: { [key: string]: string | number }, replace = false) { // 跳转至wiki页面
    const _url = this.getJumpUrl(query);

    if (!_url) return;

    if (replace) {
      window.location.replace(_url);
      return;
    }

    window.open(_url);
  }
}
