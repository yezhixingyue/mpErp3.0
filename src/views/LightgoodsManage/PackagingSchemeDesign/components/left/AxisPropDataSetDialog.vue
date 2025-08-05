<template>
  <CommonDialogComp
    width="800px"
    top='8vh'
    title="设置竖轴数据"
    :visible.sync="localVisible"
    @submit="submit"
    @cancle="localVisible = false"
    @open='onOpen'
    submitText='确定'
    class="mp-erp-comps-solution-left-table-item-axis-prop-data-set-dialog-comp-wrap"
  >
    <p>
      <span class="label">当前设置竖轴</span>
      <span class="name">下单总数（款数×数量）</span>
    </p>
    <!-- 数值类型 -->
    <NumberTypePropDataSetPanel v-model="ruleForm.InputContent" :Operator.sync='ruleForm.Operator' />
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { getValueIsOrNotNumber, getAUUID } from '@/assets/js/utils/util';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import CommonDialogComp from '@/packages/CommonDialogComp';
import NumberTypePropDataSetPanel from '@/components/PriceComps/PriceTableItem/NumberTypePropDataSetPanel.vue';
import { computed, ref } from 'vue';
import { IAxisSubmitData, TLeftRuleFormType } from '../../models/LeftRuleForm';

const props = defineProps<{
  visible: boolean
  data: TLeftRuleFormType
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

const ruleForm = ref({
  InputContent: '',
  Operator: { First: 5, Second: 6 },
});

const onOpen = () => {
  // 重置ruleForm
  ruleForm.value.InputContent = props.data.InputContent;
  ruleForm.value.Operator = { ...props.data.Operator };
};

const submit = () => {
  if (ruleForm.value.InputContent === '') {
    const temp: IAxisSubmitData = {
      list: [],
      ...ruleForm.value,
    };

    emit('submit', temp);
    localVisible.value = false;
    return;
  }
  const arr = ruleForm.value.InputContent.split(/,|，/).filter(it => it).map(it => it.split(' ').filter(_it => _it));
  if (!arr.find(it => it.length > 0)) {
    MpMessage.error('保存失败', '请添加内容');
    return;
  }
  if (arr.find(it => it.length > 2)) {
    MpMessage.error('保存失败', '输入内容格式不正确');
    return;
  }
  const strArr = arr.map(it => JSON.stringify(it));
  if (strArr.length > new Set(strArr).size) {
    MpMessage.error('保存失败', '存在重复项');
    return;
  }
  const spreadArr = arr.reduce((prev, next) => [...prev, ...next], []);
  if (spreadArr.find(it => !getValueIsOrNotNumber(it, true))) {
    MpMessage.error('保存失败', '输入内容中存在非数字或非整数类型');
    return;
  }
  if (spreadArr.find(it => +it < 0 && it !== '-1')) {
    MpMessage.error('保存失败', '不能输入负数（-1除外）');
    return;
  }
  if (arr.filter(it => it.length === 2).find(([item1, item2]) => item1 === item2)) {
    MpMessage.error('保存失败', '同一个项目中前后2个数值不能相同');
    return;
  }
  if (arr.filter(it => it.length === 1).find(([item1]) => item1 === '-1')) {
    MpMessage.error('保存失败', '不能单独使用-1设置为一个项目');
    return;
  }
  if (arr.filter(it => it.length === 1).find(([item1]) => item1 === '0')) {
    MpMessage.error('保存失败', '不能单独使用0设置为一个项目');
    return;
  }
  let min = spreadArr[0];
  let isError = false;
  spreadArr.forEach((it, i) => {
    if (i > 0 && !isError) {
      if ((+it < +min || min === '-1') && it !== '-1') isError = true;
      else min = it;
    }
  });
  if (isError) {
    MpMessage.error('保存失败', '数字排序应按照从小到大顺序排列');
    return;
  }
  let last = null;
  arr.forEach(it => {
    if (isError) return;
    if (last) {
      if (last.length === 1) {
        isError = it[0] === last[0] && ruleForm.value.Operator.First === 6;
      } else if (it[0] === last[1] && ruleForm.value.Operator.Second === 6) {
        isError = it.length === 1 || (it.length > 1 && ruleForm.value.Operator.First === 6);
      }
    }
    last = it;
  });
  if (isError) {
    MpMessage.error('保存失败', '存在相同数字且导致区间重叠');
    return;
  }

  const temp: IAxisSubmitData = {
    list: arr.map(list => ({ ID: getAUUID(), Values: list.map(n => Number(n)) as IAxisSubmitData['list'][number]['Values'] }))
      .filter(it => it.Values.length <= 2),
    ...ruleForm.value,
  };

  emit('submit', temp);
  localVisible.value = false;
};

</script>

<style lang='scss'>
.mp-erp-comps-solution-left-table-item-axis-prop-data-set-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 50px;
    // padding-right: 50px;
    padding-bottom: 20px;
    padding-top: 30px;
    max-height: 600px;
    overflow-y: auto;
    > p {
      color: #888E99;
      font-size: 14px;
      padding-bottom: 25px;
      .label {
        margin-right: 20px;
      }
    }
  }
  .el-dialog__footer {
    padding-top: 16px;
  }
}
</style>
