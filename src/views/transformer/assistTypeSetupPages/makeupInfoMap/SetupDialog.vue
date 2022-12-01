<template>
  <CommonDialogComp
    width="700px"
    title="设置映射："
    :visible.sync="localVisible"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    @closed="closed"
    :disabled="ruleForm.IsPrintPlate === ''"
    class="dialog"
    top="15vh"
  >
    <h4>
      <span>请选择适用的生产拼版模板:</span>
      <el-radio-group v-model="ruleForm.IsPrintPlate">
        <el-radio :label="true">印刷版</el-radio>
        <el-radio :label="false">其它</el-radio>
      </el-radio-group>
    </h4>
    <ul v-show="ruleForm.IsPrintPlate === false">
      <li v-for="item in displayList" :key="item.Name" class="item">
        <el-checkbox class="title"
         :value="getGroupValue(item)" :indeterminate="getGroupIndeterminate(item)" @change="setGroupValue(item)">{{item.Name}}：</el-checkbox>
        <div class="list">
          <el-checkbox
            class="check-item"
            v-for="it in item.children"
            :key="it.ID"
            :label="it.ID"
            :title="it.Name"
            :value="getItemValue(it)"
            @change="setItemValue(it)"
            >
            {{it.Name}}
          </el-checkbox>
        </div>
      </li>
    </ul>
    <p v-if="displayList.length === 0" v-show="ruleForm.IsPrintPlate === false">
      <span class="danger ft-2"><i class="el-icon-warning ft-14 mr-5"></i>暂无数据</span>
    </p>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import api from '@/api';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { IProductClassItem } from '@/pinia/modules/transformer/utils';
import { computed, reactive, ref } from 'vue';
import { IMakeupInfoRightType, MakeupInfoMapClass } from './MakeupInfoMapClass';

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

const ImpositionTemplateClassList = ref<IProductClassItem[]>([]);

const getImpositionTemplateClassList = async () => {
  if (ImpositionTemplateClassList.value.length > 0) return;
  const resp = await api.getImpositionTemplateClassList(props.data.ServerID).catch(() => null);
  if (resp?.data.Status === 1000) {
    ImpositionTemplateClassList.value = resp.data.Data;
  }
};

const displayList = computed(() => {
  const l = ImpositionTemplateClassList.value.map(it => ({
    ...it,
    children: props.data.rightDataList.filter(_it => !_it.IsPrintingPlate && _it.ClassID === it.ID),
  })).filter(it => it.children.length > 0);
  return l;
});

const ruleForm = reactive<{ IsPrintPlate: '' | boolean, Target: string[] }>({
  IsPrintPlate: true,
  Target: [],
});

interface IDisplayItem extends IProductClassItem {
  children: IMakeupInfoRightType[]
}

const getItemValue = (it: IMakeupInfoRightType) => ruleForm.Target.includes(it.ID);

const setItemValue = (it: IMakeupInfoRightType) => {
  const i = ruleForm.Target.findIndex(id => it.ID === id);
  if (i < 0) {
    ruleForm.Target.push(it.ID);
  } else {
    ruleForm.Target.splice(i, 1);
  }
};

const getGroupValue = (item: IDisplayItem) => {
  const list = item.children.filter(it => ruleForm.Target.includes(it.ID));
  return list.length > 0 && list.length === item.children.length;
};

const getGroupIndeterminate = (item: IDisplayItem) => {
  const list = item.children.filter(it => ruleForm.Target.includes(it.ID));
  return list.length > 0 && list.length < item.children.length;
};

const setGroupValue = (item: IDisplayItem) => {
  const list = item.children.filter(it => ruleForm.Target.includes(it.ID));
  const ids = item.children.map(it => it.ID);
  ruleForm.Target = ruleForm.Target.filter(id => !ids.includes(id));
  if (list.length < item.children.length) {
    ruleForm.Target.push(...ids);
  }
};

const onOpen = () => {
  const t = props.data.mapDataList.find(it => it.SourceID === props.data.curEditItem?.ID || it.SourceID === `${props.data.curEditItem?.ID}`);
  ruleForm.Target = t && t.Target ? [...t.Target] : [];
  ruleForm.IsPrintPlate = t ? t.IsPrintPlate : '';
  getImpositionTemplateClassList();
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  ruleForm.IsPrintPlate = '';
  ruleForm.Target = [];
};

const submit = () => {
  const ids = props.data.rightDataList.map(it => it.ID);
  if (ids.length > 0) {
    ruleForm.Target = ruleForm.Target.filter(id => ids.includes(id));
  }
  props.data.saveItem(ruleForm);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.dialog {
  :deep(.el-dialog__body) {
    height: 385px;
    overflow: auto;
    overflow: overlay;
    padding: 30px 55px;
    padding-right: 20px;
    margin-right: 3px;
    padding-left: 89px;
    padding-top: 0;
    @include scroll;
    h4 {
      padding-top: 30px;
      padding-bottom: 13px;
      color: #444;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 2;
      > span {
        margin-right: 15px;
      }
    }
    .item {
      margin-top: 13px;
      .title {
        .el-checkbox__label {
          font-weight: 700;
          color: #444;
        }
      }
      > .list {
        margin-top: 10px;
        padding-bottom: 8px;
        margin-left: 28px;
      }
    }
    .check-item {
      margin-right: 8px;
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
