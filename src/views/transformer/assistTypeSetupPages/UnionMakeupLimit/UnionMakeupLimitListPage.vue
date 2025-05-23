<template>
  <section class="wrap">
    <header>
      <Crumbs :list="crumbsList" />
      <div>
        <mp-button type="primary" size="small" @click="onMapClick(null)">+ 添加禁止合拼条件</mp-button>
        <span class="warning ft-12 tips-box ml-47">
          <i class="el-icon-warning ft-14 mr-8 ml-5"></i>
          注：匹配任意一条，则不允许合拼
        </span>
      </div>
    </header>
    <main class="page-main">
      <ResultFormulaTableComp
        hiddenTip
        usePropList
        v-if="GeneralMapDataClassData && GeneralMapDataClassData.mapDataList.length > 0"
        :FormulaList='GeneralMapDataClassData.mapDataList'
        :PropertyList='GeneralMapDataClassData.rightDataList'
        :isLoading='GeneralMapDataClassData.loading'
        :showHeader="false"
        :getDisplayContent="GeneralMapDataClassData.getItemMapResult"
        :rightText="'则'"
        :renderColumns="renderColumns"
        operationTitle="禁止合拼条件"
        @setup='onMapClick' @remove="onRemoveClick"
       />
      <div v-else-if="GeneralMapDataClassData && !GeneralMapDataClassData.loading" class="empty-box">
        <mp-empty description="暂无禁止合拼条件"></mp-empty>
      </div>
    </main>
    <footer>
      <mp-button class="cancel-blue-btn" @click="goBackLastPage">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import Crumbs from '@/components/common/NewSetupComps/Crumbs.vue';
import { ResultFormulaTableComp } from '@/components/common/mpzj-sell-lib/lib';
import { useTransformerStore } from '@/pinia/modules/transformer';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import router from '@/router';
import { goBackLastPage } from '@/router/handleRouterEach';
import { recordScrollPosition } from '@/assets/ts/recordScrollPositionMixin';
import { GeneralMapItemClass } from '@/pinia/modules/transformer/map/GeneralMapItemClass';
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

const onRemoveClick = (item: GeneralMapItemClass) => {
  if (GeneralMapDataClassData.value) {
    GeneralMapDataClassData.value.removeItem(item);
  }
};

const renderColumns = [{
  renderFunc: (item) => (item.NeedSetPlateSize ? '手动设置拼版尺寸' : ''),
  width: 140,
}];

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
  padding-left: 8px;
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
      i {
        vertical-align: -1px;
      }
    }
  }
  > header, > main, > footer {
    background-color: #fff;
    flex: none;
    padding-right: 8px;
  }
  > main {
    flex: 1;
    overflow: auto;
    overflow: overlay;
    @include scroll;
    padding-left: 1px;
    .empty-box {
      width: 100%;
      height: 100%;
      padding-top: 5vh;
      border: 1px solid #eee;
      box-sizing: border-box;
    }
    .mp-erp-price-module-price-table-result-formula-table-comp-container {
      padding: 0;
    }
  }
  > footer {
    text-align: center;
    padding-top: 40px;
    padding-bottom: 20px;
  }
}
</style>
