<template>
  <CommonDialogComp
    width="700px"
    title="辅助文字信息映射"
    :visible.sync="localVisible"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    class="dialog"
    top="15vh"
  >
    <!-- 产品上 -->
    <template v-if="ProductionDisplayList.length > 0">
      <h4 class="title mp-common-title-wrap">产品：</h4>
      <div v-for="item in ProductionDisplayList" :key="'prod' + item.TypeName" class="item">
        <p>{{item.TypeName}}</p>
        <div class="item-content">
          <el-checkbox
            v-for="it in item.List"
            :key="it._ID"
            :label="it._ID"
            :title="it._Name"
            :value="getValue(it)"
            @change="onChange(it)">
            {{it._Name}}
          </el-checkbox>
        </div>
      </div>
    </template>

    <!-- 部件上 -->
    <template v-if="PartDisplayList.length > 0">
      <h4 class="title mp-common-title-wrap" style="margin-top: 10px;">部件：</h4>
      <div v-for="item in PartDisplayList" :key="'part' + item.TypeName" class="item">
        <p>{{item.TypeName}}</p>
        <div class="item-content">
          <el-checkbox
            v-for="it in item.List"
            :key="it._ID"
            :label="it._ID"
            :title="it._Name"
            :value="getValue(it)"
            @change="onChange(it)">
            {{it._Name}}
          </el-checkbox>
        </div>
      </div>
    </template>

    <mp-empty v-if="ProductionDisplayList.length === 0 && PartDisplayList.length" description="暂无可映射数据"></mp-empty>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, ref } from 'vue';
import { DisplayTypeEnum, IWordsInfoRightType, WordsInfoMapClass } from './WordsInfoMapClass';

interface IDisplayItem {
  TypeName: string
  List: IWordsInfoRightType[]
}

const props = defineProps<{
  data: Omit<WordsInfoMapClass, 'getLeftList' | 'getRightList' | 'getMapList' | 'getData'>
}>();

const localVisible = computed({
  get() {
    return props.data.visible;
  },
  set(val) {
    props.data.setVisible(val);
  },
});

const checkList = ref<IWordsInfoRightType[]>([]);

// const DisplayList = ref<IDisplayItem[]>([]);
const ProductionDisplayList = ref<IDisplayItem[]>([]);
const PartDisplayList = ref<IDisplayItem[]>([]);

const getDisplayList = () => {
  // DisplayList.value = [];
  ProductionDisplayList.value = [];
  PartDisplayList.value = [];
  Object.values(DisplayTypeEnum).forEach((type) => {
    const TypeName = type.split(' ')[1];
    const List = props.data.rightDataList.filter(it => it._DisplayType === type);
    // const temp = { TypeName, List };
    if (List.length > 0) {
      // DisplayList.value.push(temp);
      const ProdList = List.filter(it => !it.Part);
      const PartList = List.filter(it => !!it.Part);

      if (ProdList.length > 0) ProductionDisplayList.value.push({ TypeName, List: ProdList });
      if (PartList.length > 0) PartDisplayList.value.push({ TypeName, List: PartList });
    }
  });
};

const getValue = (it: IWordsInfoRightType) => {
  const ids = checkList.value.map(p => p._ID).filter(id => id || typeof id === 'number');
  return ids.includes(it._ID);
};

const onChange = (it: IWordsInfoRightType) => {
  const ids = checkList.value.map(p => p._ID).filter(id => id || typeof id === 'number');
  if (ids.includes(it._ID)) {
    checkList.value = checkList.value.filter(p => p._ID !== it._ID);
  } else {
    checkList.value.push(it);
  }
};

const onOpen = () => {
  const t = props.data.mapDataList.find(it => it.SourceID === props.data.curEditItem?.ID || it.SourceID === `${props.data.curEditItem?.ID}`);
  checkList.value = t ? [...t.TargetProperty as unknown as IWordsInfoRightType[]] : [];
  getDisplayList();
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  checkList.value = [];
};

const submit = () => {
  const ids = props.data.rightDataList.map(it => it._ID);
  if (ids.length > 0) {
    checkList.value = checkList.value.filter(it => ids.includes(it._ID)); // 筛选掉已不存在于列表中的项目
  }
  const t = props.data.mapDataList.find(it => it.SourceID === props.data.curEditItem?.ID || it.SourceID === `${props.data.curEditItem?.ID}`);
  props.data.saveItem(checkList.value, t?.ID || '');
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
    padding: 30px 50px;
    padding-right: 20px;
    margin-right: 3px;
    padding-left: 95px;
    padding-top: 20px;
    @include scroll;
    .item {
      padding-bottom: 13px;
      padding-left: 5px;
      > p {
        padding-bottom: 6px;
        color: #444;
        font-weight: 700;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      }
      > .item-content {
        > label {
          margin-right: 8px;
          margin-bottom: 3px;
          .el-checkbox__label {
            font-size: 12px;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            vertical-align: -5px;
            text-overflow: ellipsis;
            width: 9em;
          }
        }
      }
    }

    .title {
      margin-left: -4.5em;
      margin-bottom: 5px;
      font-weight: 700;
      // font-size: 15px;
      // color: #444;
    }
  }
}
</style>
