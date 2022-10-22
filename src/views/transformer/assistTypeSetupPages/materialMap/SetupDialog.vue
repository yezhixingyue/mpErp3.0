<template>
  <CommonDialogComp
    width="700px"
    title="设置映射"
    :visible.sync="localVisible"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    class="dialog"
    top="15vh"
  >
    <header class="header">
      <EpCascader
        showLine
        v-if="classList.length > 0"
        title="生产端物料类型"
        :list="classList"
        :defaultProps="{ID: 'ID',Name: 'Name',children: 'List'}"
        :level="2"
        :withEmpty="false"
        onlyLastValid
        v-model="EpCascaderValue"
      />
      <span v-else class="danger ft-12"><i class="el-icon-warning ft-14 mr-5"></i> 暂无生产端可用分类数据</span>
    </header>
    <div class="c">
      <el-empty v-if="classList.length === 0" />
      <el-radio-group v-model="radio">
        <el-radio class="check-item" v-for="it in radioList" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-radio>
      </el-radio-group>
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { message } from '@/assets/js/message';
import { IFactoryMaterialClass } from '@/store/modules/transformer/map/types';
import { Message } from 'element-ui';
import { CommonDialogComp, EpCascader } from 'mpzj-sell-lib';
import { computed, reactive, ref } from 'vue';
import { MaterialInfoMapClass } from './MaterialInfoMapClass';

const props = defineProps<{
  data: Omit<MaterialInfoMapClass, 'getLeftList' | 'getRightList' | 'getMapList' | 'getData'>
  FactoryMaterialClassList: IFactoryMaterialClass[]
}>();

const localVisible = computed({
  get() {
    return props.data.visible;
  },
  set(val) {
    props.data.setVisible(val);
  },
});

const condition = reactive({
  ClassID: '',
  TypeID: '',
});

const EpCascaderValue = computed({
  get() {
    return [condition.ClassID, condition.TypeID];
  },
  set([ClassID, TypeID]) {
    condition.ClassID = ClassID || '';
    condition.TypeID = TypeID || '';
  },
});

const classList = computed(() => {
  const allUsedTypeIDs = props.data.rightDataList.map(it => it.TypeID);
  const list = props.FactoryMaterialClassList.map(lv1 => ({
    ...lv1,
    List: lv1.List.filter(lv2 => allUsedTypeIDs.includes(lv2.ID)),
  })).filter(lv1 => lv1.List.length > 0);

  return list;
});

const radioList = computed(() => {
  if (!condition.TypeID) return [];
  return props.data.rightDataList.filter(it => it.TypeID === condition.TypeID);
});
const radio = ref('');

const onOpen = () => {
  const t = props.data.mapDataList.find(it => it.SourceID === props.data.curEditItem?.ID || it.SourceID === `${props.data.curEditItem?.ID}`);
  radio.value = t?.Target[0] || '';

  if (radio.value) {
    const ids = props.data.rightDataList.map(it => it.ID);
    if (ids.length > 0 && !ids.includes(radio.value)) {
      Message.error({
        type: 'error', message: '原映射物料已不存在于现有物料列表中，请重新设置', duration: 0, showClose: true, offset: 150,
      });
      radio.value = '';
    }
  }

  condition.ClassID = '';
  condition.TypeID = '';

  if (classList.value.length > 0) {
    if (radio.value) {
      const _t = props.data.rightDataList.find(it => it.ID === radio.value);
      if (_t) {
        const target = classList.value.find(lv1 => {
          const ids = lv1.List.map(lv2 => lv2.ID);
          return ids.includes(_t.TypeID);
        });
        if (target) {
          condition.ClassID = target.ID;
          condition.TypeID = _t.TypeID;
        }
      }
    } else {
      const { ID, List } = classList.value[0];
      condition.ClassID = ID;
      condition.TypeID = List[0].ID;
    }
  }

  console.log(condition);
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  radio.value = '';
  condition.ClassID = '';
  condition.TypeID = '';
};

const submit = () => {
  let id = radio.value;
  const ids = props.data.rightDataList.map(it => it.ID);
  if (ids.length > 0 && !ids.includes(id)) {
    id = '';
  }
  if (!id) {
    message.error({ title: '保存失败', message: '请选择映射物料' });
    return;
  }
  props.data.saveItem([id]);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    padding: 20px 60px;
    padding-left: 100px;
    padding-right: 0px;
    padding-top: 0;
    header {
      padding-bottom: 13px;
      color: #444;
      height: 60px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding-top: 10px;
      margin-left: 45px;
      > span > i {
        vertical-align: -1px;
      }
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
        width: 13em;
        font-size: 12px;
        vertical-align: -5px;
      }
    }
    .c {
      padding-right: 20px;
      margin-right: 3px;
      height: 400px;
      overflow: auto;
      overflow: overlay;
      @include scroll;
    }
  }
}
</style>
