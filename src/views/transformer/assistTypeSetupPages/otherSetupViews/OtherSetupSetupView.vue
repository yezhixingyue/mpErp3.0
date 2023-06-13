<template>
  <section class="wrap">
    <header>
      <Crumbs :list="crumbsList" />
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp"
        v-if="OtherSetupListClassData && OtherSetupListClassData.curSetupTableData.data"
        :PropertyList='OtherSetupListClassData.curSetupTableData.data.rightDataList'
        :curEditData='OtherSetupListClassData.curSetupTableDataRowItem'
        leftWidth='800px'
       >
        <!-- 右侧面板 -->
        <ul class="right-panel-wrap" v-if="rultForm">
          <!-- 帖标设置 -->
          <li v-if="rultForm.Type === GenerelMappingTypeEnum.SheetIndex">
            <h4 style="font-weight: 700;">添加帖标</h4>
          </li>
          <!-- 爬移设置 -->
          <li v-if="rultForm.Type === GenerelMappingTypeEnum.Move">
            <div class="row">
              <span class="label">爬移使用：</span>
              <el-radio-group v-model="rultForm.MoveType" class="content">
                <el-radio :label="MoveTypeEnum.Skewing">偏移</el-radio>
                <el-radio :label="MoveTypeEnum.Zoom">缩放</el-radio>
              </el-radio-group>
            </div>
            <div class="row">
              <span class="label" style="line-height: 36px;">爬移量：</span>
              <div class="content">
                <div class="box">
                  <el-checkbox v-model="rultForm._MoveInChecked">内爬移：</el-checkbox>
                  <template v-if="rultForm._MoveInChecked">
                    <mp-button type="text" @click="onPorpertySelectClick('Formula')">设置</mp-button>
                    <span v-if="rultForm.Formula">{{ getFormulaName(rultForm.Formula) }}</span>
                    <div v-else>
                      <span>常数：</span>
                      <el-input v-model.number="rultForm.Value" maxlength="9" size="small"></el-input>
                      <em>mm</em>
                    </div>
                  </template>
                </div>
                <div class="box">
                  <el-checkbox v-model="rultForm._MoveOutChecked">外爬移：</el-checkbox>
                  <template v-if="rultForm._MoveOutChecked">
                    <mp-button type="text" @click="onPorpertySelectClick('MoveOutFormula')">设置</mp-button>
                    <span v-if="rultForm.MoveOutFormula">{{ getFormulaName(rultForm.MoveOutFormula) }}</span>
                    <div v-else>
                      <span>常数：</span>
                      <el-input v-model.number="rultForm.MoveOutValue" maxlength="9" size="small"></el-input>
                      <em>mm</em>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </li>
          <!-- 叼口设置 -->
          <li v-if="rultForm.Type === GenerelMappingTypeEnum.FeedEdge">
            <div class="row">
              <span class="label ft-f-12" style="margin-right: 14px;">叼口空白：</span>
              <el-radio-group v-model="rultForm.Position" class="content">
                <el-radio :label="FeedEdgePosition.Front">前折页叼口</el-radio>
                <el-radio :label="FeedEdgePosition.Back">后折页叼口</el-radio>
              </el-radio-group>
            </div>
            <div class="row">
              <span class="label" style="line-height: 36px;font-size: 12px;">叼口空白尺寸：</span>
              <div class="content">
                <div class="box">
                  <mp-button type="text" @click="onPorpertySelectClick('Formula')" style="margin-right: 25px;">设置</mp-button>
                  <span v-if="rultForm.Formula">{{ getFormulaName(rultForm.Formula) }}</span>
                  <div v-else>
                    <span>常数：</span>
                    <el-input v-model.number="rultForm.Value" maxlength="9" size="small"></el-input>
                    <em>mm</em>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <!-- 铣背设置 -->
          <li v-if="rultForm.Type === GenerelMappingTypeEnum.Milling">
            <div class="row">
              <span class="label" style="line-height: 36px;font-size: 12px;">铣背深度设为：</span>
              <div class="content">
                <div class="box">
                  <mp-button type="text" @click="onPorpertySelectClick('Formula')" style="margin-right: 25px;">设置</mp-button>
                  <span v-if="rultForm.Formula">{{ getFormulaName(rultForm.Formula) }}</span>
                  <div v-else>
                    <span>常数：</span>
                    <el-input v-model.number="rultForm.Value" maxlength="9" size="small"></el-input>
                    <em>mm</em>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </ContionCommonComp>
      <mp-empty class="mt-80" v-else description="暂无属性可设置"></mp-empty>
      <FormulaSelectDialog :visible.sync="visible" :FormulaList="OtherSetupListClassData.FormulaList" :curSelectedID="curSelectedID" @submit="onFormulaSelect"/>
    </main>
    <footer>
      <mp-button :disabled="!OtherSetupListClassData" type="primary" @click="onSubmitClick">保存</mp-button>
      <mp-button class="cancel-blue-btn" @click="goBackLastPage">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import Crumbs from '@/components/common/NewSetupComps/Crumbs.vue';
