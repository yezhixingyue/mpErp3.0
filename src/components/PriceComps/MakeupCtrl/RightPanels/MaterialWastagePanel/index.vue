<template>
  <section class="mp-erp-price-module-makeup-ctrl-page-material-wastage-panel-wrap">
    <header>
      <el-radio-group v-model="Rule">
        <el-radio :label="it.ID" v-for="it in WastageRuleList" :key="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
      <div>
        <el-input v-model.trim="Value" size="mini" maxlength="9"></el-input>
        <el-select v-model="Unit" size="mini">
          <el-option
            v-for="item in WastageUnitList"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>
        <el-select v-model="UnitType" size="mini">
          <el-option
            v-for="item in WastageUnitTypeList"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>
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
      Rule: 0,
      Value: '',
      Unit: 0,
      UnitType: 1,
    };
  },
  methods: {
    getSubmitInfo() {
      const { Rule, Value, Unit, UnitType } = this;
      if (!Value) {
        this.messageBox.failSingleError('保存失败', '请设置损耗数量');
        return null;
      }
      const bool = this.$utils.getValueIsOrNotNumber(Value, Unit !== 0);
      if (!bool) {
        this.messageBox.failSingleError('保存失败', '损耗数量输入不正确，应为数字类型，单位为%时可使用小数');
        return null;
      }
      if (+Value < 0) {
        this.messageBox.failSingleError('保存失败', '损耗数量不能为负');
        return null;
      }
      const Wastage = {
        Rule,
        Value,
        Unit,
        UnitType,
      };
      return { Wastage };
    },
    initEditData() {
      if (this.initData && this.initData.Wastage) {
        const { Rule, Value, Unit, UnitType } = this.initData.Wastage;
        this.Rule = (Rule || Rule === 0) ? Rule : 0;
        this.Value = (Value || Value === 0) ? Value : 0;
        this.Unit = (Unit || Unit === 0) ? Unit : 0;
        this.UnitType = (UnitType || UnitType === 0) ? UnitType : 0;
      }
    },
  },
  mounted() {
    this.initEditData();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-ctrl-page-material-wastage-panel-wrap {
  > header {
    padding-top: 5px;
    .el-radio {
      margin-right: 40px;
      margin-bottom: 30px;
      .el-radio__label {
        font-size: 12px;
        color: #444;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
    > div {
      display: flex;
      > .el-input {
        width: 95px;
        margin-right: 15px;
      }
      .el-select {
        width: 80px;
        &:last-of-type {
          width: 150px;
          margin-left: 15px;
        }
      }
      .el-input__inner {
        font-size: 12px;
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
