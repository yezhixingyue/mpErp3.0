<template>
  <div class="mp-erp-product-manage-comps-interaction-right-panels-risk-panel-container">
    <p>
      <span>提示内容：</span>
      <el-input size='small' v-model.trim="FailTips" maxlength="300" show-word-limit></el-input>
    </p>
    <p>
      <span>提示形式：</span>
      <el-radio-group v-model="DisplayMode">
        <el-radio :label="it.ID" v-for="it in RiskWarningTypeList" :key="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
    </p>
    <p>
      <span>提示范围：</span>
      <el-checkbox-group v-model="AreaList">
        <el-checkbox :label="it.ID" v-for="it in RiskWarningRangeList" :key="it.ID">{{it.Name}}</el-checkbox>
      </el-checkbox-group>
    </p>
    <div>
      <p>提示形式示例：</p>
      <ul>
        <li>
          <span>对话框：</span>
          <img src="@/assets/images/pop-tip.png" alt="">
        </li>
        <li>
          <span>页面提示：</span>
          <img src="@/assets/images/page-tip.png" alt="">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    initData: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapState('productManage', ['RiskWarningTypeList', 'RiskWarningRangeList']),
  },
  data() {
    return {
      FailTips: '',
      DisplayMode: '',
      AreaList: [],
      ID: '',
      ControlID: '',
    };
  },
  methods: {
    getSubmitInfo() {
      const bool = this.getCheckResult();
      if (bool) {
        return {
          List: [{
            FailTips: this.FailTips,
            DisplayMode: this.DisplayMode,
            AreaList: this.AreaList,
            ID: this.ID,
            ControlID: this.ControlID,
          }],
        };
      }
      return null;
    },
    getCheckResult() {
      if (!this.FailTips) {
        this.messageBox.failSingleError('保存失败', '请输入提示内容');
        return false;
      }
      if (!this.DisplayMode) {
        this.messageBox.failSingleError('保存失败', '请选择提示形式');
        return false;
      }
      if (!this.AreaList || this.AreaList.length === 0) {
        this.messageBox.failSingleError('保存失败', '请选择提示范围');
        return false;
      }
      return true;
    },
  },
  mounted() {
    if (this.initData && Array.isArray(this.initData.List) && this.initData.List.length === 1) { // 编辑时还原数据
      const [obj] = this.initData.List;
      const { AreaList, DisplayMode, FailTips, ID, ControlID } = obj;
      this.AreaList = AreaList;
      this.DisplayMode = DisplayMode;
      this.FailTips = FailTips;
      this.ID = ID;
      this.ControlID = ControlID;
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-product-manage-comps-interaction-right-panels-risk-panel-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  > p {
    display: flex;
    margin-bottom: 12px;
    flex: none;
    > span {
      flex: none;
      color: #888E99;
      line-height: 30px;
      margin-right: 4px;
      font-size: 14px;
    }
    > .el-input {
      max-width: 600px;
      min-width: 300px;
      .el-input__inner {
        padding-right: 65px;
      }
    }
    > .el-radio-group {
      .el-radio {
        .el-radio__label {
          line-height: 30px;
          font-size: 12px;
          color: #585858;
        }
      }
    }
    > .el-checkbox-group {
      .el-checkbox {
        .el-checkbox__label {
          line-height: 30px;
          font-size: 12px;
          color: #585858;
        }
      }
    }
    &:first-of-type {
      margin-bottom: 26px;
    }
  }
  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 25px 0;
    > p {
      font-weight: 700;
      font-size: 14px;
      color: #444;
      padding-bottom: 30px;
    }
    > ul {
      display: flex;
      > li {
        display: flex;
        flex-direction: column;
        > span {
          color: #888E99;
          padding-bottom: 15px;
        }
        & + li {
          margin-left: 100px;
        }
      }
    }
  }
}
</style>
