<template>
  <div class="promote-add-edit-detail-left-wrap">
    <ul class="mp-scroll-wrap">
      <li> <!-- 活动标题 -->
        <field-input :isDisabled='isDisabled' v-model="promoteTitle" />
      </li>
      <li class="start-time-box"> <!-- 开始时间 -->
        <disconnect-type-date-picker-comp
         :isDisabled='isStartNow || isDisabled'
         :DateValue='promoteAddRequestObj.ValidStartTime'
         :handleFunc="newVal=>this.setPromoteAddRequestObj([['ValidStartTime', ''], newVal])"
         />
        <span>
          <el-checkbox v-model="isStartNow" :disabled='isDisabled'>
            <em>立即生效</em>
          </el-checkbox>
        </span>
      </li>
      <li> <!-- 结束时间 -->
        <disconnect-type-date-picker-comp
         :DateValue='promoteAddRequestObj.ValidEndTime'
         :handleFunc="newVal=>this.setPromoteAddRequestObj([['ValidEndTime', ''], newVal])"
         title="结束时间"
         :isDisabled='isDisabled'
         />
      </li>
      <li> <!-- 申请人 -->
        <staff-selector
          :changePropsFunc='setPromoteAddRequestObj'
          :typeList="[['ApplyUser', 'StaffID']]"
          title="申请人"
          :isDisabled='isDisabled'
          :watchValue='promoteStaffList'
          :value='promoteAddRequestObj.ApplyUser.StaffID'
         />
      </li>
      <li class="top-25"> <!-- 下单渠道 -->
        <checkbox-group-comp
          :itemList='orderTypeList'
          :selectList='selectOrderTypeList'
          @change="onOrderTypeListChange"
          :defaultProps="{ label: 'name', value: 'ID' }"
          :isDisabled='isDisabled'
         />
      </li>
      <li> <!-- 客户类型 -->
        <checkbox-group-comp
          title="客户类型"
          :itemList='filterUserTypeList'
          :selectList='selectUserTypeList'
          @change="onUserTypeListChange"
          :isDisabled='isDisabled'
         />
      </li>
      <li> <!-- 客户等级 -->
        <checkbox-group-comp
          title="客户等级"
          :itemList='filterUserRankList'
          :selectList='selectUserRankList'
          @change="onUserRankListChange"
          :isDisabled='isDisabled'
         />
      </li>
      <li class="area-wrap"> <!-- 销售区域 -->
        <tree-comp
         :treeList='allAreaTreeList'
         :defaultCheckedKeys="defaultCheckedKeys"
         :handleChangeFunc='handleChangeFunc'
         :shouldDisabledList='shouldDisabledList'
         :showDisabled='isDisabled'
         :isDisabled='isDisabled'
         />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import FieldInput from '@/components/common/FieldInput.vue';
import DisconnectTypeDatePickerComp from '@/components/common/DisconnectTypeDatePickerComp.vue';
import StaffSelector from '@/components/common/SelectorComps/StaffSelector.vue';
import CheckboxGroupComp from '@/components/common/CheckboxGroupComp.vue';
import TreeComp from '@/components/common/TreeComp.vue';
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';

export default {
  components: {
    FieldInput,
    DisconnectTypeDatePickerComp,
    StaffSelector,
    CheckboxGroupComp,
    TreeComp,
  },
  computed: {
    ...mapState('common', ['orderCreateTypeList', 'userTypeList', 'userRankList']),
    ...mapState('promoteStore', ['promoteAddRequestObj', 'promoteStaffList']),
    ...mapGetters('common', ['allAreaTreeList']),
    orderTypeList() {
      if (!this.orderCreateTypeList) return [];
      return this.orderCreateTypeList.filter(item => !!item.ID);
    },
    filterUserTypeList() {
      if (!this.userTypeList) return [];
      return this.userTypeList.filter(it => it.CategoryID);
    },
    filterUserRankList() {
      if (!this.userRankList) return [];
      return this.userRankList.filter(item => !!item.CategoryID);
    },
    selectOrderTypeList() {
      return this.promoteAddRequestObj.OrderTypeList;
    },
    selectUserTypeList() {
      return this.promoteAddRequestObj.CustomerTypeList.map(it => ({ CategoryID: it.ID }));
    },
    selectUserRankList() {
      return this.promoteAddRequestObj.CustomerGradeList.map(it => ({ CategoryID: it.ID }));
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
          this.setPromoteAddRequestObj([['ValidStartTime', ''], ValidStartTime]);
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
      return this.promoteAddRequestObj.SellAreaArray.map(it => it.CountyID);
    },
    shouldDisabledList() {
      if (!this.isDisabled) return [];
      let _list = [];
      this.allAreaTreeList.forEach(l1 => {
        l1.children.forEach(l2 => {
          _list = [..._list, ...l2.children];
        });
      });
      return _list.map(it => it.ID);
    },
  },
  methods: {
    ...mapMutations('promoteStore', ['setPromoteAddRequestObj']),
    ...mapActions('common', ['getUserClassify', 'getAreaList']),
    onOrderTypeListChange(list) {
      this.setPromoteAddRequestObj([['OrderTypeList', ''], list]);
    },
    onUserTypeListChange(list) {
      const _list = list.map(it => ({ ID: it.CategoryID }));
      this.setPromoteAddRequestObj([['CustomerTypeList', ''], _list]);
    },
    onUserRankListChange(list) {
      const _list = list.map(it => ({ ID: it.CategoryID }));
      this.setPromoteAddRequestObj([['CustomerGradeList', ''], _list]);
    },
    handleChangeFunc(checkedNodes) {
      const _list = checkedNodes.filter(it => it.Level === 3).map(it => ({ CountyID: it.ID }));
      this.setPromoteAddRequestObj([['SellAreaArray', ''], _list]);
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
  width: 40%;
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
            color: #C0C4CC;
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
        > main input{
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
