import { docApi } from '@/api/doc';
import { docBaseURL } from '@/api/doc/instance';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { goBackLastPage } from '@/router';
import { DocTypeEnum } from '@/views/OpenPlatform/DocManage/js/enum';
import { localPageData } from '@/views/OpenPlatform/DocManage/js/store';
import { IArticle } from '@/views/OpenPlatform/DocManage/js/types';

export class ArticleForm {
  id = ''

  categoryID: number

  helpdocuTitle = ''

  helpdocuContent = ''

  helpdocuType = DocTypeEnum.doc

  helpdocuURL = ''

  internalID = ''

  constructor(categoryID: number, data: IArticle | null) {
    this.categoryID = categoryID;

    if (data) {
      this.id = data.id;
      this.helpdocuTitle = data.helpdocuTitle;
      this.helpdocuType = data.helpdocuType;

      if (data.helpdocuType === DocTypeEnum.doc) {
        // this.helpdocuContent = data.helpdocuContent;
        this.helpdocuContent = data.helpdocuContent.replaceAll('mpzj_origin_domain_address', docBaseURL);
      } else {
        this.helpdocuURL = data.helpdocuURL || '';
        this.internalID = data.internalID && data.internalID !== '00000000-0000-0000-0000-000000000000' ? data.internalID : '';
      }
    }
  }

  _remarkVisible = false // 仅编辑时需要设置备注

  _validateAndSetInteralID() {
    if (!this.helpdocuTitle) {
      MpMessage.error({ title: '保存失败', msg: '请输入文章标题' });
      return false;
    }
    if (this.helpdocuType === DocTypeEnum.doc) { // 文档
      if (!this.helpdocuContent) {
        MpMessage.error({ title: '保存失败', msg: '请输入文章内容' });
        return false;
      }
    } else { // 引用
      if (!this.helpdocuURL) {
        MpMessage.error({ title: '保存失败', msg: '请设置URL' });
        return false;
      }

      // eslint-disable-next-line no-useless-escape
      const reg = /(^(http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/;

      if (!reg.test(this.helpdocuURL)) {
        MpMessage.error({ title: '保存失败', msg: 'Url格式不正确' });
        return false;
      }

      const _url = new URL(this.helpdocuURL);

      const _content = [_url.hash, _url.search].filter(it => it)[0] || '';

      const searchParams = _content.split('?')[1]?.replace('?', '').split('&').map(it => ({
        [it.split('=')[0]]: it.split('=')[1],
      }));

      const t = searchParams?.find(it => it.id) || '';
      if (t && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(`${t.id}`)) {
        this.internalID = t.id;
      }

      // if (window.location.host === _url.host) { // 此处后续需要扩展用户地址
      //   const searchParams = _url.hash.split('?')[1]?.replace('?', '').split('&').map(it => ({
      //     [it.split('=')[0]]: it.split('=')[1],
      //   }));

      //   const t = searchParams.find(it => it.id);
      //   if (t && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(`${t.id}`)) {
      //     this.internalID = t.id;
      //   }
      // }
    }

    return true;
  }

  submit() {
    // 1. 重置部分字段
    this.internalID = '';

    // 2. 验证且对internalID赋值
    if (!this._validateAndSetInteralID()) return;

    // 3. 设置备注
    if (this.id) { // 编辑模式
      this._remarkVisible = true;
      return;
    }

    // 4. 如果新增时则直接提交
    this.finally();
  }

  _getParams(remark?: string) {
    const temp = { ...this, operateRemark: remark || '' };

    if (this.helpdocuType !== DocTypeEnum.doc) {
      temp.helpdocuContent = '';
    } else {
      temp.helpdocuURL = '';
      // 替换三方资源
      temp.helpdocuContent = temp.helpdocuContent.replaceAll(docBaseURL, 'mpzj_origin_domain_address');
    }

    return temp;
  }

  async finally(remark?: string) { // 最终的接口提交
    const params = this._getParams(remark);

    const resp = await docApi.getArticleSaveArticle(params);

    if (resp.data.Status === 1000) {
      const title = this.id ? '编辑成功' : '添加成功';
      // 1. 关闭弹窗
      if (this._remarkVisible) this._remarkVisible = false;

      const cb = () => {
        // 2. 对数据的修改
        if (this.id) { // 编辑
          const i = localPageData.value.article.list.findIndex(it => it.id === this.id);
          if (i > -1) {
            localPageData.value.article.list.splice(i, 1, resp.data.Data);
          }
        } else { // 新增
          localPageData.value.article.list.unshift(resp.data.Data);
          localPageData.value.article.listNumber += 1;
        }

        // 3. 路由页面的返回
        goBackLastPage();
      };

      MpMessage.success({ title, onOk: cb, onCancel: cb });
    }
  }
}
