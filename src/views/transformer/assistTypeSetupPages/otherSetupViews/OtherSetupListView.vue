<template>
  <section class="wrap">
    <header>
      <Crumbs :list="crumbsList" />
      <div class="box">
        <h2 class="mp-common-title-wrap black">折手：</h2>
        <span class="c">{{ TransformerListPageData.curInstance.NeedFolding ? '需要' : '不需要' }}</span>
        <mp-button type="text" @click="visible = true">折手设置</mp-button>
      </div>
      <FoldWayDialog :visible.sync="visible" :NeedFolding="TransformerListPageData.curInstance.NeedFolding" @submit="onNeedFoldingSubmit" />
    </header>
    <main class="page-main">
      <ul v-if="TransformerListPageData.curInstance.NeedFolding">
        <li v-for="it in OtherSetupListClassData.DisplayPageTableList" :key="it.buttonContent">
          <div class="header">
            <h4 class="mp-common-title-wrap black">{{ it.title }}：</h4>
            <mp-button type="text" @click="onEditClick(it, null)">{{ it.buttonContent }}</mp-button>
            <span class="remark tips-box"> <i class="el-icon-warning"></i> {{ it.remark }}</span>
          </div>
          <ResultFormulaTableComp
            hiddenTip
            usePropList
            v-if="it.data && it.data.mapDataList.length > 0"
            :FormulaList='it.data.mapDataList'
            :PropertyList='it.data.rightDataList'
            :isLoading='it.data.loading'
            :showHeader="false"
            :getDisplayContent="it.data.getItemMapResult"
            :rightText="it.rightText"
            :renderColumns="it.renderColumns"
            :operationTitle="it.operationTitle"
            @setup='(e) => onEditClick(it, e)' @remove="(e) => onRemoveClick(it, e)"
          />
        </li>
      </ul>
    </main>
    <footer>
      <mp-button class="cancel-blue-btn" @click="goBackLastPage">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import Crumbs from '@/components/common/NewSetupComps/Crumbs.vue';
import { IListPageTableList, useTransformerStore } from '@/pinia/modules/transformer';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import router from '@/router';
import { goBackLastPage } from '@/router/handleRouterEach';
import { recordScrollPosition } from '@/assets/ts/recordScrollPositionMixin';
import { ResultFormulaTableComp } from '@/components/common/mpzj-sell-lib/lib';
import FoldWayDialog from './ListComps/FoldWayDialog.vue';
import { GeneralMapItemClass } from '@/pinia/modules/transformer/map/GeneralMapItemClass';

recordScrollPosition('.page-main');

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData, OtherSetupListClassData } = storeToRefs(transformerStore);

transformerStore.setOtherSetupListClassData(TransformerListPageData.value);

const crumbsList = computed(() => {
  const t = convertServerList.value.find(it => it.ID === TransformerListPageData.value?.ServerID);
  const serverName = t ? t.Name : '未获取到转换器名称';
  const partName = TransformerListPageData.value?.curPart?.Name || '';

  return [
    { name: `转换设置 ( ${serverName} )`, path: '/transformerList' },
    { name: `其它设置：${TransformerListPageData.value?.curEditProductName}   ${partName}` },
  ];
});

const visible = ref(false);

const onNeedFoldingSubmit = (NeedFolding: boolean) => { // 设置是否需要折手
  const cb = () => {
    visible.value = false;
  };
  TransformerListPageData.value.getFoldingSetup(NeedFolding, cb);
};

const onEditClick = (data: typeof OtherSetupListClassData.value.DisplayPageTableList[number], item: GeneralMapItemClass | null) => {
  OtherSetupListClassData.value.setCurTableData(data as IListPageTableList, item);
  OtherSetupListClassData.value.curSetupTableData.data.curEditItem = item;
  router.push('/otherLimitSetup');
};

const onRemoveClick = (data: typeof OtherSetupListClassData.value.DisplayPageTableList[number], item: GeneralMapItemClass) => {
  data.data.removeItem(item);
};

</script>

<script lang='ts'>
export default {
  name: 'OtherSetupListView',
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
  font-size: 14px;
  > header {
    height: 75px;
    padding: 20px;
    padding-top: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .box {
      display: flex;
      align-items: center;
      line-height: 20px;
      > h2 {
        font-weight: 700;
        margin-right: 4px;
      }

      > span.c {
        display: inline-block;
        width: 6em;
        font-size: 13px;
        font-weight: 700;
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
    padding-left: 20px;

    > ul {
      > li {
        > .header {
          display: flex;
          align-items: center;
          white-space: nowrap;
          line-height: 20px;

          h4 {
            min-width: 5em;
            margin-right: 1em;
            font-weight: 700;
          }

          button {
            margin-right: 2em;
            font-size: 13px;
          }

          .remark {
            font-size: 12px;
            width: 320px;
            // background-color: #fff;
          }
        }

        > .mp-erp-price-module-price-table-result-formula-table-comp-container {
          padding: 0;
          margin-top: 5px;
        }

        & + li {
          margin-top: 30px;
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding-top: 40px;
    padding-bottom: 20px;
  }
}
</style>
