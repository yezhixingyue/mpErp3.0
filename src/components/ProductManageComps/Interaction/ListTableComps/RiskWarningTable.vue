<template>
  <!-- 风险提示组件 -->
  <section class="mp-erp-product-module-interaction-risk-warning-table-com-container">
    <header v-if="curTableType">
      <span class="mp-common-title-wrap">{{curTableType.title}}</span>
      <span class="blue-span" @click="onSetupClick(null)">{{curTableType.btnText}}</span>
    </header>
    <main>
      <div v-for="item in localTableData" :key="item.ID">
        <div class="condition">
          <el-tooltip effect="light" popper-class='common-property-condition-text-tips-box' placement="bottom-start" :visible-arrow='false'>
            <div slot="content">
              <p class="if-box"><span class="is-origin">如果</span> {{item.FilterTypeText}}：</p>
              <template v-if="Array.isArray(item.conditionText)">
                <p v-for="(it, i) in item.conditionText" :key="it.name + 'tips' + i">
                  <span v-if="i > 0" class="type">{{item.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                  <span class="name">{{it.name}}</span>
                  <span class="is-origin">{{it.operator}}</span>
                  <span class="val">{{it.val}}</span>
                  <span v-if="i === item.conditionText.length - 1" style="margin-left:2px"> 。</span>
                  <span v-else style="margin-left:2px">；</span>
                </p>
              </template>
              <p v-else>{{item.conditionText}}</p>
              <p class="if-box" style="margin-right:5px"><span class="is-origin">则：</span></p>
              <p v-for="(res, ri) in item.result" :key="res + ri">{{res}}</p>
            </div>
            <div class="common-property-condition-text-content-box">
              <p class="if-box"><span class="is-origin">如果</span> {{item.FilterTypeText}}</p>
              <template v-if="Array.isArray(item.conditionText)">
                <p v-for="(it, i) in item.conditionText" :key="it.name + 'content' + i">
                  <span v-if="i > 0" class="type">{{item.Constraint.FilterType === 1 ? '且' : '或'}}</span>
                  <span>{{it.name}}</span>
                  <span>{{it.operator}}</span>
                  <span>{{it.val}}</span>
                </p>
              </template>
              <p v-else>{{item.conditionText}}</p>
              <p class="if-box" style="margin-left:10px;margin-right:5px"><span class="is-origin">则</span></p>
              <p>
                <em v-for="(res,ri) in item.result" :key="res + ri" style="margin-right:4px">{{res}}
                  <i style="color:#33BBD5;font-weight:700;font-size:13px" v-if="ri < item.result.length - 1">；</i>
                </em>
              </p>
            </div>
          </el-tooltip>
        </div>
        <!-- <span class="part-name">部件1</span> -->
        <span class="priority-box">优先级：{{item.Priority}}</span>
        <CtrlMenus @edit='onSetupClick(item)' @remove='onRemoveClick(item)' />
      </div>
    </main>
  </section>
</template>

<script>
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import PropertyClass, { AllOperatorList } from '@/assets/js/TypeClass/PropertyClass';
import { mapState } from 'vuex';

export default {
  props: {
    type: {
      type: String,
      default: 'risk',
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    PropertyList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('productManage', ['ControlTypeList', 'RiskWarningRangeList', 'RiskWarningTypeList']),
    localTableData() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      return this.dataList.map(it => ({
        ...it,
        FilterTypeText: it.Constraint.FilterType === 1 ? '满足所有' : '满足任一',
        conditionText: this.getConditionText(it.Constraint.ItemList),
        result: this.getShowResult(it),
      }));
    },
    curTableType() {
      return this.tableTypeList.find(it => it.type === this.type);
    },
  },
  data() {
    return {
      tableTypeList: [
        { title: '界面交互', btnText: '+ 添加交互', type: 'interaction' },
        { title: '对比验证', btnText: '+ 添加对比', type: 'compare' },
        { title: '风险提示', btnText: '+ 添加风险提示', type: 'risk' },
        { title: '子交互', btnText: '+ 添加子交互', type: 'subInteraction' },
        { title: '子对比', btnText: '+ 添加子对比', type: 'subCompare' },
      ],
    };
  },
  methods: {
    onSetupClick(data) {
      this.$emit('setup', data);
    },
    onRemoveClick(data) {
      this.$emit('remove', data);
    },
    getConditionText(list) {
      const str = PropertyClass.getPropertyConditionText(list, this.PropertyList);
      return str || '空';
    },
    getShowResult(it) {
      const { List, ControlType } = it;
      const control = this.ControlTypeList.find(_it => _it.ID === ControlType);
      if (!control) return ['错误：获取控制类型失败'];
      if (control.Name === 'risk' && Array.isArray(List) && List.length === 1) { // 风险提示类型
        const { FailTips, DisplayMode, AreaList } = List[0];
        let RiskWarningRange = this.$utils.getNameFromListByIDs(AreaList, this.RiskWarningRangeList);
        RiskWarningRange = RiskWarningRange ? RiskWarningRange.join('、') : '';
        const Mode = this.$utils.getNameFromListByIDs(DisplayMode, this.RiskWarningTypeList);
        return [`${RiskWarningRange} ${Mode}：${FailTips}`];
      }
      if (control.Name === 'interaction' && Array.isArray(List)) { // 交互
        if (List.length === 0) return '空';
        const _list = List.map(_it => {
          const { Property, Operator, OptionList } = _it;
          if (!Property) return '';
          let OperatorText = this.$utils.getNameFromListByIDs(Operator, AllOperatorList);
          OperatorText = OperatorText || '未知关系';
          const _Name = Property.DisplayContent.replace(/\[|\]/g, '');
          let optionText = '';
          if (Array.isArray(OptionList) && OptionList.length > 0) {
            const { ValueType } = Property;
            if (Property.OptionList && Property.OptionList.length > 0) {
              if (ValueType !== 6) { // 非物料
                const list = this.$utils.getNameFromListByIDs(OptionList, Property.OptionList, { label: 'Second', value: 'First' });
                if (Array.isArray(list) && list.length > 1) {
                  optionText = ` [ ${list.join('/')} ] `;
                }
              } else {
                optionText = PropertyClass.getMaterialListShowText(OptionList, Property.OptionList);
                optionText = optionText ? `: ${optionText}` : optionText;
              }
            }
          }
          return `${OperatorText} ${_Name} ${optionText}`;
        });
        return _list;
      }
      return ['其它类型，暂未生成对应结果'];
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-interaction-risk-warning-table-com-container {
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
        overflow: hidden;
        > div {
          height: 36px;
          line-height: 36px;
        }
      }
      > .priority-box, > .part-name {
        width: 165px;
        min-width: 120px;
        padding-left: 15px;
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
    }
  }
}
</style>
