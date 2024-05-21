// const WIKI_ADDRESS = 'http://file.ybz888.com:7006';
const WIKI_ADDRESS = process.env.NODE_ENV === 'development' ? 'http://192.168.3.85:5173' : 'http://file.ybz888.com:7006';

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
