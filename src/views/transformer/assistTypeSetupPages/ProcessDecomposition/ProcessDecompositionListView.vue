<template>
  <section class="wrap">
    <header>
      <Crumbs :list="crumbsList" />
      <div class="box">
        <mp-button type="primary" size="small"  style="margin-right: 25px;" @click="onSetupClick(null)">+ 添加条件</mp-button>

        <p class="tips-box" style="width: 320px;"><i class="el-icon-warning"></i> 注：仅匹配1条，优先级数字越小，越优先匹配</p>
      </div>
    </header>
    <main class="page-main">
      <ResultFormulaTableComp
        hiddenTip
        usePropList
        v-if="processDecompositionStore && processDecompositionStore.list.length > 0"
        :FormulaList='processDecompositionStore.list'
        :PropertyList='processDecompositionStore.propertyList'
        :isLoading='processDecompositionStore.loading'
        :showHeader="false"
        :getDisplayContent="() => '人工工艺分解'"
        :rightText="'则需要工序:'"
        operationTitle="工艺分解条件"
        @setup='onSetupClick' @remove="onRemoveClick"
       />
      <div v-else-if="processDecompositionStore && processDecompositionStore.list.length === 0 && !processDecompositionStore.loading" class="empty-box">
        <mp-empty description="暂无工艺分解条件"></mp-empty>
      </div>
    </main>
    <footer>
      <mp-button class="cancel-blue-btn" @click="goBackLastPage">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import Crumbs from '@/components/common/NewSetupComps/Crumbs.vue';
import { useTransformerStore } from '@/pinia/modules/transformer';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import router from '@/router';
import { goBackLastPage } from '@/router/handleRouterEach';
import { recordScrollPosition } from '@/assets/ts/recordScrollPositionMixin';
import { ResultFormulaTableComp } from '@/components/common/mpzj-sell-lib/lib';
import { processDecompositionStore } from './store';
import { ProcessDecompositionClass } from './ProcessDecompositionClass';

recordScrollPosition('.page-main');

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData } = storeToRefs(transformerStore);

const crumbsList = computed(() => {
  const t = convertServerList.value.find(it => it.ID === TransformerListPageData.value?.ServerID);
  const serverName = t ? t.Name : '未获取到转换器名称';
  const partName = TransformerListPageData.value?.curPart?.Name || '';

  return [
    { name: `转换设置 ( ${serverName} )`, path: '/transformerList' },
    { name: `工艺分解：${TransformerListPageData.value?.curEditProductName}   ${partName}` },
  ];
});

const onSetupClick = (item) => {
  processDecompositionStore.value.item = item;
  router.push('/processDecompositionSetup');
};

const onRemoveClick = (item) => {
  processDecompositionStore.value.remove(item.Constraint.ConstraintID);
};

processDecompositionStore.value = null;
onMounted(() => {
  if (TransformerListPageData.value.curEditItem) {
    processDecompositionStore.value = new ProcessDecompositionClass(TransformerListPageData.value.curEditItem);

    setTimeout(() => {
      processDecompositionStore.value.getList();
      processDecompositionStore.value.getPropertyList();
    }, 5);
  }
});
</script>

<script lang='ts'>
export default {
  name: 'ProcessDecompositionListView',
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
