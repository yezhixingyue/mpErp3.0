<template>
  <CommonDialogComp
    width="700px"
    :title="`作业次数设置：${props.data.curEditItem?.Name}`"
    :visible.sync="localVisible"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    class="dialog"
    top="15vh"
  >
    <div class="list-wrap">
      <span v-if="DisplayList.length === 0" class="ft-12 is-gray">暂无公式</span>
      <template v-else>
        <div v-for="item in DisplayList" :key="item.TypeName" class="item">
          <p>{{item.TypeName}}</p>
          <div class="item-content">
            <el-radio
              v-for="it in item.List"
              :key="it.ID"
              :label="it.ID"
              :title="it.Name"
              :value="!isConst && radio"
              @change="onChange(it.ID)">
              {{it.Name}}
            </el-radio>
          </div>
        </div>
      </template>
    </div>
    <div class="num">
      <el-radio :label="true" v-model="isConst">
        <span class="title">常数：</span>
        <el-input v-model.number="numbericValue" maxlength="9" size="small" @focus="isConst = true"></el-input>
        <span class="is-gray ml-8">次</span>
      </el-radio>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, ref } from 'vue';
import { IWorkTimesRightType, WorkTimesMapClass } from './WorkTimesMapClass';

interface IDisplayItem {
  TypeName: string
  List: IWorkTimesRightType[]
}

const props = defineProps<{
  data: Omit<WorkTimesMapClass, 'getLeftList' | 'getRightList' | 'getMapList' | 'getData'>
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

const isConst = ref(false);

const numbericValue = ref<''|number>('');

const DisplayList = ref<IDisplayItem[]>([]);

const getDisplayList = () => {
  DisplayList.value = [];
  const fomulaItem = {
    TypeName: '公式',
    List: props.data.rightDataList.filter(it => !it.PartID),
  };
  const subFomulaItem = {
    TypeName: '子公式',
    List: props.data.rightDataList.filter(it => it.PartID),
  };
  if (fomulaItem.List.length > 0) {
    DisplayList.value.push(fomulaItem);
  }
  if (subFomulaItem.List.length > 0) {
    DisplayList.value.push(subFomulaItem);
  }
};

const onChange = (ID: string) => {
  isConst.value = false;
  radio.value = ID;
};

const onOpen = () => {
  const t = props.data.mapDataList.find(it => it.SourceID === props.data.curEditItem?.ID || it.SourceID === `${props.data.curEditItem?.ID}`);
  if (t) {
    if (t.Value || t.Value === 0) {
      isConst.value = true;
      numbericValue.value = t.Value;
    }
    radio.value = t.Target[0] || '';
  }

  getDisplayList();
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  radio.value = '';
  numbericValue.value = '';
  isConst.value = false;
};

const submit = () => {
  let data;
  if (isConst.value) {
    data = numbericValue.value;
    // 此处进行校验 必须为正整数
    if (data === 0) {
      MpMessage.error({ title: '保存失败', msg: '常数不能等于0' });
      return;
    }
    if (!data) {
      MpMessage.error({ title: '保存失败', msg: '请输入常数' });
      return;
    }
    if (!/^\d+$/.test(`${data}`) || typeof data !== 'number') {
      MpMessage.error({ title: '保存失败', msg: '输入的数值不正确，必须为正整数' });
      return;
    }
  } else {
    data = radio.value;
    const ids = props.data.rightDataList.map(it => it.ID);
    if (ids.length > 0 && !ids.includes(data)) data = '';
    // 此处进行校验 必须有值
    if (!data) {
      MpMessage.error({ title: '保存失败', msg: '未设置内容' });
      return;
    }
    data = [data];
  }

  props.data.saveItem(data);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    padding: 30px 10px;
    margin-right: 3px;
    padding-top: 20px;
    .list-wrap {
      min-height: 400px;
      min-height: 240px;
      overflow: auto;
      overflow: overlay;
      @include scroll;
      padding-left: 85px;
    }
    .item {
      padding-bottom: 18px;
      > p {
        padding-bottom: 8px;
        color: #444;
        font-weight: 700;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      }
      > .item-content {
        > label {
          margin-right: 8px;
          margin-bottom: 3px;
          .el-radio__label {
            font-size: 12px;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            vertical-align: -1px;
            text-overflow: ellipsis;
            width: 9em;
          }
        }
      }
    }
    .num {
      padding-left: 85px;
      border-top: 1px solid #eee;
      padding-top: 20px;
      margin-top: 10px;
      padding-bottom: 20px;
      .title {
        color: #444;
        margin-right: 4px;
      }
      .el-input {
        width: 100px;
      }
    }
  }
}
</style>
