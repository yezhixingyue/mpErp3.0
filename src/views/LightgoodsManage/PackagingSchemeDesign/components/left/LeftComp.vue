<template>
  <ul class="left-comp">
    <li>
      <h4 class="blue-v-line">方案生效条件</h4>
      <ContionCommonComp
        ref="oLeftCondition"
        :showPriority="false"
        :PropertyList='lightgoodsModuleStore.solutionListManager.conditionPropertyList'
        :ComparePropertyList='lightgoodsModuleStore.solutionListManager.conditionPropertyList'
        :curEditData='curConditionEditData'
        single
       />
    </li>

    <li style="margin-top: 20px;">
      <h4 class="blue-v-line">容器规格表</h4>

      <!-- 横竖轴配置显示与设置 -->
      <div class="axis">
        <div class="l">
          <div>
            <h4>横轴：</h4>
            <span>无</span>
          </div>

          <div>
            <h4>纵轴：</h4>
            <span>下单总数（款数×数量）</span>

            <span class="blue-span" style="margin-left: 70px;" @click="visible = true">设置数据</span>
            <el-checkbox :value="true" disabled>分段累加</el-checkbox>
          </div>
        </div>
        <div class="r">
          <div>
            <h4>数据：</h4>
            <span>体积（cm³）</span>
          </div>

          <div>
            <span style="margin-left: 3em;">其他数据：长（mm），宽（mm），高（mm）</span>
          </div>
        </div>
      </div>
      <AxisPropDataSetDialog :visible.sync="visible" :data="ruleForm" @submit="e => ruleForm.onAxisChange(e)" />

      <!-- 表数据 -->
      <div style="border-radius: 2px;background: #f2f2f2;height: 38px;margin: 30px;margin-left: 0;"></div>
      <TableDataItem v-for="it in ruleForm.DataList" :key="it.ID" :itemData="it" @change="([key, val]) => it[key] = val" :Operator="ruleForm.Operator" />

      <!-- 保存表数据 -->
      <hr style="margin:-20px 30px 28px 0;border-color: #DCDFE6;border-top: none;height: 0px;">
      <el-button type="primary" class="is-blue-button" style="width: 120px;height: 35px;padding: 0;border-radius: 4px;" @click="submit">保存表数据</el-button>
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { ContionCommonComp } from '@/components/common/mpzj-sell-lib/lib';
import AxisPropDataSetDialog from './AxisPropDataSetDialog.vue';
import { lightgoodsModuleStore } from '../../../store';
import { computed, ref } from 'vue';
import { LeftRuleForm } from '../../models/LeftRuleForm';
import TableDataItem from './TableDataItem.vue';
import { getConditionObj } from '../../../tools';

const ruleForm = ref(new LeftRuleForm(lightgoodsModuleStore.value.schemeDesignManager.currentSolution));

const oLeftCondition = ref();

const curConditionEditData = computed(() => getConditionObj(lightgoodsModuleStore.value.schemeDesignManager.currentSolution));

const visible = ref(false);

const submit = () => {
  const conditionData = oLeftCondition.value?.getConditonResult();
  if (!conditionData) return;

  const { Constraint } = conditionData;
  const params = ruleForm.value.getParams(Constraint);
  if (!params) return;

  lightgoodsModuleStore.value.schemeDesignManager.saveTableData(params); // 保存表数据
};
</script>

<style scoped lang='scss'>
.left-comp {
  padding-left: 10px;
  padding-bottom: 20px;
  white-space: nowrap;

  :deep(.mp-erp-new-comps-condtion-set-common-comp-wrap) {
    .section-title {
      .mp-common-title-wrap {
        display: none;

        & + span {
          margin-left: 0 !important;
          width: 3em;
          overflow: hidden;
          display: block;
        }
      }
    }

    .mp-common-tab-radio-box {
      text-align: left !important;
    }
  }

  .axis {
    font-size: 12px;
    margin-top: 13px;
    display: flex;
    align-items: center;

    > div {
      > div {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 26px;

        :deep(.el-checkbox) {
          .el-checkbox__label {
            font-size: 12px !important;
            margin-left: -4px;
          }
          position: relative;
          top: 1px;
          margin-left: 20px;
        }
      }

      &.l {
        border-right: 1px solid #DCDFE6;
        margin-right: 20px;
        padding-right: 30px;
      }
    }

    span {
      color: #888;
    }

    h4 {
      font-weight: 700;
      color: #444444;
    }
  }

  :deep(.mp-erp-new-comps-condtion-set-common-comp-wrap > .left > .left-content > main > .el-form.constraint-ruleForm) {
    overflow: hidden;
  }
  :deep(.mp-erp-common-comps-left-and-right-width-drap-auto-change-comp-wrap > div.left) {
    width: unset !important;
  }
}
</style>
