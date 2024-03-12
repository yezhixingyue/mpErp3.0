<template>
  <section class="mp-developer-list-manage-page-wrap">
    <Header
     :condition="localDeveloperPageData.condition"
     :list="localDeveloperPageData.list"
     @setCondition="(e) => localDeveloperPageData.condition.setConditon(e)"
     @clear="() => localDeveloperPageData.clearCondition()"
     @getList="() => localDeveloperPageData.getList()"
     />

    <Main :list="localDeveloperPageData.list" :loading="localDeveloperPageData.loading" @resolve="handleResolve" @reject="handleReject" @lock="handleLock" />

    <footer>
      <MpPagination center
        :watchPage="localDeveloperPageData.condition.Page"
        :count="localDeveloperPageData.listNumber"
        :pageSize="localDeveloperPageData.condition.PageSize"
        :handlePageChange="(num) => localDeveloperPageData.getList(num)"
      />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import MpPagination from '@/components/common/Count.vue';
import { DeveloperListManageClass } from './js/DeveloperListManageClass';
import Header from './components/Header.vue';
import Main from './components/Main.vue';
import { getDeveloperTableList } from './js/utils';

const localDeveloperPageData = ref(new DeveloperListManageClass());

const handleResolve = (row: ReturnType<typeof getDeveloperTableList>, cb: () => void) => {
  localDeveloperPageData.value.check(row, cb);
};

const handleReject = (row: ReturnType<typeof getDeveloperTableList>, Remark: string, cb: () => void) => {
  localDeveloperPageData.value.refuse(row, Remark, cb);
};

const handleLock = (row: ReturnType<typeof getDeveloperTableList>) => {
  localDeveloperPageData.value.lock(row);
};

onMounted(() => {
  localDeveloperPageData.value.getList();
});
</script>

<script lang='ts'>
export default {
  name: 'DeveloperListManagePage',
};
</script>

<style scoped lang='scss'>
.mp-developer-list-manage-page-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-left: 8px;
  box-sizing: border-box;
  background-color: #f5f5f5;

  display: flex;
  flex-direction: column;

  > header, > footer {
    flex: none;
    background-color: #fff;
  }

  > main {
    flex: 1;
    overflow: hidden;
    background-color: #fff;
  }

  > footer {
    padding-bottom: 5px;
  }
}
</style>
