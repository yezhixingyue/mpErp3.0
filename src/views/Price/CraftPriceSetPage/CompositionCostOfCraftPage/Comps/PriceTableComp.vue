<template>
  <!-- 风险提示组件 -->
  <section class="mp-erp-price-module-price-table-page-price-table-comp-container">
    <header v-if="titleObj">
      <span class="mp-common-title-wrap">{{titleObj.title}}</span>
      <span class="blue-span" @click="onFormDataWriteClick(null)">{{titleObj.btnText}}</span>
      <slot name="title"></slot>
    </header>
    <main>
      <div v-for="item in localTableData" :key="item.ID">
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
              <!-- <p class="if-box" style="margin-right:5px">
                <span class="is-origin">{{type === '1' ? '使用' : '则'}}</span>
              </p>
              <p v-for="(res, ri) in item.result.filter(_it => _it)" :key="res + ri">{{res}}</p> -->
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
              <!-- <p class="if-box" style="margin-left:10px;margin-right:5px">
                <span class="is-origin">{{type === '1' ? '使用' : '则'}}</span>
              </p>
              <p>
                <em v-for="(res,ri) in item.result.filter(_it => _it)" :key="res + ri" style="margin-right:4px">{{res}}
                  <i style="color:#33BBD5;font-weight:700;font-size:13px" v-if="ri < item.result.length - 1">；</i>
                </em>
              </p> -->
            </div>
          </el-tooltip>
        </div>
        <!-- <span class="part-name" v-if="item.target" :title="item.target.DisplayContent?item.target.DisplayContent.replace(/\[|\]/g, ''):'未知'">
          {{item.target.DisplayContent?item.target.DisplayContent.replace(/\[|\]/g, ''):'未知'}}
        </span> -->
        <span class="priority-box">优先级：{{item.Priority}}</span>
        <span class="x axis" :title="item.XAxisName">横轴：{{item.XAxisName}}</span>
        <span class="y axis" :title="item.YAxisName">竖轴：{{item.YAxisName}}</span>
        <span class="formula" >公式（{{item.FormulaCount}}）条</span>
        <CtrlMenus
         @write='onFormDataWriteClick(item)'
         @remove='onRemoveClick(item)'
         :showList="['setupCost', 'write', 'export','del']"
         setupCostText='设置条件' />
      </div>
      <div v-if="localTableData.length === 0">
        <span style="margin-left:25px;color:#a2a2a2">{{ loading ? '加载中' : '暂无数据' }}</span>
      </div>
    </main>
  </section>
</template>

<script>
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
// import { PropertyFixedType } from '@/assets/js/TypeClass/PropertyClass';
import { mapState } from 'vuex';
// import { MakeupMode } from '@/assets/js/TypeClass/PrintBreadth';

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
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('priceManage', []),
    localTableData() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      return this.dataList.map(it => ({
        ...it,
        // eslint-disable-next-line no-nested-ternary
        FilterTypeText: it.Constraint ? (it.Constraint.FilterType === 1 ? '满足所有' : '满足任一') : '',
        // result: this.getShowResult(it),
        XAxisName: this.getAxisName(it.XAxis),
        YAxisName: this.getAxisName(it.YAxis),
        FormulaCount: this.getFormulaCount(it),
      }));
    },
  },
  data() {
    return {
    };
  },
  methods: {
    onFormDataWriteClick(data) {
      this.$emit('write', data);
    },
    onRemoveClick(data) {
      this.messageBox.warnCancelNullMsg('确定删除该条设置吗?', () => {
        this.$emit('remove', data);
      });
    },
    getAxisName(Axis) { // 获取轴名称
      if (!Axis || !Axis.Property) return '空';
      // console.log('getAxisName', Axis);
      const { Property, Operator } = Axis;
      const _Name = Property.DisplayContent ? Property.DisplayContent.replace(/\[|\]/g, '') : '未知';
      let _OperatorText = '';
      if (Operator && Property.ValueType === 0) {
        _OperatorText = '（有关系）';
      }
      return `${_Name}${_OperatorText}`;
    },
    getFormulaCount(it) {
      // console.log('getFormulaCount', it);
      if (!it.FormulaList) return 0;
      return '有值待补充';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-price-table-page-price-table-comp-container {
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
      min-width: 5em;
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
        overflow: hidden;
        min-width: 120px;
        > div {
          height: 36px;
          line-height: 36px;
        }
      }
      > .priority-box, > .part-name {
        width: 165px;
        min-width: 120px;
        padding-left: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 20px;
      }
      > .axis {
        width: 280px;
        padding-right: 15px;
        flex: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      > .formula {
        width: 130px;
        flex: none;
      }
      > .ctrl-menus-container {
        width: 340px;
        min-width: 150px;
        flex: none;
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
