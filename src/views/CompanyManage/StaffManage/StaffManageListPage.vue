<template>
  <section class="mp-erp-staff-manage-list-page-wrap">
    <StaffManageListHeader
      :condition='StaffManageData.condition'
      :departmentList='departmentList'
      :jobPermissionsList='jobPermissionsList'
      :searchWatchKey='StaffManageData.dataList'
      @change='setCondition'
      @fetch="getStaffManageList"
      @clear='clearCondition'
      @add='onJumpToSetupClick(null)'
     />
    <main>
      <StaffManageListTable
        :list='StaffManageData.dataList'
        :loading='StaffManageData.loading'
        :departmentLevelList='departmentLevelList'
        @detail='handleDetail'
        @check='handleCheck'
        @dimission='handleDimission'
        @edit='onJumpToSetupClick'
        @remove='handleRemove'
      />
    </main>
    <footer>
      <CountComp
        center
        :count='StaffManageData.dataNumber'
        :watchPage='StaffManageData.condition.Page'
        :handlePageChange='getStaffManageList'
        :pageSize='StaffManageData.condition.PageSize'
      />
    </footer>
  </section>
</template>

<script>
import StaffManageClass from '../../../assets/js/TypeClass/StaffManage/StaffManageClass';
import StaffManageListHeader from '../../../components/StaffManageComp/StaffManageListHeader.vue';
import StaffManageListTable from '../../../components/StaffManageComp/StaffManageListTable.vue';
import CountComp from '../../../components/common/Count.vue';

export default {
  name: 'StaffManageListPage',
  components: {
    StaffManageListHeader,
    StaffManageListTable,
    CountComp,
  },
  data() {
    return {
      StaffManageData: new StaffManageClass(),
      departmentList: [], // 部门平铺列表
      departmentLevelList: [], // 部门树形列表 -- 后面不用则删除
      jobPermissionsList: [], // 岗位列表数据
    };
  },
  methods: {
    async getDepartmentList() { // 获取部门列表数据
      const resp = await this.api.getDepartmentList().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const _list = resp.data.Data || [];
        this.departmentList = _list;
        const level1List = _list.filter(item => item.Level === 1).map(i => ({ ...i, children: [] }));
        level1List.forEach(level1 => {
          const _level1list = _list.filter(item => item.Level === 2 && item.ParentID === level1.ID)
            .map(item => ({ ...item, children: [] }));
          // eslint-disable-next-line no-param-reassign
          level1.children = _level1list;
          level1.children.forEach(level2 => {
            const _level3list = _list.filter(item => item.Level === 3 && item.ParentID === level2.ID);
            // eslint-disable-next-line no-param-reassign
            level2.children = _level3list;
          });
        });
        this.departmentLevelList = level1List;
      }
    },
    async getJobPermissionsList() { // 获取岗位列表数据
      const resp = await this.api.getJobPermissionsList().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const _list = resp.data.Data || [];
        this.jobPermissionsList = _list;
      }
    },
    getStaffManageList(Page) { // 获取员工列表数据
      this.StaffManageData.getDataList(Page);
    },
    setCondition(data) { // 设置条件
      this.StaffManageData.setCondition(data);
    },
    clearCondition() { // 清除筛选条件
      this.StaffManageData.clearConditon();
    },
    handleDetail({ item }) { // 员工详情
      console.log('handleDetail', item);
    },
    handleCheck({ item }) { // 员工审核
      console.log('handleCheck', item);
    },
    handleDimission({ item, isCancel }) { // 员工离职|取消离职
      console.log('handleDimission', item, isCancel);
    },
    onJumpToSetupClick(data) { // 员工编辑|添加 --- 跳转对应页面
      const id = data ? data.id : 'null';
      this.$router.push({
        name: 'StaffManageSetup',
        params: {
          id,
        },
      });
    },
    handleRemove({ item, index }) { // 员工删除
      console.log('handleRemove', item, index);
    },
  },
  mounted() {
    this.getStaffManageList();
    this.getDepartmentList();
    this.getJobPermissionsList();
    this.$store.dispatch('common/getProductClassifyData'); // 获取产品二级分类数据
    this.$store.dispatch('common/fetchAdAreaList'); // 获取地区列表数据
  },
};
</script>
<style lang='scss'>
.mp-erp-staff-manage-list-page-wrap {
  background: #f6f6f6;
  padding-left: 8px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // min-width: 750px;
  overflow: hidden;
  > header, > footer, > main {
    flex: none;
    background: #fff;
  }
  > main {
    flex: 1;
  }
  > footer {
    height: 50px;
    padding-top: 2px;
  }
}
</style>
