<template>
  <section class="wrap">
    <Header
      :convertServerList="convertServerList"
      :TransformerListPageData="TransformerListPageData"
      :loading4Servers="loading4Servers"
      @changeServer="handleServerChange"
      @menuClick="onMenuClick"
    />
    <Main :TransformerListPageData="TransformerListPageData" @menuClick="onMenuClick" />
    <Footer :TransformerListPageData="TransformerListPageData" />
    <OperationLogDialog
      v-if="TransformerListPageData"
      :visible.sync="visible"
      :type="ServerTypeEnum.ConvertSetup"
      :ServerID="TransformerListPageData.ServerID"
    />
    <PartSetupDialog v-if="TransformerListPageData" :visible.sync="partSetupVisible" :item="TransformerListPageData.curEditItem" @submited="onPartSubmited" />
  </section>
</template>

<script setup lang='ts'>
import Header from '@/components/transformer/ListComps/Header.vue';
import Main from '@/components/transformer/ListComps/Main.vue';
import Footer from '@/components/transformer/ListComps/Footer.vue';
import OperationLogDialog from '@/components/LogComp/OperationLogDialog.vue';
import PartSetupDialog from '@/components/transformer/ListComps/PartSetupDialog.vue';
import { useTransformerStore } from '@/store/modules/transformer';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import router from '@/router';
import { IPartChangeParams, menuTypeEnum } from '@/store/modules/transformer/types';
import { ServerTypeEnum } from '../serverManage/utils/types';

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData } = storeToRefs(transformerStore);

const handleServerChange = (val: string) => {
  transformerStore.setTransformerListPageData(val);
};

const loading4Servers = ref(false);

transformerStore.setTransformerListPageData(null);

const visible = ref(false); // 操作日志
const partSetupVisible = ref(false); // 部件设置

const onPartSubmited = (e: IPartChangeParams) => {
  if (TransformerListPageData.value) TransformerListPageData.value.handlePartChange(e);
};

const onMenuClick = (type: menuTypeEnum) => {
  console.log('onMenuClick', type);
  switch (type) {
    case menuTypeEnum.log: // 操作日志
      visible.value = true;
      break;

    case menuTypeEnum.partSetup: // 选择产品部件
      partSetupVisible.value = true;
      break;

    case menuTypeEnum.assist: // 辅助文件映射
      router.push('/mapAssist');
      break;

    case menuTypeEnum.color: // 专色文件映射
      router.push('/mapColor');
      break;

    case menuTypeEnum.makeup: // 拼版文件映射
      router.push('/mapMakeup');
      break;

    default:
      break;
  }
};

onMounted(async () => {
  loading4Servers.value = true;
  await transformerStore.getConvertServerList();
  loading4Servers.value = false;
  if (convertServerList.value.length > 0) {
    handleServerChange(convertServerList.value[0].ID);
  }
});

</script>

<script lang='ts'>
export default {
  name: 'TransformerListPage',
};
</script>

<style scoped lang='scss'>
.wrap {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  height: 100%;
  overflow: hidden;
  > header, > main, > footer {
    flex: none;
    background-color: #fff;
  }
  > main {
    flex: 1;
    margin-left: 8px;
    margin-top: 10px;
    padding-right: 18px;
    overflow: hidden;
  }
  > footer {
    margin-left: 8px;
    height: 60px;
    padding-top: 7px;
    box-sizing: border-box;
  }
}
</style>
