<template>
  <section class="wrap">
    <header>
      <Crumbs :list="crumbsList" />
    </header>
    <main>
      <el-table
        :data="data.leftDataList"
        stripe
        resizable
        border
        style="width: 100%">
        <el-table-column prop="Name" label="生产辅助信息" width="315" show-overflow-tooltip align="center" header-align="center" ></el-table-column>
        <el-table-column label="映射专色" show-overflow-tooltip class-name="l" label-class-name="h-l" min-width="400px">
          <template #default="scope">
            <span class="blue-span" @click="onMapClick(scope.row)">设置映射</span>
            <span class="p-names">{{data.getItemMapResult(scope.row.ID, data.mapDataList)}}</span>
          </template>
        </el-table-column>
        <template #empty>
          <div>
            <span class="ft-13 is-gray" v-show="!data.loading">暂无数据</span>
          </div>
        </template>
      </el-table>
      <SetupDialog :data="data" />
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
import { computed, ref } from 'vue';
import { goBackLastPage } from '@/router/handleRouterEach';
import { recordScrollPosition } from '@/assets/js/recordScrollPositionMixin';
import { WordsInfoMapClass, IWordsInfoLeftType } from './WordsInfoMapClass';
import SetupDialog from './SetupDialog.vue';

recordScrollPosition('.el-table__body-wrapper');

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData } = storeToRefs(transformerStore);

const productNameWithClass = computed(() => {
  const arr: string[] = [];
  if (TransformerListPageData.value?.curEditItem) {
    const { FirstLevel, SecondLevel } = TransformerListPageData.value.curEditItem.Class;
    if (FirstLevel && FirstLevel.Name) arr.push(FirstLevel.Name);
    if (SecondLevel && SecondLevel.Name) arr.push(SecondLevel.Name);
    arr.push(TransformerListPageData.value.curEditItem.Name);
  }
  return arr.join('-');
});

const curPart = computed(() => {
  if (TransformerListPageData.value?.curEditItem && TransformerListPageData.value.curPartID) {
    const curPart = TransformerListPageData.value.curEditItem.PartList.find(it => it.ID === TransformerListPageData.value?.curPartID);
    if (curPart) return curPart;
  }
  return null;
});

const crumbsList = computed(() => {
  const t = convertServerList.value.find(it => it.ID === TransformerListPageData.value?.ServerID);
  const serverName = t ? t.Name : '未获取到转换器名称';
  const partName = curPart.value?.Name || '产品';

  return [
    { name: `转换设置 ( ${serverName} )`, path: '/transformerList' },
    { name: `辅助文字信息映射：${productNameWithClass.value}   ${partName}` }, // 后面补充产品与部件信息
  ];
});

const onMapClick = (item: IWordsInfoLeftType) => {
  data.value.curEditItem = item;
  data.value.visible = true;
};

const data = ref(new WordsInfoMapClass(TransformerListPageData.value?.ServerID || ''));

console.log(TransformerListPageData.value?.curEditItem, TransformerListPageData.value?.curPartID);

</script>

<script lang='ts'>
export default {
  name: 'WordsInfoMapPage',
};
</script>

<style scoped lang='scss'>
.wrap {
  padding: 0 8px;
  background-color: #f5f5f5;
  height: 100%;
  display: flex;
  flex-direction: column;
  > header {
    height: 30px;
    padding: 15px 20px;
  }
  > header, > main, > footer {
    background-color: #fff;
    flex: none;
  }
  > main {
    flex: 1;
    overflow: hidden;
    :deep(.cell) {
      color: #444;
    }
    :deep(.l .cell) {
      margin-right: 30px;
      span {
        flex: none;
        &.blue-span {
          margin-left: 80px;
        }
        &.p-names {
          margin-left: 30px;
        }
      }
    }
    :deep(.h-l.cell) {
      margin-left: 150px;
    }
    :deep(.el-table) {
      height: 100%;
      .el-table__body-wrapper {
        overflow: auto;
        overflow: overlay;
        height: calc(100% - 37px);
      }
    }
  }
  > footer {
    text-align: center;
    padding-top: 50px;
    padding-bottom: 20px;
  }
}
</style>
