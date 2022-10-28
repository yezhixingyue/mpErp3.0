<template>
  <section class="wrap">
    <header>
      <Crumbs :list="crumbsList" />
      <div>
        <mp-button type="primary" size="small" @click="onMapClick(null)">+ 添加禁止合拼条件</mp-button>
        <span class="warning ft-12 tips-box ml-47">
          <i class="el-icon-warning ft-14"></i>
          注：匹配任意一条，则不允许合拼
        </span>
      </div>
    </header>
    <main class="page-main">
      main
    </main>
    <footer>
      <mp-button class="cancel-blue-btn" @click="goBackLastPage">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import Crumbs from '@/components/common/Crumbs.vue';
import { useTransformerStore } from '@/store/modules/transformer';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import router from '@/router';
import { goBackLastPage } from '@/router/handleRouterEach';
import { recordScrollPosition } from '@/assets/js/recordScrollPositionMixin';
import { GeneralMapItemClass } from '@/store/modules/transformer/map/GeneralMapItemClass';
import { UnionMakeupLimitItemClass } from './UnionMakeupLimitItemClass';

recordScrollPosition('.page-main');

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData, GeneralMapDataClassData } = storeToRefs(transformerStore);

const crumbsList = computed(() => {
  const t = convertServerList.value.find(it => it.ID === TransformerListPageData.value?.ServerID);
  const serverName = t ? t.Name : '未获取到转换器名称';
  const partName = TransformerListPageData.value?.curPart?.Name || '';

  return [
    { name: `转换设置 ( ${serverName} )`, path: '/transformerList' },
    { name: `合拼设置：${TransformerListPageData.value?.curEditProductName}   ${partName}` },
  ];
});

const onMapClick = (item: GeneralMapItemClass | null) => {
  if (GeneralMapDataClassData.value) GeneralMapDataClassData.value.curEditItem = item;
  router.push('/unionMakeupLimitSetup');
};

transformerStore.setGeneralMapDataClassData(new UnionMakeupLimitItemClass(TransformerListPageData.value));

</script>

<script lang='ts'>
export default {
  name: 'UnionMakeupLimitListPage',
};
</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.wrap {
  padding: 0 8px;
  background-color: #f5f5f5;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > header {
    height: 75px;
    padding: 20px;
    padding-top: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    button {
      font-size: 14px;
      padding: 0;
      width: 150px;
      height: 30px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    }
    .tips-box {
      display: inline-block;
      line-height: 28px;
      background: #FFFBF6;
      width: 243px;
    }
  }
  > header, > main, > footer {
    background-color: #fff;
    flex: none;
  }
  > main {
    flex: 1;
    overflow: auto;
    overflow: overlay;
    @include scroll;
  }
  > footer {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 20px;
  }
}
</style>
