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
        leftWidth='42%'
       >
        <!-- 右侧面板 -->
        <div class="r-content">
          <p class="ft-12 mb-20">需要以下选中工序进行加工：</p>
          <el-checkbox-group v-model="checkList">
            <el-checkbox class="c-it" v-for="it in GeneralMapDataClassData.leftDataList" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-checkbox>
          </el-checkbox-group>
          <div v-if="GeneralMapDataClassData.leftDataList.length===0" class="em">
            <i class="el-icon-warning ft-14 mr-5"></i>
            <span>暂无可映射{{GeneralMapDataClassData.title || '数据'}}</span>
          </div>
        </div>
      </ContionCommonComp>
    </main>
    <footer>
      <mp-button :disabled="!GeneralMapDataClassData" type="primary" @click="onSubmitClick">保存</mp-button>
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
import { ContionCommonComp } from 'mpzj-sell-lib';
import { IGetConditonResult } from '@/store/modules/transformer/map/types';
import router from '@/router';
import { message } from '@/assets/js/message';
import { Message } from 'element-ui';

recordScrollPosition('.mp-erp-new-comps-condtion-set-common-comp-wrap > .left > .left-content > main > .el-form.constraint-ruleForm');

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData, GeneralMapDataClassData } = storeToRefs(transformerStore);

const crumbsList = computed(() => {
  const t = convertServerList.value.find(it => it.ID === TransformerListPageData.value?.ServerID);
  const serverName = t ? t.Name : '未获取到转换器名称';
  const partName = TransformerListPageData.value?.curPart?.Name || '';

  return [
    { name: `转换设置 ( ${serverName} )`, path: '/transformerList' },
    { name: `${GeneralMapDataClassData.value?.title || ''}映射`, path: { name: 'mapWorkingList', params: { pageType: router.currentRoute.params.pageType } } },
    {
      // eslint-disable-next-line max-len
      name: `${GeneralMapDataClassData.value?.curEditItem ? '编辑' : '添加'}${GeneralMapDataClassData.value?.title || ''}映射：${TransformerListPageData.value?.curEditProductName}   ${partName}`,
    },
  ];
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const oLeftComp = ref<InstanceType<any>>();

const checkList = ref<string[]>([]);

if (GeneralMapDataClassData.value?.curEditItem) {
  const ids = GeneralMapDataClassData.value.leftDataList.map(it => it.ID);
  const list = GeneralMapDataClassData.value.curEditItem.List.map(it => it.ID);
  const list2 = list.filter(id => ids.length === 0 || ids.includes(id));
  if (list2.length > list.length) {
    Message.error(`有${list2.length - list.length}个原工序选项不存在于当前列表中，已被筛除，保存后生效`);
  }
  checkList.value = list2;
}

const onSubmitClick = () => {
  if (!oLeftComp.value || !GeneralMapDataClassData.value) return;
  const condition = oLeftComp.value.getConditonResult() as IGetConditonResult;
  if (!condition) return;
  if (checkList.value.length === 0) {
    message.error({ title: '保存失败', message: `请选择${GeneralMapDataClassData.value.title}` });
    return;
  }
  const List = checkList.value.map(id => GeneralMapDataClassData.value?.leftDataList.find(it => it.ID === id)).filter(it => it) as {ID: string, Name: string}[];
  const { ID, Priority, Constraint } = condition;
  const temp = {
    ID,
    Priority,
    Constraint,
    List,
  };
  GeneralMapDataClassData.value.saveItem(temp);
};

</script>

<script lang='ts'>
export default {
  name: 'WorkingMapSetupPage',
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
    .r-content {
      padding-left: 10px;
      color: #444;
      max-width: 800px;
      > p {
        margin-top: -10px;
      }
      > .em {
        font-size: 12px;
        color: #cbcbcb;
        i {
          vertical-align: -1px;
          font-size: 15px;
        }
      }
      .c-it {
        margin-right: 10px;
        margin-bottom: 8px;
        :deep(.el-checkbox__label) {
          display: inline-block;
          vertical-align: -4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 10em;
          font-size: 12px;
        }
      }
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
