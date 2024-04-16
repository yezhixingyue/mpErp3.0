<template>
  <section class="mp-doc-manage-page-right-article-list-comp-wrap">
    <header>
      <el-button type="primary" @click="onArticleManageClick(null)">新增页面</el-button>
    </header>
    <main class="mp-scroll-wrap">
      <!-- 空列表状态 -->
      <Empty v-if="!pageData.article.loading && !pageData.article.listNumber && !pageData.class.loading" />

      <!-- 文章列表 -->
      <Article v-for="it in pageData.article.list" :key="it.id" :item="it" :listNumber="pageData.article.listNumber" @command="oncommand" />

      <!-- 移动分类 -->
      <MoveDialog
        :visible.sync="visible"
        :classList="pageData.class.list"
        :moveArticle="handleType === 'move' ? pageData.article.currentArticle : undefined"
        :copyArticle="handleType === 'copy' ? pageData.article.currentArticle : undefined"
        @submit="onMoveOrCopySubmit"
       />

      <!-- 修改历史 -->
      <HistoryDialog :visible.sync="historyVisible" :article="pageData.article.currentArticle"  />
    </main>
    <footer>
      <MpPagination center
        v-show="pageData.article.listNumber"
        :watchPage="pageData.article.condition.Page"
        :count="pageData.article.listNumber"
        :pageSize="pageData.article.condition.Limit"
        :handlePageChange="(num) => {
          if (typeof pageData.article.condition.CategoryID === 'number') {
            pageData.article.getList(pageData.article.condition.CategoryID, num)
          }
        }"
      />
    </footer>

  </section>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/Count.vue';
import { DocManageClass } from '../../js/DocManageClass';
import Empty from './components/Empty.vue';
import Article from './components/Article.vue';
import { ArticleCommandType, IArticle, IDocClass } from '../../js/types';
import MoveDialog from '../MoveDialog/Index.vue';
import HistoryDialog from './components/HistoryDialog.vue';
import router from '@/router';
import { ref } from 'vue';

const props = defineProps({
  pageData: DocManageClass,
});

const onArticleManageClick = (item: null | IArticle, type: 'save' | 'view' = 'save') => {
  props.pageData.article.setCurrentArticle(item);
  router.push(`/articleManage/${type}${item ? `?id=${item.id}` : ''}`);
};

const visible = ref(false);
const handleType = ref<'move' | 'copy'>();

const historyVisible = ref(false);

const oncommand = (type: ArticleCommandType, item: IArticle, moveVal?: number) => { // moveVal 仅移动次序时有值
  switch (type) {
    case 'history':
      props.pageData.article.setCurrentArticle(item);
      historyVisible.value = true;
      break;

    case 'edit':
      onArticleManageClick(item);
      break;

    case 'view':
      onArticleManageClick(item, 'view');
      break;

    case 'remove':
      props.pageData.article.remove(item.id);
      break;

    case 'move':
      if (moveVal) props.pageData.article.moveIndex(item.id, moveVal - 1);
      break;

    case 'move2out':
      props.pageData.article.setCurrentArticle(item);
      handleType.value = 'move';
      visible.value = true;
      break;

    case 'copy':
      props.pageData.article.setCurrentArticle(item);
      handleType.value = 'copy';
      visible.value = true;
      break;

    default:
      break;
  }
};

const onMoveOrCopySubmit = (targetClass: IDocClass) => {
  const cb = () => {
    visible.value = false;
  };
  props.pageData.article.moveorcopy(targetClass, handleType.value, cb);
};

</script>

<style scoped lang='scss'>
.mp-doc-manage-page-right-article-list-comp-wrap {
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 40px 1fr 55px;
  padding-left: 30px;
  padding-right: 20px;

  > header {
    button {
      height: 34px;
      padding: 0;
      width: 110px;
      border-radius: 4px;
    }
  }

  > main {
    overflow: auto;
  }

  > footer {
    display: flex;
    padding-top: 5px;
    margin-right: -30px;
  }
}
</style>
