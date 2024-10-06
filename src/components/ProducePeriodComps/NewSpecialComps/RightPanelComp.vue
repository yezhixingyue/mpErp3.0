<template>
  <ul v-if="itemData" class="mp-erp-period-manage-special-manage-setup-page-right-panel-comp-wrap">
    <li>
      <el-radio-group v-model="itemData.SpecialType">
        <el-radio :label="it.ID" v-for="it in NewSpecialTypeEnumList" :key="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
    </li>
    <template v-if="itemData.SpecialType !== NewSpecialTypeEnumObj.lastPay.ID">
      <li>
        <label></label>
        <el-radio-group v-model="itemData.TimeType">
          <el-radio :label="it.ID" v-for="it in SpecialTimeTypeEnumList" :key="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </li>
      <li v-if="itemData.TimeType === SpecialTimeTypeEnumObj.fixedTime.ID">
        <label>延长：</label>
        <el-input v-model.trim.number="itemData.TimeChange.First" maxlength="3"></el-input>
        <span style="margin-right:20px">天</span>
        <el-input v-model.trim.number="itemData.TimeChange.Second" maxlength="3"></el-input>
        <span>小时</span>
      </li>
      <li v-else>
        <label>除去范围：</label>
        <el-date-picker
          type="datetimerange"
          v-model="dateRange"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-ddTHH:mm:ss"
          :default-time="['00:00:00', '23:59:00']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" size="small">
        </el-date-picker>
      </li>
      <li>
        <label>提示：</label>
        <el-input type="textarea" :rows="3" v-model.trim="itemData.Tips" maxlength="40" show-word-limit />
      </li>
      <!-- <li>
        <label></label>
        <div class="update">
          <el-checkbox v-model="itemData.IsUpdateOrder">更新已有订单</el-checkbox>
          <div class="is-gray">
            <p v-show="itemData.SpecialType===NewSpecialTypeEnumObj.produce.ID">（仅更新近10天生产未完工的订单）</p>
            <p v-show="itemData.SpecialType===NewSpecialTypeEnumObj.transport.ID">（仅更新近10天未完成的订单）</p>
          </div>
        </div>
      </li> -->
    </template>
    <template v-else>
      <li class="l">
        <label>付款时间偏移：</label>
        <el-input v-model.trim.number="itemData.LatestPayChange" maxlength="3"></el-input>
        <span>小时</span>
      </li>
      <li class="l">
        <label>生产开始时间偏移：</label>
        <el-input v-model.trim.number="itemData.ProduceStartChange" maxlength="3"></el-input>
        <span>小时</span>
      </li>
    </template>
  </ul>
</template>

<script>
import NewSpecialPanelClass,
{ NewSpecialTypeEnumList, SpecialTimeTypeEnumList, NewSpecialTypeEnumObj, SpecialTimeTypeEnumObj } from '../../../store/Period/ItemClass/NewSpecialPanelClass';

export default {
  props: {
    curEditData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      itemData: null,
      NewSpecialTypeEnumList,
      SpecialTimeTypeEnumList,
      NewSpecialTypeEnumObj,
      SpecialTimeTypeEnumObj,
    };
  },
  computed: {
    dateRange: {
      get() {
        if (!this.itemData) return [];
        const { StartTime, EndTime } = this.itemData;
        return [StartTime, EndTime];
      },
      set(val) {
        if (!val) {
          this.itemData.StartTime = '';
          this.itemData.EndTime = '';
          return;
        }
        const [StartTime, EndTime] = val;
        this.itemData.StartTime = StartTime || '';
        this.itemData.EndTime = EndTime || '';
      },
    },
  },
  methods: {
    getSubmitInfo() {
      return this.itemData.checkAndGetSubmitData();
    },
  },
  mounted() {
    this.itemData = new NewSpecialPanelClass(this.curEditData);
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-special-manage-setup-page-right-panel-comp-wrap {
  min-width: 520px;
  padding-right: 40px;
  > li {
    margin-bottom: 18px;
    display: flex;
    align-items: flex-start;
    .el-input {
      flex: none;
      width: 80px;
      input {
        font-size: 13px;
        height: 32px;
        border-radius: 4px;
        text-align: center;
      }
    }
    .el-textarea {
      width: 520px;
      font-size: 13px;
    }
    .el-radio-group {
      margin-bottom: 0px;
    }
    .el-date-editor {
      width: 340px;
      line-height: 32px;
      height: 32px;
      input {
        font-size: 13px;
      }
      .el-range-separator {
        color: #989898;
      }
    }
    > label {
      flex: none;
      width: 5em;
      text-align: right;
      color: #888e99;
      line-height: 32px;
    }
    > span {
      flex: none;
      line-height: 30px;
      font-size: 13px;
      color: #989898;
      margin: 0 4px;
    }
    > div.update {
      display: flex;
      align-items: flex-start;
      > .is-gray {
        margin-left: 15px;
        margin-top: -2px;
        font-size: 13px;
        line-height: 24px;
      }
      .el-checkbox .el-checkbox__label{
        font-size: 13px;
      }
    }
    &:first-of-type {
      margin-bottom: 40px;
      padding-left: 20px;
    }
    &.l {
      > label {
        width: 9em;
      }
    }
  }
}
</style>
