<template>
  <CommonDialogComp
    width="800px"
    title="添加成员"
    :visible.sync="localVisible"
    class="mp-erp-review-group-members-list-page-comps-member-add-comp-wrap"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    :disabled="checkList.length === 0"
    top="8vh"
  >
    <p v-if="group" class="is-bold is-blue">当前设置组：{{group.Name || ''}}</p>
    <AreaSelectorIndex
      title='筛选部门'
      hasNullOption
      :changePropsFunc='setCondition'
      :requestFunc='getDataList'
      :propList='departmentList'
      :RegionalID='condition.Department.FirstDepartmentID'
      :CityID='condition.Department.SecondDepartmentID'
      :CountyID='condition.Department.ThirdDepartmentID'
      :typeList="[['Department', 'FirstDepartmentID'],['Department', 'SecondDepartmentID'],['Department', 'ThirdDepartmentID']]"
    />
    <section class="c" v-show="filteredStaffList.length > 0">
      <header>
        <el-checkbox v-model="checkedAll" :indeterminate="indeterminate">全选</el-checkbox>
      </header>
      <div class="list">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="it in filteredStaffList.slice(0, sliceNumber)" :key="it.ID" :label="it.ID">{{it.Name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <footer v-show="restNumber > 0">
        <hr>
          <span>还有剩余 {{restNumber}} 人未显示</span>
        <hr>
      </footer>
    </section>
    <div class="em" v-show="filteredStaffList.length === 0">
      <span>暂无可添加数据</span>
    </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../../packages/CommonDialogComp';
import AreaSelectorIndex from '../../../common/SelectorComps/AreaSelectorIndex.vue';
import CommonClassType from '../../../../store/CommonClassType';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    group: {
      type: Object,
      default: null,
    },
    existIds: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    AreaSelectorIndex,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    checkedAll: {
      get() {
        return this.checkList.length > 0 && this.checkList.length === this.filteredStaffList.length;
      },
      set(val) {
        const list = val ? this.filteredStaffList.map(it => it.ID) : [];
        this.checkList = list;
      },
    },
    indeterminate() {
      return this.checkList.length > 0 && this.checkList.length < this.filteredStaffList.length;
    },
    filteredStaffList() {
      return this.StaffList.filter(it => !this.existIds.includes(it.ID));
    },
    restNumber() {
      if (this.filteredStaffList.length > this.sliceNumber) {
        return this.filteredStaffList.length - this.sliceNumber;
      }
      return 0;
    },
  },
  data() {
    return {
      condition: {
        FieldType: 1,
        Page: 1,
        PageSize: 10000,
        Department: { // 部门
          FirstDepartmentID: '',
          SecondDepartmentID: '',
          ThirdDepartmentID: '',
        },
        MemberGroupID: this.group.ID,
      },
      departmentList: [],
      loading: false,
      StaffList: [],
      StaffListNumber: 0,
      checkList: [],
      sliceNumber: 90,
    };
  },
  methods: {
    onOpen() {
      this.checkList = [];
    },
    submit() {
      const temp = {
        ID: this.group.ID,
        List: this.checkList,
      };
      const data = this.checkList
        .map(id => this.filteredStaffList.find(it => it.ID === id))
        .filter(it => it)
        .map(it => ({
          UnCheckedNumber: it.UnCheckedNumber,
          IsOnline: it.IsOnline,
          IsDistributionSuspended: it.IsDistributionSuspended,
          ID: it.ID,
          Name: it.Name,
        }));
      this.$emit('submit', [temp, data]);
    },
    cancel() {
      this.localVisible = false;
    },
    setCondition([[key1, key2], value]) {
      if (!key1) return;
      if (key2) {
        this.condition[key1][key2] = value;
      } else {
        this.condition[key1] = value;
      }
    },
    async getDataList() {
      const temp = CommonClassType.filter(this.condition, true);

      this.StaffList = [];
      this.checkList = [];
      this.loading = true;
      const resp = await this.api.getStaffList(temp).catch(() => null);
      this.loading = false;

      if (resp && resp.data.Status === 1000) {
        this.StaffList = resp.data.Data || [];
        this.StaffListNumber = resp.data.DataNumber;
      }
    },
    async getDepartmentList() { // 获取部门列表数据
      const resp = await this.api.getDepartmentList().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.departmentList = resp.data.Data || [];
      }
    },
  },
  mounted() {
    this.getDepartmentList();
    this.getDataList();
  },
};
</script>
<style lang='scss'>
.mp-erp-review-group-members-list-page-comps-member-add-comp-wrap {
  .el-dialog__body {
    padding: 30px 34px;
    padding-top: 18px;
    min-height: 560px;
    > .is-bold {
      margin-bottom: 20px;
      margin-left: -14px
    }
    > section.c {
      > header {
        padding-top: 15px;
        padding-bottom: 8px;
      }
      .el-checkbox {
        margin: 5px 0;
        margin-right: 12px;
        .el-checkbox__label {
          width: 7em;
          font-size: 12px;
        }
      }
      > footer {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 28px;
        font-size: 13px;
        color: #888;
        > hr {
          width: 120px;
          margin: 0;
          border-top: none;
          border-left: none;
          border-right: none;
          border-color: #cbcbcb;
        }
        > span {
          margin: 0 18px;
        }
      }
    }
    > .em {
      text-align: center;
      padding: 50px;
      font-size: 12px;
      color: #989898;
    }
  }
  .el-dialog__footer {
    padding-bottom: 25px;
  }
}
</style>
