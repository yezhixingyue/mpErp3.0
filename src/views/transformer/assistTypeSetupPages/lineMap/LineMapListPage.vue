<template>
  <section class="wrap">
    <header>
      <Crumbs :list="crumbsList" />
      <div>
        <mp-button type="primary" size="small" @click="onMapClick(null)">+ 添加{{GeneralMapDataClassData?.title || ''}}映射</mp-button>
        <span class="warning ft-12 tips-box ml-47">
          <i class="el-icon-warning ft-14 mr-8  ml-5"></i>
          注：仅匹配一条，优先级数字越小，越优先匹配
        </span>
      </div>
      <div class="default ft-12" v-if="GeneralMapDataClassData">
        <span class="blue-span mr-20" @click="onSetDefaultClick">设置默认{{GeneralMapDataClassData.title}}</span>
        <span class="line" :title="curDefaultLine?.Name || ''">{{curDefaultLine?.Name || '未设置'}}</span>
        <span> ( 无匹配时，使用默认生产线 )</span>
      </div>
      <DefaultLineDialog v-if="GeneralMapDataClassData" :visible.sync="visible" :lineData="curDefaultLine" :data="GeneralMapDataClassData" />
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
        :rightText="'则选择：'"
        :operationTitle="GeneralMapDataClassData.title"
        @setup='onMapClick' @remove="onRemoveClick"
      />
      <div v-else-if="GeneralMapDataClassData && !GeneralMapDataClassData.loading" class="empty-box">
        <mp-empty description="暂无映射数据"></mp-empty>
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
import { computed, ref } from 'vue';
import router from '@/router';
import { goBackLastPage } from '@/router/handleRouterEach';
import { recordScrollPosition } from '@/assets/ts/recordScrollPositionMixin';
import { GeneralMapItemClass } from '@/pinia/modules/transformer/map/GeneralMapItemClass';
import { GenerelMappingTypeEnum, UseModuleEnum } from '@/pinia/modules/transformer/map/enum';
import { menuTypeEnum } from '@/pinia/modules/transformer/types';
import { LineMapItemClass } from './LineMapItemClass';
import DefaultLineDialog from './DefaultLineDialog.vue';

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
  router.push({ name: 'mapLineSetup', params: { pageType: router.currentRoute.params.pageType } });
};

const onRemoveClick = (item: GeneralMapItemClass) => {
  if (GeneralMapDataClassData.value) {
    GeneralMapDataClassData.value.removeItem(item);
  }
};

const getItemMapResult = (it: GeneralMapItemClass) => GeneralMapDataClassData.value?.getItemMapResult(it);

const UseModule = router.currentRoute.params.pageType === menuTypeEnum.LineCount ? UseModuleEnum.NormalLine : UseModuleEnum.UnionLine;

const Type = router.currentRoute.params.pageType === menuTypeEnum.LineCount ? GenerelMappingTypeEnum.NormalLine : GenerelMappingTypeEnum.UnionLine;

transformerStore.setGeneralMapDataClassData(new LineMapItemClass(UseModule, Type, TransformerListPageData.value));

const visible = ref(false);
const onSetDefaultClick = () => {
  visible.value = true;
};

const curDefaultLine = computed(() => {
  let temp = { ID: '', Name: '' };
  if (!TransformerListPageData.value) return temp;
  if (router.currentRoute.params.pageType === menuTypeEnum.LineCount) { // 普通生产线
    const _part = TransformerListPageData.value.curPart || TransformerListPageData.value.curEditItem;
    if (_part?.DefaultLine) temp = _part.DefaultLine;
  } else if (TransformerListPageData.value.curEditItem?.DefaultUnionLine) {
    temp = TransformerListPageData.value.curEditItem.DefaultUnionLine;
  }
  if (temp.ID && !temp.Name && GeneralMapDataClassData.value && GeneralMapDataClassData.value.leftDataList.length > 0) {
    const t = GeneralMapDataClassData.value.leftDataList.find(it => it.ID === temp.ID);
    temp.Name = t?.Name || '未知生产线';
  }
  return temp;
});

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
    position: relative;
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
    .default {
      position: absolute;
      right: 21px;
      bottom: 15px;
      .line {
        font-weight: 700;
        display: inline-block;
        min-width: 7em;
        text-align: right;
        max-width: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: top;
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
