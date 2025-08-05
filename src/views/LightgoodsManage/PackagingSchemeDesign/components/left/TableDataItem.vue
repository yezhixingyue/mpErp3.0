<template>
  <div class="item-wrap">
    <div v-if="!(itemData.MinValue === 0 && itemData.MaxValue === -1)" class="value">
      <span v-if="itemData.MinValue === itemData.MaxValue">{{ itemData.MinValue }}个</span>
      <template v-else>
        <span>{{ itemData.MinValue }}个</span>
        <span> {{ getOperatorLabel(Operator.First) }} 值 {{ getOperatorLabel(Operator.Second) }} </span>
        <span>{{ itemData.MaxValue }}个</span>
      </template>
    </div>
    <ul>
      <li>
        <span>体积</span>
        <el-input size="small" :value="volume" :title="volume" disabled></el-input>
        <span>cm³</span>
      </li>

      <li>
        <span>长</span>
        <el-input :value="itemData.Length" size="small" maxlength="4"  @input="e => onChange('Length', e)"></el-input>
        <span>mm</span>
      </li>

      <li>
        <span>宽</span>
        <el-input :value="itemData.Width" size="small" maxlength="4"  @input="e => onChange('Width', e)"></el-input>
        <span>mm</span>
      </li>

      <li>
        <span>高</span>
        <el-input :value="itemData.Height" size="small" maxlength="4"  @input="e => onChange('Height', e)"></el-input>
        <span>mm</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { PropertyUtils } from '@/components/common/mpzj-sell-lib/lib';
import { LeftRuleForm } from '../../models/LeftRuleForm';

const { AllOperatorList } = PropertyUtils;

const getOperatorLabel = (id: number) => {
  const t = AllOperatorList.find(it => it.ID === id);

  return t?.label || t?.Name || '';
};

const props = defineProps<{
  itemData: LeftRuleForm['DataList'][number]
  Operator: LeftRuleForm['Operator']
}>();

const emit = defineEmits(['change']);

const onChange = (key: keyof LeftRuleForm['DataList'][number], val: '' | number | string) => {
  if (val !== '' && !/^\d+$/.test(`${val}`)) {
    return;
  }

  const _val = val === '' ? '' : Number(val);

  emit('change', [key, _val]);
};

/** 体积 */
const volume = computed(() => {
  const { Width, Height, Length } = props.itemData;

  if (Width !== '' && Width > 0 && Height !== '' && Height > 0 && Length !== '' && Length > 0) {
    return Number(((Width * Height * Length) / 1000).toFixed(3));
  }

  return '自动计算';
});
</script>

<style scoped lang='scss'>
.item-wrap {
  font-size: 12px;
  color: #444;
  display: flex;
  align-items: center;
  margin-bottom: 30px;

  > div.value {
    width: 160px;
    text-align: center;
    color: #606266;

    & + ul {
      padding-left: 40px;
    }
  }

  > ul {
    padding-left: 86px;
    > li {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      :deep(.el-input) {
        width: 105px;
        // height: 30px;
        // line-height: 30px;
        margin: 0 10px;

        input {
          height: 30px;
          line-height: 30px;
          color: #444;
          font-size: 12px;
        }

        &.el-input.is-disabled .el-input__inner {
          color: #888;
          font-size: 12px;
        }
      }

      > span {
        width: 2em;
        font-size: 13px;
      }
    }
  }
}
</style>
