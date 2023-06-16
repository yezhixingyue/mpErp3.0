<template>
  <CommonDialogComp
    width="700px"
    title="选择公式"
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
        <span class="title">常数</span>
        <!-- <el-input v-model.number="numbericValue" maxlength="9" size="small" @focus="isConst = true"></el-input>
        <span class="is-gray ml-8">次</span> -->
      </el-radio>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, ref } from 'vue';
import { INumbericRightType } from '../../numbericMap/NumbericMapClass';

interface IDisplayItem {
  TypeName: string
  List: INumbericRightType[]
}

const props = defineProps<{
  visible: boolean,
  FormulaList: INumbericRightType[]
  curSelectedID: string
}>();
const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const radio = ref('');

const isConst = ref(false);

const DisplayList = ref<IDisplayItem[]>([]);

const getDisplayList = () => {
  DisplayList.value = [];
  const fomulaItem = {
    TypeName: '公式',
    List: props.FormulaList.filter(it => !it.PartID),
  };
  const subFomulaItem = {
    TypeName: '子公式',
    List: props.FormulaList.filter(it => it.PartID),
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
  radio.value = props.curSelectedID;
  if (!props.curSelectedID) isConst.value = true;
  getDisplayList();
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  radio.value = '';
  isConst.value = false;
};

const submit = () => {
  let id: null | string = null;
  let temp = null;
  if (!isConst.value) {
    id = radio.value;
    const t = props.FormulaList.find(it => it.ID === id);
    if (!t) id = '';
    // 此处进行校验 必须有值
    if (!id) {
      MpMessage.error({ title: '保存失败', msg: '未设置内容' });
      return;
    }
    temp = { ID: id, Name: t.Name };
  }

  emit('submit', temp);
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
          margin-bottom: 8px;
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
