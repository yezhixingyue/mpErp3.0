<template>
  <LRWidthDragAutoChangeComp leftWidth='450px' class="mp-erp-new-comps-condtion-set-common-comp-wrap">
    <template v-slot:left>
      <section class="left-content" v-if="ruleForm">
        <header>
          <span class="label">优先级：</span>
          <el-input v-model.trim.number="ruleForm.Priority" maxlength="15" size="small"></el-input>
          <span class="tips-box">
            <i class="el-icon-warning"></i> 注：数字越小优先级越高
          </span>
        </header>
        <main>
          <p class="section-title">
            <span class="mp-common-title-wrap">如果</span>
            <span class="blue-span" @click="visible=true">+ 添加条件</span>
          </p>
          <!-- 条件区域 -->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px" class="constraint-ruleForm">
            <el-form-item
             v-for="(it, index) in ruleForm.Constraint.ItemList"
             :key="it.key || it.ConstraintID || it.Property.StoredContent"
             :prop="it.key || it.ConstraintID || it.Property.StoredContent">
              <span slot="label" :title="it.Property.TipsContent || it.Property.DisplayContent.replace(/\[|\]/g, '')"
                >{{it.Property.DisplayContent.replace(/\[|\]/g, '')}}</span>
              <OperatorSelectorComp v-model="it.Operator" :valueList.sync='it.ValueList' :PropertyData='it.Property' />
              <ValueSelectorComp v-model="it.ValueList" :PropertyData='it.Property'  />
              <div class="del-btn" @click="onRemoveClick(index)">
                <img src="@/assets/images/del.png" alt="">
                <span>删除</span>
              </div>
            </el-form-item>
          </el-form>
          <el-radio-group v-model="ruleForm.Constraint.FilterType" size="small" class="mp-common-tab-radio-box">
            <el-radio-button :label="1">满足所有条件</el-radio-button>
            <el-radio-button :label="2">满足任一条件</el-radio-button>
          </el-radio-group>
          <FormulaPanelElementSelectDialog :visible.sync='visible' :list='PropertyList' @submit='onElementSelect' :selectedElementIDs='selectedElementIDs' />
        </main>
      </section>
    </template>
    <template v-slot:right>
      <div class="right-content">
        <slot></slot>
      </div>
    </template>
  </LRWidthDragAutoChangeComp>
</template>

<script>
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import FormulaPanelElementSelectDialog from '@/components/common/FormulaAndConditionComps/FormulaPanelElementSelectDialog.vue';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import OperatorSelectorComp from './OperatorSelectorComp.vue';
import ValueSelectorComp from './ValueSelectorComp.vue';

export default {
  props: {
    PositionID: {
      type: String,
      default: '',
    },
    moduleIndex: {
      type: Number,
      default: 0,
    },
  },
  components: {
    LRWidthDragAutoChangeComp,
    FormulaPanelElementSelectDialog, // 选择元素弹窗
    OperatorSelectorComp,
    ValueSelectorComp,
  },
  data() {
    return {
      visible: false,
      PropertyList: [],
      selectedElementIDs: [],
      isWatching: true,
      ruleForm: {
        ID: '',
        Priority: '', // 优先级
        Constraint: {
          ConstraintID: '',
          FilterType: 1, // 满足所有 1   满足任一 2
          ItemList: [],
        },
      },
      rules: {},
    };
  },
  methods: {
    async getPropertyList() { // 获取属性列表数据
      const propertyList = await PropertyClass.getPropertyList(this.PositionID, this.moduleIndex);
      if (propertyList) {
        this.PropertyList = propertyList;
        // this.initPropertyListReplaceHelper();
      }
    },
    initPropertyListReplaceHelper() { // 获取可用属性列表并转换完成后，对编辑数据时初始的PropertyList的数据进行修改操作（以获取到的可用属性为准）
      if (!this.FormulaData || this.FormulaData.PropertyList.length === 0) return;
      this.FormulaData.PropertyList = this.FormulaData.PropertyList.map(it => {
        const t = this.PropertyList.find(_it => _it.Element.ID === it.Element.ID && it.FixedType === _it.FixedType);
        if (t) return { ...t, DefaultValue: it.DefaultValue };
        return null;
      }).filter(it => it);
    },
    onElementSelect(Element) { // 属性弹窗种进行属性选择
      const item = {
        ConstraintID: '',
        Property: Element,
        Operator: '',
        ValueList: [],
        key: Math.random().toString(36).slice(-8),
      };
      this.ruleForm.Constraint.ItemList.push(item);
    },
    onRemoveClick(i) {
      this.ruleForm.Constraint.ItemList.splice(i, 1);
    },
  },
  watch: {
    PositionID(val) {
      if (this.isWatching && val) {
        this.getPropertyList();
        this.isWatching = false;
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-new-comps-condtion-set-common-comp-wrap {
  > .left {
    > .left-content {
      height: 100%;
      > header {
        white-space: nowrap;
        padding: 20px 0;
        .el-input {
          width: 110px;
          margin-right: 20px;
          .el-input__inner {
            height: 30px;
            line-height: 30px;
          }
        }
        .tips-box {
          padding-left: 16px;
          display: inline-block;
          min-width: 220px;
          width: calc(100% - 195px);
          max-width: 400px;
        }
      }
      > main {
        min-height: calc(100% - 72px);
        display: flex;
        flex-direction: column;
        > p.section-title {
          padding: 15px 0;
          padding-bottom: 30px;
          flex: none;
          .mp-common-title-wrap {
            color: #444;
          }
          .blue-span {
            font-size: 13px;
            margin-left: 15px;
          }
        }
        > .el-form.constraint-ruleForm {
          flex: 1;
          .el-form-item {
            white-space: nowrap;
            .el-form-item__label {
              color: #888E99;
              white-space: nowrap;
              font-size: 13px;
              margin-right: 6px;
              line-height: 30px;
            }
            .el-form-item__content {
              white-space: nowrap;
              // height: 30px;
              line-height: 26px;
              display: flex;
              align-items: flex-end;
              > div {
                flex: none;
              }
              .mp-erp-new-comps-condtion-set-common-comp-operator-comp-wrap {
                margin-right: 15px;
              }
              .del-btn {
                display: flex;
                align-items: center;
                font-size: 12px;
                padding-left: 12px;
                cursor: pointer;
                height: 30px;
                > span {
                  margin-left: 10px;
                  color: #a2a2a2;
                  transition: color 0.1s ease-in-out;
                  user-select: none;
                }
                &:hover > span {
                  color: #444;
                }
              }
            }
          }
        }
        > .el-radio-group {
          width: 100%;
          padding: 18px 0;
          flex: none;
          text-align: center;
          white-space: nowrap;
          > label {
            .el-radio-button__inner {
              padding: 9px 34px;
            }
          }
        }
      }
    }
  }
  > .right {
    > .right-content {
      padding-left: 5vw;
    }
  }
  span.label {
    font-size: 14px;
    color: #888E99;
  }
}
</style>
