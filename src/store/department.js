import api from '@/api/index';

export default {
  namespaced: true,
  state: {
    // 部门列表
    departmentList: [],
    // 部门父级id
    departmentParentID: -1,
    // 用户类型列表
    userTypeList: [],

  },
  getters: {
    getSuperiorDepartment(state) { // 获取一级部门
      return state.departmentList.filter((item) => item.ParentID === -1);
    },
  },
  mutations: {
    setDepartmentList(state, departmentList) { // setDepartmentList 保存部门列表数据
      state.departmentList = departmentList;
    },
    setUserTypeList(state, userTypeList) { //
      state.userTypeList = userTypeList;
    },
    // 修改部门的父级id
    modificationDepartmentParentID(state, ParentID) {
      state.departmentParentID = ParentID;
    },
  },
  actions: {
    async getDepartmentList({
      commit,
    }) { // getDepartmentList 获取部门列表数据
      const res = await api.getDepartmentList();
      if (res && res.data.Status === 1000) {
        commit('setDepartmentList', res.data.Data);
        return true;
      }
      return false;
    },
    async getUserTypeList({
      commit,
    }) { // 获取用户类型
      const res = await api.getCustomerCategoryList();
      if (res && res.data.Status === 1000) {
        commit('setUserTypeList', res.data.Data);
        return true;
      }
      return false;
    },
  },
};
