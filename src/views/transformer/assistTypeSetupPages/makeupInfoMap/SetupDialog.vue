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
    top="15vh"
  >
    <h4>
      <span>请选择适用的生产拼版模板:</span>
    </h4>
    <div class="c">
      <mp-empty v-if="data.rightDataList.length === 0" />
      <el-radio-group v-model="radio">
        <el-radio class="check-item" v-for="it in data.rightDataList" :disabled="disabledList.includes(it.ID)"
         :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-radio>
      </el-radio-group>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, ref } from 'vue';
import { MakeupInfoMapClass } from './MakeupInfoMapClass';

const props = defineProps<{
  data: Omit<MakeupInfoMapClass, 'getLeftList' | 'getRightList' | 'getMapList' | 'getData'>
}>();

const localVisible = computed({
  get() {
    return props.data.visible;
  },
  set(val) {
    props.data.setVisible(val);
  },
});

const radio = ref('');
const disabledList = ref<string[]>([]);

const onOpen = () => {
  const t = props.data.mapDataList.find(it => it.SourceID === props.data.curEditItem?.ID || it.SourceID === `${props.data.curEditItem?.ID}`);
  radio.value = t && t.Target && t.Target.length > 0 ? t.Target[0] || '' : '';

  disabledList.value = props.data.mapDataList.map(it => it.Target[0]).filter(it => it && it !== radio.value);
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  radio.value = '';
};

const submit = () => {
  const ids = props.data.rightDataList.map(it => it.ID);

  if (ids.length > 0 && !ids.includes(radio.value)) {
    radio.value = '';
  }
  const t = props.data.mapDataList.find(it => it.SourceID === props.data.curEditItem?.ID || it.SourceID === `${props.data.curEditItem?.ID}`);
  props.data.saveItem({ Target: [radio.value] }, t?.ID || '');
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    padding: 30px 55px;
    padding-right: 16px;
    margin-right: 3px;
    padding-left: 35px;
    padding-top: 0;
    h4 {
      padding-top: 30px;
      padding-bottom: 13px;
      color: #444;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 2;
      margin-left: 23px;
      font-weight: 600;
    }
    .check-item {
      margin-right: 10px;
      margin-bottom: 8px;
      line-height: 20px;
      .el-radio__label {
        display: inline-block;
        vertical-align: -5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 15em;
        font-size: 12px;
        vertical-align: -5px;
      }
    }
    .c {
      // padding-right: 20px;
      // margin-right: 3px;
      height: 400px;
      overflow: auto;
      overflow: overlay;
      @include scroll;
    }
  }
}
</style>
