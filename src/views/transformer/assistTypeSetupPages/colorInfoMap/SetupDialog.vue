<template>
  <CommonDialogComp
    width="700px"
    title="设置映射："
    :visible.sync="localVisible"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    class="dialog"
    top="20vh"
  >
    <h4>请选择对应的专色:</h4>
    <el-checkbox-group v-model="checkList">
      <el-checkbox class="check-item" v-for="it in props.data.rightDataList" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-checkbox>
    </el-checkbox-group>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { CommonDialogComp } from 'mpzj-sell-lib';
import { computed, ref } from 'vue';
import { ColorInfoMapClass } from './ColorInfoMapClass';

const props = defineProps<{
  data: Omit<ColorInfoMapClass, 'getLeftList' | 'getRightList' | 'getMapList' | 'getData'>
}>();

const localVisible = computed({
  get() {
    return props.data.visible;
  },
  set(val) {
    props.data.setVisible(val);
  },
});

const checkList = ref<string[]>([]);

const onOpen = () => {
  const t = props.data.mapDataList.find(it => it.SourceID === props.data.curEditItem?.ID || it.SourceID === `${props.data.curEditItem?.ID}`);
  checkList.value = t ? [...t.Target] : [];
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  checkList.value = [];
};

const submit = () => {
  const ids = props.data.rightDataList.map(it => it.ID);
  if (ids.length > 0) {
    checkList.value = checkList.value.filter(id => ids.includes(id));
  }
  props.data.saveItem(checkList.value);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    min-height: 120px;
    max-height: 385px;
    overflow: auto;
    overflow: overlay;
    padding: 30px 55px;
    padding-right: 20px;
    margin-right: 3px;
    padding-left: 85px;
    padding-top: 0;
    @include scroll;
    h4 {
      padding-bottom: 13px;
      color: #444;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 2;
      padding-top: 30px;
    }
    .check-item {
      margin-right: 10px;
      margin-bottom: 8px;
      .el-checkbox__label {
        display: inline-block;
        vertical-align: -5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 9em;
        font-size: 12px;
      }
    }
  }
}
</style>
