<template>
  <section class="wrap">
    <header>
      <Crumbs :list="crumbsList" />
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp"
        v-if="GeneralMapDataClassData && GeneralMapDataClassData.rightDataList.length > 0"
        :PropertyList='GeneralMapDataClassData.rightDataList'
        :curEditData='GeneralMapDataClassData.curEditItem'
        leftWidth='50%'
        single
       >
        <!-- 右侧面板 -->
        <!-- <span slot="title" v-if="curPanel && curPanel.canAdd" class="blue-span" style="position: relative;top:1px" @click="onAddClick">+ 添加</span> -->
      </ContionCommonComp>
    </main>
    <footer>
      <mp-button type="primary">保存</mp-button>
      <mp-button class="cancel-blue-btn" @click="goBackLastPage">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import Crumbs from '@/components/common/Crumbs.vue';
import { useTransformerStore } from '@/store/modules/transformer';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { goBackLastPage } from '@/router/handleRouterEach';
import ContionCommonComp from '@/components/common/NewContionCommonComp/ContionCommonComp.vue';

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData, GeneralMapDataClassData } = storeToRefs(transformerStore);

const crumbsList = computed(() => {
  const t = convertServerList.value.find(it => it.ID === TransformerListPageData.value?.ServerID);
  const serverName = t ? t.Name : '未获取到转换器名称';
  const partName = TransformerListPageData.value?.curPart?.Name || '';

  return [
    { name: `转换设置 ( ${serverName} )`, path: '/transformerList' },
    { name: '合拼设置', path: '/unionMakeupLimitList' },
    { name: `${GeneralMapDataClassData.value?.curEditItem ? '编辑' : '添加'}禁止合拼条件：${TransformerListPageData.value?.curEditProductName}   ${partName}` },
  ];
});
</script>

<script lang='ts'>
export default {
  name: 'UnionMakeupLimitSetupPage',
};
</script>

<style scoped lang='scss'>
.wrap {
  padding: 0 8px;
  background-color: #f5f5f5;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
    padding: 0 20px;
  }
  > footer {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 20px;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      & + .el-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
