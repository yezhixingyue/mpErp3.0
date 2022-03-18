import api from '@/api/index';

export default {
  namespaced: true,
  state: {
    // 部门列表
    departmentList: [],
    // 部门父级id
    departmentParentID: -1,

  },
  getters: {
    getSuperiorDepartment(state) { // 获取一级部门
      return state.departmentList.filter((item) => item.ParentID === -1);
    },
  },
  mutations: {
    setDepartmentList(state, departmentList) { // setDepartmentList 保存部门列表数据
      console.log(departmentList);
      state.departmentList = departmentList;
    },
    // 修改部门的父级id
    modificationDepartmentParentID(state, ParentID) {
      console.log('aa');
      state.departmentParentID = ParentID;
    },
  },
  actions: {
    async getDepartmentList({
      commit,
    }) { // getDepartmentList 获取部门列表数据
      const res = await api.getDepartmentList();
      console.log(res);
      if (res && res.data.Status === 1000) {
        commit('setDepartmentList', res.data.Data);
        return true;
      }
      return false;
    },
  },
};
