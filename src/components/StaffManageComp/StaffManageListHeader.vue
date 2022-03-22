<template>
  <header class="mp-erp-staff-manage-list-page-header-comp-wrap">
    <p>
      <el-button type="primary" @click="onAddClick" v-if="localPermission.Add">+添加员工</el-button>
    </p>
    <div class="s">
      <div class="bundle">
        <OrderChannelSelector
          :options='localSexEnumList'
          :requestFunc='getDataList'
          :changePropsFunc='setCondition'
          :typeList="[['Sex', '']]"
          :value='condition.Sex'
          :defaultProps='{label: "Name", value: "ID"}'
          label='筛选'
        />
        <OrderChannelSelector
          class="terminal-select"
          :options='localEducationEnumList'
          :requestFunc='getDataList'
          :changePropsFunc='setCondition'
          :typeList="[['Education', '']]"
          :value='condition.Education'
          :defaultProps='{label: "Name", value: "ID"}'
          label=''
        />
        <OrderChannelSelector
          class="terminal-select"
          :options='localStaffStatusEnumList'
          :requestFunc='getDataList'
          :changePropsFunc='setCondition'
          :typeList="[['Status', '']]"
          :value='condition.Status'
          :defaultProps='{label: "Name", value: "ID"}'
          label=''
        />
      </div>
      <TwoLevelSelectComp v-model="locationIDs" :level1Options='level1Options' :level2Options='level2Options' showLine title='城市' />
      <AreaSelector
        title='管理部门'
        hasNullOption
        :changePropsFunc='setCondition'
        :requestFunc='getDataList'
        :propList='departmentList'
        :RegionalID='condition.Department.FirstDepartmentID'
        :CityID='condition.Department.SecondDepartmentID'
        :CountyID='condition.Department.ThirdDepartmentID'
        :typeList="[['Department', 'FirstDepartmentID'],['Department', 'SecondDepartmentID'],['Department', 'ThirdDepartmentID']]"
      />
      <OrderChannelSelector
        :options='localJobPermissionsList'
        :requestFunc='getDataList'
        :changePropsFunc='setCondition'
        :typeList="[['PositionID', '']]"
        :value='condition.PositionID'
        :defaultProps='{label: "PositionName", value: "PositionID"}'
        label='岗位'
      />
    </div>
    <div class="l">
      <SearchInputComp
        spaceBetween
        :typeList="[['KeyWords', '']]"
        :requestFunc='getDataList'
        :changePropsFunc='setCondition'
        :word='condition.KeyWords'
        @reset='clearCondition'
        :searchWatchKey="searchWatchKey"
        title='关键词'
        placeholder='请输入姓名/手机号/身份证'
      />
    </div>
  </header>
</template>

<script>
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import TwoLevelSelectComp from '@/components/common/SelectorComps/TwoLevelSelectComp.vue';
import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
import SearchInputComp from '@/components/common/SearchInputComp';
import { SexEnumList, EducationEnumList, StaffStatusEnumList } from '@/assets/js/TypeClass/StaffManage/enums';
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    departmentList: {
      type: Array,
      default: () => [],
    },
    jobPermissionsList: {
      type: Array,
      default: () => [],
    },
    searchWatchKey: {},
  },
  components: {
    OrderChannelSelector,
    TwoLevelSelectComp,
    AreaSelector,
    SearchInputComp,
  },
  computed: {
    ...mapState('common', ['Permission']),
    ...mapGetters('common', ['allAdAreaTreeList']),
    localPermission() {
      return this.Permission?.PermissionList?.PermissionManageStaffBase?.Obj || {};
    },
    localSexEnumList() {
      return [{ ID: '', Name: '性别不限' }, ...SexEnumList];
    },
    localEducationEnumList() {
      return [{ ID: '', Name: '学历不限' }, ...EducationEnumList];
    },
    localStaffStatusEnumList() {
      return [{ ID: '', Name: '状态不限' }, ...StaffStatusEnumList];
    },
    level1Options() {
      const temp = { ID: '', Name: '不限' };
      if (!this.allAdAreaTreeList || this.allAdAreaTreeList.length === 0) return [temp];
      return [temp, ...this.allAdAreaTreeList.map(it => ({ Name: it.Name, ID: it.ID }))];
    },
    level2Options() {
      const temp = { ID: '', Name: '不限' };
      if (!this.allAdAreaTreeList || this.allAdAreaTreeList.length === 0 || !this.locationIDs.level1Val) return [temp];
      const t = this.allAdAreaTreeList.find(it => it.ID === this.locationIDs.level1Val);
      if (t) return [temp, ...t.children.map(it => ({ Name: it.Name, ID: it.ID }))];
      return [temp];
    },
    locationIDs: {
      get() {
        return {
          level1Val: this.condition.Location.First,
          level2Val: this.condition.Location.Second,
        };
      },
      set({ level1Val, level2Val }) {
        this.setCondition([['Location', 'First'], level1Val]);
        this.setCondition([['Location', 'Second'], level2Val]);
        this.getDataList();
      },
    },
    localJobPermissionsList() {
      return [{ PositionID: '', PositionName: '不限' }, ...this.jobPermissionsList];
    },
  },
  methods: {
    getDataList() {
      this.$emit('fetch');
    },
    setCondition(data) {
      this.$emit('change', data);
    },
    clearCondition() {
      this.$emit('clear');
    },
    onAddClick() {
      this.$emit('add');
    },
  },
  mounted() {
  },
};
</script>
<style lang='scss'>
.mp-erp-staff-manage-list-page-header-comp-wrap {
  padding: 20px 25px;
  margin-bottom: 10px;
  > p {
    > button {
      height: 32px;
      width: 120px;
      padding: 0;
      border-radius: 2px;
    }
    padding-bottom: 17px;
  }
  > div {
    &.s {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      > div {
        &.bundle {
          display: flex;
          align-items: center;
          .terminal-select {
            margin-left: 10px;
            > header {
              display: none;
            }
          }
          margin-right: 20px;
          &:last-of-type {
            margin-right: 10px;
          }
        }
      }
      > ul > li{
        &:not(.text) {
          margin-right: 10px;
        }
        &.first-select-box .el-input__inner {
          width: 110px;
        }
      }
      > .mp-erp-common-select-comps-two-level-select-comp-wrap {
        margin-right: 20px;
      }
      > div, > ul, > section {
        margin-bottom: 13px;
      }
    }
    &.l {
      padding-right: 20px;
      .mp-common-comps-search-box > .el-input {
        width: 180px;
      }
    }
  }
}
</style>
