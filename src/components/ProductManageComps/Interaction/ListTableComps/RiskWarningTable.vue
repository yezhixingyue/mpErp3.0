<template>
  <!-- 风险提示组件 -->
  <section class="mp-erp-product-module-interaction-risk-warning-table-com-container">
    <header>
      <span class="mp-common-title-wrap">风险提示</span>
      <span class="blue-span" @click="onRiskSetClick(null)">+ 添加风险提示</span>
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
              <p>{{item.result}}</p>
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
              <p>{{item.result}}</p>
            </div>
          </el-tooltip>
        </div>
        <!-- <span class="part-name">部件1</span> -->
        <span class="priority-box">优先级：{{item.Priority}}</span>
        <CtrlMenus @edit='onRiskSetClick(item)' @remove='onRemoveClick(item)' />
      </div>
    </main>
  </section>
</template>

<script>
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import { mapState } from 'vuex';

export default {
  props: {
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
  },
  methods: {
    onRiskSetClick(data) {
      this.$emit('setup', data);
    },
    onRemoveClick(data) {
      this.$emit('remove', data);
    },
    getConditionText(list) {
      const str = PropertyClass.getPropertyConditionText(list, this.PropertyList);
      return str || '未设置条件';
    },
    getShowResult(it) {
      const { List, ControlType } = it;
      const control = this.ControlTypeList.find(_it => _it.ID === ControlType);
      if (!control) return '错误：获取控制类型失败';
      if (control.Name === 'risk' && Array.isArray(List) && List.length === 1) {
        const { FailTips, DisplayMode, AreaList } = List[0];
        let RiskWarningRange = this.$utils.getNameFromListByIDs(AreaList, this.RiskWarningRangeList);
        RiskWarningRange = RiskWarningRange ? RiskWarningRange.join('、') : '';
        const Mode = this.$utils.getNameFromListByIDs(DisplayMode, this.RiskWarningTypeList);
        return `${RiskWarningRange} ${Mode}：${FailTips}`;
      }
      return '其它类型，暂未生成对应结果';
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
        padding: 0 25px;
        overflow: hidden;
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
