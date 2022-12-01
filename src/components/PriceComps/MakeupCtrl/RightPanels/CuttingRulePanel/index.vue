<template>
  <section class="mp-erp-price-module-makeup-ctrl-page-cutting-rule-panel-wrap">
    <header>
      <span>{{partName||'产品'}}使用算法：</span>
      <el-radio-group v-model="radio">
        <el-radio :label="it.ID" v-for="it in CuttingRuleList" :key="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
    </header>
    <main>
      <div class="tips-box">
        <aside>
          <i class="el-icon-warning"></i>
          <span>注：</span>
        </aside>
        <ul>
          <li>最大数量：指不考虑通刀问题，拼版时尽最大可能拼最大数量</li>
          <li>考虑通刀：指拼版时考虑通刀问题，每版可能不会拼最大数量</li>
          <li>方向一致：指拼版时按一致方向放置文件，不会颠倒方向，可能浪费较大</li>
        </ul>
      </div>
    </main>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    initData: {
      type: Object,
      default: null,
    },
    partName: {
      type: String,
      default: '',
    },
  },
  computed: mapState('priceManage', ['CuttingRuleList']),
  data() {
    return {
      radio: 1,
    };
  },
  methods: {
    getSubmitInfo() {
      const temp = {
        CuttingRule: this.radio,
      };
      return temp;
    },
    initEditData() {
      if (this.initData) {
        this.radio = (this.initData.CuttingRule || this.initData.CuttingRule === 0) ? this.initData.CuttingRule : 1;
      }
    },
  },
  mounted() {
    this.initEditData();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-ctrl-page-cutting-rule-panel-wrap {
  > header {
    padding-top: 5px;
    > span {
      font-size: 14px;
      color: #888E99;
      margin-right: 6px;
    }
    .el-radio {
      margin-right: 40px;
      .el-radio__label {
        font-size: 12px;
        color: #444;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  > main {
    padding-top: 10vh;
    > div {
      height: 90px;
      display: flex;
      padding-top: 5px;
      > aside {
        width: 58px;
        text-align: right;
        flex: none;
        margin-right: 2px;
      }
      > ul {
        letter-spacing: 1px;
      }
    }
  }
}
</style>
