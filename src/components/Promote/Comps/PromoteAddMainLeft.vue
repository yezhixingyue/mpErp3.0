<template>
  <div class="promote-add-edit-detail-left-wrap">
    <ul class="mp-scroll-wrap">
      <li>
        <!-- 活动标题 -->
        <field-input :isDisabled="isDisabled" v-model="promoteTitle" />
      </li>
      <li class="date-range">
        <span>时间范围：</span>
        <el-date-picker
          :isDisabled="isDisabled"
          v-model="StartDate"
          value-format="yyyy-MM-dd"
          size="small"
          placeholder="年 / 月 / 日"
        ></el-date-picker>
        <i>—</i>
        <el-date-picker
          :isDisabled="isDisabled"
          v-model="EndDate"
          value-format="yyyy-MM-dd"
          size="small"
          placeholder="年 / 月 / 日"
        ></el-date-picker>
      </li>
      <li class="date-cycle">
        <label>周期：</label>
        <div class="content">
          <el-radio-group v-model="PeriodType" :isDisabled="isDisabled">
            <el-radio :label="0">按天</el-radio>
            <el-radio :label="1">按周</el-radio>
          </el-radio-group>
          <ul>
            <li v-for="it in localPeriodList" :key="it.Label">
              <el-checkbox
                :value='it.isChecked'
                @change="onPeriodItemCheckedChange($event, it.Value)"
                v-if="it.Value"
                :isDisabled="isDisabled"
                >{{ it.Label }}</el-checkbox
              >
              <label v-else>{{ it.Label }}</label>
              <el-time-picker
                :value='it.StartTime'
                :editable='false'
                @input="onPeriodItemTimeChange($event, it.Value, 'StartTime')"
                value-format='HH:mm'
                :picker-options="{ format: 'HH:mm' }"
                :isDisabled="isDisabled"
                :default-value='defaultBeginTime'
                placeholder="00:00"
                size="mini"
                v-show="!it.Value || it.isChecked"
              />
              <i v-show="!it.Value || it.isChecked">-</i>
              <el-time-picker
                :value='it.EndTime'
                :editable='false'
                @input="onPeriodItemTimeChange($event, it.Value, 'EndTime')"
                :picker-options="{ format: 'HH:mm' }"
                :isDisabled="isDisabled"
                value-format='HH:mm'
                placeholder="23:59"
                :default-value='defaultEndTime'
                size="mini"
                v-show="!it.Value || it.isChecked"
              />
            </li>
          </ul>
        </div>
      </li>
      <li>
        <!-- 申请人 -->
        <staff-selector
          :changePropsFunc="setPromoteAddRequestObj"
          :typeList="[['ApplyUser', 'StaffID']]"
          title="申请人"
          :isDisabled="isDisabled"
          :watchValue="promoteStaffList"
          :value="promoteAddRequestObj.ApplyUser.StaffID"
        />
      </li>
      <li class="top-25">
        <!-- 下单渠道 -->
        <checkbox-group-comp
          :itemList="orderTypeList"
          :selectList="selectOrderTypeList"
          @change="onOrderTypeListChange"
          :defaultProps="{ label: 'name', value: 'ID' }"
          :isDisabled="isDisabled"
        />
      </li>
      <li>
        <!-- 客户类型 -->
        <checkbox-group-comp
          title="客户类型"
          :itemList="filterUserTypeList"
          :selectList="selectUserTypeList"
          @change="onUserTypeListChange"
          :isDisabled="isDisabled"
        />
      </li>
      <li>
        <!-- 客户等级 -->
        <checkbox-group-comp
          title="客户等级"
          :itemList="filterUserRankList"
          :selectList="selectUserRankList"
          @change="onUserRankListChange"
          :isDisabled="isDisabled"
        />
      </li>
      <li class="area-wrap">
        <!-- 销售区域 -->
        <tree-comp
          :treeList="allAreaTreeList"
          :defaultCheckedKeys="defaultCheckedKeys"
          :handleChangeFunc="handleChangeFunc"
          :shouldDisabledList="shouldDisabledList"
          :showDisabled="isDisabled"
          :isDisabled="isDisabled"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import FieldInput from '@/components/common/FieldInput.vue';
// import DisconnectTypeDatePickerComp from '@/components/common/DisconnectTypeDatePickerComp.vue';
import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
import CheckboxGroupComp from '@/components/common/CheckboxGroupComp.vue';
import TreeComp from '@/components/common/TreeComp.vue';
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';

