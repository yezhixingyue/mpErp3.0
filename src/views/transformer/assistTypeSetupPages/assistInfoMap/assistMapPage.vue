<template>
  <section class="assist-page">
    <header>
      <Crumbs :list="crumbsList" />
    </header>
    <main>
      <el-table
        class="mp-table"
        :data="data.leftDataList"
        stripe
        resizable
        border
        style="width: 100%">
        <el-table-column prop="Name" label="审稿文件" width="315" show-overflow-tooltip align="center" header-align="center" ></el-table-column>
        <el-table-column label="对应生产辅助文件" show-overflow-tooltip class-name="l" label-class-name="h-l" min-width="400px">
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
import Crumbs from '@/components/common/NewSetupComps/Crumbs.vue';
import { useTransformerStore } from '@/pinia/modules/transformer';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { goBackLastPage } from '@/router/handleRouterEach';
import { recordScrollPosition } from '@/assets/ts/recordScrollPositionMixin';
import { AssistInfoMapClass, IAssistInfoLeftType } from './AssistInfoMapClass';
import SetupDialog from './SetupDialog.vue';

recordScrollPosition('.el-table__body-wrapper');

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData } = storeToRefs(transformerStore);

const crumbsList = computed(() => {
  const t = convertServerList.value.find(it => it.ID === TransformerListPageData.value?.ServerID);
  const serverName = t ? t.Name : '未获取到转换器名称';
  return [
    { name: `转换设置 ( ${serverName} )`, path: '/transformerList' },
    { name: '辅助文件映射' },
  ];
});

const onMapClick = (item: IAssistInfoLeftType) => {
  data.value.curEditItem = item;
  data.value.visible = true;
};

const data = ref(new AssistInfoMapClass(TransformerListPageData.value?.ServerID || ''));

</script>

<script lang='ts'>
export default {
  name: 'assistMapPage',
};
</script>

<style scoped lang='scss'>
.assist-page {
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
      text-align: left;
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
