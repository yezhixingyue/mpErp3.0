<template>
  <section class="open-platform-doc-manage-wrap">
    <aside>
      <!-- 左侧分类管理 -->
      <LeftClassListManage />
    </aside>

    <main>
      <!-- 右侧文章列表 -->
      右侧文章列表
    </main>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import LeftClassListManage from './components/LeftClassListManage/Index.vue';
import { DocManageClass } from './js/DocManageClass';

const localPageData = ref(new DocManageClass());

onMounted(() => {
  localPageData.value.getClassList();
});

</script>

<script lang='ts'>
export default {
  name: 'DocManagePage',
};
</script>

<style scoped lang='scss'>
.open-platform-doc-manage-wrap {
  height: 100%;
  width: 100%;
  min-width: 1360px;
  box-sizing: border-box;
  background-color: #eee;
  padding-left: 8px;

  display: grid;
  grid-template-columns: 540px 1fr;
  grid-template-rows: 1fr;

  > aside, > main {
    background-color: #fff;
    padding-top: 30px;
  }
}
</style>
