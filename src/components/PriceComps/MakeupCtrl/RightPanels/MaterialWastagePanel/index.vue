<template>
  <section class="mp-erp-price-module-makeup-ctrl-page-material-wastage-panel-wrap">
    <header>
      <el-radio-group v-model="radio">
        <el-radio :label="it.ID" v-for="it in WastageRuleList" :key="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
      <div>
        <el-input v-model="Value" size="small"></el-input>
      </div>
    </header>
    <main>
      <div class="tips-box">
        <aside>
          <i class="el-icon-warning"></i>
          <span>注：</span>
        </aside>
        <ul>
          <li>展开物料数量指以展开尺寸为大小的物料数量。</li>
          <li>印刷幅面物料数量指的是拼成大版后需要印刷的物料数量，如四开、对开。</li>
          <li>百分比以产品/部件实际数量不加任何损耗的情况下为基数。</li>
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
  computed: mapState('priceManage', ['WastageRuleList', 'WastageUnitTypeList', 'WastageUnitList']),
  data() {
    return {
      radio: 1,
      Value: '',
      Unit: '',
      UnitType: '',
    };
  },
  methods: {
    getSubmitInfo() {
      const Wastage = {
        Rule: this.radio,
      };
      return { Wastage };
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-ctrl-page-material-wastage-panel-wrap {
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
