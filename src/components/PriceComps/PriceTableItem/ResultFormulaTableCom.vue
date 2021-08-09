<template>
  <!-- 结果公式列表 -->
  <section class="mp-erp-price-module-price-table-result-formula-table-comp-container">
    <header>
      <span class="mp-common-title-wrap">结果公式列表</span>
      <span class="blue-span" @click="onSetupClick(null)">+ 添加公式</span>
      <span class="tips-box">
        <i class="el-icon-warning"></i> 注：最终输出结果以下列公式运算结果为准，如果匹配不到任何公式，则此表输出结果为空。
      </span>
    </header>
    <main :class="{ loading: loading }">
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
              <p class="if-box" style="margin-right:5px">
                <span class="is-origin">则使用此公式</span>
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
                <span class="is-origin">则使用此公式</span>
              </p>
              <p>
                <em v-for="(res,ri) in item.result.filter(_it => _it)" :key="res + ri" style="margin-right:4px">{{res}}
                  <i style="color:#33BBD5;font-weight:700;font-size:13px" v-if="ri < item.result.length - 1">；</i>
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
import { mapState } from 'vuex';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';

export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    initFetch: {
      type: Boolean,
      default: true,
    },
    fetchFormulaListData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('priceManage', ['ResultFormulaList', 'PriceItemPropertyList']),
    localTableData() {
      if (!this.ResultFormulaList || !Array.isArray(this.ResultFormulaList) || this.ResultFormulaList.length === 0) return [];
      return this.ResultFormulaList.map(it => ({
        ...it,
        // eslint-disable-next-line no-nested-ternary
        FilterTypeText: it.Constraint ? (it.Constraint.FilterType === 1 ? '满足所有' : '满足任一') : '',
        result: this.getShowResult(it),
      })).map(it => {
        if (!it.Constraint) return { ...it, _ConditionText: '无' };
        const [Constraint, _ConditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(it.Constraint, this.PriceItemPropertyList);
        return { ...it, Constraint, _ConditionText };
      });
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    onSetupClick(data) {
      this.$emit('setup', data);
    },
    onRemoveClick(data) {
      this.messageBox.warnCancelNullMsg('确定删除该条公式吗?', () => {
        this.$emit('remove', data);
      });
    },
    getShowResult(item) {
      return [item.Content || '未获取到公式'];
    },
    async getFormulaList() {
      if (!this.fetchFormulaListData) return;
      this.loading = true;
      await this.$store.dispatch('priceManage/getResultFormulaList', this.fetchFormulaListData);
      this.loading = false;
    },
  },
  mounted() {
    if (this.initFetch) this.getFormulaList();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-price-table-result-formula-table-comp-container {
  padding-bottom: 40px;
  // padding-right: 10px;
  padding-top: 30px;
  background-color: #fff;
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
      // min-width: 12em;
      margin-right: 2.4em;
      &::before {
        height: 16px;
      }
    }
    > .blue-span {
      flex: none;
      font-size: 14px;
      white-space: nowrap;
      margin-right: 1em;
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
    &.loading {
      opacity: 0.2;
    }
  }
}
</style>
