<template>
  <section class="mp-doc-article-manage-view-wrap">
    <EditView
     v-if="router.currentRoute.params.type === 'save' && localPageData.curClassId"
     :classId="localPageData.curClassId"
     :currentArticle="localPageData.article.currentArticle"
     />
    <PreviewView
     v-if="router.currentRoute.params.type === 'view' && localPageData.article.currentArticle"
     :article="localPageData.article.currentArticle"
     />
  </section>
</template>

<script setup lang='ts'>
import router from '@/router';
import { localPageData } from '../../js/store';
import EditView from './views/Edit/EditView.vue';
import PreviewView from './views/PreviewView.vue';

</script>

<script lang='ts'>
export default {
  name: 'ManageArticlePage',
};
</script>

<style scoped lang='scss'>
.mp-doc-article-manage-view-wrap {
  height: 100%;
  box-sizing: border-box;
  padding-left: 10px;
  background-color: rgb(245, 245, 245);

  > section {
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
  }
}
</style>
