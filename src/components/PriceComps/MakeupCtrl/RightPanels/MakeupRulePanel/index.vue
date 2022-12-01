<template>
  <section class="mp-erp-price-module-makeup-ctrl-page-makeup-rule-set-panel-comp-wrap">
    <header>
      <span class="blue-span" :class="{'disabled': loading}" @click="onSelectClick">选择拼版规则</span>
      <span class="tips-box"><i class="el-icon-warning"></i> 不拼版则不用设置</span>
    </header>
    <main>
      <MakeupRuleSelectDialog :visible.sync="visible" :listData='MakeupRuleList' v-model="selectList" />
      <div class="list">
        <span v-for="(it, i) in selectList" :key="it.ID">
          {{it.ColumnNumber}}列 X {{it.RowNumber}}行
          <template v-if="i < selectList.length - 1">、</template>
        </span>
      </div>
    </main>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import MakeupRuleSelectDialog from './MakeupRuleSelectDialog.vue';

export default {
  props: {
    initData: {
      type: Object,
      default: null,
    },
  },
  components: {
    MakeupRuleSelectDialog,
  },
  data() {
    return {
      loading: true,
      visible: false,
      selectList: [],
    };
  },
  computed: {
    ...mapState('basicSet', ['MakeupRuleList']),
  },
  methods: {
    onSelectClick() {
      this.visible = true;
    },
    getSubmitInfo() {
      const temp = {
        RuleList: this.selectList,
      };
      return temp;
    },
  },
  async mounted() {
    await this.$store.dispatch('basicSet/getMakeupRuleList');
    this.loading = false;
    if (this.initData) {
      const { RuleList } = this.initData;
      if (Array.isArray(RuleList)) this.selectList = [...RuleList];
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-ctrl-page-makeup-rule-set-panel-comp-wrap {
  > header {
    padding-top: 4px;
    padding-bottom: 10px;
    > .blue-span {
      margin-right: 40px;
    }
    > .tips-box {
      display: inline-block;
      width: 300px;
    }
  }
  > main {
    padding-top: 20px;
    > .list {
      color: #999;
      font-size: 14px;
      line-height: 18px;
      max-width: 600px;
      > span {
        display: inline-block;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
