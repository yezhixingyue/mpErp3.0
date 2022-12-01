<template>
  <!-- 风险提示组件 -->
  <section class="mp-erp-price-module-makeup-ctrl-table-comp-container">
    <header v-if="titleObj">
      <span class="mp-common-title-wrap">
        {{titleObj.title}}
        <!-- <em class="blue-span is-font-size-12" style="margin-left:5px" @click="visible=!visible">
          {{visible ? '隐藏' : '展开'}}
          <i v-show="visible" class="el-icon-caret-top"></i>
          <i v-show="!visible" class="el-icon-caret-bottom"></i>
        </em> -->
      </span>
      <span class="blue-span" @click="onSetupClick(null)">{{titleObj.btnText}}</span>
      <slot name="title"></slot>
    </header>
    <main v-show="visible">
      <div v-for="(item, i) in localTableData" :key="item.ID" @click="onRowClick(item)" :class="{active: activeRowID === item.ID}">
        <span class="sort">{{i + 1}}.</span>
        <div class="condition">
          <el-tooltip effect="light" popper-class='common-property-condition-text-tips-box' placement="bottom-start" :visible-arrow='false'>
            <div slot="content">
              <p class="if-box"><span class="is-origin">如果</span> {{item.FilterTypeText}}：</p>
              <template v-if="Array.isArray(item._ConditionText)">
                <p v-for="(it, i) in item._ConditionText" :key="it.name + 'tips' + i">
                  <span v-if="i > 0" class="type">{{item.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                  <span class="name">{{it.name}}</span>
                  <span class="is-origin">{{it.operator}}</span>
                  <span class="val">{{it.val}}</span>
                  <span v-if="i === item._ConditionText.length - 1" style="margin-left:2px"> 。</span>
                  <span v-else style="margin-left:2px">；</span>
                </p>
              </template>
              <p v-else>{{item._ConditionText}}</p>
              <p class="if-box" style="margin-right:5px">
                <span class="is-origin">{{separator}}</span>
              </p>
              <p v-for="(res, ri) in item.result.filter(_it => _it)" :key="res + ri">{{res}}</p>
            </div>
            <div class="common-property-condition-text-content-box">
              <p class="if-box"><span class="is-origin">如果</span> {{item.FilterTypeText}}</p>
              <template v-if="Array.isArray(item._ConditionText)">
                <p v-for="(it, i) in item._ConditionText" :key="it.name + 'content' + i">
                  <span v-if="i > 0" class="type">{{item.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                  <span>{{it.name}}</span>
                  <span>{{it.operator}}</span>
                  <span>{{it.val}}</span>
                </p>
              </template>
              <p v-else>{{item._ConditionText}}</p>
              <p class="if-box" style="margin-left:10px;margin-right:5px">
                <span class="is-origin">{{separator}}</span>
              </p>
              <p>
                <em v-for="(res,ri) in item.result.filter(_it => _it)" :key="res + ri" style="margin-right:4px">{{res}}
                  <i style="font-weight:700;font-size:13px" v-if="ri < item.result.length - 1">；</i>
                </em>
              </p>
            </div>
          </el-tooltip>
        </div>
        <!-- <span class="part-name" v-if="item.target" :title="item.target.DisplayContent?item.target.DisplayContent.replace(/\[|\]/g, ''):'未知'">
          {{item.target.DisplayContent?item.target.DisplayContent.replace(/\[|\]/g, ''):'未知'}}
        </span> -->
        <span class="priority-box">优先级：{{item.Priority}}</span>
        <CtrlMenus @edit='onSetupClick(item)' @remove='onRemoveClick(item)' />
      </div>
      <div v-if="localTableData.length === 0">
        <span style="margin-left:25px;color:#a2a2a2">暂无数据</span>
      </div>
    </main>
  </section>
</template>

<script>
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import { mapState } from 'vuex';
import { MakeupMode } from '@/assets/js/TypeClass/PrintBreadth';
import { PropertyUtils } from '@/components/common/mpzj-sell-lib/lib';

const { PropertyFixedType } = PropertyUtils;

export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    titleObj: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    activeRowID: {
      type: String,
      default: '',
    },
  },
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('priceManage', ['MakeupControlTypeList', 'WastageRuleList', 'WastageUnitTypeList', 'WastageUnitList', 'PrintTimesRuleList', 'CuttingRuleList']),
    localTableData() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      return this.dataList.map(it => ({
        ...it,
        // eslint-disable-next-line no-nested-ternary
        FilterTypeText: it.Constraint ? (it.Constraint.FilterType === 1 ? '满足所有' : '满足任一') : '未知满足关系',
        result: this.getShowResult(it),
      }));
    },
    separator() {
      if (this.type === '1') return '使用';
      if (this.type === '6') return '使用物料尺寸：';
      return '则';
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    onSetupClick(data) {
      this.$emit('setup', [this.type, data]);
    },
    onRemoveClick(data) {
      this.messageBox.warnCancelNullMsg('确定删除该条设置吗?', () => {
        this.$emit('remove', data);
      });
    },
    getShowResult(item) {
      const t = this.MakeupControlTypeList.find(_it => _it.ID === +this.type);
      if (!t) return ['未知结果'];
      if (t.Name === '尺寸数量') {
        const { LengthFormula, WidthFormula, DifferentContentFormula, PrintNumberFormula, MixtureID } = item;
        if (MixtureID) return ['允许混拼'];
        const getValue = ({ Value, FormulaName, Type }, title) => {
          let str = title;
          if (FormulaName) {
            str += FormulaName;
            const targetFixedTypeName = this.$utils.getNameFromListByIDs(Type, PropertyFixedType);
            if (targetFixedTypeName) str += targetFixedTypeName;
          } else if (Value || Value === 0) str += Value;
          else str += '未获取到';
          return str;
        };
        const len = getValue(LengthFormula || {}, '长：');
        const width = getValue(WidthFormula || {}, '宽：');
        const number = getValue(DifferentContentFormula || {}, '纸张数量：');
        const count = getValue(PrintNumberFormula || {}, '印刷份数：');
        return [len, width, number, count];
      }
      if (t.Name === '拼版幅面') {
        const { BreadthList } = item;
        const str = BreadthList.map(it => {
          const { First, Second } = it;
          const modeText = this.$utils.getNameFromListByIDs(Second, MakeupMode).join('、');
          return `${First.Name}（${modeText}）`;
        }).join('、');
        return [str];
      }
      if (t.Name === '拼版规则') {
        const { RuleList } = item;
        if (!Array.isArray(RuleList)) return [''];
        const str = RuleList.map(it => `${it.ColumnNumber}列 X ${it.RowNumber}行`).join('、');
        return [`${this.title || '产品'}使用 ${str || '按1张（默认）'} 进行拼版`];
      }
      if (t.Name === '拼版算法') {
        const { CuttingRule } = item;
        if (!CuttingRule && CuttingRule !== 0) return [''];
        const Text = this.$utils.getNameFromListByIDs(CuttingRule, this.CuttingRuleList);
        return [`${this.titleObj.title}使用：${Text}算法`];
      }
      if (t.Name === '印刷次数') {
        const { PrintTimes } = item;
        if (!PrintTimes && PrintTimes !== 0) return [''];
        const Text = this.$utils.getNameFromListByIDs(PrintTimes, this.PrintTimesRuleList);
        return [`${this.titleObj.title}为：${Text}`];
      }
      if (t.Name === '物料损耗') {
        const { Wastage } = item;
        if (typeof Wastage !== 'object') return [''];
        const { Rule, Value, Unit, UnitType, FormulaName, FormulaID } = Wastage;
        const UnitTypeText = this.$utils.getNameFromListByIDs(UnitType, this.WastageUnitTypeList);
        const RuleText = this.$utils.getNameFromListByIDs(Rule, this.WastageRuleList);
        let msg;
        if (FormulaID) {
          if (FormulaName) msg = `${RuleText}：[公式:${FormulaName}]  张（ ${UnitTypeText} ）`;
          else msg = `${RuleText}：[公式:未获取到名称] 张（ ${UnitTypeText} ）`;
        } else {
          const UnitText = this.$utils.getNameFromListByIDs(Unit, this.WastageUnitList);
          msg = `${RuleText}：${Value}${UnitText}（ ${UnitTypeText} ）`;
        }
        return [msg];
      }
      if (t.Name === '物料尺寸') {
        const { MaterialSizeList } = item;
        if (!Array.isArray(MaterialSizeList)) return [''];
        const list = MaterialSizeList.map(it => `${it.First.Name}（${it.Second}元）`);
        return [list.join('、')];
      }
      return ['其它类型，暂未生成对应结果'];
    },
    onRowClick(item) {
      // eslint-disable-next-line no-unused-expressions
      item && item.ID && (this.$emit('rowClick', item.ID));
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-ctrl-table-comp-container {
  margin-bottom: 40px;
  > header {
    padding-bottom: 10px;
    line-height: 28px;
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    > .mp-common-title-wrap {
      font-size: 15px;
      color: #444;
      min-width: 12em;
      margin-right: 1em;
      &::before {
        height: 16px;
      }
    }
    > .blue-span {
      flex: none;
      font-size: 14px;
      white-space: nowrap;
    }
  }
  > main {
    > div {
      display: flex;
      align-items: center;
      height: 45px;
      box-sizing: border-box;
      border: 1px solid #eee;
      font-size: 12px;
      color: #585858;
      transition: 0.1s ease-in-out;
      min-width: 800px;
      &:not(:last-of-type) {
        border-bottom: none;
      }
      > .condition {
        flex: 1;
        padding: 0px 25px;
        height: 36px;
        padding-left: 13px;
        overflow: hidden;
        > div {
          height: 36px;
          line-height: 36px;
        }
      }
      > .sort {
        line-height: 20px;
        padding-left: 15px;
        min-width: 18px;
      }
      > .priority-box, > .part-name {
        width: 165px;
        min-width: 120px;
        padding-left: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 20px;
      }
      > .ctrl-menus-container {
        width: 230px;
        min-width: 150px;
      }
      &:hover {
        border-color: #ccc;
        background-color: #f8f8f8;
        & + div {
          border-top-color: #ccc;
        }
      }
      &.active {
        border-color: #ccc;
        background-color: #eee;
        & + div {
          border-top-color: #ccc;
        }
      }
    }
  }
}
</style>
