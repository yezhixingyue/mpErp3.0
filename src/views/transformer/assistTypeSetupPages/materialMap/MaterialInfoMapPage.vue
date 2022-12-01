<template>
  <section class="wrap">
    <header>
      <Crumbs :list="crumbsList" />
      <EpCascader
        showLine
        title="销售端物料类型"
        :list="MaterialClassList"
        :defaultProps="{ID: 'ID',Name: 'InternalName',children: 'children'}"
        :level="1"
        :fiexdWidth="150"
        v-model="EpCascaderValue"
      />
    </header>
    <main>
      <el-table
        class="mp-table"
        :data="tableData"
        stripe
        resizable
        border
        style="width: 100%">
        <el-table-column prop="Type.InternalName" label="销售端物料类型" min-width="120" show-overflow-tooltip align="center" header-align="center" >
          <!-- <template #default="scope">
            {{getMaterialClassName(scope.row.TypeID)}}
          </template> -->
        </el-table-column>
        <el-table-column prop="DisplayName" label="销售端物料" min-width="160" show-overflow-tooltip align="center" header-align="center" ></el-table-column>
        <el-table-column label="映射" min-width="340" show-overflow-tooltip align="center" header-align="center" >
          <template #default="scope">
            {{data.getItemMapResult(scope.row.ID, data.mapDataList, FactoryMaterialClassList)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip align="center" width="200px">
          <template #default="scope">
            <span class="blue-span" @click="onMapClick(scope.row)">设置映射</span>
          </template>
        </el-table-column>
        <template #empty>
          <div>
            <span class="ft-13 is-gray" v-show="!data.loading">暂无数据</span>
          </div>
        </template>
      </el-table>
      <SetupDialog :data="data" :FactoryMaterialClassList="FactoryMaterialClassList" />
    </main>
    <footer>
      <Pager
         center
        :pageSize="condition.PageSize"
        :count="filterList.length"
        :watchPage="condition.Page"
        :handlePageChange="handlePageChange"
       />
      <mp-button class="cancel-blue-btn" @click="goBackLastPage">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import Crumbs from '@/components/common/NewSetupComps/Crumbs.vue';
import { Pager, EpCascader } from '@/components/common/mpzj-sell-lib/lib';
import { useTransformerStore } from '@/pinia/modules/transformer';
import { storeToRefs } from 'pinia';
import {
  computed, onMounted, reactive, ref,
} from 'vue';
import api from '@/api';
import { goBackLastPage } from '@/router/handleRouterEach';
import { recordScrollPosition } from '@/assets/ts/recordScrollPositionMixin';
import { IFactoryMaterialClass } from '@/pinia/modules/transformer/map/types';
import { MaterialInfoMapClass, IMaterialInfoLeftType } from './MaterialInfoMapClass';
import SetupDialog from './SetupDialog.vue';

recordScrollPosition('.el-table__body-wrapper');

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData } = storeToRefs(transformerStore);

const crumbsList = computed(() => {
  const t = convertServerList.value.find(it => it.ID === TransformerListPageData.value?.ServerID);
  const serverName = t ? t.Name : '未获取到转换器名称';
  return [
    { name: `转换设置 ( ${serverName} )`, path: '/transformerList' },
    { name: '物料映射' },
  ];
});

const onMapClick = (item: IMaterialInfoLeftType) => {
  data.value.curEditItem = item;
  data.value.visible = true;
};

const data = ref(new MaterialInfoMapClass(TransformerListPageData.value?.ServerID || ''));

const MaterialClassList = ref<{ID:string, Name:string}[]>([]);
const getMaterialClassList = async () => {
  const resp = await api.getMaterialTypeList().catch(() => null);
  if (resp?.data.Status === 1000) {
    MaterialClassList.value = resp.data.Data || [];
  }
};
// const getMaterialClassName = (TypeID: string) => {
//   const t = MaterialClassList.value.find(it => it.ID === TypeID);
//   return t ? t.Name : '';
// };

const FactoryMaterialClassList = ref<IFactoryMaterialClass[]>([]);
const getFactoryMaterialClassList = async () => {
  const resp = await api.getFactoryMaterialTypeList(TransformerListPageData.value?.ServerID || '').catch(() => null);
  if (resp?.data.Status === 1000) {
    const list = resp.data.Data.filter(it => it.List.length > 0);
    FactoryMaterialClassList.value = list;
  }
};

const condition = reactive({
  TypeID: '',
  Page: 1,
  PageSize: 20,
});
const EpCascaderValue = computed({
  get() {
    return [condition.TypeID].filter(it => it);
  },
  set([val]) {
    condition.TypeID = val || '';
    condition.Page = 1;
    const dom = document.querySelector('.el-table__body-wrapper');
    if (dom) dom.scrollTop = 0;
  },
});
const filterList = computed(() => data.value.leftDataList.filter(it => (!condition.TypeID || it.Type.ID === condition.TypeID)));
const tableData = computed(() => {
  const start = (condition.Page - 1) * condition.PageSize;
  const end = condition.Page * condition.PageSize;
  return filterList.value.slice(start, end);
});
const handlePageChange = (p: number) => {
  if (p === condition.Page) return;
  condition.Page = p;
  const dom = document.querySelector('.el-table__body-wrapper');
  if (dom) dom.scrollTop = 0;
};

onMounted(() => {
  getMaterialClassList();
  getFactoryMaterialClassList();
});

</script>

<script lang='ts'>
export default {
  name: 'MaterialInfoMapPage',
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
    height: 100px;
    padding: 12px 20px;
    box-sizing: border-box;
    padding-bottom: 21px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > div > :deep(.title) {
      font-weight: 400;
      position: relative;
      top: 1px;
    }
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
    padding-top: 20px;
    padding-bottom: 30px;
    > div {
      margin-bottom: 20px;
    }
    > button {
      transform: translateX(-36px);
    }
  }
}
</style>
