<template>
  <section class="wrap">
    <header>
      <Crumbs :list="crumbsList" />
      <div>
        <mp-button type="primary" size="small" @click="onMapClick(null)">+ 添加{{GeneralMapDataClassData?.title || ''}}映射</mp-button>
        <span class="warning ft-12 tips-box ml-47">
          <i class="el-icon-warning ft-14 mr-8  ml-5"></i>
          注：匹配多条，优先级数字越小，越优先匹配
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
        :getDisplayContent="getItemMapResult"
        :rightText="'则需要工序：'"
        :operationTitle="GeneralMapDataClassData.title"
        @setup='onMapClick' @remove="onRemoveClick"
      />
      <div v-else-if="GeneralMapDataClassData && !GeneralMapDataClassData.loading" class="empty-box">
        <el-empty description="暂无映射数据"></el-empty>
      </div>
    </main>
    <footer>
      <mp-button class="cancel-blue-btn" @click="goBackLastPage">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import Crumbs from '@/components/common/Crumbs.vue';
import { ResultFormulaTableComp } from 'mpzj-sell-lib';
import { useTransformerStore } from '@/store/modules/transformer';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import router from '@/router';
import { goBackLastPage } from '@/router/handleRouterEach';
import { recordScrollPosition } from '@/assets/js/recordScrollPositionMixin';
import { GeneralMapItemClass } from '@/store/modules/transformer/map/GeneralMapItemClass';
import { GenerelMappingTypeEnum, UseModuleEnum } from '@/store/modules/transformer/map/enum';
import { menuTypeEnum } from '@/store/modules/transformer/types';
import { WorkingMapItemClass } from './WorkingMapItemClass';

recordScrollPosition('.page-main');

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData, GeneralMapDataClassData } = storeToRefs(transformerStore);

const crumbsList = computed(() => {
  const t = convertServerList.value.find(it => it.ID === TransformerListPageData.value?.ServerID);
  const serverName = t ? t.Name : '未获取到转换器名称';
  const partName = TransformerListPageData.value?.curPart?.Name || '';

  return [
    { name: `转换设置 ( ${serverName} )`, path: '/transformerList' },
    { name: `${GeneralMapDataClassData.value?.title || ''}映射：${TransformerListPageData.value?.curEditProductName}   ${partName}` },
  ];
});

const onMapClick = (item: GeneralMapItemClass | null) => {
  if (GeneralMapDataClassData.value) GeneralMapDataClassData.value.curEditItem = item;
  router.push({ name: 'mapWorkingSetup', params: { pageType: router.currentRoute.params.pageType } });
};

const onRemoveClick = (item: GeneralMapItemClass) => {
  if (GeneralMapDataClassData.value) {
    GeneralMapDataClassData.value.removeItem(item);
  }
};

const getItemMapResult = (it: GeneralMapItemClass) => GeneralMapDataClassData.value?.getItemMapResult(it);

const UseModule = router.currentRoute.params.pageType === menuTypeEnum.WorkingCount ? UseModuleEnum.NormalWorking : UseModuleEnum.UnionWorking;

const Type = router.currentRoute.params.pageType === menuTypeEnum.WorkingCount ? GenerelMappingTypeEnum.NormalWorking : GenerelMappingTypeEnum.UnionWorking;

transformerStore.setGeneralMapDataClassData(new WorkingMapItemClass(UseModule, Type, TransformerListPageData.value));

</script>

<script lang='ts'>
export default {
  name: 'WorkingMapListPage',
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
      padding: 0 15px;
      // width: 150px;
      height: 30px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    }
    .tips-box {
      display: inline-block;
      line-height: 28px;
      background: #FFFBF6;
      width: 314px;
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