export default {
  components: {
    FieldInput,
    // DisconnectTypeDatePickerComp,
    StaffSelector,
    CheckboxGroupComp,
    TreeComp,
  },
  computed: {
    ...mapState('common', [
      'orderCreateTypeList',
      'userTypeList',
      'userRankList',
    ]),
    ...mapState('promoteStore', ['promoteAddRequestObj', 'promoteStaffList']),
    ...mapGetters('common', ['allAreaTreeList']),
    orderTypeList() {
      if (!this.orderCreateTypeList) return [];
      return this.orderCreateTypeList.filter((item) => !!item.ID);
    },
    filterUserTypeList() {
      if (!this.userTypeList) return [];
      return this.userTypeList.filter((it) => it.CategoryID);
    },
    filterUserRankList() {
      if (!this.userRankList) return [];
      return this.userRankList.filter((item) => !!item.CategoryID);
    },
    selectOrderTypeList() {
      return this.promoteAddRequestObj.OrderTypeList;
    },
    selectUserTypeList() {
      return this.promoteAddRequestObj.CustomerTypeList.map((it) => ({
        CategoryID: it.ID,
      }));
    },
    selectUserRankList() {
      return this.promoteAddRequestObj.CustomerGradeList.map((it) => ({
        CategoryID: it.ID,
      }));
    },
    isStartNow: {
      get() {
        return this.promoteAddRequestObj.StartNow;
      },
      set(newVal) {
        this.setPromoteAddRequestObj([['StartNow', ''], newVal]);
        if (newVal) {
          const stringDate = ConvertTimeFormat(new Date());
          const h = `0${new Date().getHours()}`.slice(-2);
          const m = `0${new Date().getMinutes()}`.slice(-2);
          const s = `0${new Date().getSeconds()}`.slice(-2);
          const ValidStartTime = `${stringDate}T${h}:${m}:${s}.000Z`;
          this.setPromoteAddRequestObj([
            ['ValidStartTime', ''],
            ValidStartTime,
          ]);
        }
      },
    },
    promoteTitle: {
      get() {
        return this.promoteAddRequestObj.Title;
      },
      set(newVal) {
        this.setPromoteAddRequestObj([['Title', ''], newVal]);
      },
    },
    defaultCheckedKeys() {
      return this.promoteAddRequestObj.SellAreaArray.map((it) => it.CountyID);
    },
    shouldDisabledList() {
      if (!this.isDisabled) return [];
      let _list = [];
      this.allAreaTreeList.forEach((l1) => {
        l1.children.forEach((l2) => {
          _list = [..._list, ...l2.children];
        });
      });
      return _list.map((it) => it.ID);
    },
    StartDate: {
      get() {
        if (!this.promoteAddRequestObj.ValidStartTime) return '';
        const timeString = this.promoteAddRequestObj.ValidStartTime.split('T')[0].substring(0, 10);
        return timeString;
      },
      set(val) {
        let timer = '';
        if (val) timer = `${val}T00:00:00.000Z`;
        this.setPromoteAddRequestObj([['ValidStartTime', ''], timer]);
      },
    },
    EndDate: {
      get() {
        if (!this.promoteAddRequestObj.ValidEndTime) return '';
        const timeString = this.promoteAddRequestObj.ValidEndTime.split('T')[0].substring(0, 10);
        return timeString;
      },
      set(val) {
        let timer = '';
        if (val) timer = `${val}T23:59:59.997Z`;
        this.setPromoteAddRequestObj([['ValidEndTime', ''], timer]);
      },
    },
    PeriodType: {
      get() {
        return this.promoteAddRequestObj.PeriodType;
      },
      set(val) {
        this.setPromoteAddRequestObj([['PeriodType', ''], val]);
      },
    },
    localPeriodList() {
      if (this.PeriodType === 0) {
        return this.promoteAddRequestObj.PeriodList.filter((it) => !it.Value);
      }
      return this.promoteAddRequestObj.PeriodList.filter((it) => it.Value);
    },
    defaultBeginTime() {
      return new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0));
    },
    defaultEndTime() {
      return new Date(new Date(new Date(new Date().setHours(23)).setMinutes(59)).setSeconds(59));
    },
  },
  methods: {
    ...mapMutations('promoteStore', ['setPromoteAddRequestObj']),
    ...mapActions('common', ['getUserClassify', 'getAreaList']),
    onOrderTypeListChange(list) {
      this.setPromoteAddRequestObj([['OrderTypeList', ''], list]);
    },
    onUserTypeListChange(list) {
      const _list = list.map((it) => ({ ID: it.CategoryID }));
      this.setPromoteAddRequestObj([['CustomerTypeList', ''], _list]);
    },
    onUserRankListChange(list) {
      const _list = list.map((it) => ({ ID: it.CategoryID }));
      this.setPromoteAddRequestObj([['CustomerGradeList', ''], _list]);
    },
    handleChangeFunc(checkedNodes) {
      const _list = checkedNodes
        .filter((it) => it.Level === 3)
        .map((it) => ({ CountyID: it.ID }));
      this.setPromoteAddRequestObj([['SellAreaArray', ''], _list]);
    },
    onPeriodItemCheckedChange(e, itemValue) {
      const list = this.promoteAddRequestObj.PeriodList.map(it => {
        if (it.Value !== itemValue) return it;
        return { ...it, isChecked: e };
      });
      this.setPromoteAddRequestObj([['PeriodList', ''], list]);
    },
    onPeriodItemTimeChange(e, itemValue, type) {
      console.log(e);
      const list = this.promoteAddRequestObj.PeriodList.map(it => {
        if (it.Value !== itemValue) return it;
        return { ...it, [type]: e };
      });
      this.setPromoteAddRequestObj([['PeriodList', ''], list]);
    },
  },
  mounted() {
    this.getUserClassify();
    this.getAreaList();
  },
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.promote-add-edit-detail-left-wrap {
  width: 45%;
  min-width: 520px;
  display: flex;
  justify-content: center;
  padding-top: 65px;
  box-sizing: border-box;
  height: 100%;
  padding-left: 25px;
  > ul {
    width: 88%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    overflow: overlay;
    padding-right: 15px;
    > li {
      &:first-of-type {
        > .mp-common-comps-field-input-wrap {
          > input:disabled {
            background-color: rgb(245, 247, 250);
            color: #c0c4cc;
          }
        }
      }
      & + li {
        margin-top: 18px;
      }
      &.top-25 {
        margin-top: 25px;
      }
      flex: none;
      > .mp-common-comps-tree-comp-wrap {
        width: 90%;
      }
      &.start-time-box {
        display: flex;
        align-items: center;
        > .mp-common-comps-disconnect-type-date-picker-wrap {
          flex: none;
        }
        > span {
          flex: none;
          margin-left: 10px;
          em {
            font-size: 12px;
            color: $--color-text-primary;
          }
        }
      }
      &.area-wrap {
        flex: 1;
        > section {
          height: 100%;
          > div {
            border: 1px solid #eee;
            padding: 10px;
            height: 100%;
            overflow: auto;
            overflow: overlay;
            .el-checkbox__input.is-disabled.is-checked > .el-checkbox__inner {
              background-color: #26bcf9;
              border-color: #26bcf9;
              &::after {
                border-color: #fff;
              }
            }
          }
        }
      }
      > .mp-common-comps-staff-selector-wrap {
        > main input {
          &::placeholder {
            color: #cbcbcb;
          }
          border-color: $--color-text-secondary;
          // height: 30px;
          font-size: 13px !important;
        }
      }
      > .mp-common-comps-checkbox-group-comp-wrap {
        > .el-checkbox-group {
          > .el-checkbox {
            > .el-checkbox__label {
              font-size: 12px;
              min-width: 5em;
              height: 20px;
            }
          }
        }
      }
      &.date-range {
        font-size: 14px;
        > span {
          font-weight: 700;
          color: #444;
          margin-right: 15px;
        }
        > div {
          width: 140px;
          input {
            height: 30px;
            line-height: 30px;
            border-color: #cbcbcb;
          }
        }
        > i {
          margin: 0 7px;
          color: #cbcbcb;
          font-size: 13px;
          position: relative;
          top: 1px;
        }
      }
      &.date-cycle {
        display: flex;
        font-size: 14px;
        > label {
          font-weight: 700;
          color: #444;
          width: 5em;
          text-align: right;
          margin-right: 15px;
          flex: none;
        }
        > .content {
          > ul {
            display: flex;
            flex-wrap: wrap;
            padding-top: 15px;
            > li {
              > label {
                font-size: 12px;
                color: #585858;
                margin-right: 10px;
              }
              > div.el-date-editor {
                width: 70px;
                .el-input__prefix {
                  display: none;
                }
                input {
                  padding-left: 10px;
                  padding-right: 27px;
                  height: 25px;
                  line-height: 25px;
                  overflow: hidden;
                }
                .el-input__suffix {
                  right: 0;
                }
              }
              > i {
                margin: 0 8px;
                color: #cbcbcb;
              }
              margin-right: 20px;
              margin-bottom: 10px;
              width: 225px;
              height: 25px;
              line-height: 25px;
            }
          }
        }
      }
    }
  }
  .mp-common-comps-field-input-wrap > span,
  .mp-common-comps-disconnect-type-date-picker-wrap > span,
  .mp-common-comps-staff-selector-wrap > header,
  .mp-common-comps-tree-comp-wrap > header,
  .mp-common-comps-checkbox-group-comp-wrap > span {
    font-weight: 600;
  }
  .el-input.is-disabled .el-input__inner {
    border-color: $--color-text-secondary;
  }
}
</style>
