<template>
  <section class="wrap">
    <header>
      <Crumbs :list="crumbsList" />
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp"
        v-if="GeneralMapDataClassData"
        :PropertyList='GeneralMapDataClassData.rightDataList'
        :curEditData='GeneralMapDataClassData.curEditItem'
        leftWidth='800px'
        single
       >
        <!-- 右侧面板 -->
        <!-- <span slot="title" v-if="curPanel && curPanel.canAdd" class="blue-span" style="position: relative;top:1px" @click="onAddClick">+ 添加</span> -->
      </ContionCommonComp>
      <mp-empty class="mt-80" v-else description="暂无属性可设置"></mp-empty>
    </main>
    <footer>
      <mp-button :disabled="!GeneralMapDataClassData" type="primary" @click="onSubmitClick">保存</mp-button>
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
import { ContionCommonComp } from '@/components/common/mpzj-sell-lib/lib';
import { IGetConditonResult } from '@/pinia/modules/transformer/map/types';

recordScrollPosition('.mp-erp-new-comps-condtion-set-common-comp-wrap > .left > .left-content > main > .el-form.constraint-ruleForm');

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const oLeftComp = ref<InstanceType<any>>();

const onSubmitClick = () => {
  if (!oLeftComp.value || !GeneralMapDataClassData.value) return;
  const condition = oLeftComp.value.getConditonResult() as IGetConditonResult;
  if (!condition) return;
  const { ID, Priority, Constraint } = condition;
  const temp = {
    ID,
    Priority,
    Constraint,
  };
  GeneralMapDataClassData.value.saveItem(temp);
};

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
    :deep(.mp-erp-common-comps-left-and-right-width-drap-auto-change-comp-wrap) > .left {
      width: 750px !important;
    }
  }
  > footer {
    text-align: center;
    padding-top: 50px;
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