import { useTransformerStore } from '@/pinia/modules/transformer';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { goBackLastPage } from '@/router/handleRouterEach';
import { recordScrollPosition } from '@/assets/ts/recordScrollPositionMixin';
import { ContionCommonComp } from '@/components/common/mpzj-sell-lib/lib';
import { IGetConditonResult } from '@/pinia/modules/transformer/map/types';
import { RightPanelRuleForm } from './js/RightPanelRuleForm';
import { GenerelMappingTypeEnum, MoveTypeEnum, FeedEdgePosition } from '@/pinia/modules/transformer/map/enum';
import FormulaSelectDialog from './SetupComps/FormulaSelectDialog.vue';

recordScrollPosition('.mp-erp-new-comps-condtion-set-common-comp-wrap > .left > .left-content > main > .el-form.constraint-ruleForm');

const transformerStore = useTransformerStore();
const { convertServerList, TransformerListPageData, OtherSetupListClassData } = storeToRefs(transformerStore);

const crumbsList = computed(() => {
  const t = convertServerList.value.find(it => it.ID === TransformerListPageData.value?.ServerID);
  const serverName = t ? t.Name : '未获取到转换器名称';
  const partName = TransformerListPageData.value?.curPart?.Name || '';

  return [
    { name: `转换设置 ( ${serverName} )`, path: '/transformerList' },
    { name: '其它设置', path: '/otherLimitList' },
    {
      name: `${
        OtherSetupListClassData.value?.curSetupTableDataRowItem ? '编辑' : '添加'
      }${OtherSetupListClassData.value.curSetupTableData.title}设置：${TransformerListPageData.value?.curEditProductName}   ${partName}` },
  ];
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const oLeftComp = ref<InstanceType<any>>();

const rultForm = ref<null | RightPanelRuleForm>(null);

const onSubmitClick = () => {
  if (!oLeftComp.value || !OtherSetupListClassData.value || !rultForm.value) return;
  const condition = oLeftComp.value.getConditonResult() as IGetConditonResult;
  if (!condition) return;
  const params = rultForm.value.getParams();

  if (!params) return;

  const { ID, Priority, Constraint } = condition;
  const temp = {
    ID,
    Priority,
    Constraint,
    ...params,
  };

  OtherSetupListClassData.value.curSetupTableData.data.saveItem(temp);
};

const visible = ref(false);
const curFormulaKey = ref<'Formula' | 'MoveOutFormula'>('Formula');
const onPorpertySelectClick = (key: 'Formula' | 'MoveOutFormula') => {
  curFormulaKey.value = key;
  visible.value = true;
};
const onFormulaSelect = (data: null | { ID: string, Name: string }) => {
  rultForm.value[curFormulaKey.value] = data || null;
  visible.value = false;
};
const curSelectedID = computed(() => rultForm.value?.[curFormulaKey.value]?.ID || '');

const getFormulaName = (data?: { ID: string, Name: string }) => {
  if (!data) return '';
  if (data.Name) return data.Name;
  const t = OtherSetupListClassData.value.FormulaList.find(it => it.ID === data.ID);
  return t ? t.Name : '';
};

onMounted(() => {
  rultForm.value = new RightPanelRuleForm(OtherSetupListClassData.value.curSetupTableData.data.Type, OtherSetupListClassData.value.curSetupTableDataRowItem);
});

</script>

<script lang='ts'>
export default {
  name: 'OtherSetupSetupView',
};
</script>

<style scoped lang='scss'>
.wrap {
  padding: 0 8px;
  background-color: #f5f5f5;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > header {
    height: 30px;
    padding: 15px 20px;
  }
  > header, > main, > footer {
    background-color: #fff;
    flex: none;
  }
  > main {
    flex: 1;
    overflow: hidden;
    padding: 0 20px;
    // :deep(.mp-erp-common-comps-left-and-right-width-drap-auto-change-comp-wrap) > .left {
    //   width: 750px !important;
    // }
    .right-panel-wrap {
      color: #585858;
      margin-left: 14px;
      > li {
        .row {
          display: flex;
          margin-bottom: 20px;
          line-height: 24px;
          .label {
            width: 7em;
            text-align: right;
            flex: none;
            color: #444;
            margin-right: 6px;
            font-size: 12px;
          }

          .content {
            font-size: 12px;
            button {
              padding: 0;
              font-size: 12px;
              margin-left: 6px;
              margin-right: 15px;
            }
            .el-radio {
              line-height: 24px;
            }
            :deep(.el-checkbox__label) {
              font-size: 12px;
            }

            .box {
              display: flex;
              align-items: center;
              white-space: nowrap;
              line-height: 36px;
              margin-bottom: 10px;
              > div {
                display: flex;
                align-items: center;
                > div {
                  margin-right: 8px;
                  width: 80px;
                }
              }
            }
          }
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding-top: 50px;
    padding-bottom: 20px;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      & + .el-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
