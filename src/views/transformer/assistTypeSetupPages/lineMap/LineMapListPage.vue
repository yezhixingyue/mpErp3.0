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
      <ResultFormulaTableCom
        hiddenTip
        usePropList
        v-if="GeneralMapDataClassData && GeneralMapDataClassData.mapDataList.length > 0"
        :FormulaList='GeneralMapDataClassData.mapDataList'
        :PropertyList='GeneralMapDataClassData.rightDataList'
        :isLoading='GeneralMapDataClassData.loading'
        :showHeader="false"
        :getDisplayContent="GeneralMapDataClassData.getItemMapResult"
        :rightText="'则'"
        @setup='onMapClick' @remove="onRemoveClick"
      />
      <div v-else-if="GeneralMapDataClassData && !GeneralMapDataClassData.loading" class="empty-box">
        <el-empty description="暂无禁止合拼条件"></el-empty>
      </div>
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
import ResultFormulaTableCom from '@/components/common/NewContionCommonComp/ResultFormulaTableComp/ResultFormulaTableCom.vue';
import { GenerelMappingTypeEnum, UseModuleEnum } from '@/store/modules/transformer/map/enum';
import { menuTypeEnum } from '@/store/modules/transformer/types';
import { LineMapItemClass } from './LineMapItemClass';

recordScrollPosition('.page-main');

console.log(router.currentRoute.params.pageType);

const title = router.currentRoute.params.pageType === menuTypeEnum.LineCount ? '生产线' : '组合生产线';

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData, GeneralMapDataClassData } = storeToRefs(transformerStore);

const crumbsList = computed(() => {
  const t = convertServerList.value.find(it => it.ID === TransformerListPageData.value?.ServerID);
  const serverName = t ? t.Name : '未获取到转换器名称';
  const partName = TransformerListPageData.value?.curPart?.Name || '';

  return [
    { name: `转换设置 ( ${serverName} )`, path: '/transformerList' },
    { name: `${title}映射：${TransformerListPageData.value?.curEditProductName}   ${partName}` },
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

transformerStore.setGeneralMapDataClassData(new LineMapItemClass(UseModuleEnum.NormalLine, GenerelMappingTypeEnum.NormalLine, TransformerListPageData.value));

</script>

<script lang='ts'>
export default {
  name: 'LineMapListPage',
};
</script>

<style scoped lang='scss'>
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
    }
  }
  > header, > main, > footer {
    background-color: #fff;
    flex: none;
    padding-right: 8px;
  }
  > main {
    flex: 1;
    overflow: hidden;
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
