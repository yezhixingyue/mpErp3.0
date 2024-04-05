<template>
  <section class="mp-doc-manage-page-right-article-list-comp-wrap">
    <header>
      <el-button type="primary">新增页面</el-button>
    </header>
    <main>
      <!-- 空列表状态 -->
      <Empty v-if="!pageData.article.loading && !pageData.article.listNumber" />

      <!-- 文章列表 -->
      <Article v-for="it in pageData.article.list" :key="it.id" :item="it" />
    </main>
    <footer>
      footer 分页
    </footer>

  </section>
</template>

<script setup lang='ts'>
import { DocManageClass } from '../../js/DocManageClass';
import Empty from './components/Empty.vue';
import Article from './components/Article.vue';

defineProps({
  pageData: DocManageClass,
});
</script>

<style scoped lang='scss'>
.mp-doc-manage-page-right-article-list-comp-wrap {
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 40px 1fr 50px;
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
}
</style>
